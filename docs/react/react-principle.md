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
    return ()=> <Component name='王一瑾'/>
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
#### hooks的demo 

```jsx
import React ,{useState}from 'react';

const App = () => {
    const [name,setName]=useState('王一瑾')
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