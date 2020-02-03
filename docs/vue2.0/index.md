## 4.1.阅读前必看
   前端的竞争日益激烈，相信大家在面试中有所体会，如何在竞争中脱颖而出，阅读源码是必不可少的技能；目前国内vue和react最为火热，react源码相对较难，最好从vue先入手，vue一万行多代码该如何下手，也是很多人放弃看源码的原因，那我们要有方法，从宏观到微观，先从某个局部功能入手，首先从github上克隆一份代码。
## 4.2.源码目录
```bash
dist
├── index.html     #文件入口，因为这框架是单页面应用，挂在一个app,然后动态渲染路由模板
src
├── compiler
├── core
    ├── components
    ├── global-api
    ├── instance
    ├── observe
    ├── util     
    ├── vdom     
    └── images       
├── platforms
├── server
├── sfc
├── shared

```