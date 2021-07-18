## 2.1 实现一个简单的同构渲染页面

### 2.1.1 使用express启动Node服务器

源码地址:/examples/react/simpleDemo

```js
const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(3001)
```
启动服务：nodemon ./server.js

### 2.1.2 在服务端使用React组件和API渲染

####  1. 新建document.js 文件

```js
import React from 'react'

const Document = () => {
  return (
    <html>
      <head></head>
      <body>
        <h1>hello ssr</h1>
      </body>
    </html>
  )
}
export default Document
```
#### 2. server.js

```js
const express = require('express')
const ReactDOMserver=require('react-dom/server')
const Document = require('./documnet')
const app = express()

// renderToStaticMarkup 适用于纯静态页面
const html = ReactDOMserver.renderToStaticMarkup(<Document/>)

app.get('/',(req,res)=>{
    res.send(html)
})

app.listen(3001)
```
运行server.js 文件发现报以下错误，这是因为不支持jsx语法

```bash
const html = ReactDOMserver.renderToStaticMarkup(<Document/>)
                                                 ^
SyntaxError: Unexpected token '<'
    at wrapSafe (internal/modules/cjs/loader.js:915:16)
    at Module._compile (internal/modules/cjs/loader.js:963:27)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
    at internal/main/run_main_module.js:17:47
```
解决Node jsx报错

-  安装babel yarn add @babel/core @babel/register @babel/preset-env @babel/preset-react -D
-  babel有效范围，当前引入babel的文件无效
-  拆分router 把expres的router拆分独立文件，在router中执行React服务端渲染API

####  3. 新建 serverRouter.js

```js
const express = require('express')
import React from 'react'
import ReactDOMserver from 'react-dom/server'
import Document from './documnet'
const router = express.Router()

const html = ReactDOMserver.renderToStaticMarkup(<Document/>)

router.get('/',(req,res)=>{
    res.send(html)
})
module.exports=router
```
####  4. 改写 server.js

```js
require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')

const app = express()
const serverRouter = require('./serverRouter')
app.use('/',serverRouter)

app.listen(3001)
```
启动服务，打开http://localhost:3001/ 可以看见react渲染出来的内容`hello ssr`

虽然服务端返回了字符串，显示了内容，但是没有任何交互事件，也就是没有加载js

:::warning 为什么在服务端不能绑定事件？
1. 服务端没有dom，不能绑定事件
2. 服务端返回的是字符串
3. 服务端没有script
4. 浏览器只加载了html，没有加载任何script去加载执行js
:::

### 2.1.3 有交互事件的同构渲染

源码地址:/examples/react/simpleDemo

1. 新建app.js

```js
import React from 'react';

const App = () => {
    return (<div onClick={() => alert('hello')}>
        client
    </div> );
}
 
export default App;
```

2. 新建client.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

// hydrate渲染，看见服务端已经渲染好的dom，就不会再次渲染
ReactDOM.hydrate(<App />, document.getElementById('root'))
```
3. 我们用webpack构建我们的客户端渲染组件，打包成main.js

```js
 // 下载webpack、webpack-cli
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin')

module.exports = {
  entry: './src/client.js',
  output: {
    // 打包后的main.js放到build文件下
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
};
```
<font color="red">我们客户端渲染已经结束，接下来看看服务端怎么做</font>

4. document.js

```js
import React from 'react'

const Document = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>simple-ssr</title>
    </head>
    <body>
      // dangerouslySetInnerHTML 用于在dom中插入字符串，跟vue的v-html类似
      <div id="root" dangerouslySetInnerHTML={{ __html: children }} />
    </body>
    // 加载客户端打包后的main.js
    <script src="./main.js"></script>
  </html>
)

export default Document
```
5. serverRouter.js

```js
const express = require('express')
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from './components/Document'
import App from './components/App'

const router = express.Router();

// 渲染app.js ，服务端负责渲染，客户端负责绑定事件
/*
 renderToString 主要用于需要交互的页面
 renderToStaticMarkup 主要用于单纯的展示页面
*/
const appString = ReactDOMServer.renderToString(<App/>)
const html = ReactDOMServer.renderToStaticMarkup(<Document>
  {appString}
</Document>)

router.get("/", function (req, res, next) {
    res.status(200).send(html);
});

module.exports = router
```
nodemon ./src/server.js 启动服务，可以看见页面用了ssr渲染，又有了点击事件

## 2.2 实现SPA同构渲染

源码地址:/examples/react/simpleDemo2

- react-router 基本的客户端路由实现
- 理解无状态组件
- 利用react-router 实现服务端路由

### 2.2.1 客户端路由

react-router-dom：客户端、服务端都可以用

```bash
yarn add react-router-dom
```

App.js

```js
import React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom';
import routes from '../core/routes.js'

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">to Home</NavLink>
        </li>
        <li>
          <NavLink to="/user">to User</NavLink>
        </li>
      </ul>

      <Switch>
        {routes.map(route => (
          <Route key={route.path} exact={route.path === '/'} {...route} />
        ))}
      </Switch>
    </div>
  )
}

export default App
```
routes.js

```js
import Home from '../components/Home'
import User from '../components/User'
import NotFound from '../components/NotFound'

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/user",
    component: User,
  },
  {
    path: "",
    component: NotFound,
  },
];

export default routes
```
### 2.2.2 服务端路由

StaticRouter 
- 无状态组件
- 什么是无状态：它永远不会更改位置，服务端不会有用户点击切换路由，已经渲染的路由组件不会在更改
- location: string | object
- context: object

```js
<StaticRouter
 location={req.url}
 context={context}
>
<App/>
</StaticRouter>
```
serverRouter.js

```js

const express = require('express')
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from './components/documnet'
import App from './components/app'
import { StaticRouter } from 'react-router-dom'
const router = express.Router()

router.get("*",  function (req, res, next) {

// 第一次加载或者刷新页面都有服务端渲染，然后客户端接管路由跳转渲染页面
  const appString = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
    >
      <App />
    </StaticRouter>)

  const html = ReactDOMServer.renderToStaticMarkup(<Document>
    {appString}
  </Document>)
  console.log('html', html)

  res.status(200).send(html);
  
});

module.exports = router
```

<img width="100%" src="~@/react/spa.png">

到此为止我们用`react-router-dom`实现了服务端路由，客户端路由的使用

## 2.3 何时请求异步数据

### 2.3.1 客户端请求的时机和实现

