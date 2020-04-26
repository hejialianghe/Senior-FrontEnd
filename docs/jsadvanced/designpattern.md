

## 1.1 设计模式概论

### 1.1.1 代码与设计模式

🔥我们写代码到底是在写什么？

我们写项目其实就是写模块然后设计它们之间的沟通，设计模式说白了就是帮助我们更好的设计模块，
更好的组织它们之间的沟通。

🔥设计模式扮演的角色

- 帮助我们组织模块

   通过一些设计模式，组织模块间的组成结构
- 帮助我们设计沟通

  有的设计模式可以帮助我们设计模块间如何沟通

- 提高代码质量

  通过设计模式，让代码更加优雅

🔥设计原则

 1. 开闭原则

     我们的程序要对扩展开放，对修改关闭；我们的程序要给具体使用的时候扩展的接口，但是在具体使用的时候不能让其修改我们的源码，
     也就是说我们不用修改源码就能扩展功能，像vue，react等都有扩展的接口。

 2. 单一职责原则

    我们的模块只做一件事情，模块的职责越单一越好。

 3. 依赖倒置原则

     我们的上层模块不要依赖与具体的下层模块，应该依赖于抽象

假如下面是一套点餐系统，我们在上层和下层之间加一个抽象层；下层如何变动都不会影响到上层，只需更改抽象层即可。
 ```javascript
    // 具体层
    function Food1 (){}
    function Food2 (){}
    function Food3 (){}

    // 抽象层
    function  resturn (food) {
        var list={
            food1:new Food1(),
            food2:new Food2(),
            food3:new Food3(),
        }
        return list[food]
    }

    // 上层
    function order (food){
        return resturn(food)
    }
 ```
4. 接口隔离原则
  
  我们的接口要细化，功能要单一，一个接口不要调用太多方法，使其能力单一，听起来像单一职责原则；但是2者的关注点不同，
  单一职责原则主要关注于模块本身，接口隔离原则关注于接口；我们尽量细化接口，每个接口做的事情尽量单一化。

5. 迪米特法则

 我们让2个对象之间产生沟通，我们最好让2个对象之间知道的越少越好，没必要2者之间非常的了解；我们的中介者模式是一个很好体现迪米特法则的设计模式，中介者模式让2个对象之间没必要直接的沟通，如果直接沟通需要了解2者之间的api和彼此的调用方式，这个时候我们可以采用一个中介者来转达我们的需求，而不用彼此知道

6. 里氏替换原则

它主要关注于继承，它的意义是任何使用父类的地方都可以用子类去替换，直白的说我们子类继承父类的时候，我们的子类必须完全保证继承父类的属性和方法，这样的话父类使用的地方，子类可以进行替换

 <font color="red">**后面学习到设计模式都是在体现这些设计原则**</font>

### 1.1.2 设计模式的分类

1. 创建型

这些设计模式可以帮助我们优雅地创建对象

2. 结构型

帮助我们优雅地设计代码结构

3. 行为型

模块之间行为的模式总结，帮助我们组织模块行为

4. 技巧型

一些帮助我们优化代码的技巧


🔥创建型
 
- 工厂模式-大量创建对象

- 单例模式-全局只能有我一个

- 建造者模式-精细化组合对象

- 原型模式-javaScript的灵魂

🔥结构型

- 外观模式-给你的一个套餐

- 适配器模式-用适配代替更改

- 装饰者模式-更优雅地扩展需求

- 享元模式-共享来减少数量

- 桥接模式-独立出来，然后再对接过去

🔥行为型

- 观察者模式-我作为第三方转发

- 状态模式-用状态代替判断

- 策略模式-算法工厂

- 职责链模式-像生产线一样组织模块

- 命令模式-用命令去解耦

- 迭代器模式-告别for循环

🔥技巧模式

- 链模式-链式调用

- 委托模式-让别人代替你收快递

- 数据访问模式-一个方便的数据管理器

- 惰性模式-我要搞机器学习（第一次执行完后把状态记录下来）

- 等待者模式-等你们都回来再吃饭

### 1.1.3 重点设计模式区别

观察者模式

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

观察者模式则是面向目标和观察者编程的,用于耦合目标和观察者

发布-订阅模式

在现在的发布订阅模式中，称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为调度中心或事件通道，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者

发布-订阅模式是面向调度中心编程的,用于解耦发布者和订阅者

## 1.2 封装与对象

创建型设计模式到底是怎么样使用的，利用创建型设计模式更好的封装代码更好的创建对象

封装的目的？

- 定义的变量不会污染到外部

- 能够作为一个模块调用

- 遵循开闭原则

什么是好的封装？

- 变量外部不可见

- 调用接口使用

- 留出扩展接口

###  1.2.1 封装对象时的设计模式

🔥创建一个对象的模式

- 工厂模式

  目的：方便我们大量创建对象

  应用场景：当某一个对象需要经常创建的时候

- 建造者模式
  
  目的：需要组合出一个全局对象

  应用场景：当要创建单个、庞大的组合对象时

🔥保障对象全局只有一个

- 单例模式

  目的：需要确保全局只有一个对象

  应用场景：为了避免重复新建，避免多个对象存在相互干扰


###  1.2.2 基本结构

🔥工厂模式的基本结构

 ```javascript
 function Factory (type) {
     switch (type) {
         case 'type1'
         return new Type1()
         case 'type2'
         return new Type2()
         case 'type3'
         return new Type3()
     }
 }
 ```
 工厂模式就是写一个方法，只需调用这个方法，就能拿到你要的对象

 🔥建造者模式的基本结构

 ```javascript
//  模块1
function Mode1(){
}
// 模块2
function Mode2(){
}
// 最终使用的类
function Final(){
    this.mode1=new Model();
    this.mode2=new Mode2()
}
 ```
 把一个复杂的类各个部分，拆分成独立的类，然后再最终类里组合到一块，final为最终给出去的类

🔥单例模式的基本结构

单例模式的做法不是很固定，我们更重要的记住是保证全局只有一个对象的思想

 ```javascript
 // 作为单例实例化的对象
 let SingLeton=function(name){
     this.name=name
 }
/*
 在SingLeton挂在一个getInstance方法，只能通过getInstance方法来获取
 SingLeton的实力化对象
*/
 SingLeton.getInstance=function(name){
     if(this.instance){
         return this.instance
     }
     return this.instance=new  SingLeton(name)
 }
 ```
 通过定义一个方法，使用时只允许通过此方法拿到存在内部的同一实力化对象

###  1.2.2 应用示例

🔥工厂模式的示例

实现一个多彩的弹窗？

需求：弹窗有多种，它们之间存在内容和颜色上的差异

 ```javascript
    (function(ROOT){
        // 消息弹性
        function infoPop(){

        }
       // 确认弹窗
        function confirmPop(){

        }
        // 取消弹窗
        function cancelPop(){

        }
        // 弹窗工厂
        function pop (type,content,color){
            switch(type){
                case 'infoPop':
                return new infoPop(content,color)
                case  'confirmPop':
                return new confirmPop(content,color)
                case  'confircancelPopmPop':
                return new cancelPop(content,color)
            }
        }
    ROOT.pop=pop
    })(window)
// 根据传入不同的参数来，来弹出不同的弹窗
    pop('infoPop','开始','white')
 ```

上面这种写法有个弊端就是不能new pop，当用户用new关键词就不适用了


 ```javascript
 (function(ROOT){
   
    function pop (type,content,color){

        if(this instanceof pop){
            var s=this[type](content,color)
            return
        }else {
            return new pop(type,content,color)
        }
    }
    pop.prototype.infoPop= function (){
    }
    pop.prototype.confirmPop= function (){
    }
    pop.prototype.cancelPop= function (){
    }
ROOT.pop=pop
})(window)

pop('infoPop','开始','white')

 ```

 jQuery源码示例

 需求：jQuery需要操作dom，每个dom都是一个jq对象

```javascript
/*
 seletor 选择器
 context 上下文
*/
(function(ROOT){
var jQuery=function(){
    //之所以不new jQuery本身，避免递归造成无限循环，我们用的Query.fn上的init方法代替
    return new jQuery.fn.init(seletor,context)
}
// JQuery各种操作都会挂载到prototype上
JQuery.fn=JQuery.prototype={
    init:function(){

    }
}
jQuery.fn.init.prototype=jQuery.fn
// extend方法把方法拷贝extend对象上
jQuery.extend=jQuery.fn.extend=function(){

}

jQuery.extend({

})

ROOT.$=ROOT.jQuery=jQuery
})(window)
```

总结：工厂模式就是要把我们要暴露的对象，真正要实例化的对象先封装到函数的内部，然后我们只暴露一个工厂方法，使用者通过这个工厂方法
来获取我们实例话的对象，它的优势方便我们大量的创建对象。

🔥建造者模式的示例

编写一个编辑器插件

需求：有一个编辑器插件，初始化的时候需要配置大量参数，而且内部功能很多

```javascript
// 最终类
function Editor(){
    this.intt=new initHTML()
    this.fontControll=new fontControll()
    this.stateControll=new stateControll()
}

// 初始化html的类，最终渲染成dom
function initHTML(){}
// 初始化控制样式的方法
initHTML.prototype.initStyle=function(){}
// 初始化渲染成dom的方法
initHTML.prototype.renderDom=function(){}


// 改变字体颜色大小的类
function fontControll(){}
// 控制颜色的方法
fontControll.prototype.changeColor=function(){}
// 控制字体大小的方法
fontControll.prototype.changeFontsize=function(){}


// 改变状态类，为了前进后退
function stateControll(){
    this.state=[] //存储状态
    this.nowstate=0 //状态指针
}
//保存状态的方法
stateControll.prototype.saveState=function(){}
//回滚状态的方法
stateControll.prototype.saveBack=function(){
    var state=this.state[this.nowstate-1]
    this.fontControll.changeColor(state.color)
    this.fontControll.changeFontsize(state.color)
}
//前进状态的方法
stateControll.prototype.saveGo=function(){}

window.Editor=Editor
```
建造者模式是把它的模块抽离出独立的类，然后在组合起来

vue初始化

需求：vue内部众多模块，而且过程复杂，vue类也可以看做是一个建造者模式

```javascript
function Vue(options){
    // 只允许用户用new操作符，如果直接调用就抛出警告
    if(this instanceof Vue){
        console.warn('Vue is a constructor and should be called with the `new` keyword')
    }
    // 初始化配置项
    this._init(options)
}

initMixin（Vue) // 初始化系统混入到Vue中去
stateMixin(Vue) // 状态系统混入到Vue中去
eventsMixin(Vue) // 事件系统的混入
lifecycleMixin(Vue) // 生命周期混入
renderMixin(Vue)  // 渲染混入

```
通过这些方法和我们上一个案例把模块独立成一个类，把这些类放到暴露出的类里面是一个道理；
只不过这里改成方法，vue中所有的功能都是独立开发，通过这一系列的混入将其混入进去

🔥单例模式的示例

写一个数据存储对象

需求：项目中有一个全局的数据存储者，这个存储者只能有一个 ，不然会需要进行同步，增加复杂度

```javascript
function store(){
    this.state={}
    if(store.install){
        return store.install
    }
    store.install=this
}

store.install=null
var s1=new store()
var s2=new store()
s1.state.a=1
console.log(s1,s2) // store { state: { a: 1 } } store { state: { a: 1 } }
```