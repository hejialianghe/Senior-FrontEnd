## 2.1 代码规范

### 2.1.1 社区已有的规范

🚀 HTML/CSS

- Google HTML/CSS/JS 规范
  著名的谷歌前端规范，大二全

- AIrbnb Style 规范（包括CSS和Sass）
  AIrbnb的样式规范，不仅包含css规范，亦包含Sass的规范

 🚀 javaScript 规范
 
  - Airbnb javaScript规范
    Airbnb的javascript编码规范
     
  - javascript Standard Style
    Standard规范，影响力最大的JS编码规范，生态丰富，提供了开箱即用的各种lint规则和编辑器插件

 🚀 框架相关
    
  - Vue style Guide
    VueJS官方推荐的编码规范

  - Airbnb React/JSX Style Guide
    Airbnb javascript规范的React/JSX部分

### 2.1.2 建立代码规范 - ESLint

 - Eslint介绍
   一款高度可配置的javaScript静态代码检测工具，已经成为js代码检查的事实标准 

 - 特效
   - 完全的可插拔，一切行为都通过配置产生
   - 任意rule之间都是独立的

 - 原理
   先通过解析器（parser）将javaScript代码解析为抽象语法树（AST），再调用规则对AST进行检查，从而实现对代码的检查

- AST 浅析
   AST是一种可遍历的、描述代码的树状结构，利用AST可以方便地分析代码的结构和内容[https://astexplorer.net/](https://astexplorer.net/)

-  ESLint CLI

```bash
eslint -h
```
- CLI 之外
  - 编辑器的集成
    VS Code/Atom/Vim   在写代码的同时就可以实时对代码进行检查
  - 构建工具集成
    Webpack/Rollup/Gulp/Grunt  在构建过程中进行代码检查