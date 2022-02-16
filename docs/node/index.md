## 1.1 Nodejs 简介

### 1.1.1 安装node

#### Mac

1. MacOS-installer.pkg 官方提供的安装包
2. HomeBrew 命令安装到全局 
3. nvm 管理版本，方便切换（推荐）

```bash
# 安装nvm
sudo curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
# nvm安装node
nvm install --lts
# 如果显示没有发现这个命令，就编辑.bash_profile
 vim .bash_profile
# 把以下复制进去，wq保存退出，如果不了解vim编辑，可以谷歌
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
# 然后 source 一下 .bash_profile
source .bash_profile
```
#### winndow

1. Windows-installer.msi 官方安装包，快速开始，推荐使用
2. nvm-windows windows版本的nvm，社区维护不稳定
3. Cmder 集成命令行工具 （推荐）
4. WSL Window提供的内置Linux运行环境，配合VSCode （推荐）
5. Windows Terminal

### 1.1.2 node版本选择

LTS是稳定版本，Current最新版本

### 1.1.3 Nodejs模块机制及包管理器

#### nodejs 模块机制

- Node应用由模块组成，采用CJS/ESM模块规范来组织
- 每个文件就是模块，有自己的作用域
- 每个文件里面定义的变量、函数、类都是私有的，对其他文件不可见
- 在Node中，模块的加载是运行时同步加载的
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了

#### 模块加载机制 require/export

![](~@/node/require.png)

在一个文件`require`一个包的时候（const xx =require('xx')），node会看require里的路径类型，
1. 如果是一个内置模块，就直接返回这个内置模块，例如：path、fs等。
2. 如果是相对路径或者绝对路径，node会先把相对路径转换成绝对路径，会在当前路径下查找是否有xx文件，如果存在就返回，如果没找到会把xx当作目录，在这个目录下查找index文件，找到就返回，没找到就Can't find。
3. 如果没有路径就是我们的第三方模块，根据所在的父模块确定安装目录，在目录中查找入口文件，这个入口文件就是index.js或main.js,bin下的文件，这个文件由package.json来指定。

在node处理模块加载的时候，还有缓存的概念，就是说缓存中存在了，就直接返回；内置模块直接加载；根据找到文件创建新的模块并缓存。

#### nodejs包管理器

- npm 代指Node的模块生态，又代指模块安装CLI工具
- 通过package.json来描述项目的基本配置信息和依赖，组成树状结构
- 使用nvm管理node版本，使用nrm管理npm源，使用npx执行命令
- 使用scripts组织工程化脚本入口

### 1.1.4 Nodejs的能力

![](~@/node/nodeability.png)

## 1.2 Nodejs提供的原生API能力（上）

#### node架构

![](~@/node/node-framework.png)

### 1.2.1 了解Nodejs提供的数据类型

#### 1. Nodejs数据类型-Buffer

- 流式数据（非一次性加载完成的数据）由于产生和使用不一定同速，所以需要缓存
- 存储需要临时占用大量内存的数据，内存中开辟的一片区域，用于存放二进制数据
- 流的生产者与消费者之间的速度通常是不一致的，因此需要buffer来暂存一些数据
- buffer大小通过highWaterMark参数指定，默认情况下是16kb

![](~@/node/buffer.png)

:tomato: 创建buffer

- Buffer.from(buffer | array | string) 使用堆外内存新增Buffer
- Buffer.from(arrayBuffer) 浅拷贝arrayBuffer，共享内存

- Buffer.alloc(size) 分配一个指定大小的Buffer,默认值0，使用UTF-8编码
- Buffer.allocUnsafe(size) 分配一个初始化的Buffer

- 流式数据会自动创建Buffer，手动创建Buffer需谨慎
 
:tomato: 创建Buffer-坑

- 预分配一个内部的大小为Buffer.poolSize(8k)的Buffer实例，作为快速分配的内存池
- 如果allocUnsafe/from(array)的size小于4k，则从预分配的池子中分配

- 绕开V8回收机制，使用专用回收机制，提高性能和内存使用效率
- 但这种玩法会导致未初始化的数据块投入使用，造成数据泄露风险

:tomato:  使用Buffer

- 转换格式
  - 字符串：编码Buffer.from(string),解码buf.toString()
  - JSON:buf.JSON()

- 剪裁和拼接
  - 剪裁：Buffer.slice()表现与Array.slice()不同，返回Buffer与原buf共享内存
  - 拼接：buf.copy/buf.concat 返回新的Buffer

- 比较和遍历索引
  - 判断相等：buf1.equals(buf2) 比较的是二进制的值
  - 索引：使用buf[index]形式进行索引，for...of/indexOf/includes等Array方法也可以使用

#### 2. Nodejs数据类型-Stream

- Stream 模块提供的是抽象接口，有很多模块实现了这个接口
- Stream 就是解决生产者和消费者问题的一种方式，解决异步IO问题
- Stream 模块对于流的使用者而言无需关心 readableSrc.pipe(writableDest)

![](~@/node/buffer.png)

#### 3. Nodejs数据类型-event/EventEmitter

![](~@/node/eventEmitter.png)

event只提供了EventEmitter一个对象，相当于事件触发，会触发很多事件，触发事件会进入EventLoop，一旦触发会被Event handlers捕获。
EventEmitter的核心就是事件触发的Emitter，事件监听的on功能进行封装，一个简单的EventEmitter绑定一个监听器，然后去监听事件。

#### 4. Nodejs数据类型-Error

:tomato: 错误类型

  - 标准的javascript错误，比如：SyntaxError/ReferenceError
  - 底层操作触发的系统错误，比如：文件读写
  - 用户自定义错误
  - 异常逻辑触发的AssertionError，通常来自assert模块

:tomato: 错误冒泡和捕获
   
   - 所有通过Node.j或javaScript运行时抛出的异常都是Error实例
   - 大多数的异步方法接受一个callback函数，该函数会接受一个Error对象传入作为第一个参数

#### 5. Nodejs数据类型-URL

  - 弃用urlObjects，该用WHATWG URL
  - 使用URLSearchParams操作参数

  ```js
    //  案例：截取params1和params2=2  https://hejialianghe.github.io?params1=1&params2=2
   // 1.截取url上的参数（老方法）
    const _query=url.parse(req.url).query
    // _query 拿到的是params1=1&params2=2，url.parse(req.url).pathname，可以拿到https://hejialianghe.github.io?
    Querystring.parse(_query)['params1']
    // 2.使用URLSearchParams操作参数
    Object.fromEntries(new URLSearchParams(_query))
    // {params1:1,params2:2} 
  ```

#### 6. Nodejs数据类型-global

 - 看上去像是全局变量的存在，实际上仅存在于模块的作用域中

  `__dirname、__filename、exports、module、require()`

- 从javaScript继承而来的全局变量

 `console、timer全家桶、global（容器）`

- Nodejs特有的全局变量

`Buffer、process、URL、WepASSembly`


这些可以不用太深入，至少有这个概念，node架构最底层的数据类型，其实有这些数据类型，在上层去实现复杂的业务逻辑的时候；就可以调用这些数据类型，这是node帮我们封装好的；不用在再去造轮子。

### 1.2.2 Nodejs 工具库

#### Nodejs工具库-util

本是内置模块开发时的公共工具集，现在开放给开发者使用

:tomato: 风格转换

  - promisify<=>callbackify、TextEncoder<=>TextDecoder

:tomato: 调试工具

 - debuglog、inspect、format、getSystemErrorName

:tomato: 类型判断

 - types.isDate(value)

 #### Nodejs断言等价-assert

 内置断言库，需要配合测试框架使用，主动抛出AssertionError错误

 :tomato: 断言真假

 - assert(value,msg),match(string,reg)

 :tomato: 断言等价

 - strictEqual/deepStrictEqual以及相反操作equal/deepEqual弃用

 :tomato: 断言成功失败

 - fail/throws doesNotThrow/ifError/rejects

#### Nodejs工具库-querystring

官方提供的解析和格式化URL查询字符串的实用工具

- 查询字符串转键值对 querystring.parse(str[,sep[eq[,options]]])

- 键值对转查询字符串 querystring.stringify(obj)

### 1.2.3 Nodejs的文件操作能力

#### Nodejs的文件操作能力-os

- os模块提供了与操作系统相关的实用方法和属性

- 通过兼容的方式调用不同平台的底层命令，形成系统快照

  `cpus、platform、type、uptime、userInfo`

- 定义操作系统级别的枚举常量

 `信号常量SIG*、错误常量E*、windows特有WSA*、优先级PRIORITY_*`

#### Nodejs的文件操作能力-fs

- fs模块模拟Linux环境，提供了用于与文件系统进行交互的API
- 所有的文件系统操作都具有同步和异步的形式
- URI作为特殊的文件也可以被fs模块实用
- 操作文件夹
  - mkdir/rmdir
- 操作文件
  - chmod/open/read/write

### 1.2.4 Nodejs的文件操作能力

 [MDN 中提供的 Nodejs 课程](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs)

  [Nodejs中文文档站点](http://nodejs.cn/)

  [Nodejs安装详解](https://juejin.im/post/5d4fb52c518825219c281bd1)

  [Nodejs优秀项目集合](https://github.com/sindresorhus/awesome-nodejs)

## 1.3 Nodejs提供的原生API能力（下）

### 1.3.1 Nodejs的模块机制及原理

#### Nodejs的模块机制-CommonJS

- 模块引用

 通过require（module）来引入module

- 模块定义

通过挂载在module.exports对象上实现定义

- 模块标识

通过路径标识引入的是哪个模块

在node引入一个模块会经历下面这4个阶段

![](~@/node/moduleme.png)

#### 路径分析

- 内置模块

 - 在Node进程开始的时候就预加载了
 - 加载的是二进制文件，需要定位和编译

- 文件模块

 - 通过NPM安装的第三方模块
 - 本地模块

- 模块内容

 - 函数、对象或者属性，如函数、数组甚至任意类型的JS对象

#### 模块加载优先级

![](~@/node/modulepriority.png)

#### 模块文件定位

![](~@/node/moduleLocation.png)

#### 编译模块执行

- .js 文件：
  - 通过fs模块同步读取后编译执行，未识别类型也会当作js处理

- .json 文件：
  - 通过fs模块同步读取后，用JSON.parse()解析并返回结果

- .node 文件：
  - 这是用C/C++写的扩展文件，通过process.dlopen()方法加载最后编译生成的

#### 模块js文件的编译

- 注入全局变量
  - 以参数形式，注入module/exports/require方法
  - 同时注入路径解析时得到的__filename/__dirname
- 构造上下文执行环境
  - 闭包产生作用域，通过runlnThisContext()执行
  - 将function对象挂载到exports对象上，并导出

#### 加入缓存以及清除缓存

- 核心模块
  - 登记在NativeModeule._cache上

- 文件模块
  - 封装后的方法以字符串形式存储，等待调用

- 清除缓存
  - 通过delete require.catch[require.resolove(module)]

#### import vs require

- import 
  - ES6规范
  - 静态加载模块
  - 编译的时候执行代码 
  - 缓存执行结果
  - 按需引入，节省内存

- require
  - commonJS规范
  - 动态加载模块
  - 调用的时候加载源码
  - 加载全部代码

  ### 1.3.2 Nodejs的网络编程能力

  #### 网络模型 OSI & TCP/IP

 ![](~@/node/networkmodel.png)

  #### Soket

  - 实现底层通信，几乎所有的应用层都是通过socket进行通信
  - 对TCP/IP协议进行封装，向应用层协议暴露接口调用
  - TCP/IP协议中，传输层存在两种通用协议：TCP、UDP
  - 两种协议不同，因为不同参数的socket实现过程也不一样

  #### Nodejs网络基础模块-net/dgram

  - net 模块是TCP/IP的Node实现，提供一些用于底层的网络通信的小工具
  - http.Server 继承自net.Server
  - http 客户端与http服务端的通信均依赖与socket（net.Socket）
    - net.Server: TCP server,内部通过socket来实现与客户端的通信
    - net.Socket: 本地socket与node版实现，它实现了全双工的stream接口

 #### Nodejs网络基础模块-net.Socket

  - net.Socket 对象是TCP或UNIX Socket 的抽象
  - net.Socket 实例实现了一个双工流接口

  - API归纳
    - 连接相关connect
    - 数据读写 write
    - 数据属性 bufferSize
    - 地址相关 address

 #### Nodejs网络基础模块-http/https/http2

 - Http模块是Node的门脸，是编写Web Server最常见的模块
 - Server部分继承自net.Server,并对请求和响应数据进行封装
 - 也提供了request/get的能力，允许向其他服务端发起HTTP请求
 - Node封装了HTTPS/HTTP2的实现，可以轻松创建类HTTP服务

  ### 1.3.3 的进程管理

  #### 操作系统的进程和线层

  - 运行任务的程序叫做“进程”，一个进程只能执行一个任务
  - 进程并发：以多进程形式，允许多个任务同时运行
  - 线层并发：以多线程形式，允许单个任务分成不同的部分运行
  - 操作系统提供协调机制，防止冲突，共享资源
  - javascript是单线层语言，所以多个任务只能排队运行

  #### 多进程vs多线程

| 维度  |  多进程  | 多线程 | 比较 | 
| :---: | :--------: | :------: | :---: | 
|  数据共享  | 数据共享复杂，需要用IPC；数据是分开的，同步简单 |  因为共享进程数据，数据共享简单，同步复杂  |  各有千秋   |
|  资源利用  | 占用内存，切换复杂，CPU利用率低 |  占用内存少，切换简单，cpu利用高  |   多线程更好  |
|  性能开销  | 创建销毁、切换复杂、速度慢 | 创建销毁、切换简单、速度很快  |   多线程更好  |
|  编码实践  | 编码简单、调试方便 |  编码、调试复杂  |   多进程更好  |
|  可靠性  | 进程独立运行，不会相互影响 |  线程呼吸共命运  |  多进程更好   |
|  分布式支持  | 可用于多机多核分布式，易于扩展 |  只能用于多核分布式 |   多进程更好  |

#### Event Loop

- javascript通过EventLoop的形式解决单线程任务调度问题
- EventLoop是一个程序结构，用于等待和发送消息和事件
- 浏览器的Event loop和Node的Event loop是两个概念

#### 浏览器的Event Loop

![](~@/node/browserEventloop.png)

#### Nodejs-Event Loop

![](~@/node/nodeventloop.png)

node采用v8作为js解析引擎，io处理方面用到了自己的LIBUV，LIBUV是跨平台的抽象层，封装了不同平台的底层特性，对外提供了统一的api；事件循环机制也是它里面实现的，所以v8引擎解析js脚本，解析后的代码调用nodeAPI；LIBUV库负责nodeAPI的执行，将不同的任务分配给不同的线程形成一个Eventloop，将不同的任务分配给不同的线程，以异步的形式将结果返回给v8，v8在将结果返回给用户；LIBUV引擎分为6个阶段，它会按照顺序反复执行，每当
进入某个阶段的时候，都会从对应的回调队列中抽取函数去执行，当队列为空或回调函数达到系统设置的值的时候，就会进入下一个阶段

#### Nodejs进程-process

- Process是一个全局的对象，无需require直接使用，提供进程描述
- process对象是EventEmiter的实例，暴露了进程事件的钩子
   - exit 监听进程退出
   - uncaughException 监听异常
- 提供标准的输出，对应的是进程的I/O操作
  - node版本的console底层是由stdio实现的
  - 数据流与其他双工数据流不同，同步写会阻塞进程导致性能开销

#### Nodejs进程创建-child_process(子进程)/cluster

- child_process 是 Node.js的内置模块
  - spawn：适用于返回大量数据，例如图像处理，二进制数据处理
  - exec：适用于小量数据，maxBuffer默认值为200*1024超出崩溃
  - fork：衍生新的进程，进程之间是相互独立的，每个进程独立

- cluster 是Node.js 的内置模块
  - Worker 对象包含了关于工作进程的所有公共的信息和方法
  - fork：衍生新的进程，进程之间是相互独立的，每个进程独立
  - 使用主从模型轮询处理服务的负载任务，通过IPC通信

#### 进程守护

pm2

### 1.3.4 扩展资料

  [浏览器与Node的事件循环(Event Loop)有何区别?](https://blog.fundebug.com/2019/01/15/diffrences-of-browser-and-node-in-event-loop/)

  [Nodejs原生模块整理](https://itbilu.com/nodejs/core/N1tv0Pgd-.html)

  [Nodejs中的模块机制](https://juejin.im/entry/5b4b5081e51d451984696cb7)

  [深入理解Nodejs中的进程与线程](https://juejin.im/post/5d43017be51d4561f40adcf9)

  [Nodejs中文文档站点](http://nodejs.cn/)

## 1.4 Nodejs原生Web Server实战

### 1.4.1 Web Server的构成

- 处理HTTP：对HTTP的动词（GET/POST/PUT）进行响应
- 路由管理：分别处理不同URL路径的请求，返回对应的网络资源
- 静态文件托管：对网络请求的静态资源进行响应或使用模版动态响应请求
- 文件数据存储：将请求携带的数据存储到文件或则数据库中

#### Web Server的基本架构

![](~@/node/baseFramework.png)

### 1.4.2 Web Server的优势

- 并发性能优势
  
  基于事件驱动的服务在响应请求的场景中有极高的并发性能表现

- javascript

 减少学习成本，使用最流行的javascript或其他可编译/转换为javascript的语言均可实现

- 生态活跃完善

npm提供了数十万个可重用的工具包，它还提供了一流的依赖解决方案，可实现自动化工具链构建

- 代码可移植

兼容各种操作系统运行环境，一份代码可以运行在多种环境中

- 框架高度包容

Node及Node的Web框架都拥有天然的包容性，易于扩展和维护

- 友好的社区氛围

丰富的生态诞生了大量的开源社区，聚集了众多优秀的开发人员

### 1.4.3 Web Server的最小系统

#### 1. 一个简单的http服务
```js
    var http=require('http')
    http.creareServer(function(req,res){
        res.write('Hello World')
        res.end()
    }).listen(1000)
```
1. 执行 `node index.js`运行，浏览器访问`http://localhost:1000/`,

2. 也可以下载包`nodemon`运行，全局安装的话，运行方式`nodemon index.js`;局部安装的话用npx运行`npx nodemon index.js`;也可以在package.json里配置`script`运行，`"dev": "nodemon index.js"`

#### 2. 实现路由处理和静态资源托管

```js
const http=require('http')
const url =require('url')
const fs=require('fs')
const path =require('path')
// 404处理
const noFound = (req,res)=>{
    fs.readFile(path.join(__dirname,'404.html'),(err,data)=>{
        if(err){
            res.write(404,'no found')
        }else {
            // res.writeHead(200,{'Content-type':"text/html;charset='utf-8'"})
            res.writeHead(200,{'Content-type':"text/html;charset=utf-8"})
            res.write(data)
            res.end()
        }
    })
}
http.createServer((req,res)=>{
    // 1.路由处理
    // 2.静态资源托管

    // url.parse解析后会返回一个url对象，pathname是什么？
    // 例如：http://nodejs.cn/api/url.html#url_u，pathname是指/api/url.html#url_u
    var pathName=url.parse(req.url).pathname
    if(pathName ==='/'){
        pathName=path.join(__dirname,'index.html')
    }
    // extname返回扩展名，就是.后面的,如果没有.就返回空字符串
    const extName=path.extname(pathName)
    if(extName === '.html') {
        fs.readFile(pathName,(err,data)=>{
            if(err){
                noFound(req,res)
            }else {
                res.writeHead(200,{'Content-type':"text/html;charset=utf-8"})
                res.write(data)
                res.end()
            }
        })
    }


}).listen(1000)
```

#### 3. 实现http verb 和 store

```js
// 源文档：examples/node/1.4/mini_node
const http=require('http')
const url =require('url')
const fs=require('fs')
const path =require('path')
const qs=require('qs')

const writeDb=(thunk)=>{
    fs.appendFile(path.join(__dirname,'db'),thunk,(err) => {
        if (err) throw err;
        console.log('数据已被追加到文件');
      })
}
http.createServer((req,res)=>{
    // 3.HTTP verb
    // 4. store
    // url.parse解析后会返回一个url对象，pathname是什么？
    // 例如：http://nodejs.cn/api/url.html#url_u，pathname是指/api/url.html#url_u
    var pathName=url.parse(req.url).pathname

    if(pathName.startsWith('/api')){
        const method=req.method
        if(method==='GET'){
            const query= qs.parse(url.parse(req.url).query)
            const resData ={
                code:200,
                data:query,
                msg:'sucess'
            }
            res.end(JSON.stringify(resData))
        } else if(method==='POST'){
            const contentType=req.headers['content-type']
            
            if(contentType===  'application/json'){
                let postData=''
                req.on('data',(thunk)=>{
                    postData+=thunk
                    writeDb(thunk)
                })
                req.on('end',(thunk)=>{
                    res.end(JSON.stringify({
                        code:200,
                        data:postData,
                        msg:'sucess'
                    }))
                })
            }
          
        }
        
    }
}).listen(1000)
```

### 1.4.3 扩展

[Nodejs官网 http模块](http://nodejs.cn/api/http.html)

[Node.js超详细零基础教程(1)—处理GET、POST请求](https://juejin.im/post/5d5277a7f265da03cd0a74a7)

[尝试手写一个 nodejs http-server](https://juejin.im/post/5b75739ee51d45554762288e)

## 1.5 使用Express搭建Web server

### 1.5.1 Express 框架概览

- 高度包容，快速而简单的Node.js Web框架
- 拥有稳定可靠丰富的社区和中间件生态
- 易于学习，可定制程度高，开箱即用
- 精巧的Express为Web和移动应用程序提供了一组强大的功能

### 1.5.2 Express的能力

- 封装http模块，方便地创建Web应用
- 通过中间件机制实现可扩展性
- 提供路由机制，便于组织业务应用
- 提供多种模版引擎，支持了静态文件的渲染和托管
- 便于添加错误处理，方便对系统进行容错处理
- 便于添加数据库连接，操作数据库数据

#### Express中间件

- 路由和中间件是Express的基础，路由是特殊的中间件

- Express是一系列中间件函数调用的过程

- 中间件是对处理过程的封装，输入请求对象/响应对象，通过next进入下一个中间件处理过程

- 使用app.use()将中间件注册到应用实例上，路由中间件注册到路由实例上

![](~@/node/routerMiddle.png)

#### 编写Express中间件

![](~@/node/writeMiddle.png)

#### Express 路由机制

- 路由是一段Express代码，它将http动词、URL路径/模式和处理函数三者关联起来

- Express的应用程序设计要从路由设计入手，将服务的能力描述起来

- 还可以使用Router中间件，实现路由逻辑模块化设计

![](~@/node/routingMe.png)

#### Express 性能评估

![](~@/node/preform.png)

#### Express 最佳实践

- 使用中间件压缩响应数据，在反向代理层做最佳

- 避免在业务逻辑处理中使用同步阻塞操作

- 引入完善的基建保障，记录日志，处理异常

- 需要重启的时候立即重启，保证程序可以自动重启启动

### 1.5.3 Express Web Server实战

- 实现一个可以生成邮件的模版管理系统
- 有配置界面，可以沉淀业务域中的邮件模版，可以新增模版
- 可以预览最终的邮件样式

![](~@/node/requirement.png)

#### 邮件模版系统-功能设计

![](~@/node/fundesign.png)

### 1.5.4扩展学习

[MDN 中提供的 Express 课程](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/Introduction)

[使用 Node.js + Express 搭建一个简单的微博网站](https://cythilya.github.io/2014/11/23/nodejs-express-microblog/)

[NodeJS express框架核心原理全揭秘](https://zhuanlan.zhihu.com/p/56947560)

## 1.6 使用Nodejs编写 RESTful API

### 1.6.1 RESTful API

rest是暴露服务端资源的一种约定方式，同时提供获取这种资源的动词，基于rest架构的web server api，我们就称为RESTful API。

#### REST概念

- URI资源定位

REST是面向资源，而资源通过URI进行暴露

- 链接资源状态

服务器生成包含状态转移的表征数据，用来响应客户端对一个资源的请求，客户端可据此了解状态转移的方式

- 使用HTTP已有特性

REST很用利用了HTTP本身的一些特性，如HTTTP动词、HTTP状态码、HTTP头部信息

- 统一资源规范

包含一组受限的预定义的操作，资源都通过使用项目接口进行资源的访问

#### 充分利用HTTP描述URI资源

![](~@/node/httpres.png)

### 1.6.2 REST 工程实践

### REST 接口设计-路由

```js
   //接口要遵循http动词
  GET /xhr/v1/templateList // 获取模版列表
  GET /xhr/v1/templateDetail?id=xx   // 模版单个模版详情
  POST /xhr/v1/templateCreate // 创建模版
  PUT  /xhr/v1/templateChange/1 // 修改模版,
  DELETE /xhr/v1/templateDelate/1 // 删除模版
```

### 数据表设计-封装数据服务

- 选用MongoDB存储数据
- 引用mongoose构建数据模型

- 邮件模版Schema
  - id String 唯一识别邮件模版的id
  - template text 可支持HTML
  - data  邮件模版中填充的数据

  ### 1.6.3 REST 最佳实践

 - 充分理解并使用HTTP请求
 - 使用API测试工具而非浏览器测试你的API接口
 - 选择合适的文档生成工具，删除API文档
 - REST只是规范并不强制，最合适团队的才是最好的
 - 找个实践REST较好的框架胜过自己造轮子

:tomato: 开始实战

1. 项目结构

 ```bash
  ├── server    
  │   ├──  middleware # 自己写的中间件；可以用于处理一些业务逻辑
  │   ├──  model      # 数据模型，接口的数据模型
  │   ├──  routes     # 接口的业务代码
  │   ├── index.js    # 入口文件
  └─ package.json     # 管理项目运行的依赖、及描述信息                                  
 ```
 2. 下载所需要的依赖

`yarn add express mongoose nodemon body-parser`

mongoose ：简化操作mongodb的库

body-parser：处理post请求时返回thunk，它会自动帮我们加入res.body中

```json  
用nodemon启动项目，当我们保存时，nodemon会帮助我们启动项目
"scripts": {
    "dev": "nodemon server/index.js",
  }
```

3. 编写入口文件index.js

编写入口文件，需要连接数据库，这里我们使用mogodb，mongodb的安装教程在本文的最下面，当然会mysql，也可以用mysql。

```js
const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const templateRouter=require('./routes/template')
const app=express()
// 连接mongodb，temp是我们数据库的名称
mongoose.connect('mongodb://127.0.0.1:27017/temp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
var db=mongoose.connection
db.on('error',function(){
    console.log('监听错误');
})
// 监听mogodb是否连接成功
db.once('open',function(){
    console.log('数据库连接成功');
})
// 我们编写的中间件，提供$sucess和#error来处理返回的数据
require('./middleware/index')(app)
// 用bodyParser处理post请求，处理返回chunk
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}))
// 我们的路由前缀/xhr/v1/，如果匹配在url中匹配到了/xhr/v1/，就会进入子路由templateRouter
app.use('/xhr/v1/',templateRouter)
// 前面都没有匹配到调用next()就会进入下一个中间件
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})
app.listen(2000,()=>{
    console.log('server is running on http://localhost:2000')
})
```
4. 在model中编写数据模型

```js
// 数据模型
const mongoose=require('mongoose')
const templateSchema=mongoose.Schema({
    name:String,
    template:String,
    data:String
})
//第一个参数 当前模型名称，第二个参数 schema
module.exports=mongoose.model('template',templateSchema)

```
5. 编写处理返回数据的中间件

```js
// 处理错误的中间件
module.exports=(req,res,next)=>{
    res.$success=(data,code=200)=>{
        const _data = {
            code
        }
        if(typeof data==='object'){
            _data.msg='sucess'
            _data.data=data
        }else {
            _data.msg=data
        }
        res.json(_data)
    }
    res.$error=(err,code=500)=>{
        const _data = {
            code
        }
        if(typeof data==='objcet'){
            _data.msg='error'
            _data.data=JSON.stringify(err)
        }else {
            _data.msg=err
        }
        res.json(_data)
    }
    next()
}
```
6. 在routes编写业务接口

```js
  // 路由模块，业务模块
const express=require('express')
const router=express.Router()
const Template=require('../model/template')

// 查询模版列表
router.get('/templateList',async (req,res,next)=>{
    const temps=await Template.find({}).sort({update_at:-1})
    res.$success(temps)
})
// 创建模版
router.post('/templateCreate',async (req,res,next)=>{
    const temps =await Template.create(req.body)
    res.$success(temps)
})
// 查询模版详情
router.get('/templateDetail',async (req,res,next)=>{
    const { id }=req.query
    const temps = await Template.findById({_id:id})
   res.$success(temps)
})
// 更新模版
router.put('/templateChange/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndUpdate({_id:id},req.body,{
        new:true
    })
   res.$success(temps)
})
// 删除模版
router.delete('/templateDelate/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndRemove({_id:id})
   res.$success(temps)
})
module.exports=router
```

7. 其它

测试接口可以用postman

```json
请求创建模版接口示例：http://localhost:2000/xhr/v1/templateCreate
在headers要加入Content-Type:application/json
请求的参数：
{
	"name":"test1",
	"template":"<h1>express<h1>",
	"data":"{name:'test1'}"
	
}
返回的数据，其中_id是mongodb为我们创建的
{
    "code": 200,
    "msg": "sucess",
    "data": [
        {
            "_id": "5f2c19c81a53ff25e7d94953",
            "name": "test1",
            "template": "<h1>express<h1>",
            "data": "{name:'test1'}",
            "__v": 0
        }
    ]
}
```
```js
// 源码地址
 https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/node/1.6

```

:tomato: 安装mongodb

 <font color="red">**window下安装mongodb**</font>

<font color="blue"> 1. 下载安装</font>

 传送门：https://www.mongodb.com/download-center/community

<font color="blue"> 2. 配置数据库数据存放目录和日志存放目录</font>

例如在D盘下创建数据目录 

mkdir D:\data\db

创建日志目录  

mkdir D:\data\log

数据和日志放哪都可以，不一定是D盘

<font color="blue"> 3. 配置mongod.cfg</font>

进入C盘C:\mongodb目录下创建mongod.cfg文件，并把以下内容复制进去

```bash
storage:
  dbPath:  D:\data\db
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path:  D:\data\log\mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
# 权限验证,是否用密码连接数据库，开始不要设置密码，如果设置权限验证，就把#去掉
#security:
    #authorization: enabled
```

<font color="blue"> 4. 安装mongodb服务</font>

在C:\mongodb\bin目录下打开shell，并执行以下命令

mongod.exe --config "C:\mongodb\mongod.cfg" --install

启动mongodb服务

net start MongoDB

如果执行成功，会输出以下信息

2015-09-25T15:54:09.212+0800 I CONTROL  Hotfix KB2731284 or later update is notinstalled, will zero-out data files2015-09-25T15:54:09.229+0800 I JOURNAL  [initandlisten] journal dir=c:\data\db\j
ournal2015-09-25T15:54:09.237+0800 I JOURNAL  [initandlisten] recover : no journal fil
es present, no recovery needed2015-09-25T15:54:09.290+0800 I JOURNAL  [durability] Durability thread started2015-09-25T15:54:09.294+0800 I CONTROL  [initandlisten] MongoDB starting : pid=2488 port=27017 dbpath=c:\data\db 64-bit host=WIN-1VONBJOCE882015-09-25T15:54:09.296+0800 I CONTROL  [initandlisten] targetMinOS: Windows 7/W
indows Server 2008 R22015-09-25T15:54:09.298+0800 I CONTROL  [initandlisten] db version v3.0.6

<font color="blue"> 5. 其它指令</font>

net stop MongoDB //关闭MongoDB服务

mongod.exe --remove  //移除 MongoDB 服务，要在C:\mongodb\bin目录下打开shel执行该命令或点击mongo.exe 

mongo.exe //进入mongodb管理后台，要在C:\mongodb\bin目录下打开shell执行该命令或点击mongo.exe 

<font color="blue"> 6. window版数据库管理工具navicatmongodb</font>

链接: https://pan.baidu.com/s/14NYuD-rkG7p4YsX3UZgBOA 提取码: xeah

<font color="red">**mac下安装mongodb（linux上同理）**</font>

<font color="blue"> 1. mac下安装mongodb</font>

手动安装

传送门：https://www.mongodb.com/download-center/community

1.打开finder按shift+command+g 输入/usr/local 进入这个目录下

2.在/usr/local下创建mongodb文件夹

3.把下载好的包拖入/usr/local/mongodb目录下

4打开命令行输入cd /usr/local/mongodb

5.解压

sudo tar zxvf mongodb-linux-x86_64-rhel70-4.2.0.tgz //解压，手动点击也可以

6.修改文件名

sudo mv mongodb-linux-x86_64-rhel70-4.2.0 mongodbserver  //修改文件名，手动修改也可以

<font color="blue"> 2. 创建data和log</font>

sudo mkdir data  //创建data文件

sudo mkdir log  //创建log文件

<font color="blue"> 3. 在/usr/local/mongodb/目录下创建配置文件mongod.conf</font>

1.vim  /usr/local/mongodb/mongod.conf //编辑文件，命令行中执行

2.输入i 进入输入模式

3.把以下内容复制到mongod.conf文件里

```bash
  dbpath=/usr/local/mongodb/data/  #数据存放路径 
  logpath=/usr/local/mongodb/log/mongodb.log #日志存放路径
  fork=true #后台运行 bind_ip=0.0.0.0 #允许任何IP进行连接 
  auth=false #true是要进行密码验证连接数据库，false不需要
```
4.按esc 进入编辑

5.按 ：进入末尾

6.按 wq 进行保存并退出

<font color="blue"> 4. 配置全局环境变量</font>

1.vim /etc/profile //进入编辑profile模式，命令行中执行

2.把以下内容复制到profile中

export PATH=$PATH:/usr/local/mongodb/mongodbserver/bin

3.按esc 进入编辑,.按 ：进入末尾,按 wq 进行保存并退出

4.source /etc/profile //重新加载,命令行中执行

<font color="blue"> 5. 启动mongodb</font>

mongod --config /usr/local/mongodb/mongod.conf //命令行中运行

显示：child process started sucessfully，parent exiting 说明运行成功

查看mongodb是否启动成功

ps -ef | grep mongodb 

ps -axu |grep mongo  获取进程号

<font color="blue"> 6. 创建数据库</font>

```bash
mongo # 连接数据库
use temp #temp就是我们创建的数据库，用show dbs 查看数据库是不显示的，因为里面没有数据
```

<font color="blue"> 7. 其他指令</font>

mongorestore -h 127.0.0.1:27017 -d testdata --drop /home/data/  // 导入数据，testdata是数据库的名称，/home/data/是老数据存放地址

mongod --shutdown --dbpath  /usr/local/mongodb/data/ //关掉服务

数据库用户及权限管理

提示：如果想进行账号密码连接数据库，请看1，2，3，4，,5设置密码后请修改

mongodb.conf 里的配置项auth=true

``` js
1.mongo //命令行输入

2.use admin //进入admin

3.db.createUser({user:"xxx",pwd:"xxx",roles:[{role:"userAdminAnyDatabase",db:"admin"}]}); //创建超级管理员

4.use testdata //进入testdata数据库

5.db.createUser({user:"xxx",pwd:"xxx",roles:[{role:"readWrite",db:"testdata"}]});//建立testdata数据库管理员

db.auth("xxx","xxx") //创建完成后可以进行管理员验证，看是否设置成功

db.changeUserPassword("xxx","xxxx"); //修改用户密码
```

show users //查看已有用户

show dbs  //查询数据库列表

<font color="blue"> 8. mac下数据库管理工具Robo</font>

传送门：https://robomongo.org/download