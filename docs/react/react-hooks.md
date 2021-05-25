## 8.1 React-hooks

### 8.1.1 hooks使命

#### 逻辑组件复用

- 逻辑与UI组件分离

  React 官方推荐在开发中将逻辑部分与视图部分结耦，便于定位问题和职责清晰

- 函数组件拥有state

  在函数组件中如果要实现类似拥有state的状态，必须要将组件转成class组件

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


### 8.1.2 hooks实践

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
- useMemo 缓存数值
- useCallback 缓存函数
- useCustom
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
export const ItemsContext = React.createContext({ name: '' }) //接受一个默认值

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
6. useImperativeHandle

可以让你在使用ref时自定义暴露给父组件的实例值,useImperativeHandle 应当与forwardRef 一起使用，这样可以父组件可以调用子组件的方法

```js
// 父组件
function Father () {
 const modelRef = useRef(null);
 /* 确定 */
  function sureBtn() {
      // 调用子组件的方法
    inputRef.current.model();
  }
 return (
     <>
     <Button onClick={sureBtn}>确定</Button>
     <Children ref={modelRef}></Children>
     </>
 )
}
// 子组件
const Children = React.forwardRef((props,ref)=>{
const [visible, setVisible] = useState(false);
    useImperativeHandle(ref, () => ({
      model: () => {
        setVisible(true);
      },
    }));
})

```
7. useMemo

useMemo的理念和memo差不多，都是根据判断是否满足当前的有限条件来决定是否执行useMemo的callback函数，第二个参数是一个deps数组，数组里的参数变化决定了useMemo是否更新回调函数。

useMemo和useCallback参数一样，区别是useMemo的返回的是缓存的值，useCallback返回的是函数。

- useMemo减少不必要的渲染
```js
// 用 useMemo包裹的list可以限定当且仅当list改变的时候才更新此list，这样就可以避免List重新循环 
 {useMemo(() => (
      <div>{
          list.map((i, v) => (
              <span
                  key={v} >
                  {i.patentName} 
              </span>
          ))}
      </div>
), [list])}

```
- useMemo减少子组件的渲染次数

```js
 useMemo(() => (
     { /* 减少了PatentTable组件的渲染 */ }
        <PatentTable
            getList={getList}
            selectList={selectList}
            cacheSelectList={cacheSelectList}
            setCacheSelectList={setCacheSelectList} />
 ), [listshow, cacheSelectList])
```
- useMemo避免很多不必要的计算开销

```js

const Demo=()=>{
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
    const newLog = useMemo(()=>{
     const log =()=>{
           // 大量计算 
           // 在这里面不能获取实时的其他值
        }
        return log
    },[])
    // or
   const log2 = useMemo（()=>{
           // 大量计算 
        
        return // 计算后的值
    },[list])
    return <div onClick={()=>newLog()} >{log2}</div>
}
```
8. useCallback

useMemo和useCallback接收的参数都是一样，都是依赖项发生变化后才会执行；useMemo返回的是函数运行结果，useCallback返回的是函数；父组件传递一个函数
给子组件的时候，由于函数组件每一次都会生成新的props函数，这就使的每次一个传递给子组件的函数都发生的变化，这样就会触发子组件的更新，有些更新是没有必要的。

```js

const Father=({ id })=>{
    const getInfo  = useCallback((sonName)=>{
          console.log(sonName)
    },[id])
    return <div>
        {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
        <button onClick={ ()=>setNumber(number+1) } >增加</button>
        <DemoChildren getInfo={getInfo} />
    </div>
}

/* 用react.memo */
const Children = React.memo((props)=>{
   /* 只有初始化的时候打印了 子组件更新 */
    console.log('子组件更新',props.getInfo())
   return <div>子组件</div>
})

```
useCallback必须配合 react.memo pureComponent，否则不但不会提升性能，还有可能降低性能。

react-hooks的诞生，也不是说它能够完全代替class声明的组件，对于业务比较复杂的组件，class组件还是首选，只不过我们可以把class组件内部拆解成funciton组件，根据业务需求，哪些负责逻辑交互，哪些需要动态渲染，然后配合usememo等api，让性能提升起来。react-hooks使用也有一些限制条件，比如说不能放在流程控制语句中，执行上下文也有一定的要求。


### 8.1.5扩展资料

[React Hooks 官方文档](https://reactjs.org/docs/hooks-intro.html)

[useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)

## 8.2 React-hooks原理解析

### 8.2.1 前言

::: warning
阅读以下内容之前先了解一下，[hooks出现的动机](https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation),同时也要熟悉hooks的用法，可以参考上一篇文章
:::

废话不多说，我首先克隆一份代码下来

```bash
git clone --branch v17.0.2 https://github.com/facebook/react.git
```
hooks导出部分在`react/packages/react/src/ReactHooks.js`，虽然在react导出，但是真正实现在`react-reconciler`这个包里面。

读源码，我们逐个击破的方式:

1. useState

2. useEffect

### 8.2.2 useState

hooks不是一个新api也不是一个黑魔法，就是单纯的一个数组，看下面的例子hooks api返回一个数组，一个是当前值，一个是设置当前值的函数。

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

#### react 包中导出的useState

源码出处：`react/packages/react/src/ReactHooks.js`

react包中导出的usesate，其实没什么东西，大致看一下就能明白

```js
export function useState<S>(
  initialState: (() => S) | S, // flow类型注解
) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```
在`ReactHooks.js`搜索到了useState，函数里先执行了`resolveDispatcher`,我们先看看resolveDispatcher函数做了写什么？
`resolveDispatcher`函数的执行，获取了`ReactCurrentDispatcher`的current，那我们在看看`ReactCurrentDispatcher`是什么？

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  invariant(
    dispatcher !== null,
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
  );
  return dispatcher;
}
```
源码出处：`react/packages/react/src/ReactCurrentDispatcher.js`

```js
/**
 * Keeps track of the current dispatcher.
 */
const ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: (null: null | Dispatcher),
};

export default ReactCurrentDispatcher;
```
`ReactCurrentDispatcher`现在是null，到这里我们线索好像中断了，因为current要有个`useState`等方法才行；我们可以断点的形式，去看看在mount阶段，react执行了什么？也就是在mount阶段ReactCurrentDispatcher.current挂在的hooks，蓝色部分就是react在初始化阶段执行的函数

![](~@/react/Hooksprinciple.png)

<font color="red">下面才是正文，千万不要放弃</font>

源码出处：`react/packages/react-reconciler/src/ReactFiberHooks.new.js`

1. renderWithHooks

```js
const HooksDispatcherOnMount = { // 初次挂载的钩子
    useState: mountState,
}
const HooksDispatcherOnUpdate = { // 更新时候的钩子
     useState: updateState,
}

// 挂载和更新页面的时候，用的是不同的hooks

let currentlyRenderingFiber;//当前正在使用的fiber
//hooks在不同的阶段有不同的实现
/**
 * @param {*} current 上一个fiber 初次挂载 的时候null
 * @param {*} workInProgress 这一次正在构建中的fiber
 * @param {*} Component 当前组件
 */
export function renderWithHooks(current, workInProgress, Component) {
    //每当在新渲染一个函数组件fiber的时候
    currentlyRenderingFiber = workInProgress;
    currentlyRenderingFiber.memoizedState=null;//在执行组件方法之前，要清空hook链表 因为你肯定要创建新的hook链表

    // current === null || current.memoizedState === null 说明是mount阶段，否则是更新阶段
     ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;

    let children = Component();//Counter组件的渲染方法
    currentlyRenderingFiber = null;//渲染结束 后把currentlyRenderingFiber清空
    workInProgressHook = null;
    currentHook = null;
    return children;
}
```

2.  mountState

```ts
function mountState(
  initialState
) {
     // 返回当前正在运行的hook对象,构建hook单项链表
  const hook = mountWorkInProgressHook();
    // 初始值如果是函数，现执行函数
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
// 如果是字符串就赋值给hook对象，hook.baseState和hook.memoizedState
  hook.memoizedState = hook.baseState = initialState;
 // 定义一个队列
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });
// dispatch挂载的queue，
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));

 //  2个值以数值的形式返回
  return [hook.memoizedState, dispatch];
}
```
3. mountWorkInProgressHook

```js
function mountWorkInProgressHook(): Hook {
  const hook  = { //创建一个hooks对象
    memoizedState: null, // 自己的状态
    baseState: null, /
    baseQueue: null,
    queue: null, // 自己的更新队列，形成环状列表
    next: null, // 下一个更新
  };
      //说明这是我们的第一个hook
    if (workInProgressHook === null) {
        //fiber的memoizedState指向第一个hook对象
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}
```
如果方法里面有多个useState方法，如何让这些按期望顺序执行呢？怎样维护queue对象？

![](~@/react/mountState.png)

- 在初始化时，每一次申明useState就图上所示，会生成一对state/setter映射。
接着每次渲染都会按照这个序列从数组最小下标遍历到最大值
- 在前面代码（mountState）中，我们说会先返回一个hook对象，state值（memoizedState）和返回的setXXX都会关联到这个hook对象，因此在触发某一个setXXX方法的时候可以正确地设置memoizedState值

`queue.pending`永远指向最后一个更新，`pending.next`永远指向第一个更新

## 8.3 使用hooks会遇到的问题

[react hooks遇到的问题](https://zh-hans.reactjs.org/docs/hooks-faq.html)
[React Hooks完全上手指南](https://zhuanlan.zhihu.com/p/92211533)

在工程中必须引入lint插件，并开启相应规则，避免踩坑。

```js
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```
这2条规则，对于新手，这个过程可能是比较痛苦的，如果你觉得这2个规则对你编写代码造成了困扰，说明你还未完全掌握hooks，对于某写特殊场景，确实不需要「exhaustive-deps」，可在代码处加eslint-disable-next-line react-hooks/exhaustive-deps；切记只能禁止本处代码，不能偷懒把整个文件都禁了。

### 8.3.1 useEffect相关问题

1. 依赖变量问题

```js
function ErrorDemo() {
  const [count, setCount] = useState(0);
  const dom = useRef(null);
  useEffect(() => {
    dom.current.addEventListener('click', () => setCount(count + 1));
  }, [count]);
  return <div ref={dom}>{count}</div>;
```
像这种情况，每次count变化都会重新绑定一次事件，那我们怎么解决呢？

```js
function ErrorDemo() {
  const [count, setCount] = useState(0);
  const dom = useRef(null);
  useEffect(() => {
    dom.current.addEventListener('click', () => setCount(count + 1));
  }, []);
  return <div ref={dom}>{count}</div>;
```
把依赖count变量去掉吗?如果把依赖去掉的话，意味着hooks只在组件挂载的时候运行一次，count的值永远不会超过1；因为在effect
执行时，我们会创建一个闭包，并将count的值保存在闭包当中，且初始值为0

#### 思路1:消除依赖

```js
  useEffect(() => {
     // 在这不依赖于外部的 `count` 变量
    dom.current.addEventListener('click', () => setCount((precount)=>++precount); 
  }, []) // 我们的 effect 不使用组件作用域中的任何变量
```
setCount也可以接收一个函数，这样就不用依赖count了

#### 思路1: 重新绑定事件

```js
  useEffect(() => {
    const $dom = dom.current;
    const event = () => {
      setCount(count);
    };
    $dom.addEventListener('click', event);
    return  $dom.removeEventListener('click', event);
  }, [count]);
```
#### 思路2:ref

你可以 使用一个 ref 来保存一个可变的变量。然后你就可以对它进行读写了

当你实在找不到更好的办法的时候，才这么做，因为依赖的变更使组件变的难以预测

```js
  const [count, setCount] = useState(0);
  const dom = useRef(null);
  const countRef=useRef(count)
  useEffect(() => {
    countRef.current=count
  });
  useEffect(() => {
     // 在任何时候读取最新的 count
    dom.current.addEventListener('click', () => setCount(countRef.current + 1));
  }, []); // 这个 effect 从不会重新执行
```

1. 依赖函数问题

只有 当函数（以及它所调用的函数）不引用 props、state 以及由它们衍生而来的值时，你才能放心地把它们从依赖列表中省略。下面这个案例有一个 Bug：

```js
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // 使用了 productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 这样是无效的，因为 `fetchProduct` 使用了 `productId`
  // ...
```

#### 思路1:推荐的修复方案是把那个函数移动到你的 effect 内部

这样就能很容易的看出来你的 effect 使用了哪些 props 和 state，并确保它们都被声明了：

```js
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 把这个函数移动到 effect 内部后，我们可以清楚地看到它用到的值。
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ 有效，因为我们的 effect 只用到了 productId
  // ...
}
```

#### 思路2: useCallback

把函数加入 effect 的依赖但 把它的定义包裹 进 useCallback Hook。这就确保了它不随渲染而改变，除非 它自身 的依赖发生了改变

```js
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  const fetchProduct = useCallback(() => {
    const response = await fetch('http://myapi/product/' + productId); // 使用了 productId prop
    const json = await response.json();
    setProduct(json);
  }
  }, [productId]); 
}

  useEffect(() => {
    fetchProduct();
  }, [ProductPage]); 
```
