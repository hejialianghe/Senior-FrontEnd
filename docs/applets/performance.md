## 1.1 小程序的工作原理

### 1.1.1 双线程架构和 Exparser 框架

#### 常见的页面渲染方式

1. Naitve：流畅度好，但是修改和发布不够灵活
2. Web 渲染：修改和发布灵活，但是加载可能不稳定，渲染有时不够流畅
3. Hybrid 渲染：技术方案较多，需要选型和精心设计，找到兼顾速度和流畅性的方案

#### Hybrid 渲染

Naitve 和 Web 都有它们的优势和劣势，我们想有一种混合的方案去中和它们的优势和劣势，达到一个平衡的效果，下面有 3 种方案

- PhoneGap：跑的还是常见 web 页面，只是在页面包了一层壳，native 提供一些 api 调用，它确实有些原生的体验
- React-Native：能达到原生体验，但稳定性没那么好
- JS-SDK：提供了一些拍照、扫一扫的原生能力

#### 微信小程序的选择

基于 JS-SDK 和资源离线缓存的 Hybrid 方案

- 界面渲染采用 Web 技术
- 页面使用独立的 Webview 渲染
- 资源打包一次下载后缓存使用，并且异步更新
- 提供原生组件和原生能力调用接口

#### 双线程架构

![](~@/applets/duble_layer.png)

小程序分为`逻辑层`、`渲染层`，它们之间的通信需要通过`native`;每打开一个页面会开辟一个 webview，它们独立渲染；所以返回的时候，直接从内存里加载

优点：

1. 流畅性：渲染层和逻辑层分别运行在不同的线程，互不阻塞
2. 安全性：逻辑层无法直接修改渲染层的内容，也无法直接获取敏感数据
3. 灵活轻量：基础库集成在微信端，业务代码轻量话，两者都可以远程更新
4. 渲染主要还是 web 技术，具备了 Web 开发的效率和灵活

缺点：

1. 开发成本：与传统开发有所区别的语法和结构，已有的的功能无法直接运行在小程序上，需要移植成本
2. 非实时性：由于渲染层和逻辑层的分离，大多数操作都变成了异步，复杂场景处理繁琐
3. 能力限制：页面大小，打开数量和内存回收都存在限制和一定的不可控性
4. 性能优化：与传统的 web 开发的性能问题有所不同，需要另行优化性能问题

#### Exparser 框架

微信小程序中负责组件的组织框架，包括内置组件和自定义组件的管理

- 基于 shadow DOM 模型，但是又不依赖浏览器和其他工具库
- 可在 JS 环境中运行，使的逻辑层和渲染层模型一致
- 高效轻量，性能表现好，在组件实例极多的环境下表现尤其优异，同时代码尺寸也较小

自定义组件的创建流程

1. 以 Component 构造器的内容创建组件对象
2. 为组件对象添加注册时声明的 data
3. 结合 WXML，生成组件 Shadow Tree
4. Shadow Tree 装入 Compose Tree
5. 依次触发组件的 created、attached 等事件

### 1.1.2 Web 和 Native 的通信原理

#### Web 发送数据到 Native <Badge text="重要" type="tip"/>

- 拦截 URL Scheme ：Native 的 WebView 拦截 Web 页面发出的特定格式的网络请求
- 拦截 prompt API ：Native 的 WebView 拦截 Web 页面中的 window.prompt 等 api 的调用
- Native API 注入：Native 在 javaScript 环境上下文直接注入 javascript 方法以供调用

#### 1. 拦截 URL Scheme

`net://post?id=123` net 是自定义的协议，可以定义成 net 也可以是 abc 等

- Scheme 就是应用自定义的 URL 协议名，如上面代码中的 netease
- 客户端可以通过 API 对 WebView 发出的请求进行捕获并根据 Scheme 决定是否拦截和解析

```js
// 这种方式不推荐，只适用于demo或低频场景
// 因为多次连续调用时，客户端只会收到最后一次消息
location.href = 'net://post?id=3'

// 推荐使用这种方式，消息不会丢失
const iframe = doucment.createElement('iframe')
iframe.style.display = 'none'
iframe.src = 'net://post?id=123'
doucment.body.appendChild(iframe)
setTimeout(() => {
  iframe.remove()
}, 100)
// ios端：可以接收至少3000w个字符的URL；
// Android端可以接收至少200w个字符的URL
// 消息太长不利于性能；需要考虑是否直接传输这么大量的数据
```

优点：

- 发送简单（location.href 或 iframe.src）
- 兼容性强（IOS2.0+ Android 1.0+）
- 侵入性低
  缺点：
- 消息长度限制（？）
- 过于灵活，缺少限制，容易出错

#### 2. 拦截 prompt API

- Native 可以捕获和拦截 WebView 中`alert/confirm/console/prompt`等 API 的调用
- 一般拦截 prompt 较多，因为该方法使用的使用的频率较低，不容易冲突
  - IOS：runJavaScriptTextInputPanelWithPrompt
  - Android：WebChromeClient.onJsPrompt

```js
// 最好先判断是否处于APP内的WebView再调用
const isInAPP = /net/i.test(navigator.userAgent)
isInAPP && prompt('post?id=1')
```

#### 2.Native 直接注入

- WebView 中的 javascript 是运行于 WebView 所提供的环境中的，所以 Native 可以通过 WebView 直接介入 javascript 的执行环境（context）

```js
// IOS UIWebview
JScontext *context=[uiWebViewvalueForKeyPath："documentView.webView.mainFrame.javascriptContext"];

context["postBridgeMessage"]= ^(NSArray<NSArray *>*calls){
    // Native 逻辑
}
// Android
// 其中@javascriptInterface注解是安全机制，可以搜索后详细了解
public class BridgeLogic {
    // @JavascriptInterface
    public void sendData(String message) {
        // native 逻辑
    }
}
private void initView() {
    webView=(WebView) findViewById(R.id.webview);
    // 开启webview Javascript 手动执行 默认为false
    webview.getSettings().setJavascriptEnabled(true)
    // 传入BridgeLogic的实例并挂载到Javascript中 window.JSBridge上
    webview.addJavascriptInterface(new  BridgeLogic(),"JSBridge")
}

// Web端的Javascript调用代码
// IOS UIWebView内
window.postBridgeMessage('post?id=123')
window.JSBridge.sendData('post?id=123')
```

优点：

- 执行效率相对较高
  缺点：
- 数据格式灵活，但学习成本较高
- 两端耦合性较强
- 可能出现命名空间冲突（window 对象）

#### Native 发送数据到 Web <Badge text="重要" type="tip"/>

我们可以注册一个方法到 window 上,native 可以调用此方法并传值

- ios：stringByEvaluatingjavaScriptFromString(该方法可以直接获取到 javascript 的执行结果)

```js
// Swift
let title = webview.stringByEvakuatingjavaScriptFromString("document.title")
// OC
NSString*title = [webview stringByEvakuatingjavaScriptFromString:@"document.title"]
```

- Android：loadUrl(4.4,无法直接获取 javascript 的执行结果)

```js
// java
webView.loadUrl("javascript:alert('NativeMessage')")
```

- Android：evaluatejavascript(4.4+,可以直接获取到 javascript 的执行结果)

```js
// java
mWebView.evaluatejavascript("javascript:document.title",new ValueCallback<string>(){
    @Override
    public void onReceiveValue(Strinf value){
        // 此处为js 返回结果
    }
})
```

### 1.1.3 原生组件和同层渲染

#### 原生组件

原生组件的优点：

- 扩展 Web 的能力：比如输入框对键盘的更好的控制
- 更好的体验：将地图、视频交互由 Native 线程渲染，不占用 Webview 渲染线程
- 更快的性能 L：在一些高频操作场景下，可以绕过 setData 通信流程直接渲染

原生组件的限制：

- css 支持不全
- ui 渲染方面的限制
- 只能在最高层级
- 事件模型的限制

开发中涉及到原生组件的调试时，最好在真机环境下进行验证，开发者工具无法完全模拟原生组件的特性

#### 同层渲染

由于原生组件带来的限制，微信研制除了同层渲染，原生组件个 webview 是同一层了，解决了事件绑定和 css 问题
![](~@/applets/same-rendering.png)

#### 实现原理

ios

- wkWebView 会为 overflow:scroll 的元素生成原生渲染层 WKChildScrollView
- 原生渲染层与其他 Web 元素的渲染关系已经由 WKWebView 内部维护好
- 原生组件就可以插入到因为 Scroll 而生成的原生渲染层中

Android

- Chromium 内部存在 embed 类型的节点
- Chromium 会为 Webview 内 embed 节点创建 Webplugin 实例，并生成一个 RenderLayer
- RenderLayer 可以渲染外部设置的内容
- 小程序就可以将原生组件的内容渲染到对应的 embed 节点生成的 RenderLayer 上

利用 embed 渲染 pdf，小程序也是利用这个特性实现了同层渲染
![](~@/applets/pdf.png)

#### 同层渲染后

css 支持更好：position、margin、box-shadow、transform 等都基本支持
渲染层级可控：可以使用 z-index 控制原生组件的渲染层级
事件机制正常：原生组件上的事件可以冒泡到父元素上进行监听或阻止
依然有一些限制：

- 避免频繁修改 CSS
- 不能通过本组件或者父组件设置 border-radius 截取显示内容
- 低版本安卓可能不支持
- 原生组件全屏后原生组件外的元素将不可见

## 1.2 性能优化

#### 性能优化的意义

小程序也需要性能优化

- 冷启动载入慢，loading 状态较长（冷启动：首次启动）
- 数据量较大的页面更新不及时，滚动卡顿
- 一些触摸反馈类的功能不流畅

### 1.2.1 加快小程序的启动速度

#### 启动速度

核心：减少小程序启动时所需要下载的包体积

1. 使用分包
   - 小程序的非首页或非重要页面放入分包中，可以非常有效地减少首次下载的包体积
   - 分包还可以提升小程序整体的包体积上限，也有助于后续的首屏渲染加速

```json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/share/index"]
    }
  ]
}
```

2. 分包预下载

- 正常情况下，只有在访问到了分包页面的情况下，分包才会触发下载，降低了分包页面的打开速度
- 分包预下载可以实现访问到某个页面时，自动预下载分包的内容，做到提前下载分包，同时又不影响主包的加载速度

```json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    {
      "root": "packageA",
      "name": "nameA",
      "pages": ["pages/share/index"]
    }
  ],
  "preloadRule": {
    "pages/share/index": {
      "network": "all", // 什么网络情况下预下载，wifi/all
      "packages": ["packageA"] // 分包的root和name
    }
  }
}
```

3. 独立分包
   - 独立分包可以独立于主包运行，不需要下载主包
   - 进入普通分包或主包页面时，主包才被下载
   - 独立分包也可以配置预下载主包
   - 一个小程序可以有多个独立分包

```json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    {
      "root": "packageA",
      "name": "nameA",
      "pages": ["pages/share/index"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/share/index": {
      "network": "all", // 什么网络情况下预下载，wifi/all
      "packages": ["__APP__"] // 可以预下载主包
    }
  }
}
```

4. 优化启动速度的其他方式

- 删除无用代码，并开启上传压缩，降低包体积
- 减少包内图片大小和数量，并推荐使用 Webp 格式图片
- 适当使用 web-view 组件

### 1.2.2 加快小程序的首屏渲染

- 分块渲染：优先渲染屏幕高度的内容，其他内容待 ready 后再渲染
- 数据预拉取：配置首屏数据接口预拉取或则周期性更新，节省数据请求时间
- 骨架屏：使用骨架屏幕，降低用户可感知的页面渲染时间
- 避免多余数据：

  - 避免空的生命周期方法
  - 减少初始化阶段的同步形式的方法调用
  - 避免过多或过复杂的主包页面和过多的自定义组件
  - 不参与渲染的数据采用纯数据字段

  #### 数据预拉取和周期性更新

  - 数据预拉取可以在小程序冷启动的同时，提前拉取指定接口的数据，节省数据的请求时间
  - 周期性更新可以按小程序的配置，每隔 12 小时定时拉取指定接口的数据，不需要小程序被启动，但是需要 7 天内被使用过

```js
App({
  onLaunch() {
    wx.setBackgroundFethcToken({
      token: 'xxx', // 可以发送小程序存储的用户标识
    })
    wx.getBackgroundFetchData({
      fetch: 'pre/periodic', // 预拉取或者周期性更新类型
      success(res) {
        console.log(res.fetchData) // 缓存数据
        console.log(res.timeStamp) // 客户端拿到缓存数据的时间戳
      },
    })
  },
})
```

#### 首屏渲染--骨架屏

[骨架屏文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html)

用开发者工具生成，然后引入业务页面，显示隐藏即可

### 1.2.3 加快小程序的动态渲染

#### 减少 setData 传递的数据量

- setData 涉及到进程间的通信，尤其是 Native 向 Web 传递使用的是 EvaluateScript 的方式，过大的数据量，就需要更长的处理时间
- 可以只传递 data 中变化的部分，也可以将多次 setData 合并为一次调用

#### 正确使用自定义组件

- 如果无法避免的需要频繁更新某一部分渲染层的 ui，可以将该部分声明为一个独立的自定义组件，因为这些组件内部的数据更新是独立的，计算开销更小
- 去掉自定义组件不必要的 dataset 属性，因为每次时间触发时，这些数据都会被收集传递到逻辑层
- 一个页面内自定义组件的数量也不宜过多，否则将会因为自定义组件的注册开销影响到首屏的渲染速度

#### 使用 WXS

可以理解为：WXS 就是直接运行于渲染层，也就是浏览器的脚本，所以存在一些能力和限制。

- 语法上只支持类似 ES5 的标准
- 与逻辑层 javascript 作用域隔离
- 可以通过调用组件实例的方法或者发出自定义事件来实现与逻辑层的间接通信
- 可以直接获取或修改组件上元素的样式

```js
// 导出变量pull
<wxs module="pull" src="./pull.wxs">
<scroll-view
  class="pulldown-wrapper"
  bindtouchstart="{{pull.touchStart}}"
  bindtouchstart="{{pull.touchMove}}"s
  bindtouchstart="{{pull.touchEnd}}"
  change:prop="{{pull.monitorShowRefresh}}"
  prop="{{showRefresh}}"
>
<view>{{text}}</view>
</scroll-view>
```

wxs 的通信方式

![](~@/applets/wechat-com.png)

动态设置 data 到 wxml 上

[wxs 传送门](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)
