## 3.1 常见网络安全防护

### 3.1.1 阻断服务攻击（DOS）

- 阻断服务攻击，想办法目标网络资源用尽
- 变种：分布式阻断服务攻击

影响：

1.  宽带消耗性（消耗目标的带宽）
2.  资源消耗型（消耗目标的计算资源）

解决方案：

1.  防火墙
2.  交换机（路由器）
3.  流量清洗

### 3.1.2 跨站脚本攻击（xss）

- 原理：将跨站脚本注入到被攻击的网页上，用户打开网页会执行跨站脚本。

解决方案： 1. 输入过滤（转义） 2. 输出过滤（转义）

### 3.1.3 SQL 注入

‘;update user set money=99999 where id=10025’

select \*from user where user_name=';update user set money=99999 where id=10025'

解决方案：
输入过滤（转义）
数据库安全策略

### 3.1.4 跨站请求伪造（csrf）

假如你刚登录银行网站不久，cookie 还没过期，黑客利用小广告之类让你点击，然后请求在程序中请求转账接口

解决方案：

1.  验证 referer 字段
2.  在请求地址添加 token 并验证

### 3.1.5 HTTPS 中间人攻击

黑客在电脑上安装伪造的证书，拦截客户端的请求

## 3.2 同源策略

### 3.2.1 定义

- 禁止一个源（origin）的脚本&文档和另一个源的脚本&文档交互
  - 两个 URL 的 protocol，port 和 host 相同，那么同源
  - 思考：如果两个源产生过多交换有什么问题？

![](~@/network/someorigin.png)

思考：

- 为什么不禁用不同源的 js？

因为有时候需要把 js 放到 cdn 上，那么可能就不同源了，所以行不通。

- 应不应该允许不同源的 js 修改 dom？

允许

- 应不应该允许网站提交数据到不同源的的服务器？

不允许

- 应不应该允许网站提交 cookie 到不同源的服务器？

不允许

### 3.2.2 跨域的 N 种方法

#### 1.JSONP

- 利用不限制跨越脚本执行的特点

```js
// 服务端数据（data.js）
jsonp('example', {
  a: 1,
  b: 2,
})

// index.html
function jsonp() {
  console.log(topic, data)
}
// 加载跨域数据脚本
var script = document.createElement('script')
script.setAttribute('src', 'data.js')
document.getElementdByTagName('head')[0].appendChild(script)
```

思考

- jsonp 可以用来提交数据吗？

可以在 url 上，但只能 get 请求；服务端可以通过判断返回不同的脚本

- 尝试为 fetch 函数扩展 jsonp 功能

```js
fetch(<jsonp-url>,{method: 'jsonp'})
      .then(data=>{
         console.log(data)
      })
```

#### 2. 跨域资源共用 <Badge text="重要" type="tip"/>

- 跨域资源共用（Cross-Origin Resource Sharing）使用额外 HTTP 头允许指定的源和另一个源进行交互
  服务端设置 Access-control-Allow-Origin:https://a.com

![](~@/network/corss.png)

get、post 我们称之为简单请求，简单请求在同源策略中会简单的处理,如果 b.com 返回了这个头`Access-control-Allow-Origin:https://a.com`，那么我们认为
这个请求是可以通过的。

预检

但是还有复杂一点的请求，我们需要先发 OPTIONS 请求，a.com 想请求 b.com 它需要发一个自定义的 Headers：X-ABC 和 content-type，这个时候就不是简单请求了，
a.com 要给 b.com 发一个 options 请求，它其实在问 b.com 我用 post 行不行，还想在 Headers 中带 X-ABC 和 content-type；并不是所有的 headers 都发这个 OPTIONS 请求，因为 X-ABC 是自定义的，所以需要发；b.com 看到 OPTIONS 请求，先不会返回数据，先检查自己的策略，看看能不能支持这次请求，如果支持就返回 200。

OPTIONS 请求返回以下报文

```js
HTTP/2.0 20 OK
Access-Control-Allow-Origin:https://a.com
Access-Control-Allow-Methods:POST,GET,OPTIONS
Access-Control-Allow-Headers:X-ABC,Content-Type
     Access-Control-Max-Age:86400 // 告诉浏览器这个策略生效时间为一个小时，在一个小时之内发送类似的请求，不用在问服务端了，相当于缓存了
```

浏览器收到了 OPTIONS 的返回，会在发一次，这一次才是真正的请求数据，这次 headers 会带上 X-ABC、contentType。

整体的过程 cors 将请求分为 2 种，简单请求和复杂请求，需不需要发送 OPTIONS 浏览器说的算，浏览器判断是简单请求还是复杂请求，cors 是非常广泛的跨域手段
这里的缺点是 OPTIONS 请求也是一次请求，消耗带宽，真正的请求也会延迟。

#### 3.反向代理 <Badge text="重要" type="tip"/>

![](~@/network/proxy.png)

因为跨越是浏览器的限制，所以可以用同源的服务器去代理请求，代理服务使链路变的更长。

### 3.2.3 实战-CORS（fetch+node.js）

- 观察 node.js 在服务端的实现 CORS 跨域
- 观察浏览器器 fetch 的使用方法
- 观察 OPTIONS 预检请求

项目地址：/examples/computerNetwork/3.2

1. 用 express 起 2 个服务

```js
const express = require('express')
const app1 = express()

app1.get('/', function (req, res) {
  res.send('hello')
})

app1.listen(3000)

const app2 = express()
app2.get('/api', function (req, res) {
  res.send('go')
})

app2.post('/api', function (req, res) {
  res.send('go')
})
app2.listen(3001)
```

启动 node 服务 nodeman cors.js

2. 用`whislte`做代理

```bash
    npm i whistle -g # 下载，mac电脑：sudo npm i whistle -g
    whistle start # 启动
    http://localhost:8899/ # 浏览器查看
    SwitchOmega # 谷歌代理插件，可以配置127.0.0.1:8899的服务上
```

配置 whislte 进行代理的域名

![](~@/network/whistle.png)

谷歌代理插件 SwitchOmega，配置代理服务器 127.0.0.1:8899 的服务

![](~@/network/switchOmega.png)

SwitchOmega 选择 proxy 进行代理

![](~@/network/webresquest.png)

3. 在`dev.com`网站上请求`dev1.com/api`

从上面看到在`dev.com`网站上请求`dev1.com/api`有跨域的报错信息，告诉我们可以用 CORS 加请求头,以下是解决方法。

```diff
const express = require('express');
const app1 = express();

app1.get('/',function(req,res){
    res.send('hello')
})

app1.listen(3000)

const app2 = express()
app2.get('/api',function(req,res){
+    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})

app2.post('/api',function(req,res){
    res.send('go')
})

app2.put('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
app2.listen(3001)
```

在浏览器控制面板输入 fetch('http://www.dev1.com/api',{method:'POST',headers:{'Content-Type':'application/json'}})进行请求；
再次请求并加 content-type 字段，如果我们用 post 请求并在 headers 里加字段 content-type:'application/json'，因为这是复杂请求，浏览器会先发送一个 options 请求，我们需要设置响应的 headers 允许添加某个字段。

![](~@/network/options.png)

```diff
app1.listen(3000)

const app2 = express()
app2.get('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
+ app2.options('/api',function(req,res){
+   res.set('Access-Control-Allow-Origin','http://www.dev.com')
+   res.set('Access-Control-Allow-Headers','content-type')
+  res.sendStatus(200)
+ })
app2.post('/api',function(req,res){
+    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})

app2.put('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
app2.listen(3001)
```

用`put`请求看看，报错信息中可以看出是要在响应前加上允许`PUT`的请求

![](~@/network/put.png)

GET/POST/HEAD 这种简单请求不会受这种影响,`put`、`delete`属于复杂请求，我们添加上以下代码来允许`PUT`请求

```diff
 app2.options('/api',function(req,res){
  res.set('Access-Control-Allow-Origin','http://www.dev.com')
  res.set('Access-Control-Allow-Headers','content-type')
+ res.set('Access-Control-Allow-Methods','PUT')
  res.sendStatus(200)
 })
```

我们在请求的时候在 headers 添加自定义字段 token,需要添加以下代码允许自定义

```diff
 app2.options('/api',function(req,res){
  res.set('Access-Control-Allow-Origin','http://www.dev.com')
+ res.set('Access-Control-Allow-Headers','content-type,token')
  res.set('Access-Control-Allow-Methods','PUT')
  res.sendStatus(200)
 })
```

<font color="red">子域名下请求父域名、父域名下请求子域名、子域名下请求子域名 都属于跨域，服务端通常通过判断是不是同一个一级域名，然后在 origin 里加上通过的域名</font>

fetch('http://www.dev1.com/api',{method:'POST',mode:'no-cors'}) 这种加上 no-cors，会显示请求成功了，但是拿不到数据，这种请求属于透明请求。
