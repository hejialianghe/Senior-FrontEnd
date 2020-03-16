/* @flow */

import Dep from './dep'  
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
// 观察者类,对每个对象设置getter和setter，进行依赖收集和发送更新
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value  //传入的观测对象
    this.dep = new Dep() //实例化一个依赖管理器，用来收集数组的依赖
    this.vmCount = 0
    /**
     * 给value增加一个属性'__ob__'，值为该value的Observer的实例
     * 这样是相当于在value上打一个补丁，避免重复操作
     * 方法在util/lang.js
     */
    def(value, '__ob__', this) 
    // 数组处理的方式
    if (Array.isArray(value)) {
      if (hasProto) { //数组是否支持‘__proto__’属性
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value) //给数组下面的子元素转换给响应式
    } else {
      // 对象的处理方式，如果是对象就调用walk
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  //  遍历每个对象设置getter和setter
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 * 支持__proto__直接赋值替换
 */
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
// 不支持__proto__的直接修改相关属性方法
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
    /*
    * 给值value创建观察者实例
    * 如果观察成功就返回新的观察者实例
    * 如果已经观察过了,就返回现有的
    */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 如果不是Object或者是VNode实例，就不必设置getter好和setter
  // obj !== null && typeof obj === 'object'
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  //通过‘__ob__’，判断是否有Observer实例，如果已经打过标记了，就直接拿出Observer的实例对象
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    /**
     * 确保value纯对象，且没有被是否Observer过
     */
    shouldObserve && //是否Observer过,通过toggleObserving来修改
    !isServerRendering() && // 是否是服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && //isPlainObject判断类型是否是object
    Object.isExtensible(value) && //isExtensible判断对象是否可以扩展
    !value._isVue  // 避免vue实例被观察
  ) {
    ob = new Observer(value)
  }
  // 根数据就计数
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object, //要响应的对象
  key: string, // 响应对象的键
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 实例化一个依赖管理器，来收集数组的依赖
  const dep = new Dep()
  /**
   * Object.getOwnPropertyDescriptor 获取属性描述符
   * configurable 表示能否重新定义和删除属性
   */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  /**
   * 如果该对象没有设置了getter，也未传入val，就设置val的值
   * 如果设置了getter和setter，也未传入val，就将其执行
   */
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
    // 递归，针对子对象设置geter和setter，并返回子对象的Observer实例
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true, //表示能否通过for in 循环属性
    configurable: true, //是否可以删除或重新定义属性‘
    get: function reactiveGetter () {
      // 如果有getter属性，调用一下
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // 在getter收集依赖
        dep.depend()
        if (childOb) {
          // 子对象进行依赖收集
          childOb.dep.depend()
          // 如果是数组，对每个成员都进行依赖收集，如果数组成员还是数组则递归
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 在setter中更新依赖
      dep.notify() 
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
