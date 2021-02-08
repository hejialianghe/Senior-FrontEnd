## 3.1 常见网络安全防护

### 3.1.1 阻断服务攻击（DOS）

- 阻断服务攻击，想办法目标网络资源用尽
- 变种：分布式阻断服务攻击

影响：
   1. 宽带消耗性（消耗目标的带宽）
   2. 资源消耗型（消耗目标的计算资源）

解决方案：
   1. 防火墙
   2. 交换机（路由器）
   3. 流量清洗

### 3.1.2 跨站脚本攻击（xss）

  - 原理：将跨站脚本注入到被攻击的网页上，用户打开网页会执行跨站脚本。

  解决方案：
     1. 输入过滤（转义）
     2. 输出过滤（转义）

### 3.1.3 SQL注入

‘;update user set money=99999 where id=10025’

select *from user where user_name=';update user set money=99999 where id=10025'

解决方案：
  输入过滤（转义）
  数据库安全策略

### 3.1.4 跨站请求伪造（csrf）

假如你刚登录银行网站不久，cookie还没过期，黑客利用小广告之类让你点击，然后请求在程序中请求转账接口

解决方案：
   1. 验证referer字段
   2. 在请求地址添加token并验证

### 3.1.5  HTTPS 中间人攻击

黑客在电脑上安装伪造的证书，拦截客户端的请求

## 3.2 同源策略

### 3.2.1 定义
- 禁止一个源（origin）的脚本&文档和另一个源的脚本&文档交互
  - 两个URL的protocol，port和host相同，那么同源
  - 思考：如果两个源产生过多交换有什么问题？

![](~@/network/someorigin.png)

思考：

- 为什么不禁用不同源的js？

因为有时候需要把js放到cdn上，那么可能就不同源了，所以行不通。

- 应不应该允许不同源的js修改dom？

允许

- 应不应该允许网站提交数据到不同源的的服务器？

不允许

- 应不应该允许网站提交cookie到不同源的服务器？

不允许

### 3.2.2 跨域的N种方法

#### 1.JSONP

- 利用不限制跨越脚本执行的特点

```js
 // 服务端数据（data.js）
 jsonp("example",{
    a:1,
    b:2
 })

 // index.html
 function jsonp () {
    console.log(topic,data)
 }
 // 加载跨域数据脚本
 var script = document.createElement('script')
 script.setAttribute('src','data.js')
 document.getElementdByTagName('head')[0].appendChild(script)
```
思考

-  jsonp可以用来提交数据吗？

 可以在url上，但只能get请求；服务端可以通过判断返回不同的脚本

- 尝试为fetch函数扩展jsonp功能

```js
fetch(<jsonp-url>,{method: 'jsonp'})
      .then(data=>{
         console.log(data)
      })
```

#### 2. 跨越资源共用 <Badge text="重要" type="tip"/> 

- 跨域资源共用（Cross-Origin Resource Sharing）使用额外HTTP头允许指定的源和另一个源进行交互
  服务端设置 Access-control-Allow-Origin:https://a.com

![](~@/network/corss.png)

get、post我们称之为简单请求，简单请求在同源策略中会简单的处理,如果b.com返回了这个头`Access-control-Allow-Origin:https://a.com`，那么我们认为
这个请求是可以通过的。

预检

但是还有复杂一点的请求，我们需要先发OPTIONS请求，a.com想请求b.com它需要发一个自定义的Headers：X-ABC和content-type，这个时候就不是简单请求了，
a.com要给b.com 发一个options请求，它其实在问b.com我用post行不行，还想在Headers中带X-ABC和content-type；并不是所有的headers都发这个OPTIONS请求，因为X-ABC是自定义的，所以需要发；b.com看到OPTIONS请求，先不会返回数据，先检查自己的策略，看看能不能支持这次请求，如果支持就返回200。

OPTIONS请求返回以下报文
```js
HTTP/2.0 20 OK
Access-Control-Allow-Origin:https://a.com
Access-Control-Allow-Methods:POST,GET,OPTIONS
Access-Control-Allow-Headers:X-ABC,Content-Type
     Access-Control-Max-Age:86400 // 告诉浏览器这个策略生效时间为一个小时，在一个小时之内发送类似的请求，不用在问服务端了，相当于缓存了
```
浏览器收到了OPTIONS的返回，会在发一次，这一次才是真正的请求数据，这次headers会带上X-ABC、contentType。

整体的过程cors将请求分为2种，简单请求和复杂请求，需不需要发送OPTIONS浏览器说的算，浏览器判断是简单请求还是复杂请求，cors是非常广泛的跨域手段
这里的缺点是OPTIONS请求也是一次请求，消耗带宽，真正的请求也会延迟。

#### 3.反向代理 <Badge text="重要" type="tip"/> 

![](~@/network/proxy.png)

因为跨越是浏览器的限制，所以可以用同源的服务器去代理请求，代理服务使链路变的更长。