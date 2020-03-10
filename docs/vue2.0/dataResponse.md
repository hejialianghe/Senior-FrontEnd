## 2.1 概述
### 2.1.1 数据、视图、vue之间的关系
`vue`最大的特点之一就是用数据驱动视图，相信大家用的都很爽，只需更改数据，我们的页面就会随之改变，由此我们可以得出以下公式：

 <font color="red">**UI = render(state)**</font>

 `state`代表数据，`UI`代表页面，`vue`将扮演着`render`；vue将侦测数据，一旦数据变化就会把数据反应到`ui`上。
## 2.2 Object的侦测

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

 vue中的源码，目录`src/core/observer/index.js`
 ```javascript
 // Observer观察者类,对每个对象设置getter和setter，进行依赖收集和发送更新
 
 export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; 

    constructor (value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
    /**
     * 给value增加一个属性'__ob__'，值为该value的Observer的实例
     * 这样是相当于在value上打一个补丁，避免重复操作
     * 方法在util/lang.js
     */
        def(value, '__ob__', this)
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
    customSetter?: ?Function,
    shallow?: boolean
    ) {

      const dep = new Dep()
    // 递归，针对子对象设置geter和setter，并返回子对象的Observer实例
        let childOb = !shallow && observe(val)

        Object.defineProperty(obj, key, {
            // 在这里可以知道获取了对象的方法
            get: function reactiveGetter () {
            dep.depend()//收集依赖，往下面看会明白
            return val
            },
            // 在这里可以知道设置了方法
            set: function reactiveSetter (newVal) {
             dep.notify() // 通知所有依赖这个对象观察者进行更新
             val=newVal
            }
        })

    }
 ```
 从上面的源码可以看到，通过new Observer(obj)我们可以使对象变得可观测，那么下一步我们就要知道既然知道了数据什么时候变化，那该怎么去更新视图呢？该更新哪些视图呢，这就要先提到依赖收集。

 ### 2.2.2 依赖收集

 数据发生了变化，我们不可能把整个视图都更新一遍，所以视图中谁用了这个数据，就去更新这部分视图。所以我们会把谁依赖这个数据都放到一个数组里，这样当数据发生变化时，我们直接遍历数组的依赖去更新视图就行了。

 何时收集依赖？
  在getter中调用dep.depend()

 何时更新依赖
  在setter中调用dep.notify()

 🔥我们用dep类去存放依赖
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




 

 
## 2.3 Array的侦测
