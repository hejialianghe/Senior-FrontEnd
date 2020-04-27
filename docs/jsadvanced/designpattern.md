

## 4.1 设计模式概论

### 4.1.1 代码与设计模式

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

### 4.1.2 设计模式的分类

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

### 4.1.3 重点设计模式区别

观察者模式

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

观察者模式则是面向目标和观察者编程的,用于耦合目标和观察者

发布-订阅模式

在现在的发布订阅模式中，称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为调度中心或事件通道，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者

发布-订阅模式是面向调度中心编程的,用于解耦发布者和订阅者

## 4.2 封装与对象

创建型设计模式到底是怎么样使用的，利用创建型设计模式更好的封装代码更好的创建对象

封装的目的？

- 定义的变量不会污染到外部

- 能够作为一个模块调用

- 遵循开闭原则

什么是好的封装？

- 变量外部不可见

- 调用接口使用

- 留出扩展接口

###  4.2.1 封装对象时的设计模式

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


###  4.2.2 基本结构

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

###  4.2.3 应用示例

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

vue-router

需求：vue-router必须 保障全局有且只有一个，否则的话会错乱

```javascript
    let _Vue
    function install (Vue){
        if(install.installed &&  _Vue===vue) return
        install.installed=true
        _Vue=vue
    }
```

###  4.2.4 总结

工厂模式：如果你写的模块，需要大量创建类似的对象

建造者模式：需要创建一个需要大量参数，且内部模块庞大

单例模式：防止重复注册，防止有多个对象互相干扰

##  4.3 提高复用性

什么是好的复用？

- 对象可以再重复使用，不用修改
- 重复代码少
- 模块功能单一

###  4.3.1 提高复用性的设计模式

🔥 减少代码数量，高效复用代码

- 桥接模式

  目的：通过桥接代替耦合

  应用场景：减少模块之间的耦合

- 享元模式
  
  目的：减少对象/代码数量

  应用场景：当代码中创建了大量类似对象和类似的代码块

🔥 创建高可复用性的代码

 - 模版方法模式

   目的：定义一系列操作的骨架，简化后面类似操作的内容

   应用场景：当项目中出现很多类似操作内容

###  4.3.2 基本结构

🔥 桥接模式

```javascript
 // 有三种形状，每种形状都有3种颜色
 function rect (color){ //矩形
     showcolor(color)
 }
 function circle () { // 圆形
     showcolor(clor)
 }
 function delta (color){ // 三角形
     showcolor(clor)
 }
 
 new circle("red")
```
- 对于3种形状、每种形状有3种颜色的需求，可以不用创建9种不同颜色的不同形状
- 这个模式把重复的方法抽取出来，然后在桥接出去

这个模式跟我们的建造者模式很类似拆分再组合，建造者模式的核心是如何去构造对象；而我们桥接模式是如何简化我们的代码，提高我们的可复用性，一个关注的是功能一个关注的是创建，这是它们的区别。

🔥 享元模式

```javascript
    // 有一百种不同文字的弹窗，每种弹窗行为相同，但是文字和样式不同，我们没必要新间一百个弹窗对象
    function Pop(){
    }
    // 保留同样的行为
    Pop.prototype.action=function(){}
    //显示
    Pop.prototype.show=function(){}
    // 提取出每个弹窗不同的部分作为一个外部数组
    var popArr=[
        {text:"window1",style:[400,400]}
        {text:"window2",style:[400,200]}
    ]

    var poper=new Pop()

    for(var i=0;i<100;i++){
        poper.show(popArr[i])
    }
```
- 只需一个类，不需要new一百次弹窗
- 这个类只保留所有弹窗共有的，每个弹窗不同的部分留作为一个公共享元

🔥 模版方法模式

```javascript
  // 编写导航组件，有的带消息提示，有的竖着，有的横者
   function baseNav(){
       // 基础类，此处定下基本骨架
   }

   baseNav.prototype.action=function(fn){
       // 特异性的处理，留一个回调等待具体实现
   }
```
- 导航组件多种多样，可能后面还会新增类型，那么我们不妨写一个基础的组件库，然后具体的实现，延迟到具体的使用时


###  4.3.3 应用示例

🔥桥接模式的示例
 
 创建不同的选中效果

 需求：有一组菜单，上面每种选项都有不同的选中效果

 ```javascript
//  一般做法
 //menu1,menu2,menu3
function menuItem(word){
  this.word="";
  this.dom=document.createElement('div');
  this.dom.innerHTML=this.word;  
}
var menu1=new menuItem('menu1');
var menu2=new menuItem('menu2');
var menu3=new menuItem('menu3');
menu1.onmouseover=function(){
  menu1.style.color='red';
}
menu2.onmouseover=function(){
  menu1.style.color='green';
}
menu3.onmouseover=function(){
  menu1.style.color='blue';
}
menu1.onmouseout=function(){
  menu1.style.color='white';
}
menu2.onmouseout=function(){
  menu1.style.color='white';
}
menu3.onmouseout=function(){
  menu1.style.color='white';
}


// 桥接模式做法
function menuItem(word,color){
  this.word=word;
  this.color=color;
  this.dom=document.createElement('div');
  this.dom.innerHTML=this.word;
  document.getElementById('app').appendChild(this.dom);
}

menuItem.prototype.bind=function(){
  var self=this;
  this.dom.onmouseover=function(){
     console.log(self.color);
  	this.style.color=self.color.colorOver;
  }
  this.dom.onmouseout=function(){
  	this.style.color=self.color.colorOut;
  }  
}
function menuColor(colorover,colorout){
  this.colorOver=colorover;
  this.colorOut=colorout;
}


var data=[{word:'menu1',color:['red','black']},{word:'menu2',color:['green','black']},{word:'menu3',color:['blue','black']}]
for(var i=0;i<data.length;i++){

  new menuItem(data[i].word,new menuColor(data[i].color[0],data[i].color[1])).bind();

}
 ```

 Express中创建get等方法

 需求：express中get，post等方法，有七八个，如何快速地创建。

 ```javascript
 var methods=['get','post','delete','put'];
    methods.forEach(function(method){
    app[method]=function(){
        //利用桥接过来的route来完成post，get等请求
        route[method].apply(route,slice.call(arguments,1))
    }
    })
 ```

🔥享元模式的示例

文件上传

需求：项目中有一个文件上传功能，该功能可以上传多个文件

一般做法

```javascript
//文件上传
function uploader(fileType,file){
	 this.fileType=fileType;
    this.file=file;
}
uploader.prototype.init=function(){
  //初始化文件上传的html
}
uploader.prototype.delete=function(){
  //删除掉该html
}
uploader.prototype.uploading=function(){
  //上传
}

new uploader('img',fileob1)
new uploader('txt',fileob2)
new uploader('img',fileob3)
new uploader('word',fileob4)

```
享元模式
```javascript

 //fileType,file
function uploader(){

}
uploader.prototype.init=function(){
  //初始化文件上传的html
}
uploader.prototype.delete=function(){
  //删除掉该html
}
uploader.prototype.uploading=function(filetype,file){

}

var fileob1,fileob2,fileob3,fileob4
var data=[
  {
  	type:'img',
  	file:fileob1
  },
  {
  	type:'txt',
  	file:fileob2
  },
  {
  	type:'img',
  	file:fileob3
  },
  {
  	type:'word',
  	file:fileob4
  },      
]
var uploader=new uploader();
for(var i=0;i<data.length;i++){
	uploader.uploading(data[i].type,data[i].file);
}
```

jQuery的extend

需求：extends方法，需要判断参数数量来进行不同的操作

```javascript
// 一般做法
var jQuery={};
jQuery.fn={};
jQuery.extend = jQuery.fn.extend = function() {
  if(arguments.length==1){
     for(var item in arguments[0]){
         this[item]=arguments[0][item]
     }
  }else if(arguments.length==2){
    for(var item in arguments[1]){
      arguments[0][item]=arguments[1][item]
    }
    return arguments[0];
  }
 
} 

// 享元做法，保留一个公共的for循环
jQuery.extend = jQuery.fn.extend = function() {

  var target=arguments[0];
  var source;
  if(arguments.length==1){
    target=this;
    source=arguments[0];
  }else if(arguments.length==2){
    target=arguments[0];
    source=arguments[1];
  }
  for(var item in source){
    target[item]=source[item]
  }
  return target;
}
```


 🔥模版方法模式的示例

 编写一个弹窗组件

 需求：项目有一系列弹窗，每个弹窗的行为、大小、文字不同

```javascript
function basePop(word,size){
  this.word=word;
  this.size=size;
  this.dom=null;
}
basePop.prototype.init=function(){
	var div=document.createElement('div');
	div.innerHTML=this.word;
	div.style.width=this.size.width+'px';
	div.style.height=this.size.height+'px';
	this.dom=div;
}
basePop.prototype.hidden=function(){
   //定义基础操作
   this.dom.style.display='none';
}
basePop.prototype.confirm=function(){
   //定义基础操作
   this.dom.style.display='none';
}
function ajaxPop(word,size){
  basePop.call(this,word,size);
}
ajaxPop.prototype=new basePop();
var hidden=ajaxPop.prototype.hidden;
ajaxPop.prototype.hidden=function(){
	hidden.call(this);
	console.log(1);
}
var confirm=ajaxPop.prototype.confirm;
ajaxPop.prototype.confirm=function(){
	confirm.call(this);
	console.log(1);
}
var pop=new ajaxPop('sendmes',{width:100,height:300});
pop.init();
pop.confirm();

var axios={get:function(){
	return Promise.resolve();
}};
 
```

上面这个就是我们面向对象中的继承，模版模式不一定非要通过继承方式来完成，它强调先定义后面进行不同维度的操作的基本行为；

然后在这个基本行为上有扩展的空间，这就是我们模版方法的目的。

封装一个算法计算器

需求：现在我们有一系列自己的算法，但是这个算法常在不同的地方需要增加一些不同的操作

```javascript
    //算法计算器

function counter(){
  this.beforeCounter=[];
  this.afterCounter=[];
}

//然后我们把具体的不同部分留到具体使用的时候去扩展
//所以我们定义两个方法来扩展
counter.prototype.addBefore=function(fn){
   this.beforeCounter.push(fn);
}
counter.prototype.addAfter=function(fn){
   this.afterCounter.push(fn);
}

//最终计算方法
counter.prototype.count=function(num){
   //结果边两
   var _resultnum=num;
   //算法队列数组组装
   var _arr=[baseCount];
   _arr=this.beforeCounter.concat(_arr);
   _arr=_arr.concat(this.afterCounter);
   //不同部分的相同算法骨架
   function baseCount(num){
     num+=4;
     num*=2;
     return num;
   }
   //循环执行算法队列
   while(_arr.length>0){
     _resultnum=_arr.shift()(_resultnum);
   }
   return _resultnum;
}
//使用
var countObject=new counter();
countObject.addBefore(function(num){
   num--;
   return num;
})
countObject.addAfter(function(num){
  num*=2;
  return num;
})
countObject.count(10);

```
这个应用了组合实现模版模式

 <font color="red">**javascript的组合与继承**</font>

 - 组合（推荐）
   1. javascript最初没有专门的继承，所以最初javascript推崇函数式的编程，然后进行统一组合桥接到一起
   2. 桥接模式可以看出组合的一种体现，组合的好处是耦合低，方便方法复用，方便扩展

- 继承
   1. es6出现class与extend，继承的方式多种多样，但是都是各有弊端
   2. 模版方法模式可以看出继承的一种体现，继承的好处是可以自动获得父类的内容与接口，方便统一化

###  4.3.4 总结

- 桥接模式

通过独立方法间接的桥接来形成整体功能，这样每个方法都可以被高度复用

- 享元模式

提取出公有部分与私有部分，私有部分作为外部数据传入，从而减少对象数量

- 模版方法模式

当一个功能朝着多样化发展，不妨先定义一个基础的，把具体实现延迟到后面

## 4.4 提高可扩展性（1）

提高可扩展性的目的

- 面对需求变更，方便更该需求
- 减少代码修改的难度

什么是好的扩展

- 需求的变更，不需要重写
- 代码修改不会引起大规模变动
- 方便加入新模块

### 4.4.1 提高可扩展性的设计模式

🔥 更好的更改代码

- 适配器模式（接口）

适配器模式的目的：通过写一个适配器，来代替替换

适配器模式的应用场景：面临接口不通用的问题

- 装饰者模式（方法作用）

装饰者模式的目的：不重写方法的扩展方法

装饰者模式的应用场景：放一个方法需要扩展，但是又不好去修改方法

🔥解耦你得方法与调用

- 命令模式

命令模式的目的：解耦实现和调用，让双方互不干扰

命令模式的应用场景：调用的命令充满不确性

### 4.4.2 基本结构

🔥 适配器模式的基本结构

```javascript
    var log=(function(){
        return winodw.console.log
    })
```
想用log来代替console.log

🔥 装饰者模式的基本结构

```javascript
  // 在一个他人写好的模版a内部调用b，模块为他人写好，不能修改，如何扩展b方法？
    var a={
        b:function(){}
    }
    function myb(){
        a.b()
        // 要扩展的方法
    }
```
我们新建一个自己的方法，在其内部调用b方法，并且再执行自己的方法，这样可以在不修改原方法的情况下扩展方法

🔥 命令模式的基本结构

```javascript
  var command=(function(){
      // action中定义了各种方法
      var action={}
      // excure可以调用action方法
      return function excure()
  })()
  // command只需输入命令就可以调用action里的方法
```
### 4.4.3 应用示例

框架的变更

需求：目前项目使用的A框架，现在改成了B，2个框架与十分类似，但是有少数几个方法不同

```javascript
// A框架调用的方式
A.c()
// 假如我们项目中换成了jQuey，我们不想全部去替换A方法，就用适配器的方法
A.c=function(){
    return $.on.apply(this.arguments)
}

```

参数适配

需求：为了避免参数不适配产生问题，很多框架会有一个参数适配操作


```javascript
// 给参数适配，没传值给默认值
function f1(){
    var _defalut={
        name:"",
        color:""
    }
    for(var item in _defalut){
        _defalut[item]=config[item] || _defalut[item]
    }
    return _defalut
}

```

🔥 装饰者模式的基本结构

扩展你的已有事件绑定

需求：现在项目改造，需要给input标签已经有的事件增加一些操作

```javascript
var decorator=function(dom,fn){
  if(typeof dom.onclick='function'){
  	var _old=dom.onclick;
  	dom.onclick=function(){
  		_old();
  		fn();
  	}
  }
}
decorator(document.getElementById('dom1'),function(){
    // 自己的操作
})
```






