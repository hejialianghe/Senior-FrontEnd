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

#### 跨越资源共用 <Badge text="重要" type="tip"/> 

- 跨域资源共用（Cross-Origin Resource Sharing）使用额外HTTP头允许指定的源和另一个源进行交互
  服务端设置 Access-control-Allow-Origin:域名