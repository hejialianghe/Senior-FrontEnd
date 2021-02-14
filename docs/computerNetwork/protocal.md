## 1.1 OSI七层模型

OSI七层模型

- 开放式系统互联网模型
- 世界范围内的网络标准概念模型
- OSI的努力让互联网协议组件走向标准化

#### 应用层

提供高级API

- 定义了网络主机提供的方法和接口（业务协议、高级协议）
- 往往直接对应用户行为
- 例如：HTTP、FTP、SMTP等

#### 展示层

- 也被称做语法层
- 将Application layer中的数据转化为传输格式，保留语义（如：序列化、加密解密、字符串编码解码等）
- 确保数据发送取出后可以被接受者理解

####  会话层

- 提供管理会话的方法（Open/Close/ReOpen/检查状态等）
- 提供对底层连接的断断续续的隐藏；甚至对多种底层流的隐藏（提供数据同步点）

#### 传输层

提供主机到主机（host-to-host）的数据通信能力

- 建立连接保证数据封包发送、接受到的顺序一致
- 提供可靠性（发送者知道数据有没有被完整送达）
- 提供流控制（发送者和接受者同步速率）
- 提供多路复用（多种信号复用一个信道）

#### 网络层

提供数据在逻辑单元（例如IP地址）之间的传递能力

- 路由：决定数据的下一站在哪里
- 寻址：为数据封包增加头信息（地址等）

#### 数据链路层

提供数据在设备和设备之间的传输能力

- 流控制 ：发送者接受者之间同步数据是收发速度和数据量

- 错误控制：检测数据有没有出错，并重发出错的数据

#### 物理层

定义底层一个位（bit）的数据如何让变成物理信号

- 将数据链路层发生的数据传递行为转化成为物理设备识别的信号

- 封装了大量底层物理设备的能力

## 1.2 TCP/IP 协议和互联网协议群

### 1.2.1 TCP/IP协议群简介

- 类似OSI模型，一种网络协议的基本模型

![](~@/network/suite.png)

1. 应用层

- 提供应用间通信能力（HTTP协议）

2. 传输层

- 提供主机到主机的通信能力（TCP/UDP协议）

3. 网络层

- 提供地址到地址的通信能力（form：12.3.41.1->to :9.1.2.12）

4. 链路层

- 提供设备到设备的通信能力（设备1->设备2）

5. 物理层

- 光电信号的传输

### 1.2.1 TCP/IP的三次握手

![](~@/network/threehand.png)

### 1.2.2TCP/IP协议的消息顺序处理方法

- 消息的绝对顺序用（SEQ，ACK）这一对元组描述
  - SEQ（Sequence）：这个消息发送前一共发送了多少字节
  - ACK （Acknowledge）：这个消息发送前一共收到了多少字节

## 1.3 DNS与CDN

### 1.3.1 DNS的基础知识

#### 统一资源定位符（URL）

- 也被称作（网址），用于定位互联网上的资源

![](~@/network/url.png)

#### DNS Query过程

![](~@/network/dns.png)

### 1.3.2 CDN 实现原理

cdn用于存变化不大的文件

![](~@/network/cdn.png)

#### CDN云测工具

[17ce](https://www.17ce.com/)

## 1.4 HTTP入门和基础工具链

#### 蒂姆.伯纳斯-李

- 英国著名科学家（1955-）
  - 万维网（1990年HTTP协议）
  - 创办MIT人工智能实验室

### 1.4.1 HTTP协议

- 超文本传输协议

  超是一个形容词，形容这个文本很厉害,这个协议是挂在tcp上实现的，开始设计就是客户端和服务端通信的，它提供了一种标准就是中间可以传文本，
  因为传二进制太复杂了，传文本大家都看的懂，容易推广就容易普及。
- 处理客户端和服务端之间的通信
- http请求/http返回
- 网页/json/xml/提交表单

#### 纯文本+无状态（stateless）

- 应用层协议（下面可以是TCP/IP）
- 信息纯文本传输
- 无状态
  - 每次请求独立
  - 请求间不影响
- 浏览器提供了手段维护状态（Cookie，session,*Storage等）

#### HTTP历史

- 1991 HTTP 0.9
- 1996 HTTP 1.0
- 1999 HTTP 1.1
- 2015 HTTP 2.0

#### 设计的基础因素

- 带宽
  - 基础网络（线路、设备等）
- 延迟
  - 浏览器
  - DNS查询
  - 建立连接（TCP三次握手）

#### 设计考虑因素-缓存与带宽优化

- 缓存
  - （http1.0）提供缓存机制如IF-Modified-Since等基础缓存控制策略
  - （http1.1）提供E-Tag等高级缓存策略

- 带宽优化
  - （http 1.1）利用range头获取文件的某个部分
  - （http 1.1）利用长连接让多个请求在一个TCP连接上排队
     如果每一个请求都建立一个TCP，这样是非常浪费带宽的，如果所有请求都复用一个tcp，那么这样省去了一些tcp握手的开销。
  - （http 2.0）利用多路复用技术同时传输多个请求
     进一步节省带宽

#### 设计考虑因素-压缩/安全性

- 压缩
  - 主流web服务器如nginx/express等都提供gzip压缩功能
  - （http2.0）采用二进制传输，头部使用HPACK算法压缩

- HTTPS
  - 在HTTP和TCP/IP之间增加TSL/SSL层
  - 数据传输加密（非对称+对称加密）

### 1.4.2 HTTPS

- 安全超文本传输协议（Hyper Text  Transfer Protocol Secure）
- 数据加密传输
  - 防止各种攻击手段（信息泄露、篡改等）
-  SSL/TSL（Secure Socket Layer/Transport Layer Secure）
   - SSL-安全套接层
   - TSL-传输层安全性协议
   - 需要在客户端安装证书

![](~@/network/https.png)

### 1.4.3 Node.js实战http请求

🍎 Header和Body（实战）

- http协议是一个文本传输协议，传输内容是人类可读的文本，大体分成2部分：
  - 请求头（header）/返回头
  - 消息体Body
- 观察node实现http的基础协议

```js
const net = require('net')

const response = `
HTTP/1.1 200 ok
Data: Tue,30 Jun 2020 01:00:00 GMT
Content-Type: text/plain
Connection: Closed
// 上面是描述，下面设计文本内容
Hello word
`
const server= net.createServer(socket=>{
    socket.end(response)
})

server.listen(80,(err)=>{
    console.log('err',err);
})
```
我们请求一下`http://localhost/`

![](~@/network/netttohttp.png)

从上图可以看出respoons header是我们添加进去的，request header是浏览器帮我们添加进去的

### 1.4.3 基础工具链

1. Chrome

- Google 开发的免费浏览器
- Chrome 开发者拥有强大的调试能力

2. cURL

- 传输一个URL（和服务端交互的工具）
  - url：网址（Uniform Resource Locator）
- 支持多种协议（HTTP/HTTPS/FTP/FTPS/SCP/SFTP/DICT/TELNET）

```bash
curl www.baidu.com # 返回百度首页的内容，跟浏览器是一样的，会少一些响应头
curl -I www.baidu.com # 返回协议头部

HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
Connection: keep-alive
Content-Length: 277
Content-Type: text/html
Date: Sun, 14 Feb 2021 09:12:18 GMT
Etag: "575e1f59-115"
Last-Modified: Mon, 13 Jun 2016 02:50:01 GMT
Pragma: no-cache
Server: bfe/1.0.8.18
```
2. fetch

- 在网络上获取数据的标准接口
   - 提供对请求/返回对象（标准的Promise接口）
   - 提供自定义header能力
   - 提供跨域能力

浏览器上可以直接请求 fetch("/")

4. postMan

- 协作的API开发工具

经常用的场景是服务端工程师把一些复杂的请求参数配置好，通过postman可以分享出来给前端工程师

5. whistle

whistle是一个抓包的工具，也叫网络调试工具，它能看到这些分包，可以在http协议上修改一些参数。

- 跨平台网络调试工具
  - 需要SwitchOmega插件
  - node.js 开发
  - 支持抓包 、重放、替换、修改等

```bash
    npm i whistle -g # 下载，mac电脑：sudo npm i whistle -g 
    whistle start # 启动
    http://localhost:8899/ # 浏览器查看
    SwitchOmega # 谷歌代理插件，可以配置127.0.0.1:8899的服务上
```
谷歌代理插件SwitchOmega，配置代理服务器127.0.0.1:8899的服务
![](~@/network/switchOmega.png)

示例：以代理百度为例
![](~@/network/baidu.png)

![](~@/network/whistleweb.png)

#### 小结

简单比效率更重要（java/HTTP）等

## 1.8 UDP vs TCP，HTTP vs HTTPS

### 1.8.1 UDP

- 比TCP节省网络资源和迅速

  - 不需要建立连接（延迟更低）
  - 封包体积更小 （传输入速度快）
  - 不关心数据顺序（不需要序号和ACK，传输快速）
  - 不保证数据不丢失

#### 思考

没有虚拟连接、不校验数据、不保证顺序、没有收到不重复---是不是意味着不安全、不可靠？

- UDP自由度跟高
 
  - 需要用户程序在应用层定义类似的机制
  - TCP面向流（API接收流）、UDP面向消息（API接收数据包）

- 场景不同

  - 模糊：文件&文本、多媒体
  - TCP：远程控制
  - UDP：DNS查询

### 1.8.2 HTTP2.0 目标

- 多个请求多路复用
- 防止对头阻塞
- 压缩HTTP头部
- 服务端推送

#### HTTP 1.1 排队问题

多个文件共用一个TCP，如果第一个文件响应慢，会阻塞后面的文件，浏览器最多会建立6个tcp连接

![](~@/network/http1.1.png)

#### HTTP 2.0 

1. 多路复用

把几个请求打包成一个小块去请求，并行发送

![](~@/network/http2.0.png)

2. 防止对头阻塞

一个分包请求3个文件，即使第一个阻塞了，第二个也能返回

3. 压缩头部

- HPACK技术
  
  例如：METHOD GET 用2表示

3. 服务端推送




