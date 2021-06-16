## 3.1 事件处理

### 3.1.1 react事件和DOM事件

| react事件  |  原生事件  |
| :-------: | :--------: | 
|  onClick |  onclick |  
|  onClick={eventListener} |  onclick="eventListener()" |  
|  e.preventDefalut |  onclick="javascript" |  

```jsx{10}
class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数
   }
   doSomethind(){

   }
    handleClick(e){
        console.log(e)
        this.doSomethind() //报错，会说找不到这个方法
    }
   render(){
    return (
      <div className='listItem'>
        <span onclick={this.handleClick}>header<span>
      <div>
    )
   }
  }
```
在面向对象的编程中，this的使用方法会随着引用对象的差别而不同，当被对象引用时指向的是对象，单独函数引用指向的是window，严格模式是`undefined`，那我们在react中怎么解决这个问题呢？

### 3.1.2 this关键词的处理

- 在jsx中使用bind方法
- 在构造函数中使用bind方法
- 使用箭头函数

```jsx{5,11,19}
class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数
     // 方法2
     this.handleClick=this.handleClick.bind(this)
   }
   doSomethind(){

   }
    // 方法3，推荐使用，箭头函数的this总是指向定义时的对象，而不是运行时
    handleClick=(e)=>{
        console.log(e)
        this.doSomethind() //报错，会说找不到这个方法
    }
   render(){
    return (
      <div className='listItem'>
        {/*方法1*/}
        <span onclick={this.handleClick.bind(this)}>header<span>   
      <div>
    )
   }
  }
```
### 3.1.3 向事件处理程序传递参数

```jsx{15,17,19}
class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数)
     this.state={
         conunt:1
     }
   }
    handleClick(id){
        console.log(id)
    }
   render(){
    return (
      <div className='listItem'>
       {/* 方法1*/}
        <span onclick={this.handleClick.bind(this,1)}>header<span> 
         {/* 方法2*/}
        <span onclick={()=>this.handleClick(1)}>header<span>  
          {/* 传递事件对象event*/}
        <span onclick={(e)=>this.handleClick(1,e)}>header<span>  
      <div>
    )
   }
  }
```

### 3.1.4 向父组件传递参数

```jsx{21}
// 父组件
class App extends Component {
    handDelete(id){
        console.log(id)
    }
    render(){
        <ListItem onDelete={this.handDelete}/>
    }
}
// 子组件
class ListItem extends Component {
     constructor(props){
     super(props)
     this.state={
         conunt:1
     }
   }
   render(){
    return (
      <div className='listItem'>
        <span onclick={()=>this.props.onDelete(this.state.conunt)}>header<span>  
      <div>
    )
   }
  }
```
### 3.1.5 React事件机制

#### DOM事件

![](~@/react/domhandle.png)

在js的事件触发经过3个阶段，事件的捕获->目标对象事件的处理->事件冒泡，假设在`text`中触发了事件，会经过一个捕获的阶段，父级元素将事件一直传递到本身发生的元素上，在经过本身的事件处理之后，会经历冒泡饿阶段，事件从子元素向父元素冒泡；就因为这样，事件委托成为了可能，就是将子元素的事件处理委托给父元素。

#### react事件

![](~@/react/reacthandle.png)

react会将所有的事件都绑定到document上，而不是某个元素上面，统一的使用事件监听，并在冒泡阶段处理事件，当挂载和卸载组件的时候
只需在统一的事件监听位置，增加或删除对象，因此极大的提高效率；当事件触发的时候，我们的组件会生成一个合成事件，然后传递到`documennt`中，doucument会通过`DispatchEvent`回调函数依次执行`DispatchEvent`中同类型的事件监听函数，事件注册是在组件生成的时候，我们将vDom中所有的事件的原生事件`documennt`中的一个监听器当中，也就是所有的事件处理函数都存在`ListenerBank`中
并以`key`作为索引，这样的好处是将可能要触发的事件分门别类。

react事件要素

- react事件是合成事件，不是DOM原生事件
- 在document监听所有支持的事件
- 使用统一的分发函数dispatchEvent

### 3.1.6 扩展学习

[源码分析事件](https://zhuanlan.zhihu.com/p/25883536)

[合成事件](	http://react.html.cn/docs/events.html)

## 3.2 认识State

安装`react-devtools`调试工具

方法1:有条件的可以在谷歌商店安装

方法2:没有条件的看地址安装[点击我](https://www.npmjs.com/package/react-devtools)

### 3.2.1 如何定义State
```jsx
   class ListItem extends Component {
     constructor(props){
     super(props)
     this.state={ //定义一个state
         conunt:1 
     }
   }
   render(){
    return (
      <div className='listItem'>
        <span>{this.state.count}<span>  
      <div>
    )
   }
  } 
```
### 3.2.2 修改State

- 使用setState
- setState是异步的
- State的更新是一个浅合并（shalllow merge）的过程

```jsx
   class ListItem extends Component {
     constructor(props){
     super(props)
     this.state={
         conunt:1 
     }
   }
   addCunt(){
       console.log('step1',this.state.count)
       this.setState({ //修改一个state
           count:this.state.count+1
       })
       console.log('step2',this.state.count)
   }
   render(){
    return (
      <div className='listItem'>
        <span onclick={()=>this.addCount()}>{this.state.count}<span>  
      <div>
    )
   }
  } 
```
addCount函数中打印的2次`conut`的值是一样的，说明setState的处理过程是异步的而不是同步的,react在执行setState时候，优化执行的时机，多个setState合并在一起去执行，如果非要在state变化话后做一些操作的话，其实setState会接收第二个参数。

```jsx
   class ListItem extends Component {
     constructor(props){
     super(props)
     this.state={
         conunt:1 
     }
   }
   addCunt(){
       this.setState({ //修改一个state
           count:this.state.count+1
       },()=>{
         console.log('step3',this.state.count) // 可以拿到修改后的值
       })
   }
   render(){
    return (
      <div className='listItem'>
        <span onclick={()=>this.addCount()}>{this.state.count}<span>  
      <div>
    )
   }
  } 
```
### 3.2.3 创建新的状态

修改state我们都要遵循状态都应该是不可变数据

#### 什么是不可变数据

不可变数据是函数式编程的重要概念，就是我们对已经初始化的数据不进行更改，每次更改都是创建新的对象来承载新的数据状态

状态类型
- 值类型：string、number、boolean、null、undefined
- 数组类型
- 对象

```jsx
// 1.状态的类型是值类型
this.setState({
    count:1,
    name:'zs',
    show:true
})
// 2.状态的类型是数组
const _books=this.state.books.concat('new book')
   // 或
const _books=[...this.state.books,'new book')]
this.setState({
    books:_books
})
// 2.状态的类型是对象
const _item=Object.assign({},this.state.item,{id:1,ame:'zs'})
    // 或
const _item={...this.state.item,id:1,ame:'zs'}
this.setState({
    item:_item
})
```

上面创建新的对象都是浅拷贝，如果要深拷贝可以用immutable.js类库 来处理不可变数据。

### 3.2.4 扩展资料

[React Dev Tools](https://www.npmjs.com/package/react-devtools)

[状态组件和无状态组件](https://juejin.im/entry/59a980306fb9a02485103d0b)

[setState异步的理解](https://juejin.im/post/5bf1444cf265da614a3a1660)

## 3.3 State进阶

### 3.3.1 通过条件判断优化渲染

下面代码是我们渲染一个列表，当我们删除第一行列表的时候，其它2个列表其实没有任何变化，但是它们的render方法还是执行了，执行了render方法其实也要diff对比，当一个大型的项目，这显然也是很耗时的，所以我们要优化它，优化有2种方法：

1. sholudComponentUpdate(利用这个钩子阻止，如果子组件没有变化就不进行渲染)

2. PureComponent（利用react提供的组件）

![](~@/react/shouldUpdate.png)

```jsx
// 父组件
import React,{Component} from 'react';
import ListItem from './listItem'
class Stated extends Component {
    state = { 
        listData: [
            {
              id: 1,
              name: "Sony 65寸高清液晶电视",
              price: 7000,
              stock: 1
            },
            {
              id: 2,
              name: "华为 Meta30",
              price: 6000,
              stock: 2
            },
            {
              id: 3,
              name: "华硕画家国度笔记本电脑",
              price: 10000,
              stock: 3
            }
          ]
     }
     renderList(){
      return  this.state.listData.map(item=>{
            return <ListItem key={item.id} data={item} onDelete={this.handDelete}></ListItem>
        })
     }
     handDelete=(id)=>{
         const listData=this.state.listData.filter(item=>item.id!==id)
         this.setState({
            listData
         })       
     }
    render() {  
        return (  
            <div>
                {this.state.listData.length<=0 && <div>购物车为空</div>}
                {this.renderList()}
            </div>
        );
    }
}
export default Stated;

// 子组件
import React, { Component } from 'react';
class ListItem extends Component {
    state = {  }
    render() { 
        console.log('item render--虚拟dom')
        return (  
            <div>
                <span>{this.props.data.name}</span>
                <button onClick={()=>{
                    this.props.onDelete(this.props.data.id)
                }}>删除</button>
            </div>
        );
    }
}
 
export default ListItem;
```
#### sholudComponentUpdate
```jsx
// 子组件
import React, { Component } from 'react';
class ListItem extends Component {
    state = {  }
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.data.id===this.props.data.id) return false
        return true
    }
}
export default ListItem;
```
#### PureComponent
```jsx
// 父组件
import React,{PrueComponent} from 'react';
import ListItem from './listItem'
class Stated extends PrueComponent {
    ......
}
```

### 3.3.2 单一数据源

尊崇单一数据源，相同的子组件的数据应该由父组件通过`props`传递子组件，由父组件统一管理，避免造成数据的混乱，使用这个原则的时候，当父组件任何一个
状态的改变，会自动更新子组件这一部分，从上而下传达到子组件的，是同步的方法，子组件想操作数据，由父组件提供更新函数。

### 3.3.3 状态提升

当我们的子组件都要控制同一个数据源的时候，我们需要将数据提升到它们共同的父组件当中，然后父组件通过props传递给子组件，并由父组件进行统一管理和存储。


### 3.3.4 为什么使用不可变数据

1. 可回溯

 不直接在数据上修改，方便我们追溯以前的历史记录。
 
2. 跟踪数据改变

直接修改数据，跟踪数据的改变需要把当前数据和以前数据的版本进行对比，这样整个对象树都要遍历一次
如果使用不可变数据，创建新的对象，这样我们发现是一个新的对象，那我们不需要对象树对比就知道数据发生了变化，因为对象不是同一个引用了

3. 确定在react中何时重新渲染

不可变性最主要优势在于它可以帮助我们在react中创建Pure components，我们可以轻松确定不可变数据是否发生了改变，从而确实何时对组件进行重新渲染
### 3.3.5 有状态组件和无状态组件

#### Stateful

- 类组件
- 有状态组件
- 容器组件

#### Stateless

- 函数组件
- 无状态组件
- 展示组件

无状态组件，所有数据源都来自于父组件，它只做展示的作用

尽可能通过状态提升原则，将需要的状态提取到父组件中，而其他的组件使用无状态组件编写


### 3.3.6 扩展资料

[不可变数据](https://github.com/immutable-js/immutable-js)

[JS内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)

[状态提升](http://huziketang.mangojuice.top/books/react/lesson17)

[context管理状态](http://react.html.cn/docs/context.html)

[context管理状态](https://juejin.im/post/5a90e0545188257a63112977)  


## 3.4 生命周期

### 3.4.1 三个阶段的生命周期函数

#### 三个阶段生命周期

创建阶段->更新阶段->卸载阶段

![](~@/react/lifeCycle.png)

### 3.4.2 创建阶段

#### 1. 创建阶段constructor

- 初始化内部状态，显性设置和隐性设置

   一个类必须有`constructor`方法，如果这个方法没有显示定义，一个默认的`constructor`方法会被添加

- 需要使用super()调用基类的构造函数

  将父类的props注入给子组件

- 可以直接修改state
#### 2. 创建阶段componentWillMount(16.3移除)

- UI渲染完成前调用
- 只执行一次
- 这里调用setState不会触发render

 更多的时候我们把组件里面的内容，会提前到`constructor`中，所以这个生命周期函数在项目中我们很少使用

#### 3. 创建阶段render

- 一个组件必须有的方法（我们的类组件）
- 返回一个顶级的react元素
  只能有一个根元素，不能返回并列元素
- 渲染的是Dom Tree的一个React对象

#### 4. 创建阶段componentDidMount

- UI渲染完成后调用
- 只执行一次
- 获取一些外部数据资源

需要注意的是当父组件执行render的时候，当所有子组件都完成了创建，那么父组件才能最终的完成渲染，然后父组件执行componentDidMount


### 3.4.3 更新阶段

当state和props发生变化时，进入更新阶段

#### 1.更新阶段componentWillReceiveProps(16.3移除)

只接收props
- 组件接收到新props的时候触发
- 在此对比新props和原来的props
- 不推荐使用

#### 2.更新阶段shouldComponentUpdate

接收state和props
- 是否要继续执行render方法
- 可以由PureComponent自动实现

#### 3.更新阶段componentDidUpdate

- 每次UI更新时调用
- 更新一些外部数据资源

### 3.4.4 卸载阶段 componentWillUnmount
- 组件移除时调用
- 可以用来做资源的释放

### 3.4.5 图解生命周期

#### 旧的生命周期

![](~@/react/usedLifecycle.png)

#### 新的生命周期

16.3以后移除了 componentWillmount、componentWillReceiveProps、componentWillUpdate

![](~@/react/newLifecycle.png)

### 3.4.6 扩展资料

[React新生命周期1](https://www.jianshu.com/p/514fe21b9914)


[React新生命周期2](https://zhuanlan.zhihu.com/p/38030418)

## 3.5 React组件设计模式

### 3.5.1 高阶组件

在业务中可能碰到许多要复用业务逻辑的情况，我们为了避免每个组件都写一段相同逻辑的代码，我们就用高阶组件。

高阶组件是对已有组件的封装，形成新的组件后，有自己的状态和逻辑；并可以传递已有的组件

高阶组件就是接收组件作为参数，并返回新的组件

```js
const NewComponent=higherOrderComponent(OldComponent)
```
![](~@/react/higherOrder.png)

#### 案例：假如多个组件需要鼠标滑入时给个提示，滑出时清空提示，那么可以把这个公共提示抽离出来复用

目录
```bash
src/  
    components/
       Item/
         index.jsx
         withTooltip.js
``` 
封装Hoc组件（withTooltip.js）
```js
import React from 'react';
const withTooltip=(Component)=>{
    class Hoc extends React.Component {
        state={
            showToolTip:false,
            content:''
        }
        handleOver=(e)=>{
            this.setState({showToolTip:true,content:e.target.innerText})
        }
        handleOut=()=>{
            this.setState({showToolTip:true,content:''})
        }
        render(){
            return(
                <div onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    <Component action={this.state} {...props}></Component>
                </div>
            )
        }
    }
    return Hoc
}
export default withTooltip
```
在需要的组件引入并调用（index.jsx）
```jsx{13}
import React from 'react';
import withTooltip from './withTooltip'
const ItemA = (props) => {
    return (
        <div className="container">
            <button>Tooltip</button>
            {
                props.action.showToolTip && <div>{props.action.content}</div>
            }
        </div>
        );
}
export default withTooltip(ItemA)
```
![](~@/react/higherOrder2.png)

#### 高阶组件特性
- 一个函数，传入一个组件，返回一个新组件
- 一般不会有ui展现
- 提供一些可复用的功能

### 3.5.2 函数作为子组件（renderProps）

解决复用业务逻辑的问题，是指一种在组件之间使用一个值为函数的props，来共享代码的的设计模式

![](~@/react/renderProps.png)

#### 结构

```jsx
// 1.定义子组件
render(){
        return (
            <div>
                {this.props.render(this.state)}
            </div>
        )
    }
// 2.使用函数作为Props
<RenderPropComponent render={
    (state)=>{
        <div>
            content
        </div>
    }
}/>
```
#### 改写上面的案例

目录
```bash
src/  
    components/
       Rp/
         index.jsx
         withTooltip.js
``` 
定义子组件（withTooltip.js）
```jsx
import React from 'react';
    class WithTooltip extends React.Component {
        state={
            showToolTip:false,
            content:''
        }
        handleOver=(e)=>{
            this.setState({showToolTip:true,content:e.target.innerText})
        }
        handleOut=()=>{
            this.setState({showToolTip:true,content:''})
        }
        render(){
            return(
                <div onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    {this.props.render(this.state)}
                </div>
            )
        }
    }
export default WithTooltip
``` 
定义父组件（index.jsx)
```jsx
import React from 'react';
import WithTooltip from './withTooltip'
const ItemA = (props) => {
    return (
        <div className="container">
              <WithTooltip 
                  render={({showToolTip,content})=>(
                    <div>
                      <button>Tooltip</button>
                        {
                        showToolTip && <div>{content}</div>
                        }
                    </div>
                )}>
            </WithTooltip>
        </div>
        );
}
export default ItemA
``` 
### 3.5.3 函数作为子组件（Children）

改写成函数作为子组件（更加直观）推荐

定义子组件
```jsx{16}
import React from 'react';
    class WithTooltip extends React.Component {
        state={
            showToolTip:false,
            content:''
        }
        handleOver=(e)=>{
            this.setState({showToolTip:true,content:e.target.innerText})
        }
        handleOut=()=>{
            this.setState({showToolTip:true,content:''})
        }
        render(){
            return(
                <div onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    {this.props.children(this.state)}
                </div>
            )
        }
    }
export default WithTooltip
``` 
定义父组件
```jsx{7-14}
import React from 'react';
import WithTooltip from './withTooltip'
const ItemB = (props) => {
    return (
        <div className="container">
              <WithTooltip>
                {({showToolTip,content})=>(
                    <div>
                      <button>Tooltip</button>
                        {
                        showToolTip && <div>{content}</div>
                        }
                    </div>
                )}
            </WithTooltip>
    
        </div>
        );
}
export default ItemB
``` 
### 3.5.4 扩展阅读

[扩展阅读1](https://www.jianshu.com/p/ff6b3008820a)

[扩展阅读2](https://zhuanlan.zhihu.com/p/62791765)
