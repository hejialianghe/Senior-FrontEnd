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

## 6.3 redux进阶下

### 6.3.1 Reselect & Immutable Data

#### Reselect（同一数据需要重复渲染的时候）

- 针对mapStateToProps 中state在同一数据源中需要筛选的场景

- mapStateToProps 中的state如果带有筛选函数，会导致每次都返回新对象

#### Immutable Data（不影响原数据）

- 避免副作用

- 状态可追溯

- React中比较是shallowCompare

#### Immutable方案

immutable

- 提供完整的API，与普通的js对象不同，2者不能直接使用

- 对Redux的应用程序来说，整个state tree应该是Immutable.JS对象，根本不需要使用普通的javascript对象

immer

- js原生数据结构实现的immutable，也提供了一套对应的API，相比immutable更推荐使用

### 6.3.2  Redux的不足

- Redux范式繁琐 完成一次页面渲染，需要在Action层分别定义type，Action方法，Reducer中响应Action方法，完成一次流程需要在多个文件夹中来回切换。

- 基础功能匮乏 默认只能同步方法，异步数据请求需要安装插件（Redux-thunk），复杂功能交由第三方插件完成，有一定接入成本。

#### 三种解决方案对比

| 解决方案  |  多层范式  | 同步/异步 | 集成插件 |
| :---: | :--------: | :------ | :----: |
|  redux-actions  | 否 |  不区分  | 否  | 
|  @rematch-core  | 否 |  区分  | 是 | 
|  dva  | 否 |  区分  | 是 | 

### 6.3.3 扩展预习资料

[redux-actions](https://redux-actions.js.org/introduction)

[@rematch/core](https://rematch.github.io/rematch/#/lang/zh-cn/)

[dva](https://dvajs.com/guide/)

## 6.4 Mobx 入门

响应式状态管理工具

### 6.4.1 Mobx 核心概念

- Mobx 提供的一种状态（State）可供观察的解决方案。

- 可观察的状态（Observable state）意味这在Mobx构建应用中，更洗粒度和更高效的状态管理

- 与Redux 中状态变化取决于对比前后差异，Mobx中申明了观察对象便会依据框架本身的能力进行管理

#### Redux 流程 vs Mobx 流程

Redux 应用流转图

![](~@/react/reduxAbout.png)

Mobx 应用流转图

![](~@/react/mobxAbout.png)

#### 核心概念

- Observable State

  - Mobx为常用的数据结构（如：对象，数组和类实例）添加了可观察的功能。
  - 使用`@observable装饰器`更便捷完成添加Observable State功能。

- Derivations（衍生）
  
  - Computed values（计算值）：使用纯函数（pure function）从当前可观察状态中衍生出的值。
  - Reacions（反应）：当状态改变时需要自动发生的副作用。

## 6.5 Mobx接入实战

### 6.5.1 Mobx复杂应用

- Store 单例

Store状态全局管理是解决复杂应用的标配

- 状态跨组件 

跨组件传递可以通过Provider传递

- 拆分局部状态

Mobx的特性可以使一些局部状态在当前组件完成

- 清理autorun

componentWillUnmount中执行autorun返回的函数

##### Mobx5 Or Mobx4

Mobx5

- Mobx5内部实现对象 observbale的核心是基于ES的proxy

- 而目前 proxy没有对应的polyfill，所以只能运行在现代浏览器上

Mobx4

- Mobx4 内部实现对象observable的核心是基于Object.defineProperty

- Observable 数据并非真正的数组，其继承自对象，所以与普通的数组对象及某些行为不一样

##### 案例

1. 下载

```bash
 yarn add mobx
 yarn add mobx-react
```

2. 在src下新建models文件，在该文件下新件home.js 和index.js

home.js

```js
import { observable, action } from 'mobx';

export class HomeInfo {
    // 定一个observable对象
  @observable name = '蚂蚁';
  // 定义一个动作，修改这个name
  @action
  updateName = (params) => {
    this.name = params;
  }
}

export default new HomeInfo();

```
index.js

```js
import homeInfo from './home';

export default {
  homeInfo,
};

```

3. 关联组件

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import store from './models';
import App from './app';

render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.querySelector('#app'),
);

```

4. 将数据注入到组件中

```jsx
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('homeInfo')
@observer
export default class Home extends Component {
static propTypes = {
  homeInfo: PropTypes.objectOf(PropTypes.object),
};

static Home.defaultProps = {
    homeInfo: {},
};
handleClick=()=>{
    const {homeInfo:{updateName}}=this.props
    updateName('更改')
}
  render() {
    const { homeInfo: { name } } = this.props;
    return (
      <div className="mobx">
        <p>{name}</p>
        <button onclick={this.handleClick}></button>
      </div>
    );
  }
}
```

### 6.5.2 Mobx vs Redux

| 对比维度 |  范式  | 异步 | 插件化 | 核心 | 社区 |
| :------:| :--------: | :------ | :----: |:----: |:----: |
|  Mobx  |  简单 |  支持  | 不支持  | Mobx5（ES6 proxy）Mobx4(Object.defineProperty) | 相对繁荣 |
|  Redux  | 复杂 |  插件支持  | 支持  | Symbol.observable订阅更新 | 繁荣 |


### 6.5.3 扩展学习资料

[mobx中文文档](https://cn.mobx.js.org/)

[mobx英文](	https://medium.com/@Zwenza/how-to-persist-your-mobx-state-4b48b3834a41)