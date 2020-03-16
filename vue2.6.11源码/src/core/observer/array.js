/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype


/**
 * copy一份数组的原型方法，防止污染原数组原型
 */
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 缓存原生方法
  const original = arrayProto[method]
  /**
    *  通过def给对象赋值，并设置描述符
    *  Object.defineProperty(obj,key,{
    *   value:val
    *  })
   */
  def(arrayMethods, method, function mutator (...args) {

    const result = original.apply(this, args)
    // __ob__存的是Observer实例
    const ob = this.__ob__
    let inserted
    //对数组新增元素进行转换成响应式
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2) //args是个数组，splice(开始位置,个数,替换的元素)，所以参数下标为2的是新加的元素
        break
    }
    if (inserted) ob.observeArray(inserted) //对新增元素转换为相应式
    // 通知更新
    ob.dep.notify()
    return result
  })
})
