## 3.2 企业级Nodejs框架egg概览

### 3.2.1 egg框架概览

#### egg的优势

- 多环境配置支持灵活
- 系统稳定性有保障
- 轻松实现定时任务
- 丰富的开发生态
- 简单易扩展的插件系统

#### egg.js 在企业中的定位

![](~@/node/eggbase.png)

#### Egg.js项目约定

 ```bash
.
|____package.json
|____config
| |____config.{env}.js # 用于编写不同环境下配置文件
| |____plugin.js # 用于配置需要加载的插件
| 
|____app # 核心文件
| |____ router.js # 用于配置URL路由规则
| |____ controller # 用于与用户交互
| |____ service # 用于编写业务逻辑层
| |____middleware # 用于编写中间件
| |____ public # 用于放置静态资源
| |____ extend # 用于框架的扩展
| 
|____test # 用于单元测试
 ```

 #### Egg.js内置对象

 - 由Koa继承而来的对象 Application、Context、Request、Reponse
 - 扩展的对象 Controller、Service、Helper、Config、Logger

![](~@/node/builtin-obj.png)

### 3.2.2 egg.js开发Web Server实战

