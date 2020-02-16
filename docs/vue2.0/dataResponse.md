## 2.1 概述
### 2.1.1 数据、视图、vue之间的关系
`vue`最大的特点之一就是用数据驱动视图，相信大家用的都很爽，只需更改数据，我们的页面就会随之改变，由此我们可以得出以下公式：

 <font color="red">**UI = render(state)**</font>

 `state`代表数据，`UI`代表页面，`vue`将扮演着`render`；vue将侦测数据，一旦数据变化就会把数据反应到`ui`上。
## 2.2 Object的侦测

### 2.2.1 利用Object.defineProperty是数据变得可观测
 相信大家都知道Object.defineProperty这个方法，vue就是用这个方法对数据进行观测的，会对所有的数据设置getter和setter，这样我们就知道了数据何时发生变化了，从而去更新相应的视图

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
 ```javascript
    export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data

    constructor (value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {  
        if (hasProto) {
            protoAugment(value, arrayMethods)
        } else {
            copyAugment(value, arrayMethods, arrayKeys)
        }
        this.observeArray(value)
        } else {
        this.walk(value)
        }
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk (obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
        }
    }

 ```
 
## 2.3 Array的侦测
