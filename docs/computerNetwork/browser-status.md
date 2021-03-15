## 4.1 前端路由和服务端路由

### 4.1.1 前端路由和History API

#### History API

提供操作控制浏览器会话历史，维护会话栈（Session stack）的能力

#### history.go()

<img width="300px" src="~@/network/history-go.png">

切换我们的会话栈，但并不改变我们的会话栈

#### back & forward

<img width="300px" src="~@/network/back.png">

back相当于go(-1),forward相当于go(1)

#### pushState(state,title,url)

<img width="300px" src="~@/network/pushState.png">

新增一个状态（State）到会话栈（session Stack）

- state：状态数据（自定义），可以通过history.state获取
- title：预留字段，多数浏览器不使用
- url：新状态的url

假如我们现在打开baidu.com网站，我们在控制台里输入以下内容

```js
history.pushState(null,null,'/test') 
// 发现页面并没有再次请求资源，我们就是利用这个能力去做单页面应用的

history.pushState({name:"demo1"},null,'/test')
// 第一个参数可以传递参数，可以用history.state拿到,可以用于区分页面
// history.pushState({name:"demo1"},null,'/test?name=demo1')跟query传递参数是一样的
```
有些垃圾网站当你打开后，你会发现按返回，一直返回不了，它们就是在你的会话栈中pushState很多次，它们push的url也不会导致页面变化，所以给人错觉进入这样的网站像中病毒一样，返回不了。

#### pushState(state,title,url)

<img width="400px" src="~@/network/replace-state.png">

替换会话栈（session Stack）中当前的状态

- state：状态数据（自定义），可以通过history.state获取
- title：预留字段，多数浏览器不使用
- url：新状态的url

```js
history.pushState(null,null,'/test1') 
history.pushState(null,'/test2')

// 可以替换test1
history.replaceState(null,'/test3')
```

### 4.1.2 实战服务端路由

#### 观察node.js实现服务端路由

源码地址：/Senior-FrontEnd/examples/computerNetwork/4.1

做的功能是当访问`http://localhost:8080/details`返回的是`details.html`,当访问`http://localhost:8080/list`返回的是`list.html`

```js
const app = require('express')()
const path = require('path')
const fs =  require('fs')

// __dirname 当前文件相对目录
const pageDir = path.resolve(__dirname,'page')
const htmlFile = fs.readFileSync(pageDir)

function displayHtmlFile(name) {
    return (req,res)=>{
        const filePath= path.resolve(pageDir,name+".html")
        res.sendFile(filePath)
    }
}
htmlFile.forEach(file=>{
    const [name,ext] = file.split('.')
    app.get('/',name,displayHtmlFile(name))

})
app.listen(3000)
```
#### 观察用Cluster启动后多个实例进行负载均衡

```js
const cluster = require('cluster');
// 想知道机器上有多少cpu核心
const numCPUs = require('os').cpus().length
const express = require('express')

//cluster.isMaster 判断主进程还是从进程 
if(cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for(let i=0;i<numCPUs;i++){
        cluster.fork() // 创建worker，又启动了几次次当前文件，不过进不了主进程了，上面又isMaster判断了
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker${worker.process.pid} died`)
    })
}else {
    // Worker can share any TCP connection
    // in this case it is an HTTP server
    // 把所有的进程都监听8888
    const app =  new express()
    app.listen(8888)
    console.log(`Worker${process.pid} started`)
}
```
### 4.1.3 实战一个但页面应用

1. 服务端怎么做?

```js
const app = require('express')()
const path =  require('path')

const htmlFile =  path.resolve(__dirname, "page/spa.html")
// 请求products 或者product/123 都访问spa.html
app.get(/\/product(s|\/\d+)/,(req,res)=>{
    res.sendFile(htmlFile)
})

app.listen(3000)
```
2. 前端怎么做？

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        a {
            color : skyblue;
            cursor: pointer
        }
    </style>
    <title>Document</title>
</head>
<body>
  <h2>单页面应用示例</h2>
  <div id="content"></div>

  <ul>
      <li><a onclick="route('/products')">列表</a></li>
      <li><a onclick="route('/product/123')">详情</a></li>
  </ul>

  <script>
      // 更新列表的函数
      function pageList (){
          const html = `
          <ul>
            <li>Apple</li>
            <li>TicTok</li>
            <li>Alibaba</li>
          </ul>
          `
        document.getElementById('content').innerHTML =  html
      }
    //  更新详情的函数
      function pageDetail() {
          document.getElementById('content').innerHTML = "DETAIL"
      }
 
   // 实现页面切换并加入记录
      function route (page) {
        history.pushState(null,null,page)
        matchRoute(pages,window.location.href)
      }

      const pages = [
          {
              match: /\/products/,
              route: pageList
          },
          {
              match : /\/product\/\d+/,
              route: pageDetail
          }
      ]

      // 监听浏览器前进回退按钮，实现页面渲染
     window.onpopstate= function() {
        matchRoute(pages,window.location.href)
     }
     // 匹配当前页面
      function matchRoute(pages,href) {
        const page =  pages.find(page=>page.match.test(href))
        page.route()
      }
      matchRoute(pages,window.location.href)
  </script>
</body>
</html>
```

## 4.2 Session&Cookie&Storage和单点登录

### 4.2.1 Session和Storage

#### 登录场景（理解Session和Cookie）

<img width="500px" src="~@/network/sessionandcookie.png">

- Session 代表一次会话
- SessionID 是这一次会话的唯一标识
- Cookie 是浏览器用于存储少量数据的存储手段

#### 实战Session/Cookie

- 观察浏览器发出请求，服务端返回cookie
- 观察Set-Cookie在跨域情况下会发生什么

```js
const express =  require('express')

const app1 = express()
app1.get('/',(req,res)=>{
    res.setHeader('Set-Cookie','abc=123')
    res.send('ok')
})
app1.listen(3000)
```
![](~@/network/setcookie.png)



