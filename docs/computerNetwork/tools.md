## 5.5 移动端网络优化的指标和策略

### 5.5.1 网络优化指标

####  一个请求的时间消耗

浏览器/Network/Timing

<img width="500px" src="~@/network/resourcescheduling.png">

一个请求到底有哪些消耗，这也是一道常见的面试题，一个请求发生到返回需要三部分时间；
- Resource Scheduling（资料调度）
  浏览器同时处理很多请求，发送一个请求不是立即去发，是有一个调度过程的；浏览器也不是同时无限制的发送请求，浏览器对于一个运营项发送6个请求，其实6个已经很多了，
  现在是一个http2.0的时代；其实建立一个连接，可以传送很多数据，也不一定像过去那样多发几个请求了；虽然是http2.0时代，也是有一定限制的，一次也不会请求太多数据。
- Connection Start （建立连接）
   - stalled （闲置时间，程序准备工作）
   - DNS Lookup （DNS查询时间）
   - initial connection （TCP建立连接，3次握手）
   - SSL （三次握手的时候，也会把ssl层建立起来，所以三次握手和ssl层有重叠，黄色部分和紫色部分）
- Request/Response （收发请求）
  - Request sent 发请求
  - Waiting（TTFB）（第一个字节返回，耗时的大开销在网络延迟也有服务端的处理，用了91.94ms）
  - Content Download （下载）
  
浏览器同时处理很多请求，不能说你想发一个请求，就立即帮你发；它其实有一个调度过程的，浏览器也不是无限制的发送请求，通常一个TCP发送6个

####  页面加载

从上面可以看出页面有17个请求，其实并没有建立这么多的TCP/IP连接，所以有些请求在`Connection Start`阶段，没有`DNS Lookup`、`initial connection`、`SSL`的过程，因为不需要建立一个完整的TCP/IP连接，因为咱们的http2.0是多路复用的，第一个文件建立3次握手之后，可能第二个文件又不建了，这里面省了很多握手的时间。

为什么4.8MB的资源传输只有10.4kb呢？

因为这些数据是压缩传输的，压缩的优势是消耗更少的流量，劣势是消耗CPU的资源。

![](~@/network/pageload.png)

####  常见的性能指标

- 是否显示？
  - 首次绘制时间（FP）、首次内容绘制（FCP）
    FP和FCP是差不多的东西，但是有一个区别；有时候首次绘制时间，从监控上讲白屏也算；首次内容绘制至少让用户看到一些东西，这2个东西监控呢，可以直接监控当前html页面的字节数，可以不断的读取当前页面的字节数；还有一种方法是找一个关键元素，比如你先让用户看到的是轮播图，在轮播图加载完打一个点。
- 关键元素是否显示？
  - 首次有效绘制（FMP），主角元素计时

   首次有效绘制就是看见我看到了我最关键的那个东西，比如下单按钮是否被渲染出来
- 是否可用
  - 可交互时间（TTI）

    页面有可交互元素，例如一个input框
- 最大内容
  - LCP

- 是否卡顿
  - CPU消耗、输入延迟等

### 5.5.2 网络优化策略

主要是缓存和减小流量

- 缓存类
  - 本地缓存
  - 离线包
  - 预加载
- 压缩
- 请求合并

#### 1. 缓存

- http缓存
- 移动端缓存（native）
  native开启空间给web用于做缓存
- 服务端缓存（redis、ssr等）


#### 2. 离线包

在打开APP期间将资源推送到APP的缓存中

#### 3. 预加载

- APP预加载完整容器（Webview）
- H5应用预加载下一个页面的数据

#### 4. 压缩

- js压缩、css压缩
  - uglifyjs/xxx minify
- GZIP
  - express/nginx/caddy
- 合并
  - 雪碧图

#### 5. 请求合并

<img width="500px" src="~@/network/res-merge.png">

请求合并也可以发生在浏览器端，建议发生在服务端，做到的极致就是服务端渲染。

#### 6. webp格式的图片

如果一个网站图片过多，采用webp格式的图片，体积能优化20%-50%；不支持webp格式的图片采用png、jpg等格式；一般安卓都支持，ios14以下会有问题如果是混合开发的app，native可以在不支持的手机上进行转换成支持的格式。
