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
