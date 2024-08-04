## 1.1 阅读前必看
   前端的竞争日益激烈，相信大家在面试中有所体会，如何在竞争中脱颖而出，阅读源码是必不可少的技能；目前国内vue和react最为火热，react源码相对较难，最好从vue先入手，vue一万行多代码该如何下手，也是很多人放弃看源码的原因，那我们要有方法，从宏观到微观，先从某个局部功能入手，首先从github上克隆一份代码，可以克隆tags v2.6.11版本
## 1.2 前置知识点
   如果想深入的了解vue源码，至少需要以下几个知识点
![](~@/vue2.0/vuepre.png)
### 1.2.1 Flow

   相信大家都知道，javascript是弱类型语言，写代码时非常爽但同时也容易犯错，所以Facebook搞了这么一个类型检测工具，可以加入类型的限制
   提高代码质量

####  :tomato: 案例

下面例子如果这样调用`count(1,'t')`会出现意想不到的错误，这样的编程太不稳定了
``` javascript
 function count (a,b) {
       return a*b
   }
```
如果我们对参数加以限制，只允许传递Number类型，否则Flow工具就会检测报错
``` javascript
 function count (a:number,b:number) {
       return a*b
   }
```
vue源码中出现的flow语法
``` javascript
 export function renderList (
    val: any, // any代表任意类型
    render: (
        val: any,
        keyOrIndex: string | number, // 以是string类型可以是number类型
        index?: number // 问号在冒号之前，代表可以不传，要传的话必须是number类型
    ) => VNode
    ): ?Array<VNode>{ // 问号在冒号之后，代表参数必须要传，但可以是数组类型也可以是null和undefined，<>里的代表数组里的类型
    ...
    }
    // flow 入门https://zhuanlan.zhihu.com/p/26204569
```
## 1.3 源码目录
```bash
├─ .circleci                 # 包含CircleCI持续集成/持续部署工具的配置文件
├─ benchmarks                # 基准和性能测试文件，vue的跑分demo，例如大数据量的table或者渲染大量的SVG
├─ dist                      # 构建后输出的不同版本vue文件（UMD、common.js、生产和开发包）
├─ examples                  # 用vue写的一些小demo
├─ flow                      # 进行静态类型检测，静态类型检测类型声明文件(https://flow.org/)
├─ packages                  # 包含服务端渲染和模块编译器两种不同的NPM包，是提供不同使用场景使用的
├─ scripts                   # 存放npm脚本配置文件，结合webpack、rollup进行编译、测试、构建等操作
│   ├── config.js             # 包含在`dist`中找到的所有文件的生成配置 
│   └── build.js              # 对config.js中所有的rollup配置进行构建
├─ src                       # 主要源码所在位置，核心内容
│   ├── compiler             # 编译器代码，将template编译成render函数
│   ├── core                 # vue核心代码，包括内置组件、全局API封装、vue实例化、观察者、虚拟DOM、工具函数等
│   │   ├── components       # 组件相关属性，主要是keep-Alive
│   │   ├── global-api       # vue全局api。例如：Vue.use Vue.extend vue.mixin
│   │   ├── instance         # 实例化相关内容，生命周期，事件等
│   │   ├── observe          # 响应式核心目录，双向绑定相关文件
│   │   ├── util             # 工具方法
│   │   └── vdom             # 包括虚拟DOM，创建（creation）和打补丁（patching）的代码
│   ├── platforms            # 包含平台特有的相关代码，vue是一个跨平台的mvvm框架（web、weex）
│   │   ├── web              # web端
│   │   │   ├── compiler     # web端编译相关代码，用来编译模版或render函数
│   │   │   ├── runtime      # web端运行是相关代码，用来创建vue实例等
│   │   │   ├── server       # 服务端渲染
│   │   │   └── util         # 相关工具类
│   │   └── weex             # 基于通用跨平台的web开发语言和开发经验，来构建Android、ios和web应用
│   ├── server               # 服务端渲染（ssr）
│   ├── sfc                  # 转换单文件组件（*.vue）
│   └── shared               # 全局共享的方法和常量
├─ test                      # test测试用例
├─ types                     # vue新版本支持TypeScript，主要是用typeScript声明文件
├─ .editorconfig             # 文本编码样式配置文件      
├─ .eslintignore             # eslint校验忽略文件
├─ .eslintrc.js              # eslint配置文件
├─ .flowconfig               # flow配置文件
├─ LICENSE                   # 项目开源协议
```
## 1.4 开始吧！
####  :tomato: 克隆代码
```bash
  git clone -b v2.6.11 https://github.com/vuejs/vue.git
```
####  :tomato: 阅读源码，我们逐个击破的方式 
1. 响应式

    `vue`如何实现数据的响应式，从而用数据驱动视图

2. vittualdom和DIff

    `vittualdom`及 `DIff `算法