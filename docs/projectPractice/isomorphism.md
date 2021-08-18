
## 1.1 认识同构

### 1.1.1 前后端分离的历史与发展

前后端不分离（JSP MVC）-> 前后端分离（AJAX）-> SPA(前端路由)-> SSR(前端后端渲染同构)

### 1.1.2 同构渲染的出现

#### 问题和背景

- SEO问题
- 首屏白屏
- Nodejs
- mvvm ssr

#### 同构 CSR+SSR

- 同构：同一套js代码运行在不同的环境
- CSR：Client-Side Rendering
- SSR：Server-Side Rendering
- Node中间层 用数据渲染动态页面

#### 优点

- 首屏快

服务端内网接口数据渲染页面，无需等待js执行完毕

- SEO

首屏页面丰富，方便爬虫

- 保留SPA优点

只有首屏是服务端渲染，之后还是走前端路由，无需刷新切换内容

#### 缺点

- 门槛高
需要理解服务端渲染，兼容服务端和客户端差异

- 难以改造

旧SPA项目难以改造成服务端同构渲染

- 占用服务器资源

动态页面的生成在服务端

#### 同构是唯一方案吗？

也可以尝试预渲染技术，适合每个用户都会返回相同的内容

## 1.2 同构的实现原理

### 1.2.1 客户端渲染

简单页面客户端渲染
```js
impot React from 'react'
import ReactDoM from 'react-dom'

ReactDoM.render(
    <h1>Hello world<h1>,
    document.getElementById('root')
)
```
SPA客户端渲染

加载HTML->js->请求数据->render

加载js到render的过程就是白屏时间

### 1.2.2 服务端渲染

HTML->js->render的过程在服务端完成

服务端不能访问dom，所以会返回创建好的字符串给浏览器；服务端渲染的优势是让用户更快的看见内容；由于服务端渲染是耗性能的，所以不能每个页面都去这么做，所以接下来我们看看同构渲染。

### 1.2.3 SSR同构渲染原理

服务端渲染 + SPA = Server-side rendering

用户首次请求会向node服务器去发送请求，node服务收到请求后再去请求数据，做首屏的渲染，渲染以后返回给浏览器，用户就会看到首屏内容；
页面加载js给dom绑定事件，并接管了路由操作和其他操作，这时候就变成了我们熟悉的SPA;这时候我们即消除了SPA的白屏时间，这时候又可以在客户端无刷新的切换页面。在这个过程中得益于虚拟dom的mvvm框架提供的服务端渲染能力；在服务端虚拟dom转换的是字符串，在客户端转换的真实的dom。

#### 优点

- SEO：首屏HTML内容丰富
- 白屏时间：没有白屏时间，页面内容直接可见
- 无刷新路由：继承SAP的优点
- 同构：一套代码，两端运行

#### SSR同构难点

- 服务端开发：Node开发能力和掌握框架提供的服务端渲染技术
- 性能和监控：服务端渲染性能，服务端异常监控和处理
- 路由同构：如何同一套路由兼容Node环境和浏览器环境
- 请求和cookie：如何兼容两端请求，服务端缓存请求用户身份以及cookie的转发
- 状态数据共享：服务端store的如何共享给客户端
- 构建和部署：两端js的构建，Node服务的部署和客户端js的部署

## 1.3 React同构

#### 两端渲染方法概述

```js
// client
import ReactDOM from 'react-dom'
// server
import ReactDOMServer from 'react-dom/server'
```
ReactDOM 提供客户端渲染方法，将组件渲染为真实DOM

ReactDOMServer 提供服务端渲染方法，这些方法将组件渲染成为静态标记

### 1.3.1 React服务端渲染方法

基本API

```js
// 参数都传入组件，返回string
 ReactDOMServer.renderToStaticMarkup(element);

 ReactDOMServer.renderToString(element)
```

1. renderToStaticMarkup（适用于纯静态页面）

```js
import ReactDOMServer from 'react-dom/server'
const App= ()=>(<h1>Hello</h1>)
const str = ReactDOMServer.renderToStaticMarkup(<App/>)
console.log(str)
// <h1>Hello<h1>
```
- 将React 元素渲染为HTML字符串
- 不会在React 内部创建的额外DOM属性，例如：data-reactroot

1. renderToString（适用于可交互页面）

```js
import ReactDOMServer from 'react-dom/server'
const App= ()=>(<h1>Hello</h1>)
const str = ReactDOMServer.renderToString(<App/>)
console.log(str)
// <h1 data-reactroot>Hello<h1>
```
- 将React 元素渲染为HTML字符串
- 并在React 内部创建的额外DOM属性data-reactroot
- 作用：告诉客户端复用页面提升性能，data-reactroot这个属性就是告诉客户端，服务端已经渲染过了，那么客户端直接可以复用这个组件，然后只绑定事件就可以了。

### 1.3.2 React客户端渲染方法

基本API

```js
// 两个渲染方法
import ReactDOM from 'react-dom'
// 1
ReactDOM.render(
    element,
    container[,callback]
)
// 回调：在组件被渲染或更新之后被执行，react>15

// 2
ReactDOM.hydrate(
    element,
    container[,callback]
)
// 在ReactDOMServer渲染的容器中对HTML的内容进行hydrate操作。
// React 会尝试在已有标记上绑定事件监听器
```
1. ReactDOM.render

```js
import ReactDOM from 'react-dom'
const App= ()=>(<h1>Hello</h1>)
const root = doucment.getElementById('root')
ReactDOM.render(<App/>,root)
```

2. ReactDOM.hydrate

ReactDOM.hydrate配合ssr首次渲染，如果用render会重复渲染，hydrate只用于首次渲染，为服务端渲染的html绑定事件。

```js
import ReactDOM from 'react-dom'
const App= ()=>(<h1>Hello</h1>)
const root = doucment.getElementById('root')
ReactDOM.render(<App/>,root)
```
#### React 两端渲染差异

suppressHydrationWarning

下面的案例就是在服务端渲染的时间，在客户端渲染的时候已经过去一段时间了，那怎样解决这个问题呢？

单个元素的文本两端渲染有差异，可以使用`suppressHydrationWarning`这个属性来解决，文本差异可以解决，属性差异不能保证解决。
```js
// 组件
const App=()=>{
    <h1 suppressHydrationWarning>
     {new Date().getTime()}
    </h1>
}
// 服务端渲染
ReactDOMServer.renderToString(<App/>)

// 首次客户端渲染
const root = document.getElementById('root')
ReactDOM.hydrate(<App/>,root)
```
两端渲染

当有大段文本差异，可以使用以下方法，`componentDidMount`这个钩子只会在客户端渲染的时候才会执行；在服务端的时候只会执行`constructor`;所以可以利用在componentDidMount钩子渲染差异内容。

```js
class App extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={mounted:false}
    }
    componentDidMount(){
        this.setState({mounted:true})
    }
    return (
        <div>
            hello:
            {mounted && <Todo>}
        </div>
    )
}
```
总结：
react同构渲染的过程：

1. 服务端用ReactDOM.`renderToString`渲染出html字符串
2. 客户端用首次用ReactDOM.`hydrate`为其绑定事件
3. 下次再次更新dom就用ReactDOM.`render`



