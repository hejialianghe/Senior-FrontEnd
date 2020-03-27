/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 把watch实例记录在依赖数组中
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
// 把wathc实例从从依赖的数组中移除
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
// Dep.target 上存放当前需要Watch实例，调用depend就用调用watcher实例上的addDep方法
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 通知依赖数组中所有的 watchr进行更新操作
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null

// 维护一个栈结构，用于存储和删除 Dep.target
const targetStack = []

// pushTarget 会在 new Watcher 时被调用
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

// popTarget 会在 new Watcher 时被调用

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
