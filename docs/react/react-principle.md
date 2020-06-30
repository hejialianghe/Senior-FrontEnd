## 5.1 React Virtual DOM原理

### 5.1.1 Virtual DOM是什么？

官方定义：virtual DOM是一种编程理念，将ui虚拟的保持到内存中，并且通过某些库渲染成真实的dom。

总结：virtual dom是一种编程理念，将ui节点抽象成js对象。

#### ui节点抽象

Learn Once，Write anywhere：因为提供了对HTML DOM的抽象，所以在web开发中，通常不需要去调用DOM API，也是因为抽象，所以React也可以开发Native（React Native）

#### Virtual dom 构建UI

以我们经常见的web开发为例，来看下React是怎么通过Virtual DOM渲染成HTML元素的。

```jsx
    class App extends Component {
        state={
            text:'Virtual DOM'
        }
        render () {
            const {text}=this.state
            return (
                <div>
                    {text}
                <div>
            )
        }
    }
```
可以看到React是通过render方法渲染Virtual DOM ，从而绘制出真实DOM。意味着每次修改state的值就会执行render方法

### 5.1.2 Virtual DOM VS 原生DOM

- 原生DOM更新

DOM API 调用更新UI

- Virtual DOM更新

1. 每次render都会产生一份新的’react dom‘
2. Virtual DOM要对新旧‘react dom’进行比较，从而确定在旧‘dom’的基础上进行多少变更
3. 确定最优的变更策略之后调用DOM API更新

Virtual DOM数据结构

```js
    const globaldom={
        tagname:'html',
        children:[{
            tagname:'head'
        },{
            tagname:'body',
            children:[
                {
                  tagName:'div',
                  attributes:{
                      className:'test'
                  }
                }
            ]
         }
        ]
    }
```
对UI节点抽象

在Virtual DOM中，对HTML节点进行抽象，用js对象的形式表示HTML

改变了过去对HTML节点的理解

呈现在用户面前的页面就是一个复杂的递归对象

### 5.1.3 Virtual DOM Diff

- Virtual DOM如何提搞性能

1. 我们将render产生的Virtual DOM简称 ‘Vdom’
2. 通常调用setState方法触发Vdom更新
3. 通过对比新旧‘Vdom’确定最优实现新的‘vdom’所需的操作

- Virtual DOM Diff的层次

1. 层级级别的比较
2. 元素级别的比较

## 5.4 React-hooks

### 5.4.1 hooks使命

#### 逻辑组件复用

- 逻辑与UI组件分离

  React 官方推荐在开发中将逻辑部分与视图部分结耦，便于定位问题和职责清晰

- 函数组件拥有state

  在函数组件中如果要实现类似拥有state的状态，必须要将组件专成class组件

- 逻辑组件复用

 社区一直致力于逻辑层面的复用，像 render props / HOC，不过它们都有对应的问题，Hooks是目前为止相对完美的解决方案

#### hooks 解决的问题

render props

Avator 组件是一个渲染头像的组件，里面包含其中一些业务逻辑，User组件是纯ui组件，用于展示用户昵称

```jsx
export default funtion APP(){
    return (
        <div className="App">
            <Avatar>
               {data=> <User name={data}/>}
            </Avatar>
        </div>
    )
}
```

- 通过渲染props来实现逻辑组件复用
- render props 通过嵌套组件实现，在真实的业务中，会出现嵌套多层，以及梭理props不清晰的问题

Hoc

```jsx
class Avatar extends Component {
    render(){
        return <div>{this.props.name}</div>
    }
}
funtion HocAvatar(Component){
    return ()=> <Component name='王艺瑾'/>
}
```
- 通过对现有组件进行扩展、增强的方式来实现复用，通常采用包裹方法来实现
- 高阶组件的实现会额外地增加元素层级，使得页面元素的数量更加臃肿

Hooks

```jsx
import React,{useState} from 'react'

export function HooksAvatar (){
    const [name,setName]=useState('王一瑾')
    return <>{name}</>
}
```
- React 16.8引入的Hooks，使得实现相同功能而代码量更少成为现实
- 通过使用Hooks，不仅在编码层面减少代码的数量，同样在编译之后的代码也会更少

### 5.4.2 hooks原理

hooks不是一个新ap也不是一个黑魔法，就是单纯的一个数组，看上面的例子hook api返回一个数组，一个是当前值，一个是设置当前值的函数
#### hooks中的useState

```jsx
import React ,{useState}from 'react';

const App = () => {
    const [name,setName]=useState('王艺瑾')
    return (<div>
             <div>{name}</div>
             <button
                onClick={()=> setName('张艺凡')}
               >切换</button>
           </div>
       );
}
export default App;
```
- 上边是一个非常简单的Hook API，创建了name和setName，在页面上展示name，按钮的点击事件修改name

- 那么在这个过程中setState是如何实现的呢？

#### useState源码解析

```ts
useState<S>(initialState:(()=>S) | S) :[S,Dispatch<BasicStateAction<S>>] {

    currentHookNameInDev='useState'
    mountHookTypesDev()
    const preDispatcher=ReactCurrentDispatcher.current
    ReactCurrentDispatcher.current=InvalidNestedHooksDispatcherOnMountInDEV
    try{
        return mountState(initialState)
    }finally {
        ReactCurrentDispatcher.current=prevDispatcher
    }
}
```
- useState API 虽然是在react中引入的，其内部实现是在react-reconciler包中完成的
- 在try/catch代码部分，调用了mountState方法
- 顺着这个方法，我们去探寻一下mountState的实现

#### mountState解析

```ts
function mountState<S>(initialState:(()=>S | S,):[S,Dispatch<BasicStateAction<S>]{
    // 返回当前正在运行的hook对象
    const hook=mountWorkInProgressHook()
    // 初始值如果是函数，现执行函数
    if(typeof initialState==='function'){
        initialState=initialState()
    }
    // 如果是字符串就赋值给hook对象，hook.baseState和hook.memoizedState
    hook.memoizedState=hook.baseState=initialState
    // 定义一个队列
    const queue=(hook.queue={
        pending:null,
        dispatch:null,
        lastRenderedReducer:basicStateReducer,
        lastRenderedState:(initialState:any)
    })
    // dispatch挂载的queue，
    const dispatch:Dispatch<BasicStateAction<S>>=(
        dispatchAction.bind(
            null,
            currentlyRenderingFiber,
            queue // 传入queue与dispatch关联起来
         ):any))
        //  2个值以数值的形式返回
         return [hook.memoizedState,dispatch]
}
```
如果方法里面有多个useState方法，如何让这些按期望顺序执行呢？怎样维护queue对象？

![](~@/react/mountState.png)

- 在初始化时，每一次申明useState就图上所示，会生成一对state/setter映射。
接着每次渲染都会按照这个序列从数组最小下标遍历到最大值
- 在前面代码（mountState）中，我们说会先返回一个hook对象，state值（memoizedState）和返回的setXXX都会关联到这个hook对象，因此在触发某一个setXXX方法的时候可以正确地设置memoizedState值

### 5.4.3 hooks实践

#### Hook官方APi（大概率用到的）
- useState 
 函数组件中的state方法
- useEffect
函数组件处理副作用的方法，什么是副作用？异步请求、订阅原生的dom实事件、setTimeoutd等
- useReducer
另一种"useState"，跟redux有点类似
- useRef
返回一个突变的ref对象，对象在函数的生命周期内一直存在
-useCustom
自定义Hooks组件

1. useState 

```jsx
import React,{useState} from 'react'
const HooksTest = () => {
    // 声明一个count的state变量，useState可以给一个默认值
    const [count,setCount]=useState(0) 
    /*
        useState也可以传递一个函数，这个函数第一个参数可以拿到上一次的值，
        在可以在函数里做一些操作
        const [count,setCount]=useState((preState)=>{
            return {...preState,..updatedValues}
        }) 
     */
  return (
        <div>
            {/*通过setCount来改变count的值*/}
            <button onClick={()=>{
               setCount(count+1) 
            }}
            >Add</button>
            {count}
        <div>
    )
} 
```
2. useEffect

```jsx
import React,{useEffect} from 'react';
// 我们可以把useEffect 看做componentDidmount、componentDidUpdate、componntWillUnmount
const HooksTest = () => {
    const [count, setCount] = useState(0);
    // useEffect可以让你在第一个参数的函数中执行副作用操作，就是请求数据，dom操作之类的
    // useEffect返回一个函数，函数里表示要清除的副作用，例如清除定时器,返回的函数会在卸载组件时执行
    useEffect(()=>{
        document.title = `You clicked ${count} times`;
        return ()=>{
            clearIntercal(timer)
        }
    })
    /*
      useEffect的第二个参数，通过在数组中传递值，例如只有count变化时才调用Effect，达到
      不用每次渲染后都执行清理或执行effect导致的性能问题
    */
    useEffect(()=>{
     document.title = `You clicked ${count} times`;
    },[count])

    /*
    如果想执行只运行一次的effect（仅在组件挂载和卸载时执行），可以传递一个空数组，
    告诉React你的Effect不依赖与props或state中任何值
    */
    useEffect(()=>{
     document.title = `You clicked ${count} times`;
    },[])

    /* 
      可以使用多个Effect，将不相关的逻辑分离到不同的effect中
    */
   useEffect(()=>{
       axios.get('login')
   },[])
    return(
         <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
         </div>
    )
}
```
3. useReducer

useReducer是useState的替代方案，它接受一个形如(state,action)=>newState的reducer，并返回当前的state以及与其配套的dispatch方法
```jsx
import React,{useReducer} from 'react'
const initialState={count:0}
function reducer (state,action){
    switch (action.type){
        case 'increment':
            return {count:state.count+1}
        case 'decrement':
            return {count:state.count-1}
        default:
            throw new Error()
    }

}
const [state.dispatch]=useReducer(reducer,initialState)
const HooksTest = () => {

  return (
        <div>
            {state.count}
            <button onClick={()=>{
             dispatch({type:'increment'})
            }}>increment</button>
            <button onClick={()=>{
             dispatch({type:'decrement'})
            }}>increment</button>
        <div>
    )
}   
```

3. useRef

```jsx
import React,{useRef} from 'react'
const HooksTest = () => {
    const inputEl=useRef(null)
   function onButtion () {
      console.log('inputEl',inputEl)
      inputEl.current.focus() 
   }
  return (
        <div>
            <input type='text' ref={inputEl}>
            <button onClick={onButtion}
            >Add</button>
            {count}
        <div>
    )
} 

```

