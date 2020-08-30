## 2.1 Nodejs web框架及koa

### 2.1.1 Nodejs常见的框架

| 框架名称  |  特性  | 评价 | 
| :------: | :-----: | :---: |
| Express | 简单、实用、路由中间件等五脏俱全 |  最著名web框架  | 
|  Hapi&Restify | 面向API&微服务 |  移动互联网时代API作用被放大，故而独立分类，尤其是对于微服务开发更是利器  |
| ThinkJS   | 面向新特性 |  借鉴ThinkPHP，并慢慢走出自己的一条路，长于新特性执行，新版V3.0是基于Koa2.0的作为内核的  |
|  Koa  | 专注于异步流程改进 |  下一代web框架  |
|  Egg  | 基于Koa，在开发上有极大的便利|  企业级Web开发框架  |

### 2.1.2 Koa概览

- Express很简洁，Koa更简洁
- Koa应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的
- 内置优雅的底层中间件处理内容协商，缓存清理，代理支持和重定向等常见任务的方法，开箱即用

#### 洋葱模型

请求一层层的进入，一层层的退出，也就是说先进的后出，后进的先出

![](~@/node/onionmodel.png)

从下面代码可以看出，完全是遵循洋葱模型从1-9执行过程，通过next把模块串联起来，koa的洋葱模型允许我们加入很多中间件的处理

```js
const Koa=require('koa')
const app=new koa()

// x-response-time

app.use(async (ctx,next)=>{
    const start= Date.now() //1
    await next() // 2
    const ms=Date.now()-start // 8
    ctx.set('X-Response-Time',`${ms}ms`) // 9
})

// logger

app.use(async (ctx,next)=>{
    const start= Date.now() //3
    await next() //4
    const ms=Date.now()-start //6
    ctx.set(`${ctx.methods}${ctx.url}-${ms}`) //7
})

// reponse

app.use(async ctx=>{
    ctx.body='Hello World' //5
})

app.listen(3000)

```

#### Koa常见的中间件

- koa-static处理静态资源
- koa-router 处理路由
- koa-session 保存网络请求状态
- koa-bodyparser 处理请求体
- koa-compress 压缩响应数据
- koa-logger 输出服务日志
- koa-error 处理响应错误

### 2.1.3 使用Koa编写web Server

#### REST 接口设计-路由

```js
   //接口要遵循http动词
  GET /xhr/v2/templateList // 获取模版列表
  GET /xhr/v2/templateDetail?id=xx   // 模版单个模版详情
  POST /xhr/v2/templateCreate // 创建模版
  PUT  /xhr/v2/templateChange/1 // 修改模版,
  DELETE /xhr/v2/templateDelate/1 // 删除模版
```

我们使用社区提供的优秀脚手架去构建项目,github上搜索`awesome-koa`可以找到koa相关社区资源，例如：`https://github.com/fineen/awesome-koa`，在文档里找到这`koa-rest-api-boilerplate `这个脚手架;一个小技巧，以awesome为前缀去找框架相关资源。

```bash
  # --depth表示克隆深度，1表示克隆最进一次的commit
 git clone --depth=1 https://github.com/posquit0/koa-rest-api-boilerplate.git
 cd koa-rest-api-boilerplate
 rm -rf .git && git init
```
看一个框架，首先看`package.json`文件，看脚本运行了哪些命令，然后看入口文件。

 ```bash
  ├── app  
      ├──  config 
      │ ├── cors.js # 配置cors，跨域相关配置
      │ ├── index.js # 项目环境相关配置
      │ └──  logger.js # 配置错误相关
      ├── connections 
      │ └── apm.js # 实时监控应用性能和当前工作负载
      ├── constants # 常量
      ├── controllers # 业务层
      │       └── template.js
      ├── middlewares # 中间件  
      ├──  model # 数据模型    
      │      └── template.js
      ├──  routes  # 路由  
      │      └── template.js # template模块的路由
      ├── index.js 
      └──  utils
       ├── http.js # 请求封装
       └── reponse.js # 响应数据封装        
  └─ package.json       
 ```

#### 1. 编写数据模型

```js
    const mongoose = require('mongoose');
    const templateSchema = mongoose.Schema({
        name: String,
        template: String,
        data: String
    });
    module.exports = mongoose.model('template', templateSchema);
```

#### 2. 编写router

```js
const Router = require('koa-router');
const templateController = require('../controllers/template');
const router = new Router();

router.prefix('/xhr/v2');

router.get('/templateList', templateController.templateList);

router.post('/templateCreate', templateController.templateCreate);

router.get('/templateDetail', templateController.templateDetail);

router.put('/templateChange/:id', templateController.templateChange);

router.del('/templateDelate/:id', templateController.templateDelate);

module.exports = router;

```
#### 3. 在controllers编写业务

```js
'use strict';
const Template = require('../models/template');
const Response = require('../utils/response');
const logger = require('../logger');
// 查询列表
exports.templateList = async (ctx)=>{
  const temps = await Template.find({}).sort({ update_at: -1 });
  return Response.success(ctx, {
    code: 200,
    data: temps,
    message: 'success'
  });
};
// 创建列表
exports.templateCreate = async (ctx)=>{
  const result = await Template.create(ctx.request.body);
  return Response.success(ctx, {
    code: 200,
    data: result,
    message: 'success'
  });
};
// 查询某个详情
exports.templateDetail = async (ctx)=>{
  logger.info({ reuslt: ctx.rquery, event: 'reuslt' });
  const result = await Template.findById({ _id: ctx.query.id });
  if(result) {
    return Response.success(ctx, {
      code: 200,
      data: result,
      message: 'success'
    });
  }else {
    return Response.fail(ctx);
  }
};
// 更新某个
exports.templateChange = async (ctx)=>{
  const result = await Template.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body, { new: true }); //new 为true是返回修改后的
  if(result) {
    return Response.success(ctx, {
      code: 200,
      data: result,
      message: 'success'
    });
  }else {
    return Response.fail(ctx);
  }
};
// 删除某个
exports.templateDelate = async (ctx)=>{
  try {
    await Template.findOneAndDelete({ _id: ctx.params.id });
    return Response.ok(ctx, {
      code: 200,
      message: '删除成功'
    });
  }catch(err) {
    return Response.noContent(ctx);
  }
};

```
源码参考：[源码](https://github.com/hejialianghe/koa-rest-base)
### 2.1.4 Koa VS Express

#### koa

- 更优雅的编程体验
- 核心轻量，插件生态庞大
- 内置异步流控制
- 于Express生态不兼容，有自己的开发生态
- 入手简单，便于企业生态实践

#### Express

- Nodejs至今最流行框架
- 提供了Web中间件的标准
- 简单快捷可扩展
- 维护成本高，对系统设计能力要求高
- 学习曲线低，入手简单

### 2.1.5 扩展学习资料

[Koa官网](https://koajs.com/)
[Koa源码](https://github.com/koajs/koa)
[Awesome](https://github.com/fineen/awesome-koa)
[Koa2快速开发入门](https://juejin.im/post/5c6eb4ac6fb9a049d4426ab2)

## 2.2 Koa 原理解析及手写源码

### 2.2.1 手写开源库源码

#### 方法论

- 为什么要读源码？
- 应该去读哪些源码？
- 方法？工具？技巧？
- 手写源码该注意什么？

#### 为什么？

- 知其然，也要知其所以然（面试官总是这么要求我们）
- 代码是一个程序员心血结晶，阅读源码就是跟作者对话
- “天下代码一大抄”，先临摹，”再想着自创“
- 发现技术薄弱点及时修补沉淀
- 剥离场景，获取代码组织灵感
- 解决遇到的具体问题
- 看源码只是一种方法、手段、而不是目的

#### 看什么？

- "一个中心，两个基本点"
  - 以源码大本营Github为中心
  - 坚持使用冯.诺依曼结构理念
  - 坚持 “下去”
- 优秀的代码值得反复读
- Awesome列表

#### 怎么弄？

- 阅读源码方法

  - 先用明白，再开始读源码
  - 摸清作者的惯用手法
  - 提纲契领，找到入口，绘制架构图
  - 仔细阅读已经提供的文档

- 使用支持引用跳转的编辑器

- 注释核心代码逻辑，编写代码块进行验证

- 源码阅读能力提升秘籍
  - 阅读混淆后的代码

### 2.2.2 koa源码概览

#### 项目依赖

```js
  "dependencies": {
    "accepts": "^1.3.5", // 网络请求类型管理
    "cache-content-type": "^1.0.0", // 可缓存的CotentType管理库
    "content-disposition": "~0.5.2",
    "content-type": "^1.0.4",
    "cookies": "~0.8.0",
    "debug": "~3.1.0",
    "delegates": "^1.0.0", // javascript委托库
    "depd": "^2.0.0",
    "destroy": "^1.0.4",
    "encodeurl": "^1.0.2",
    "escape-html": "^1.0.3",
    "fresh": "~0.5.2",
    "http-assert": "^1.3.0", // 网络请求断言库
    "http-errors": "^1.6.3",
    "is-generator-function": "^1.0.7",
    "koa-compose": "^4.1.0", // 中间件组合器（洋葱模型实现的核心）
    "koa-convert": "^1.2.0", // 1.x转换器
    "on-finished": "^2.3.0",
    "only": "~0.0.2", // 属性选择器
    "parseurl": "^1.3.2",
    "statuses": "^1.5.0", // 语义化HTTP响应码
    "type-is": "^1.6.16",
    "vary": "^1.1.2"
  }
```

#### 目录结构

下面结构是tree生成，电脑没有的可以先下载它，有的执行`tree -L 2 -i` 生成2级树结构，
mac 可以用此命令模拟`find . -print | sed -e's;[^/]*/;|____;g;s;____|; |;g'`

 ```bash
.
|____package.json
|____benchmarks # 性能基准测试
| |____Makefile 
| |____middleware.js
| |____run
|____ docs # 文档目录
| 
|____lib # 核心文件
| |____response.js # reponse响应
| |____request.js #request请求
| |____context.js # 上下文
| |____application.js # 主应用
|____test #单元测试
 ```

#### 源码架构

![](~@/node/source-code.png)

### 2.2.3 构造一个可用运行的Server

#### Application源码解析

- 模块依赖
  - 原生依赖 events.Emitter util stream http
  - 第三方工具依赖
    - koa-compose（处理洋葱模型）、http-errors（处理错误）、statuses（状态码）
    - koa-convert（兼容koa1）、is-generator-function（兼容generator） 
    - depd、only、debug、on-finished （编程工具）
  - 内置模块依赖 request、response context

- 核心库 Application初始化配置

#### Koa-compose

![](~@/node/koa-compose.png)

- 基于Promise的流程控制方式，对异步流程同步化，解决链式耦合
- 将输入数组中的函数依此调用
- 提供一个数组函数公用的上下文ctx
- 提供一个数组函数之间串联的next指针

- 核心代码逻辑为：递归遍历数组

#### 实现最小系统的koa

koa.js

```js
/*
    实现 :
    1. const app=new Koa()
    2. app.listen
    3. app.use
*/
const http=require('http')
class Koa {
    constructor(){}
    middleware (){};
    listen (port,cb) {
        const server=http.createServer((req,res)=>{
            this.middleware(req,res)
        })
        server.listen(port,cb)
    }
    use(middleware){
        this.middleware=middleware
        return this
    }
}
module.exports=Koa
```
app.js

```js
const Koa=require('./koa')
const app=new Koa()
app.use((req,res)=>{
    res.writeHead(200)
    res.end('hell new koa')
})
app.listen(2000,()=>{
    console.log('server is run 2000');
})
```
### 2.2.4 扩展资料

[Koa2 原理解析和实现](https://juejin.im/post/5be3a0a65188256ccc192a87)

[可能是目前最全的koa源码解析指南](https://developers.weixin.qq.com/community/develop/article/doc/0000e4c9290bc069f3380e7645b813)

## 2.3 Koa 请求响应上下文原理解析

### 2.3.1 理解委托模式

#### 设计模式-委托

- javascript 事件委托-事件冒泡给父元素

- javascript 行为委托-原型继承实现原型链

- delegates 外层暴露的对象将请求委托给内部的其他对象进行处理

- Koa使用委托的目的：避免重复实例化req/res

#### 手写delegate 依赖包

- TJ Holowaychunk已经离开NOde社区（转写go去了）项目已不维护

- delegate 实现中使用了部分过期的方式

- 基于现有的ES标准可以写的更优雅

- 控制属性的读写权限

 ### 2.3.2 compose（动态代理模式）

- 面向切面编程（AOP）

- 动态代理（模式）植入目标代码

- 洋葱模型-中间件模型

在运行的时候动态的将代码植入类的指定方法、指定位置的编程思想就是面向切面编程

### 2.3.3 构造请求响应体语法糖

#### 请求响应体

- Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__

- 使用getter/setter封装Node原生request/reponse

- 实现jQuery示的属性使用

- 使用accept处理HTTP请求协议

#### 上下文语法糖

- 单一context原则：每一个请求都有唯一一个context对象

- 所有的关于请求和响应的东西都放在context里面，共享所有资源使context具有高内聚的性质，内部元素互相能访问到

### 2.3.4 扩展资料

[Koa源码阅读（二）上下文ctx](https://juejin.im/post/5c0a075bf265da610f638811)

[Koa封装的ctx对象具体详解](https://zhuanlan.zhihu.com/p/112356268)

[详解JavaScript十大设计模式](https://juejin.im/entry/58c280b1da2f600d8725b887)

## 2.4 koa 常见的中间件1

### 2.4.1 koa-router

#### 路由控制是什么？

- 通过路由判断服务器应该提供什么服务

- koa-router提供的能力

  - 处理HTTP动词
  - 路由分层管理
  - 支持动态参数
  - 分割路由文件

  #### koa-router怎么用？

  - 基本使用：配置get/post请求
  - 分模块分层配置路由
  - 处理接口路径中的动态参数
  - 结合fs模块实现路由文件的分割

  #### 怎么做到的？

   核心方法
   - register()
   - verb()
   - routers()
   - allowMethods()

### 2.4.2 koa-bodyparser

- 解析request.body内容，方便取用

- Koa-bodyparser提供的能力

  - 解析用户发过来的数据body部分
  - 支持text/json/xml/form
  - 支持body解析配置

- app.use(bodyParser)

#### 怎么做到的？

获取二进制数据流->解压缩inflation->解码iconv-lite->字符串解码

### 2.4.2 koa-session

- 保存用户的登录状态

- koa-session 基本流程

 - 根据cookie或者外部存储初始化cookie。
 - 调用next()执行后面的业务逻辑，其中可以读取和写入新的session内容。
 - 调用commit()把更新后的session保存下来。

### 2.4.3 扩展资料

[浅析koa的洋葱模型实现](https://segmentfault.com/a/1190000013981513)

[koa2学习笔记（二）使用koa-router](https://juejin.im/post/5cd11420f265da036d79d0f3)

[Koa-bodyparser 源码](https://github.com/koajs/bodyparser)

[玩转Koa-bodyparser 原理解析](https://juejin.im/post/5c3de636f265da6179750d2b)

[Koa-session源码](https://github.com/koajs/session)

## 2.5 koa 常见的中间件2

### 2.5.1 koa-error

更优雅的错误抛出方式

- Koa内置的错误处理逻辑ctx.app.emit(error)
- UnhandledPromiseRejecticonWarning处理
- Koa-error支持将错误通过GUI形式返回

### 2.5.2 koa-logger

- app.use(logger())
- 拦截请求/响应，输出带颜色的日志
- log4js丰富日志输出
  - 访问日志accesslog
  - 系统级错误日志
  - 应用级节点日志

### 2.5.3 koa-proxy

#### 代理请求

- 开发中，代理后端服务，使用mock
- 上线后，通过Node将请求转发到java服务
- 代理请求解决跨域限制

### 2.5.4 扩展资料

[Koa-error 源码](https://github.com/koajs/error#readme)

[koa2 中的错误处理以及中间件设计原理](https://www.52cik.com/2018/05/27/koa-error.html)

[koa-logger源码](https://github.com/koajs/logger)

[Node.js 之 log4js 完全讲解](https://juejin.im/post/57b962af7db2a200542a0fb3)

[koa-proxy源码](https://github.com/popomore/koa-proxy)

