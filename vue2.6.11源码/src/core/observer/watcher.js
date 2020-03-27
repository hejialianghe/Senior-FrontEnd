/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function, // 要 watch 的属性名称
    cb: Function, // 回调函数
    options?: ?Object,
    isRenderWatcher?: boolean   // 是否是渲染函数观察者，Vue 初始化时，这个参数被设为 true
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    // expOrFn可以是字符串或者函数
    // 什么时候会是字符串，例如我们正常使用的时候，watch: { x: fn }, Vue内部会将 `x` 这个key 转化为字符串
   // 什么时候会是函数，其实 Vue 初始化时，就是传入的渲染函数 new Watcher(vm, updateComponent, ...);

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    // 这里调用了 this.get，也就意味着 new Watcher 时会调用 this.get
   // this.lazy 是修饰符，除非用户自己传入，不然都是 false。可以先不管它
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  /**
   * 把watch实例放在Dep的静态属性target上
   * 调用getter添加依赖
   */
  get () {
        // 将当前 watcher 实例，赋值给 Dep.target 静态属性
        // 也就是说 执行了这行代码，Dep.target 的值就是 当前 watcher 实例
        // 并将 Dep.target 入栈 ，存入 targetStack 数组中
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 这里执行了 this.getter，获取到 属性的初始值
      // 如果是初始化时 传入的 updateComponent 函数，这个时候会返回 udnefined
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  /**
   * 
   *添加依赖关系到Dep集合中去
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  /**
   * 清理依赖项集合
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  /**
   * 更新函数
   */
  update () {
    /* istanbul ignore else */
    // 如果用户定义了 lazy ，this.lazy 是描述符，我们这里可以先不管它
    if (this.lazy) {
      this.dirty = true
   // this.sync 表示是否改变了值之后立即触发回调。如果用户定义为true，则立即执行 this.run
    } else if (this.sync) {
      this.run()
    } else {
     // queueWatcher 内部也是执行的 watcher实例的 run 方法，只不过内部调用了 nextTick 做性能优化。
    //  它会将当前 watcher 实例放入一个队列，在下一次事件循环时，遍历队列并执行每个 watcher实例的run() 方法
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      // 获取新的属性值
      const value = this.get()
      if (
        // 如果新值不等于旧值
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        /**
         * 
         * 如果新值是一个 引用 类型，那么一定要触发回调
           举个例子，如果旧值本来就是一个对象，
            在新值内，我们只改变对象内的某个属性值，那新值和旧值本身还是相等的
            也就是说，如果 this.get 返回的是一个引用类型，那么一定要触发回调

         */
        isObject(value) ||
        // 是否深度 watch
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        // this.user 是一个标志符，如果开发者添加的 watch 选项，这个值默认为 true
        // 如果是用户自己添加的 watch ，就加一个 try catch。方便用户调试。否则直接执行回调。
        if (this.user) {
          try {
              // 触发回调，并将 新值和旧值 作为参数
              // 这也就是为什么，我们写 watch 时，可以这样写： function (newVal, oldVal) { // do }
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
