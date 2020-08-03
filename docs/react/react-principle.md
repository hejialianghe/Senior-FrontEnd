## 5.1 React Virtual DOM原理

### 5.1.1 Virtual DOM是什么？

官方定义：virtual DOM是一种编程理念（数据驱动视图），将ui虚拟的保持到内存中，并且通过某些库渲染成真实的dom，这个过程又叫做协调。

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

#### Component Diff

![](~@/react/componentdiif.png)

假设将图中的D节点更换成G节点，会把D节点删掉，然后创建G节点；只会同层级比较，这样会降低diff的复杂度，大概率下面的层级不一样的。

#### Element Diff

1. createChild
2. moveChild
3. removeChild

我们元素之间的对比中，会有3种情况：创建节点、删除节点、移动节点

- 创建节点

```js
    createChild:function(child,afterNode,mountImage){
        return makeInserMarku(mountImage,afterNode,child._mountIndex)
    }
```
- 删除节点

```js
    removeChild:function(child,node){
        return makeRemove(child，node)
    }
```
- 移动节点


假设我们把节点3移动到第一的位置

![](~@/react/moveChild.png)

```js
// 老的节点和新的节点相同，说明需要移动节点
if(preChild===nextChild){
    updates=enqueue(updates,this.moveChild(preChild,lastPlaceNode,nextIndex,lastIndex))
    lastIndex=Math.max(preChild._mountIndex,lastIndex)
    preChild._mountIndex=nextIndex
}
// 移动的方法
moveChild:function (child,afterNode,toIndex,lastIndex){
    // _mountIndex是这个元素在原有节点的顺序，lastIndex是这次要更新的顺序
    if(child._mountIndex<lastIndex){
        return makeMove(child,afterNode,toIndex)
    }
}
```
在实际中最后一个节点移动到第一位置的时候，不是把最后一个节点直接移动到第一的位置，而是把这个节点前面的节点依次往后移动，直到最后一个节点成为第一的位置。

### 5.1.3 扩展资料

[Virtual DOM 定义](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)

[Virtual DOM Node](https://mithril.js.org/vnodes.html)

[VDom与 DOM 的区别](https://reactkungfu.com/2015/10/the-difference-between-virtual-dom-and-dom/)

[React性能优化：Virtual Dom原理浅析](https://juejin.im/entry/5af99e786fb9a07ac90d5664)

[[译] Virtual Dom 和 Diff 算法](https://juejin.im/post/5c504f736fb9a049ef26fcd3)

## 5.3 new componentLifecyle（新生命周期）

### 5.3.1 React组件新生命周期详解

老的生命周期

![](~@/react/oldLIfeCycle.png)

react 16.3 增加了getDeriveStateFromProps和getSnapshotBeforeUpdate 2个静态方法

![](~@/react/react16.3.png)

react 16.4中增加了在setState和forceUpdate()都会执行这个静态方法`getDeriveStateFromProps`

![](~@/react/newLifecycle.png)

### 5.3.2 挂载阶段

1. 挂载阶段的函数

- constructor 构造函数，初始化state，以及为事件处理函数绑定实例
- getDeriveStateFromProps 新增的静态方法，返回一个新的state，或者是null，静态方法里的，这里面的this是指向全局变量
- render 渲染函数
- componentDidMount 挂载成功后立即调用

2. 更新阶段的函数

- getDeriveStateFromProps props变化或者state方法触发
- shouldComponentUpdate 判断是否进行更新
- render 函数
- getSnapshotBeforeUpdate 生命周期方法在更新之前（如：更新 DOM 之前）被调用。此生命周期的返回值将作为第三个参数传递给 componentDidUpdate。（通常不需要，但在重新渲染过程中手动保留滚动位置等情况下非常有用。）
- componentDidUpdate 更新后会被立即调用

3. 卸载阶段的函数

- componentWillUnmount 卸载函数，组件卸载及销毁之前直接调用，主要用于清除一些在组件生命周期订阅，真实DOM事件以及setTimeout/setinterval的返回值

### 异常捕获

- componentDidCatch 生命周期方法在后代组件抛出错误后被调用，方法接受两个参数（err，info），分别是错误信息和错误组件的栈信息
- getDerivedStateFromError 在后代组件抛出错误后调用，接受一个参数（error）表示具体的错误信息

### 5.3.3 新版组件升级

- componetWillMount (17.0被移除)
  - render 方法之前调用，在此调用setState并不会触发再次渲染
  - 通常会在这个方法中进行页面标题的一些修改以及其他与再次render不相关的操作
- UNSAFE_componentWillMount （16.3 新增不安全的生命周期引入别名）
   - 与state相关的操作挪到constructor方法中执行
   - 异步操作挪到componentDidMount中执行

- componentWillUpdate(17.0被移除)
   - 在组件收到新的props或state时，会在渲染之前调用
   - 方法内不能调用setState，触发循环，内存泄漏
- UNSAFE_componentWillUpdate（16.3 新增不安全的生命周期引入别名）
   - 应该在shouldComponentUpdate

- componentWillReceiveProps(17.0被移除)
  - 接受父级传递过来最新的props，转化为组件内的state
  - 判断是否进行更新或者执行异步请求数据
- UNSADFE_componentWillReceiveProps（16.3 新增不安全的生命周期引入别名）
  - 与渲染相关的props直接渲染，不需要处理为组件内的state
  - 异步数据请求在componentDidUpdate中处理
  - getDerivedStateFromPropss方法替换，需要考虑生命周期的执行顺序

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
- useContext
接受一个context对象（React.createContext的返回值）并返回该context的当前值，当前的context由上层组件中距离最近的`<Mycontext.provider></Mycontext.provider>`的
value prop决定
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

3. useContext

```jsx
// 1. 创建一个上下文管理组件context-manager.js，用于统一导出context实例
import React from 'react'
export const ItemsContext = Taro.createContext({ name: '' }) //接受一个默认值

// 2. 父组件提供数据
import React from 'react'
import Child from './child'
import { ItemsContext } from './context-manager'
import './index.scss'

const items = { name: '测试' }
const Father = () => {
  return (
    <div className='father'>
      <ItemsContext.Provider value={items}>
        <Child></Child>
      </ItemsContext.Provider>
    </div>
  )
}

export default Father

// 3.子组件用useContext解析上下文
import React ,{useContext} from 'react'
import { ItemsContext } from './context-manager'
import './index.scss'
const Child = () => {
  const items=useContext(ItemsContext)
  return (
    <div className='child'>
        子组件
        {items.name}
    </div>
  )
}
export default Child
```

4. useReducer

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

5. useRef

- 获取dom
  
```jsx
import React,{useRef} from 'react'
const HooksTest = () => {
    const inputEl=useRef(null)
   function onButtion () {
    //  inputEl.current 就是我们获取的dom对象
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
- 存变量
  
因为在函数式组件里没有this来存放一些实例的变量，所以React建议使用useRef来存放有一些会发生变化的值，useRef 不单是为了DOM的ref，同时也是为了存放实例属性

```jsx
const intervalRef=useRef()
useEffect(()=>{
    intervalRef.current=setInterVal(()=>{})
    return ()=>{
        clearInterval(intervalRef.current)
    }
})
```
### 5.4.4 扩展资料

[React Hooks 官方文档](https://reactjs.org/docs/hooks-intro.html)

[useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)