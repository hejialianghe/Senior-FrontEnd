## 4.1.阅读前必看
   前端的竞争日益激烈，相信大家在面试中有所体会，如何在竞争中脱颖而出，阅读源码是必不可少的技能；目前国内vue和react最为火热，react源码相对较难，最好从vue先入手，vue一万行多代码该如何下手，也是很多人放弃看源码的原因，那我们要有方法，从宏观到微观，先从某个局部功能入手，首先从github上克隆一份代码。
## 4.2.源码目录
```bash
├─ .circleci                 # 包含CircleCI持续集成/持续部署工具的配置文件
├─ benchmarks                # 基准和性能测试文件，vue的跑分demo，例如大数据量的table或者渲染大量的SVG
├─ dist                      # 构建后输出的不同版本vue文件（UMD、common.js、es生产和开发包）
├─ examples                  # 用vue写的一些小demo
├─ flow                      # 进行静态类型检测，静态类型检测类型声明文件(https://flow.org/)
├─ packages                  # 包含服务端渲染和模块编译器两种不同的NPM包，是提供不同使用场景使用的
├─ scripts                   # 存放npm脚本配置文件，结合webpack、rollup进行编译、测试、构建等操作
│   ├─ alias.js              # 模块导入所有源代码和测试中使用的别名
│   ├─ config.js             # 包含在`dist`中找到的所有文件的生成配置 
│   ├─ build.js              # 对config.js中所有的rollup配置进行构建
├─ src                       # 主要源码所在位置，核心内容
│   ├── compiler             # 解析模块相关
│   ├── core                 # vue核心代码，包括内置组件、全局API封装、vue实例化、观察者、虚拟DOM、工具函数等
│   │   ├── components       # 组件相关属性，主要是keep-Alive
│   │   ├── global-api       # vue全局api。例如：Vue.use Vue.extend vue.mixin
│   │   ├── instance         # 实例话相关内容，生命周期，事件等
│   │   ├── observe          # 响应式核心目录，双向绑定相关文件
│   │   ├── util             # 工具方法
│   │   └── vdom             # 包括虚拟DOM，创建（creation）和打补丁（patching）的代码
│   ├── platforms            # 包含平台特有的相关代码，vue是一个跨平台的mvvm框架（web、weex）
│   ├── server               # 服务端渲染（ssr）
│   ├── sfc                  # 转换但文件组件（*.vue）
│   ├── shared               # 全局共享的方法和常量

```