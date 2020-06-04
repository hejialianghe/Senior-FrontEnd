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
        <span onclick={()=>this.handleClick.(1)}>header<span>  
          {/* 传递事件对象event*/}
        <span onclick={(e)=>this.handleClick.(1,e)}>header<span>  
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
        <span onclick={()=>this.props.onDelete.(this.state.conunt)}>header<span>  
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
