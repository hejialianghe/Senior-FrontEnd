
## 2.1 实现一个简单的同构渲染页面

### 2.1.1 使用express启动Node服务器

[源码地址](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/react/simpleDemo)

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

[源码地址](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/react/simpleDemo)

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

[源码地址](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/react/simpleDemo-2)

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

![spa.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cab138200d64c48b527f219531652a3~tplv-k3u1fbpfcp-watermark.image)

到此为止我们用`react-router-dom`实现了服务端路由，客户端路由的使用

## 2.3 何时请求异步数据

[源码地址](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/react/simpleDemo-3)
### 2.3.1 客户端请求的时机和实现

推荐：componentDidmount、useEffect中发送请求

不推荐：componentWillmount、componentWillReceiveProps、componentWillUpdate

#### 为什么不在componentWillmount请求数据？

1. 执行完componentWillmount后，会立即执行render方法，这时候接口数据还没有返回，提前请求并没有减少render方法的调用
2. 过期警告componentWillmount、componentWillReceiveProps、componentWillUpdate，在新版本的react将移除这些生命周期；
在新的版本中将采用fiber架构：fiber架构将导致这些生命周期多次执行。


![fiber-line.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/533d88f4890a475a9b69557c61a74f80~tplv-k3u1fbpfcp-watermark.image)

同步：是一次性渲染全部组件

异步：分片多次渲染，高优先级任务可以打断渲染（遇到点击，滚动这样的任务把它作为高优先级任务优先响应用户,浏览器空闲时间再次接着渲染，所以会导致上3个生命周期多次执行）

### 2.3.2 服务端请求的时机和实现

服务端不会执行componentDidmount、useEffect，所以服务端要在渲染组件之前要拿到数据

axios发送请求(支持服务端和客户端)

```bash
yarn add axios
```
1. 新建apiRouter.js

模拟一些接口，并返会一些数据

```js
const express = require('express')

const router = express.Router();

router.get("/home", function (req, res, next) {
  res.json({ title: 'Home', desc: '这是home页面' })
});

router.get("/user", function (req, res, next) {
  res.json({ name: '张三', age: '21', id: '1' })
});

module.exports = router
```
2. 改写server.js

```diff
require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')
const app = express()
const serverRouter = require('./server/serverRouter')
const apiRouter = require('./server/apiRouter')

// api接口
+ app.use("/api/", apiRouter);
// 用于加载静态资源
app.use("/build", express.static('build'));
// 服务端渲染
app.use('/',serverRouter)

app.listen(3003)
```
3. api.js

请求数据的封装

```js
import axios from 'axios'

const req = axios.create({
  baseURL:'http://localhost:3003/api',
});

req.interceptors.response.use(function (response) {
  return response.data;
});

// 请求首页
export const fetchHome = () => req.get('/home')
// 请求用户信息
export const fetchUser = () => req.get('/user')
```
4. user组件

```js
import React,{useEffect} from 'react';
import { fetchUser } from '../core/api'

const User = ({staticContext}) => {
  // staticContext 用于服务端渲染，staticContext是请求接口返回的值，具体可以看serverRouter.js
  console.log('staticContext',staticContext)
  // 客户端请求的时机，在服务端渲染的时候，useEffect并不会执行
  useEffect(()=>{
    fetchUser().then(data=>console.log('User data:',data))
  },[])
  return (
    <main>
      <h1>User</h1>
      <button onClick={()=>{alert('user!')}}>click me</button>
    </main>
  )
}

User.getData = fetchUser
export default User
```
5. serverRouter.js

```js

const express = require('express')
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from '../components/documnet'
import App from '../components/app'
import { StaticRouter,matchPath } from 'react-router-dom'
import routes from '../core/routes'
const router = express.Router()

router.get("*", async function (req, res, next) {
  let data = {}
  let getData = null

  // 匹配当前路由，然后拿到当前要渲染组件的静态属性getData；getData就是请求的接口函数
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match) {
      getData = (route.component || {}).getData
    }
    return match
  });
  
  if (typeof getData === 'function') {
    try {
      data = await getData()
    } catch (error) { }
  }
  const appString = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      // context传的值，在组件中staticContext可以获取到对应的值
      context={data}
    >
      <App />
    </StaticRouter>)

  const html = ReactDOMServer.renderToStaticMarkup(<Document data={data}>
    {appString}
  </Document>)

  res.status(200).send(html);

});

module.exports = router
```
#### 总结：

1. 服务端渲染是在渲染组件之前请求数据，然后利用`context`把值传到对应组件，这样就渲染出了有数据的组件。
2. 客户端渲染可以在`componentDidmount、useEffect`中请求数据进行客户端渲染。

## 2.4 客户端复用服务端数据

[源码地址](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/react/simpleDemo-4)
#### 服务端怎样向客户端传递数据

- 通过window全局变量

#### 利用window全局变量传递数据

1. 改写serverRouter.js

```js
  const html = ReactDOMServer.renderToStaticMarkup(<Document data={data}>
    {appString}
  </Document>)
```
2. 改写 doucment.js

我们可以将传递过来的数据转换成JSON字符串，赋值给window.__APP_DATA；然后放到script标签中，在客户端就会执行以下代码。

```diff
import React from 'react'

const Document = ({ children ,data}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>simple-ssr</title>
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: children }}></div>
+        <script
+         dangerouslySetInnerHTML={{
+          __html: `window.__APP_DATA__=${JSON.stringify(data)}`,
+         }}
+      />
        <script src="/build/main.js"></script>
      </body>
    </html>
  )
}
export default Document
```
3. 改写home.js

```js
import React, { useState } from 'react';
import {fetchHome} from '../core/api'
const Home = ({staticContext}) => {
  console.log('staticContext',staticContext)
  const getInitialData = () => {
    // 服务端渲染拿到的数据
    if (staticContext) {
      return staticContext
    }
    // 客户端渲染，拿到服务端传递过来的数据
    if (window.__APP_DATA__) {
      return window.__APP_DATA__
    }
    return {}
  }
  const [data, setData] = useState(getInitialData())

  return (
    <main>
      <div>{data.title}</div>
      <div>{data.desc}</div>
    </main>
  )
}
Home.getData = fetchHome

export default Home
```
#### 客户端路由跳转数据获取

上面home.js的写法有一定问题？

- home.js客户端渲染从`window.__APP_DATA__`上获取数据，如果home跳转到user，那么user.js数据从哪获取呢？不能从`window.__APP_DATA__`获取了，user.js需要不同的数据。

- `window.__APP_DATA__` 只能应用于首屏获取数据。

4. 新建useData.js

useData.js 是封装的一个hooks,用于处理数据
```js
import { useState, useEffect } from 'react'

const useData = (staticContext, initial, getData) => {

  // 初始化数据
  const getInitialData = () => {
    //  server render
    if (staticContext) {
      return staticContext
    }
    // client first render
    if (window.__APP_DATA__) {
      return window.__APP_DATA__
    }
    return initial
  }
  const [data, setData] = useState(getInitialData())

  useEffect(() => {
    // 客户端首次执行完以后，把window.__APP_DATA__清除掉；下个路由就可以请求数据了
    if (window.__APP_DATA__) {
      window.__APP_DATA__ = undefined
      return
    }
    if (typeof getData === 'function') {
      console.log('spa render')
      getData().then(res => setData(res)).catch()
    }
  }, [])

  return [data, setData]

}

export default useData
```

4. 改写home.js

```js
import React, { useState } from 'react';
import {fetchHome} from '../core/api'
import useData from '../core/useData'

const Home = ({staticContext}) => {
  const [data, setData] = useData(staticContext, { title: '', desc: ''}, fetchHome)
  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.desc}</p>
    </main>
  )
}
Home.getData = fetchHome

export default Home
```

package.json

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rm -rf build && webpack --config ./webpack.config.js",
    "start": "npm run build && nodemon ./src/server.js"
  },
```