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

### 1.2.1 了解Nodejs提供的数据类型

#### 1. Nodejs数据类型-Buffer

- 流式数据（非一次性加载完成的数据）由于产生和使用不一定同速，所以需要缓存
- 存储需要临时占用大量内存的数据，内存中开辟的一片区域，用于存放二进制数据
- 流的生产者与消费者之间的速度通常是不一致的，因此需要buffer来暂存一些数据
- buffer大小通过highWaterMark参数指定，默认情况下是16kb

![](~@/node/buffer.png)

🚀 创建buffer

- Buffer.from(buffer | array | string) 使用堆外内存新增Buffer
- Buffer.from(arrayBuffer) 浅拷贝arrayBuffer，共享内存

- Buffer.alloc(size) 分配一个指定大小的Buffer,默认值0，使用UTF-8编码
- Buffer.allocUnsafe(size) 分配一个初始化的Buffer

- 流式数据会自动创建Buffer，手动创建Buffer需谨慎
 
🚀 创建Buffer-坑

- 预分配一个内部的大小为Buffer.poolSize(8k)的Buffer实例，作为快速分配的内存池
- 如果allocUnsafe/from(array)的size小于4k，则从预分配的池子中分配

- 绕开V8回收机制，使用专用回收机制，提高性能和内存使用效率
- 但这种玩法会导致未初始化的数据块投入使用，造成数据泄露风险

🚀  使用Buffer

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

🚀 错误类型

  - 标准的javascript错误，比如：SyntaxError/ReferenceError
  - 底层操作触发的系统错误，比如：文件读写
  - 用户自定义错误
  - 异常逻辑触发的AssertionError，通常来自assert模块

🚀 错误冒泡和捕获
   
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

🚀 风格转换

  - promisify<=>callbackify、TextEncoder<=>TextDecoder

🚀 调试工具

 - debuglog、inspect、format、getSystemErrorName

🚀 类型判断

 - types.isDate(value)

 #### Nodejs断言等价-assert

 内置断言库，需要配合测试框架使用，主动抛出AssertionError错误

 🚀 断言真假

 - assert(value,msg),match(string,reg)

 🚀 断言等价

 - strictEqual/deepStrictEqual以及相反操作equal/deepEqual弃用

 🚀 断言成功失败

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

#### 模块记载优先级

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

  
