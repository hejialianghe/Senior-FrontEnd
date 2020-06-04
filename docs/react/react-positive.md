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
### 3.2.4 扩展资料

[React Dev Tools](https://www.npmjs.com/package/react-devtools)

[状态组件和无状态组件](https://juejin.im/entry/59a980306fb9a02485103d0b)

[setState异步的理解](https://juejin.im/post/5bf1444cf265da614a3a1660)

## 3.3 State进阶

### 3.3.1 通过条件判断优化渲染

### 3.3.1 使用不可变数据

### 3.3.1 状态提升

### 3.3.1 使用无状态组件

