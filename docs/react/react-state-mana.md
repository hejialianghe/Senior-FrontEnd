## 6.1 redux入门

### 6.1.1 redux基础

#### 为什么需要Redux？

 Redux 适合于大型复杂的单页面应用。

![](~@/react/whyredux.png)

#### Redux核心概念

- state： 应用全局数据的来源，数据驱动视图的核心

- action：数据发生改变的动作描述

- reducer： 结合state和action，并返回一个新的state

#### Redux三大原则

- 单一数据源：整个应用的是state被存储在一棵object tree中，并且这个object tree只存在于唯一一个store中。

- State是只读： 唯一改变state的方法就是触发action，action是一个用于描述已发生事件的普通对象。

- 使用纯函数来执行修改State ：纯函数意味着同样的输入就会有同样的输出。

#### Redux 运转图

![](~@/react/reduxwork.png)

### 6.1.2 react & redux

#### Redux API

- createStore 创建一个Redux store来以存放应用中所有的state。

- combineReducers 将多个不同reducer函数作为value的objcet，合并成一个最终的reducer函数。

- applyMiddleware 接受自定义功能的middleware来扩展Redux。

- compose 函数式编程中的方法，右到左来组合执行参数。

#### React-Redux API

- connect 将React组件与Redux链接起来

- Provider 提供被connnet链接起来的组件能够访问得到Store

### 6.1.3 扩展资料

[Redux 文档](https://www.redux.org.cn/)

[Redux 插件](https://zhuanlan.zhihu.com/p/20597452)


## 6.2 redux进阶上

优化使用Redux，让应用更高效

### 6.2.1 Redux 异步

Redux MiddleWare

Redux 的插件机制，使得Redux默认的同步Action扩展支持异步Action

```js
// 同步的Action
export function  updateName(params) {
    return {
        type:'UPDATE_NAME',
        payload:params
    }
}
// 异步的Ation
export function queryUserInfo (params) {
    return function (dispatch,getState){
        axios.post().then(res=>{
            dispatch({
                  type:'UPDATE_NAME',
                  payload:res.data
            })
        })
    }
}
```
#### applyMiddleware

applyMiddleware接受一系列插件，每个插件（middleware）都会以dispatch和getState作为参数，并返回一个函数；该函数会被传入下一个插件中，直到调用结束。

```js
    import {createStore,combineReducers,applyMiddleware} from 'redux'
    import thunk from 'redux-thunk' //处理异步的插件
    export defalut createStore (
        combineReducers,
        applyMiddleware(...[thunk,otherMiddleware])
    )
```
![](~@/react/middleware.png)

#### 案例

store

```js
    import {createStore,applyMiddleware} from 'redux'
    import thunk from 'redux-thunk'
    import reducers from './reducer'
    export default createStore(
        reducers,
        applyMiddleware(thunk)
    )
```
action

```js
  export function querAsyncName (params){
      return (dispatch,getstate)=>{
          setTimeout(()=>{
            dispatch({
                type:ASYNC_UPDATE_NAME,
                payload:params
            })
          },1000)
      }
  }
```
reducer

```js
const DEFAULT_NAME='可可'
export default function homeReducer(state = DEFAULT_NAME, action) {
  switch (action.type) {
    case ASYNC_UPDATE_NAME:
      return action.payload
    default:
      return state
  }
}

```
home组件
```jsx
import {connect} from  'react-redux'
import {querAsyncName} from '@/action/home'
@connect(
  (state)=> state.homeReducer,
  (dispatch)=>{
      onQuerAsyncName:(params)=>dispatch(querAsyncName(params))
  }
)
export default Home extends Component {
    render(){
        const { onQuerAsyncNameAdync,homeReducer}=this.props
        return (
            <div>
                <button onClick={()=>{
                  onQuerAsyncName('郑乃鑫')
                }}>
                </button>
                <div>{homeReducer}<div>
            </div>
        )
    }
}
```

 <font color="red">**react+redux+ts 可以参考github上的demo**</font>
 
 [点击进入](https://github.com/hejialianghe/react-ts-redux)
