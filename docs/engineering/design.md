## 4.1 工程设计范式

- 工程设计范式有哪些种类

Rails Style / Domain Style

- 相信很多有一定经验的开发者都会遇到选择这种问题
  - 一个看似分层良好的古老工程，随着业务发展却越来越臃肿和低效
  - 一个新的项目，因为这种隐形问题上的纠结，而耽误了自己时间和精力

### 4.1.1 工程范式分类

 #### :tomato: Rails Style

```js
// egg应用典型结构
|── app               
|   ├── config     
|   ├── controller
|   ├── extend
|   ├── public
|   ├── router.ts
|   ├── service
|   └── view      
├── app.ts                    
├── agent.ts
├── config
├── logs
├── test
├── typings
├── README.md
├── package.json            
└── yarn.lock
```
```js
// Rails Style TodoList
root
|── reducers              
|   ├── todoReducer.js
|   └── fileterReducer.js
├── actions                 
|   ├── todoActions.js                         
|   └── filterAction.js
├── components                 
|   ├── todoList.jsx
|   ├── todoItem.jsx               
|   └── filter.jsx
├── containers                 
|   ├── todoListContainer.jsx
|   ├── todoItemContainer.jsx               
|   └── filterContainer.jsx
├── App.jsx
└── index.js
```
- Rails Style的特点
  - 专注于纵向的“层”的划分
  - 同一类文件放置在同一目录下
  
- 优势：
    - 便于合并导出
    - 便于进行“层”的扩展

- 不足：
    - 依赖关系难以直接地分析
    - 对功能的修改会涉及到大量的目录切换
    - 难以水平拆分

:tomato: Domain style

```js
// Aant Design
├── ...                            
├── components                
|   ├── util 
        └── ...    
|   ├── alert             
|   |   ├── demo         
|   |   ├── index.en-US.msd    
|   |   ├── index.tsx
|   |   ├── index.zh-CN.md
|   |   └── style
|   ├── anchor             
|   |   ├── Anchor.tsx
|   |   ├── AnchorLink.tsx
|   |   ├── __tests__
|   |   ├── demo
|   |   ├── index.en-US.msd    
|   |   ├── index.tsx
|   |   ├── index.zh-CN.md
|   |   └── style
└── ... 
```
- Domain style的特点
  - 专注于横向的 “功能” 的划分
  - 同一个feature放置在同一目录下

- 优势：
  - 便于水平拆分
  - 便于进行“功能”的扩展

- 不足
  - 会产生大量的重复结构
  - 难以垂直拆分

### 4.1.2 如何选择工程范式
 
- 单一功能的项目
  - 库、三方包：fs-extra、axios等
  - 由于不存在水平拆分的必要性、故可以选择Rails Style
  - 易于扩展
  - 减少重复代码
```js
// Axios
root
|── dist              
|   └── ...
├── examples                                     
|   └── ...
├── lib                 
|   ├── adapters
|   |    └── ...
|   ├── cancel
|   |    └── ...
|   ├── core
|   |     └── ...   
|   ├── defaults.js       
|   └── axios.js
├── sandbox                                     
|   └── ...
├── test                                    
|   └── ...
├── package.json
└── webpack.config.js
```
- 聚合功能型项目
  - 组件池、utils：ant-design、element-ui、lodash等
  - 纵向分层少，极易横向扩展-故选择Domain Style
  - 易于添加新feature
  - 便于横向拆分

- 业务工程项目 
  - 即有大量的垂直分层，又有大量的feature聚合 
  - Rails Style + Domain Style

#### :tomato:  Rails Style 对比 Domain Style

| 工程设计范式  |  特点  |  优势  |  不足  |  适用项目  |
| :---------: | :----: | :----: |:----: |:----: |
| Rails Style | 纵向“层”的划分，同一类文件放置在同一目录下 | 便于合并导出，便于进行“层”的扩展 | 依赖关系难以直观地分析，对功能的修改会涉及到大量的目录切换 ，难以水平拆分 | 单一功能的项目 | 
| Domain Style | 横向“功能”的划分，同一feature放置在同一目录下 | 便于水平拆分，便于进行“功能”的扩展 | 会产生大量的重复结构，难以垂直拆分 | 聚合功能型项目 | 

业务工程项目一般需要Rails Style 和 Domain Style结合

## 4.2 multi-repo VS mono-repo

它们是什么？

这是两种代码风格仓库的管理风格
 - multi-repo：把每个项目都分别用git托管
 - mono-repo：统一用一个git仓库管理所有的项目

### 4.2.1  multi-repo

```js
// multi-repo
root
|── project-a          
|   ├── ...
|   └── .git
├── project-b                 
|   ├── ...                    
|   └── git
├── project-c                 
|   ├── ...  
|   └── .git
├── project-d                 
|   ├── ...    
|   └── .git
...
```
从上面可以看出多个项目对应多个仓库，大多数工程，其实都是以multi-repo方式管理的

- 优势：

   可以让各项目团队根据需要定制更适合自己的workflow

-  不足：
   1. 难以对所有项目统一进行操作（git checkout / npm publish / npm run build）
   2. 难以追踪依赖关系（a->b->c）

### 4.2.2  mono-repo

```js
// multi-repo

├── .git 
├── lerna.json
├── package.json                                        
├── packages                 
    ├── project-a
    |    ├── README.md
    |    ├── __tests__
    |    ├── lib
    |    └── package.json
    ├── project-b
    |    ├── README.md
    |    ├── __tests__
    |    ├── lib
    |    └── package.json
    ├── project-c
        ├── README.md
        ├── __tests__
        ├── lib
        └── package.json
```
广泛应用于一些知名开源项目和硅谷巨头（React/Angular/Vuetify/Google） 
- 优势
  1. 方便统一地操作各个项目（git checkout / npm publish / npm run build）
  2. 利用工具，可以方便地追踪项目间的依赖关系

- 不足：
  1. 代码库随着业务发展会非常巨大
  2. 失去部分的灵活性（workflow必须统一）
  3. 强依赖于mono-repo的管理工具

### 4.2.3  multi-repo的管理

 - git submodule

 ```bash
 # 初始化git submodules仓库
 git submodule init
 # 添加一个submodule
 git submodule add https://github.com
# 更新所有的submodule
git submodule update
# 查submodule status
git  submodule status
# foreach 用于在每个submodule中执行命令
git submodule foreach "git checkout -b featureA"
 ```
 - git提供的一种管理子仓库的方案
 - 可以批量管理多个git repo
 - 本质上是一个父repo维护了一份各个子repo的清单
 - 坑还是不少的：git Submodule的坑
 - 替代方案：git  subtree

### 4.2.4 mono-repo的管理-lerna

- 为js生态下的mono-repo管理提供一站式的解决方案
- babel/create-react-app/jest/react-router/umi/nestjs

解决方案：

mono-repo下的依赖管理、版本管理、开发提效、工作流

#### 目录结构

- 整体作为一个Git仓库，也是个npm包（私有）
- lerna.json是整个mmono-repo的配置文件
- 每个真正的项目，平铺在packages/中
- 整个项目可以统一管理所有依赖（也可以分别管理）
```js
// lerna
├── .git 
├── lerna.json
├── package.json                                        
├── packages                 
    ├── project-a
    |    ├── README.md
    |    ├── __tests__
    |    ├── lib
    |    └── package.json
    ├── project-b
    |    ├── README.md
    |    ├── __tests__
    |    ├── lib
    |    └── package.json
    ├── project-c
        ├── README.md
        ├── __tests__
        ├── lib
        └── package.json
```

#### 用lerna管理项目实战 <Badge text="重要" type="tip"/> 

用lerna管理项目实战

```bash
npm i lerna -g
lerna init
```
1. 初始化的目录结构

```json
- packages
  - lerna.json
  - package.json
```
```bash
# 创建项目1
lerna create pac-1
# 创建项目3
lerna create pac-2
# 创建项目3
lerna create pac-3
```
目录中 lerna.jsoon

```json
{
  // 配置$schema可以在vscode中，鼠标滑倒每个配置项时候，可以看每个配置项的介绍 
  // 可以在https://www.schemastore.org/json/中网站查看知名项目的描述文件
  "$schema": "http://json.schemastore.org/lerna",
  "packages": [
    "packages/*"
  ],
  "version": "independent" // 可以给各个项目发不同的版本
}
```
::: tip
接下来我们为pac-1、 pac-2、pac-3添加依赖关系，我们制造这样一种依赖，pac-1模块被pac-2依赖；pac-2模块被pac-3模块依赖，
这时候就形成了pac-1、 pac-2、pac-3间接依赖关系。
:::

2. 添加项目依赖

```bash
# 制造依赖关系，对于内部项目的依赖，lerna会以软连接的形式，给它们相互软链接起来
lerna add pac-1 packages/pac-2
lerna add pac-2 packages/pac-3
```
如果我们给项目添加外部依赖，可能需要给每个项目node_moudles都添加，同一个依赖会安装很多次，这显然不合理，为了解决这个问题，leran可以把依赖添加到项目根目录；`lerna clean`去清除每个项目中node_modules相同的依赖;用 `lerna bootstrap --hoist`重新安装依赖，

3. 发版

需要注意是的 lerna.json 配置为"version": "independent"时可以为每个包独立发不同的版本，如果"version":'0.0.0'是发同样的版本
```bash
leran publish
```
4. 其它

可以用`lerna -h`查看全部指令

```bash
lerna  exec [cmd] [args...] # 执行每一个package.json你想指行的命令
lerna run <script> # 执行package.josn 中script配置的命令
lerna diff [pkgName] # 对比 文件变化
lerna changed # 查看文件变化
```
#### lerna.json 配置

```json
{
  "version":"0.0.0",
  "npmClient":"npm",
  "npmClientArgs":[
    "--pure-lockfile"
  ],
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file","*.md"],
      "message": "chore(replease):publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```
- 其实只有几个主要字段：version、npm*、command、packages
- command配置-json schema查看
   - 配置lerna子命令的默认项目

- version: 决定fixed mode / independent mode
- packages：项目路径
- npm*：解耦包管理工具

::: tip 一些注意项
- mono-repo 不可嵌套
- mono-repo 的主仓库必须是私有的（private：true）
- 如果你对仓库的私密性要求非常高，甚至可以不用npm而使用git应用依赖
- 任何的json配置记不住，都可以用json schema
:::

源码地址：/examples/engineering/4.1/lerna-demo

#### lerna 外的选择-nx
- Angular出品
- 框架强相关：Angular、React
- 支持插件机制
- 远超mono-repo管理的强大功能

### 扩展资料

[Git submodule的坑](https://blog.devtang.com/2013/05/08/git-submodule-issues/)

[git subtree](https://github.com/apenwarr/git-subtree/)

[npm v7 Series - Introduction](https://blog.npmjs.org/post/617484925547986944/npm-v7-series-introduction)

[NX](https://nx.dev/)