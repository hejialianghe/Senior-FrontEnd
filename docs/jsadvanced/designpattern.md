

## 4.1 设计模式概论

### 4.1.1 代码与设计模式

####  :tomato: 我们写代码到底是在写什么？

我们写项目其实就是写模块然后设计它们之间的沟通，设计模式说白了就是帮助我们更好的设计模块，
更好的组织它们之间的沟通。

####  :tomato: 设计模式扮演的角色

- 帮助我们组织模块

   通过一些设计模式，组织模块间的组成结构
- 帮助我们设计沟通

  有的设计模式可以帮助我们设计模块间如何沟通

- 提高代码质量

  通过设计模式，让代码更加优雅

####  :tomato: 设计原则

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


####  :tomato: 创建型
 
- 工厂模式-大量创建对象

- 单例模式-全局只能有我一个

- 建造者模式-精细化组合对象

- 原型模式-javaScript的灵魂

####  :tomato: 结构型

- 外观模式-给你的一个套餐

- 适配器模式-用适配代替更改

- 装饰者模式-更优雅地扩展需求

- 享元模式-共享来减少数量

- 桥接模式-独立出来，然后再对接过去

####  :tomato: 行为型

- 观察者模式-我作为第三方转发

- 状态模式-用状态代替判断

- 策略模式-算法工厂

- 职责链模式-像生产线一样组织模块

- 命令模式-用命令去解耦

- 迭代器模式-告别for循环

####  :tomato: 技巧模式

- 链模式-链式调用

- 委托模式-让别人代替你收快递

- 数据访问模式-一个方便的数据管理器

- 惰性模式-我要搞机器学习（第一次执行完后把状态记录下来）

- 等待者模式-等你们都回来再吃饭


## 4.2 封装对象

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

####  :tomato: 创建一个对象的模式

- 工厂模式

  目的：方便我们大量创建对象

  应用场景：当某一个对象需要经常创建的时候

- 建造者模式
  
  目的：需要组合出一个全局对象

  应用场景：当要创建单个、庞大的组合对象时

####  :tomato: 保障对象全局只有一个

- 单例模式

  目的：需要确保全局只有一个对象

  应用场景：为了避免重复新建，避免多个对象存在相互干扰


###  4.2.2 基本结构

####  :tomato: 工厂模式的基本结构

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

 ####  :tomato: 建造者模式的基本结构

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

####  :tomato: 单例模式的基本结构

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

####  :tomato: 工厂模式的示例

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

####  :tomato: 建造者模式的示例

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
    if(!(this instanceof Vue)){
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

####  :tomato: 单例模式的示例

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

####  :tomato:  减少代码数量，高效复用代码

- 桥接模式

  目的：通过桥接代替耦合

  应用场景：减少模块之间的耦合

- 享元模式
  
  目的：减少对象/代码数量

  应用场景：当代码中创建了大量类似对象和类似的代码块

####  :tomato:  创建高可复用性的代码

 - 模版方法模式

   目的：定义一系列操作的骨架，简化后面类似操作的内容

   应用场景：当项目中出现很多类似操作内容

###  4.3.2 基本结构

####  :tomato:  桥接模式

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

####  :tomato:  享元模式

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

####  :tomato:  模版方法模式

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

####  :tomato: 桥接模式的示例
 
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

####  :tomato: 享元模式的示例

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


 ####  :tomato: 模版方法模式的示例

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
   //结果变量
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

####  :tomato:  更好的更改代码

- 适配器模式（接口）

适配器模式的目的：通过写一个适配器，来代替替换

适配器模式的应用场景：面临接口不通用的问题

- 装饰者模式（方法作用）

装饰者模式的目的：不重写方法的扩展方法

装饰者模式的应用场景：放一个方法需要扩展，但是又不好去修改方法

####  :tomato: 解耦你得方法与调用

- 命令模式

命令模式的目的：解耦实现和调用，让双方互不干扰

命令模式的应用场景：调用的命令充满不确性

### 4.4.2 基本结构

####  :tomato:  适配器模式的基本结构

```javascript
    var log=(function(){
        return winodw.console.log
    })
```
想用log来代替console.log

####  :tomato:  装饰者模式的基本结构

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

####  :tomato:  命令模式的基本结构

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

####  :tomato:  适配器模式示例

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

####  :tomato:  装饰者模式示例

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
Vue的数组监听

需求：vue中利用defineProperty可以监听对象，那么数组怎么办

```javascript
var arrayProto=Array.prototype
var arrayMethods=Object.create(arrayProto)
var methodsToPatch=[
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'resverse',
  'sort'
]

methodsToPatch.forEach(method=>{
  var original=arrayMethods[method]
  object.defineProperty(arrayMethods,method,{
    value(...args){
    const result =original.apply(this,args)
    dep.notify()
    return result
    }
  })

})
```
装饰者模式，拿到老方法，调用老方法，组成新方法

####  :tomato:  命令模式示例

需求：封装一系列的canvas绘图命令

```javascript
 var myCanvas=function(){

   }
   myCanvas.prototype.drawCircle=function(){

   }
   myCanvas.prototype.drawRect=function(){

   }
   

   var canvasComand=(function(){
     var action={
     	drawCircle:function(config){

     	},
     	drawRect:function(config){

     	}
     };
     return function excute(commander){
     	commander.forEach((item)=>{
     		action[item.command](item.config);
     	})
     }
   })()

  myCanvas([{command:'drawReact',config:{}}])
```
1. 用户只管输入他要的命令，不用关心api

2. 命令和实现解耦，无论命令发生变动，还是实现发生变动，都不会彼此影响

绘制随数量图片

需求：需要做一个画廊，图片数量和排列顺序随机

```javascript
   var createImg=(function(){
    	var action={
    	  create:function(obj){
             var htmlArr=[];
             var _htmlstring='';
             var _htmlTemplate="<div><img src='{{img-url}}' /></div><h2>{{title}}</h2>"
             var displayWay={
             	normal:function(arr){
                  return arr;
             	},
             	reverse:function(arr){
             	  return arr.reverse;
             	}
             }

             obj.imgArr.forEach((img)=>{
               var _html;
               _html=_htmlTemplate.replace('{{img-url}}',img.img).replace('{{title}}',img.title);
               htmlArr.push(_html);
             })
             htmlArr=displayWay[obj.type](htmlArr);
             _htmlstring=htmlArr.join("");
             return "<div>"+_htmlstring+"</div>";
    	  },
    	  display:function(obj){
            var _html=this.create(obj);
            obj.target.innerHTML=_html;
    	  }
    	}

        return function excute(obj){
             var _default={
             	imgArr:[{img:'xxxx',title:'default title'}],
             	type:'normal',
             	target:document.body
             };
             for(var item in _default){
             	_default[item]=obj[item]||_default[item];
             }
             action.display(_default);          
        }
    })()
    createImg({
      imgArr:[{img:'xxxx',title:'default title1'},{img:'xxxx',title:'default title2'}],
      type:'normal',
    })
```

数据-> excute命令解析层 -> 调用api

### 4.4.4 总结

- 适配器模式

当面临两个新老模块间接口api不匹配，可以用适配来转化api

- 装饰者模式

当老的方法，不方便去直接修改，可以通装饰者来增加功能

- 命令模式

解耦实现与具体命令，让实现端和命令端扩展的都更轻松

## 4.5 提高可扩展性（2）

提高整体项目可扩展性的核心

- 低耦合

- 良好的组织沟通方式

### 4.5.1 提高可扩展性的设计模式

####  :tomato:  应对需求上的变更

- 观察者模式（事件绑定是典型的观察者模式，比如dom上监视点击了事件，点击事件触发以后就去做这个点击事件）

观察者模式的目的：减少对象间的耦合，来提高可扩展性

观察者模式的应用场景：当两个模块直接沟通会增加它们的耦合性时

- 职责链模式

职责链模式的目的：为了避免请求发送者与多个请求处理者耦合在一起，形成一个链条

组合模式的应用场景：把操作分隔成一系列模块，每个模块只处理自己的事情


####  :tomato:  应对需求上的变更

访问者模式的目的：解耦数据结构与数据操作

访问者模式的应用场景：数据结构不希望与操作有关联


### 4.5.2 基本结构

####  :tomato:  观察者的基本结构

```javascript
function observe {
  this.message={}
}

observe.prototype.regist=function(type,fn) {
  this.message[type]=fn
}

observe.prototype.fire=function(type){
  this.message[type]()
}

observe.prototype.remove=function(type){
  this.message[type]=null
}
```
- 定义一个中转观察者，两个模块之间不直接沟通，而是通过观察者，一般使用与不方便直接沟通，或者异步操作


####  :tomato:  职责链模式的基本结构

```javascript
function mode1 () {

}

function mode2 () {

}

function mode3 () {

}

_result=mode1(_result)
_result=mode2(_result)
_result=mode3(_result)

```
- 把要做的事情组织为一条有序的链条，通过再这条链条传递消息来完成功能，适用于不设计到赋值异步操作

####  :tomato:  访问者模式的基本结构

```javascript
var data=[]

var handler=function () {

}

handler.prototype.get=function(){

}

var vistor=function (handler,data){
  handler.get(data)
}
```

- 通过定义一个访问者，代替直接访问对象，来减少两个对象之间的耦合

### 4.5.3 应用示例

####  :tomato:  观察者模式示例

多人合作的问题

需求：现在假设A工程师写了首页模块，然后B工程师写了评论模块。现在要把评论展示在首页

```javascript
function observe {
  this.message={}
}

observe.prototype.regist=function(type,fn) {
  this.message[type]=fn
}

observe.prototype.fire=function(type){
  this.message[type]()
}

function comment () {
  var self=this;
  this.commentList=[
    {
      type:'hot',
      content:'xxxx'
    }
  ];
// 注册事件
observeOb.regist('gotHot',function(){
  var _arr=[];
  self.commentList.forEach((item)=>{
    if(item.type==='hot'){
      _arr.push(item)
    }
  })
  return _arr
})

}
// 调用事件
var _arr=observeOb.fire('gotHot')

```

一个转盘

需求：有一个转盘应用，每转一圈，速度加快

```javascript
function observe {
  this.message={}
}

observe.prototype.regist=function(type,fn) {
  this.message[type]=fn
}

observe.prototype.fire=function(type){
  this.message[type]()
}

var observeOb=new observe()

// 初始化html=> 最终结果选定 => 运动结果 => 运动控制

var _domArr=[]

function htmlInit (target) {
  for(let i =0;i<9;i++){
    var _div=document.createElement('div')
    _div.innerHTML=i
    _div.setAttribute('class','item')
    target.appendChild(_div)
    _domArr.push(_div)
  }
}

function getFinal(){
  var _num=Math.random()*10+40
  return Math.floor(_num,0)
}
// 运动模块
function mover (moveConfig){
  var nowIn=0;
  var removeNum=9;
  var timer=setInterval(()=>{
    if(nowIn!=0){
      removeNum=nowIn-1
    }
    _domArr[removeNum].setAttribute('class','item')
    _domArr[nowIn].setAttribute('class','item item-on')
    nowIn++
    if(nowIn==moveConfig.moveTime){
      clearInterval(timer)
      if(moveConfig.moveTime==10){
        observeOb.fire('finish')
      }
    }
  },moveConfig.speed)
}

function moveControll () {
  var final=getFinal()
  var _circle=Math.floor(final/10,0)
  var stopNum=final%10
  var _speed=2000
  var _runCircle=0
  mover({
    moveTime:10,
    speed:_speed
  })
  observeOb.regist('finish',fucntion(){
    var _time=0;
    _speed-=50;
    _runCircle++;
    if(_runCircle<=_circle){
      _time=0
    }else {
      _time=stopNum
    }
    mover({
      moveTime:_time,
      speed:_speed
    })
  })
}

htmlInit(document.getElementById('app'))
moveControll()
```

####  :tomato:  职责链模式示例

Axios的拦截器

需求：axios拦截器的设计，大家可以看成一个用给职责链的思想去处理请求

```javascript
function axios(){
  this.interceptors={
    request:new interceptorsManner(),
    response: new interceptorsManner()
  }
  axios.prototype.request=function (){
    var chain=[dispathReuest,undefined]
    var promise=Promise.resolve(config)
    this.interceptors.request.handlers.forEach((interceptor)=>{
      chain.unshift(interceptor.fulfilled,interceptor.injected)
    })
      this.interceptors.response.handlers.forEach((interceptor)=>{
      chain.shift(interceptor.fulfilled,interceptor.injected)
    })
    while(chain.length){
      promise=promise.then(chain.shift(),chain.shift())
    }
  }
}

function interceptorsManner (){
  this.handlers=[]
}

interceptorsManner.prototype.use=function(fulfilled,rejected){
  this.handlers.push({
    fulfilled:fulfilled,
    rejected:rejected
  })
}
```

利用职责链组织一个表单验证

需求：有一个表单，需要前后台校验，后台校验

```javascript
  // 表单事件绑定->表单前端验证->表单后端验证
  // 思想：把你要做的事情拆分为模块，模块之间只做自己模块的事情

input.onblur=function() {
  var _value=input.value
  var _arr=[font,middle,back,fontAgain]
  async function test(){
    var _result=_value
    while (_arr.length>0){
      _result=await _arr.shift()(_result)
    }
    return _result
  }
  test().then((res)=>{
    console.log(res)
  })
}

function font (result){}

function middle (result){}

function back (result){}

function fontAgain (result){}
```

####  :tomato:  访问者模式示例

不同角色访问数据

需求：假设有一个公司的财务报表，财务关心支出和收入，老板关心盈利

```javascript
function report () {
  this.income=""
  this.cost=""
  this.profit=""
}

function boss () {}

boss.prototype.get=function(data) {}

function account () {}

account.prototype.get=function (num1,num2){}

function vistor (data,man) {
  var handle={
    boss:function (data){
      man.get(data.profit)
    },
    account:function (data){
      man.get(data.income,data.cost)
    }
  }
  handle[man.constructor.name](data)
}

vistor(new report(),new account())
vistor(new report(),new boss())

// 设计的数据结构操作难以去访问具体的数据结构的时候
```

表格操作

需求：一个可以新增，删除的表格

```javascript
  function table () { }

  table.prototype.show=function () {

  }

  table.prototype.delete=function () {
    vistor(this.tableData,'delete',id)
  }

  table.prototype.add=function () {

  }

  var tableData=[
    {
      id:1,
      name:'xxx',
      prize:'xxx'
    }
  ]

  function vistor (table,data,handle) {
    var handleOb={
      delete:function(id){

      },
      add:funtion(id,name,price){

      }
    }
    var arg=Array.prototype.splice(arguments);
    arg.splice(0,3);
    handleOb[handle].apple(this,arg)
  }
```
### 4.5.4 总结

- 观察者模式

适用于不适合直接沟通的模块之间的组织

- 职责链模式

组织同步模块，把要做的事情划分为模块，要做的事情一次传递

- 访问者模式

解耦数据操作与数据结构

## 4.6 提高代码质量

提高代码质量

- 高质量的代码，方便后续的一切操作
- 方便他人阅读

什么是代码质量

1. 代码整洁
2. 结构规整，没有漫长的结构
3. 阅读好理解

### 4.6.1 优化代码结构

- 策略模式/状态模式

策略/状态模式的目的：优化if-else分支

策略/状态模式的应用场景：当代码if-else分支过多时

- 外观模式

外观模式的目的：通过为多个复杂的子系统提供一个一致的接口

外观模式的应用场景：当完成一个操作时，需要操作多个子系统，不如提供一个更高级的

### 4.6.2 优化你的代码操作

- 迭代器模式

迭代器者模式的目的：不访问内部的情况下，方便的遍历数据

迭代器模式的应用场景：当我们需要对某个对象进行操作，但是又不能暴露内部

- 备忘录模式

备忘录模式的目的：记录状态，方便回滚

备忘录模式的应用场景：系统状态多样，为了保证状态的回滚方便，记录状态

### 4.6.3 基本结构

####  :tomato:  策略模式的基本结构

假设要编写一个计算器，有加减乘除，我们把一层一层的if判断，变成下面的形式

```javascript
  function Strategy (type,a,b) {
    var Strategyer={
      add:function (a,b){
        return a+b
      }
      minus:function(a,b){
        return a-b
      }
      division:function (a,b){
        return a/b
      }
    }
    return Strategyer[type](a,b)
  }
```

####  :tomato:  状态模式的基本结构（加了状态的策略模式）

为了减少if-else结构，将判断变成对象内部的一个状态，通过对象内部的状态改变，让其拥有不同的行为

```javascript
function stateFactor (state) {
  var stateObject={
    _status:'',
    state:{
      state1:function () {

      },
      state2:function (){

      }
    },
    run:function () {
      return this.state[this._status]
    }
  }
  stateObject._status=state
  return stateObject
}
```

####  :tomato:  外观模式的基本结构

我们组织方法模块时可以细化多个接口，但是我们给别人使用时，要合为一个接口就像你可以直接去餐厅去点套餐

```javascript
  // 模块1
  function Model1 () {

  }
  // 模块2
  function Model2 () {

  }
  // 功能由Model1获取Model2得结果来完成

  function use () {
    Model2(Model1())
  }
```

####  :tomato:  迭代器模式的基本结构

在不暴露对象内部结构的同时，可以顺序的访问对象内部，可以帮助我们简化循环，简化数据操作

```javascript
  function Iterator (item){
    this.item=item
  }
  Iterator.prototype.dealEach=function (fn) {
    for(var i=0;i<this.item.length;i++){
      fn(this.item[i],i)
    }
  }
```

####  :tomato:  备忘录模式的基本结构

记录对象内部的状态，当有需要时回滚到之前的状态或者方便对象使用

```javascript
  function Memento () {
    var cache={}
    return function (cacheName){
      if(cache[cacheName]){
        // 有缓存的操作
      }else {
        // 没有缓存的操作
      }
    }
  }
var MementtoFn=Memento()
MementtoFn('xxxcx')
```


### 4.6.4 应用示例

####  :tomato:  策略/状态模式的示例

动态的内容

需求：项目有一个动态的内容，根据用户权限的不同显示不同的内容

```javascript
// 没有用策略的模式的情况
function showPart1(){
	 console.log(1);
 }
 function showPart2(){
	console.log(2);
}
function showPart3(){
	console.log(3);
}
axios.get('xxx').then((res)=>{
	 if(res=='boss'){
		 showPart1();
		 showPart2();
		 showPart3();
	 }else if(res=='manner'){
		showPart1();
		showPart2();		 
	 }else if(res=='staff'){
		showPart3();
	 }
}) 

// 用策略模式的情况
 function showControl(){
	this.status='';
    this.power={
	  boss:function(){
		showPart1();
		showPart2();
		showPart3();		  
	  },
	  manner:function(){
		showPart1();
		showPart2();
	  },
	  staff:function(){
		showPart3();
	  }
	}
 }
 showControl.prototype.show=function(){
	 var self=this;
	 axios.get('xxx').then((res)=>{
		 self.status=res;
		 self.power[self.status]();
	 })
 }
 new showControl().show();

```

复合运动

需求：有一个小球，可以控制它左右移动，或则左前，右前等方式移动

```javascript
 function moveLeft(){
  console.log('left')
 }
 function moveRight(){
	console.log('RigmoveRight')	 
}
function moveTop(){
	console.log('Top')	 
}
function moveBottom(){
	console.log('bomoveBottom')	 
} 

// 没有用状态模式的情况
 function mover(){
   if(arguments.length==1){
	   if(arguments[0]=='left'){
         moveLeft();
	   }else if(arguments[0]=='right'){
		 moveRight();
	   }else if(arguments[0]=='top'){
		 moveTop();
	   }else if(arguments[0]=='bottom'){
		 moveBottom();
	   }
   }else{
	   if(arguments[0]=='left'&&arguments[1]=='top'){
		 moveLeft();
		 moveTop();
	   }else if(arguments[0]=='right'&&arguments[1]=='bottom'){
		 moveRight();
		 moveBottom();
	   }
   }
 }

// 用状态模式的情况
 function mover(){
	 this.status=[];
	 this.actionHandle={
		left:moveLeft,
		right:moveRight,
		top:moveTop,
		bottom:moveBottom
	 }
 }
 mover.prototype.run=function(){
	 this.status=Array.prototype.slice.call(arguments);
	 this.status.forEach((action)=>{
		 this.actionHandle[action]();
	 })
 }
 new mover().run('left','right');

```

####  :tomato:  外观模式的示例

插件封装的规律

需求：插件基本都会给最终使用提供一个高级接口

```javascript
// 划分功能，给使用者一个统一的接口
function tab(){
  this.dom=null
}
tab.prototype.initHTML=function(){

}
tab.prototype.changeTab=function(){
      
}
tab.prototype.eventBind=function(){
   var self=this;
   this.dom.onclick=function(){
     self.changeTab();
   }
}
tab.prototype.init=function(config){
  this.initHTML(config);
  this.eventBind();
}
```

封装成方法的思想

需求：在兼容时代，我们会常常需要检测能力，不妨作为一个统一接口

```javascript
  //dom支持检测
function addEvent(dom,type,fn){
  if(dom.addEventListener){
  	dom.addEventListener(type,fn,false);
  }else if(dom.attachEvent){
  	dom.attachEvent('on'+type,fn)
  }else{
  	dom['on'+type]=fn
  }
}
```

####  :tomato:  迭代器模式的示例

构建一个自己的forEach

需求：forEach方法其实是一个典型的迭代器方法

```javascript
  // 对数组和对象进行迭代
  //forEach
  function Iterator(data){
    this.data=data;
  }
  Iterator.prototype.dealEach=function(fn){
    if(this.data instanceof Array){
      for(var i=0;i<this.data.length;i++){
        fn(this.data[i],i)
      }
    }else{
      for(var item in this.data){
        fn(this.data[item],item)
      }
    }
  }
```

给你的项目数据添加迭代器

需求：项目经常对于后端数据进行遍历操作，不如封装一个迭代器，遍历的更方便

```javascript

//数据迭代器
var data=[{num:1},{num:2},{num:3}]
function i(data){
    function Iterator(data){
      this.data=data;
    }
    Iterator.prototype.getHasSomenum=function(handler,num){
       var _arr=[];
       var handleFn;
       if(typeof handler=='function'){
         handleFn=handler;
       }else{
         handleFn=function(item){
             if(item[handler]==num){
                return item;
             }
         }
       }
       for(var i=0;i<this.data.length;i++){
          var _result=handleFn.call(this,this.data[i])
          if(_result){
            _arr.push(_result);  
          }
          
       }
       return _arr;
    }
    return new Iterator(data);
}
i(data).getHasSomenum('num',1);
// 自定义的筛选方法
i(data).getHasSomenum(function(item){
  if(item.num-1==2){
      return item;
  }
});
```

####  :tomato:  备忘录模式的示例

文章页的缓存

需求：项目有一个文章页需求，现在进行优化，如果上一篇已经读取过了，则不进行请求，否则请求文章数据

```javascript
//缓存
function pager(){
  var cache={};
  return function(pageName){
     if(cache[pageName]){
         return cache[pageName];
     }else{
         axios.get(pageName).then((res)=>{
           cache[pageName]=res;
         })
     }
  }
}
var getpage=pager();
getpage('pageone');

```

前进后退功能

需求：开发一个可移动的div，拥有前进后退功能能回滚到之前的位置

```javascript
//前进后退
function moveDiv(){
    this.stateList=[]; // 缓存之前的状态
    this.nowState=0; // 状态指针，指向当前状态在哪个
}
/**
  * @param {string} type 往哪个方向移动
  * @param {Number} num  移动多远
  */
moveDiv.prototype.move=function(type,num){
    changeDiv(type,num); //假设移动位置的函数
    this.stateList.push({
     type:type,
     num:num
    }); // 添加状态
    this.nowState=this.stateList.length-1; // 设置当前指针
}
moveDiv.prototype.go=function(){ //前进
  var _state;
  if(this.nowState<this.stateList.length-1){ //当前指针小于数组最后一位，说明能前进
      this.nowState++;
      _state=this.stateList[this.nowState];
      changeDiv(_state.type,_state.num);
  } 
}
moveDiv.prototype.back=function(){ //后退
    var _state;
    if(this.nowState>=0){
        this.nowState--;
        _state=this.stateList[this.nowState];
        changeDiv(_state.type,_state.num);
    }
}
```

### 4.6.5 本章总结

- 策略/状态模式

帮助我们优化if-else结构

- 外观模式

一种套餐化接口的思想，提醒我们封装常用方法

- 迭代器模式

帮助我们更好的遍历数据

- 备忘录模式

帮我们缓存以及回到过去的状态

## 4.7 总结

:::tip 提示
<font color="red">**我们的设计模式，要记住其思想，不用记住其结构，结构不是固定；我们通过设计模式主要是提高我们代码的质量**</font>
:::





















