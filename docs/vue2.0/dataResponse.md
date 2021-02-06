## 2.1 概述
### 2.1.1 数据、视图、vue之间的关系
`vue`最大的特点之一就是用数据驱动视图，相信大家用的都很爽，只需更改数据，我们的页面就会随之改变，由此我们可以得出以下公式：

 <font color="red">**UI = render(state)**</font>

 `state`代表数据，`UI`代表页面，`vue`将扮演着`render`，一旦数据变化就会把数据反应到`ui`上。
## 2.2 Object的响应

### 2.2.1 利用Object.defineProperty是数据变得可观测
 相信大家都知道Object.defineProperty这个方法，vue就是用这个方法对数据进行观测的，会对所有的数据设置getter和setter，这样我们就知道了数据何时发生变化了，从而去更新相应的视图

   首先我们先看这个案例
 ```javascript
    let mayun={
        money:"1000亿"
    }

    Object.defineProperty(mayun,'money',{
        get(){
            console.log('mayun我被读取了')
        },
        set(newVal){
            console.log('mayun被设置了',newVal)
        }
    })
    mayun.money // mayun我被读取了
    mayun.money="10000亿" //mayun被设置了10000亿
 ```
 从上面的案例可以看出，我们读取数据时会进入get函数中；我们设置数据时会进入set函数中，这样数据就变得可观测了，用户读取和设置数据我们都会知道。

 vue中的源码目录`src/core/observer/index.js`
 ```javascript
 // Observer观察者类,对每个对象设置getter和setter，进行依赖收集和发送更新
 
 export class Observer {
    value: any;

    constructor (value: any) {
        this.value = value
  
    /**
     * 给value增加一个属性'__ob__'，值为该value的Observer的实例
     * 这样是相当于在value上打一个补丁，避免重复操作
     * 方法在util/lang.js
     */
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
         // 数组逻辑
        } else {
        // 操作对象的逻辑
        this.walk(value)
        }
    }

    /**
     * 遍历对象上的每个属性
     */
    walk (obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i])
        }
    }

   //在对象上定义反应属性
  export function defineReactive (
    obj: Object, //要响应的对象
    key: string, // 响应对象的键
    val: any,    // 对象的值
    ) {

      const dep = new Dep() //创建一个依赖管理器
    // 递归，针对子对象设置geter和setter，并返回子对象的Observer实例
        let childOb = observe(val)

        Object.defineProperty(obj, key, {
            enumerable: true, //表示能否通过for in 循环属性
            configurable: true, //是否可以删除或重新定义属性

            // 在这里可以知道获取了值
            get: function reactiveGetter () {
            dep.depend()//收集依赖，往下面看会明白
            return val
            },

            // 在这里可以知道更改了值
            set: function reactiveSetter (newVal) {
             dep.notify() // 通知所有依赖这个对象观察者进行更新
             val=newVal
            }
        })
    }

    /*
    * 给值创建观察者实例
    * 如果观察成功就返回新的观察者实例
    * 如果已经观察过了,就返回现有的
    */
   function observe (value: any, asRootData: ?boolean): Observer | void {
    // 如果不是对象，就不必设置getter好和setter
    if (!isObject(value) {
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
     return ob
    }

 ```
 从上面的源码可以看到，通过new Observer(obj)我们可以使对象变得可观测，那么下一步我们就要知道既然知道了数据什么时候变化，那该怎么去更新视图呢？该更新哪些视图呢，这就要先提到依赖收集。

 ### 2.2.2 依赖收集

 数据发生了变化，我们不可能把整个视图都更新一遍，所以视图中谁用了这个数据，就去更新这部分视图。所以我们会把谁依赖这个数据全部都放到一个数组里，这样当数据发生变化时，我们直接遍历数组的依赖去更新视图就行了。

 何时收集依赖？
  在getter中调用dep.depend()

 何时通知依赖去更新视图？
  在setter中调用dep.notify()

 ####  :tomato: 我们用dep类去存放依赖
  ```javascript
   // 源代码 `src/core/observer/dep.js`
   // Dep用来管理watcher实例，watcher实例就是数据的依赖
    class Dep {
        constructor(){
        // 存放watcher实例
            this.deps=[]
        }
        // 添加依赖
        addDep(dep){
            this.deps.push(dep)
        }

       // 移除一个依赖
        removeSub (sub: Watcher) {
            remove(this.subs, sub)
        }

        // 当Dep上有静态属性target时，就调用Dep.target的adddDep方法，进行添加依赖到deps数组中
        depend () {
            if (Dep.target) {
              Dep.target.addDep(this)
            }
        }

        // 通知所有订阅者进行更新
        notify(){
            const subs = this.subs.slice()
            for (let i = 0, l = subs.length; i < l; i++) {
                // update的方法更新视图
                subs[i].update()
            }
        }
    }

  ```
  从上面可知,我们用Dep类去存放依赖,现在我们使数据变的可观测,又知道了`何时去存放依赖`,`何时又去通知依赖更新视图`,`在哪存放依赖`,现在我们不知道的是`依赖是谁?`

 ### 2.2.3 谁是依赖?
 这就引出了我们的Watcher类,它算是每个数据的依赖，每个数据可能有很多依赖，所以我们才会把这些依赖放到一个Dep类的数组里；从而如果要只要更新这个数组里的
 watch实例就行了，其实watch实例中有个回调函数，就是更新视图的函数

 在编译阶段会对不同的数据进行new Watcher(vm,expOrFn,cb)；在wtcher类中会进行以下操作
 1. 我们把wacher实例放到Dep的静态属性target上
 2. 然后调用数据的getter，把依赖（Wathcer实例）添加到Dep实例的数组中去
 3. 当用户数据设置数据时，会触发new Watcher()传入的回调函数cb

```javascript
    /**
     * 使一个对象转化成可观测对象
     * @param { Component } vm vue实例
     * @param { string | Function } expOrFn 表达式，要watch 的属性名称
     * @param { Function } cb 更新视图的回调函数
     */
    class Watcher {
        constructor(vm,expOrFn,cb){
            this.vm=vm //vue实例
            this.getter = expOrFn //要观察的表达式
            this.cb=cb //回调函数

            // expOrFn可以是字符串或者函数
            // 什么时候会是字符串，例如我们正常使用的时候，watch: { x: fn }, Vue内部会将 `x` 这个key 转化为字符串
            // 什么时候会是函数，其实 Vue 初始化时，就是传入的渲染函数 new Watcher(vm, updateComponent, ...);

            if (typeof expOrFn === 'function') {
              this.getter = expOrFn
            } else {
              this.getter = parsePath(expOrFn)
            }
            this.value=this.get()
        }

        get (){
            let value
            const vm = this.vm
            // 我们把wacher实例放到Dep静态属性的target上
            //vue源码中将其封装成了一个方法pushTarget，在src/core/observer/dep.js
            Dep.target = this 
            value  = this.getter.call(vm, vm) //触发getter添加依赖
            Dep.target=null //释放
            return value
        }
        update(){
           //  触发回调，更新视图
           this.cb.call(this.vm, value, oldValue)
        } 
    }

/**
 * 源码地址 src/core/util/lang.js
 * Parse simple path.
 * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
 * 例如：
 * data = {a:{b:{c:2}}}
 * parsePath('a.b.c')(data)  // 2
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
/**
 * Parse simple path.
 *  如果 path 参数，不包含 字母 或 数字 或 下划线，或者不包含 `.`、`$` ，直接返回
 * 也就是说 obj-a, obj/a, obj*a 等值，会直接返回
 */
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

 ### 2.2.4 梳理一下宏观的整个流程
 
 1. 我们通过`Observer`类使数据变得可观测
 2. 用`Dep`类去存放依赖
 3. 用`Watcher`实例去作为每个数据的依赖

 <font color="red">**举个例子：**</font>
```html
    <div id="app">
        <p>{{msg}}<p>
        <div v-text="msg"><div>
    <div>
```
 我这个p标签和div标签都用了msg这个数据，所以这2个都是msg的依赖；那在我们编译的时候会 new Observer(data) 使数据变得可观测；然后new Watcher(vm,expOrFn,tempcb)；new Watcher(vm,expOrFn,textcb);然后触发数据的getter把2个依赖添加dep实例的数组中，当用户进行更改值的时候；会触发数据的setter，然后遍历dep数组调用依赖的update方法更新视图。

 宏观流程是这样，具体细节还要自己去看

 ### 2.2.5 响应式2.0和3.0的对比

 2.0 Object.defineProperty

 1. 2.0需要对每个属性进行监听，对data的属性是遍历+递归为每个属性设置getter和setter
 2. 2.0数组添加元素和长度的变化无法监视到采用的是this.$set(obj,index,value)的方法
 3. 对象的添加值和删除值，Object.defineProperty无法观测，采用的是this.$set(obj,key,value)的方法

 3.0 proxy

  1. 弥补了2.0上面的缺点
  2. 采用惰性监听，初始化的时候不创建Observer，而是会在用到的时候去监听，效率更高，速度加倍
 
 

 ### 2.2.6 简单实现vue响应式和编译的参考代码
 
 目录 `examples/vue2.0/2`

 
## 2.3 Array的响应

 ### 2.3.1 Array的观测
由于Array没有defineProperty属性，所以不能像Object一样进行监听属性变化，然而vue实现了特有的方法去监听Array的变化，下面让我们看看一个例子。

```javascript
    let arr=[]
    arr.__proto__.newPush=function mutator (val){
    console.log('访问到了') //访问到了
    this.push.call(this,val)
    }
    arr.newPush(8)
    console.log(arr) //[ 8 ]
```
从上面的例子我们可以看出，我们只要修改Array原型上的方法，就能知道什么修改了数据；同样vue中就是这么实现的，然后看vue源码的实现

```javascript
   // 源码目录 src/core/observer/array.js
    import { def } from '../util/index'

    const arrayProto = Array.prototype

    export const arrayMethods = Object.create(arrayProto)
    /**
     * copy一份数组的原型方法，防止污染Array的原型
     */

    // 改变数组的7个方法
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
        //对数组新增元素和删除元素进行转换成响应式
        switch (method) {
        case 'push':
        case 'unshift':
            inserted = args
            break
        case 'splice':
            inserted = args.slice(2) //args是个数组，splice(开始位置,个数,替换的元素)，所以参数下标为2的是新加的元素
            break
        }
        if (inserted) ob.observeArray(inserted) //对新增元素转换为响应式
        // 通知更新
        ob.dep.notify()
        return result
    })
    })


```
  上面的源码可以看出，vue先拷贝了一份原型上的方法，避免污染Array的原型，然后创建一个对象并指定了原型；在arrayMethods上定义了7个方法并给7个方法指定了函数
  如果有新增元素，转换成响应式并触发更新

  vue通过创建一个数组拦截器，在拦截器里重写了操作数组的方法，放操作数组是，从拦截器就可以观测的到操作数组



  ### 2.3.2 把拦截器挂载到数组实例上

```javascript
/*
 *vue中的源码目录`src/core/observer/index.js`
 */
 export class Observer {
    value: any;

    constructor (value: any) {
        this.value = value
  
    /**
     * 给value增加一个属性'__ob__'，值为该value的Observer的实例
     * 这样是相当于在value上打一个补丁，避免重复操作
     * 方法在util/lang.js
     */
        def(value, '__ob__', this)
        
        if (Array.isArray(value)) {   // 数组逻辑
            if (hasProto) { //数组是否支持"__proto__"属性 const hasProto = '__proto__' in {}
                protoAugment(value, arrayMethods)  
            } else {
                copyAugment(value, arrayMethods, arrayKeys) 
            }   
            this.observeArray(value) //深度监测，给数组下面的子元素转换给响应式
        } else {
        // 操作对象的逻辑
         this.walk(value)
        }

 
    //直接替换原型
    function protoAugment (target, src: Object) {
        /* eslint-disable no-proto */
        target.__proto__ = src
        /* eslint-enable no-proto */
    }}

    // 直接添加到对象上
    function copyAugment (target: Object, src: Object, keys: Array<string>) {
        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i]
            def(target, key, src[key])
        }
    }
    //对数组的成员进行observe
    observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  } 
}

    /*
    * 给值value创建观察者实例
    * 如果观察成功就返回新的观察者实例
    * 如果已经观察过了,就返回现有的
    */
   function observe (value: any, asRootData: ?boolean): Observer | void {
    // 如果不是对象，就不必设置getter好和setter
    if (!isObject(value) {
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
        (Array.isArray(value) || isPlainObject(value)) && //isPlainObject判断类型是否是object
        Object.isExtensible(value) && //isExtensible判断对象是否可以扩展
        !value._isVue  // 避免vue实例被观察
    ) {
        ob = new Observer(value)
    }
     return ob
    }
```
上面代码中先判断浏览器是否支持`__proto__`属性，如果支持就把数据的`__proto__`属性设置为`arrayMethods`；如果不支持直接则循环把方法加到value上

 ### 2.3.3 何时收集依赖和触发依赖？

 收集依赖：在getter中

 触发依赖：在重写操作数组的方法中（arrayMethods）

为什么说收集依赖也在getter函数中，这不是操作的对象的吗？

 ```javascript
  new vue({
      data(){
          return {
              test:[1,2,3,4]
          }
      }
  })
 ```
 我们对data return出来的这个对象转换成响应式进行观测；我们获取数组时，肯定是obj.test;这样的话肯定会走obj的getter中，所以我们收集依赖也是在
 getter中

 ####  :tomato: 收集依赖
  ```javascript
    export class Observer {
        constructor (value) {
            this.value = value
            // 创建一个依赖管理器，用来收集数组依赖
            this.dep = new Dep()    
            if (Array.isArray(value)) {
        
            } else {
            this.walk(value)
            }
        }
    }

     //在对象上定义反应属性
    export function defineReactive (
        obj: Object, //要响应的对象
        key: string, // 响应对象的键
        val: any,    // 对象的值
        ) {

    
        // 递归，针对子对象设置geter和setter，并返回子对象的Observer实例
            let childOb =  observe(val)

            Object.defineProperty(obj, key, {
                enumerable: true, //表示能否通过for in 循环属性
                configurable: true, //是否可以删除或重新定义属性

                // 在这里可以知道获取了值
                get: function reactiveGetter () {
                if (Dep.target) {
                    if (childOb) {
                    // 子对象进行依赖收集
                    childOb.dep.depend()
                    // 如果是数组，对每个成员都进行依赖收集，如果数组成员还是数组则递归；例如二维数组
                    if (Array.isArray(val)) {
                        dependArray(val)
                    }
                }
                 return val
                },

                // 在这里可以知道更改了值
                set: function reactiveSetter (newVal) {
                dep.notify() // 通知所有依赖这个对象观察者进行更新
                val=newVal
                }
            })
        }
    // __ob__是否转换成响应式了
    function dependArray (value: Array<any>) {
        for (let e, i = 0, l = value.length; i < l; i++) {
            e = value[i]
            e && e.__ob__ && e.__ob__.dep.depend()
            if (Array.isArray(e)) {
            dependArray(e)
            }
        }
    }
 ```
  <font color="red">**举个例子：**</font>

 ```javascript
  new vue({
      data(){
          return {
              test:[1,2,3,4]
          }
      }
  })
 ```
 分析一下整个流程
 1. 我们 new Observer()时候，会进去defineReactive 这个函数中，执行了observe(val)获取到了Observer 实例；并给该对象设置了getter和setter（observe(val此时传入的是数组test）
 2. 当调用该对象的getter的时候，我们对数组进行依赖收集，如果子对象中还有数组则对递归收集

  ####  :tomato: 通知依赖
   ```javascript
    methodsToPatch.forEach(function (method) {
    def(arrayMethods, method, function mutator (...args) {

        const result = original.apply(this, args)
        // __ob__存的是Observer实例
        const ob = this.__ob__
        // 通知更新
        ob.dep.notify()
        return result
    })
    })
 ```
 此时我们想通知依赖，首先要能访问到依赖，这里的关键就是this，此时的this指向的是被响应的数据value，数据value上会绑定一个`__ob__`属性；
 `__ob__`的值是Observer实例，我们在实例中就可以访问到依赖管理器，然后只需要调用dep.notify()就可以去通知依赖了

 ### 2.3.4 不足

```javascript
    arr[0]=0
    arr.length=0
 ```
 不足的地方就是用下标去更改数据无法监测，无法用length置空数组，vue提供set方法和delete去更改数据