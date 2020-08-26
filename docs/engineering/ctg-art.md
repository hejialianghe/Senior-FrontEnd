## 5.1 构建简史

### 5.1.1 前端进化史

#### 洪荒时代

- Vanilla javascript/HTML/CSS

1993年-HTML（超文本标记语言）-> 1994-css（层叠样式表）-> javaScript

- 最火热的话题

DOM、BOM、样式放在哪、浏览器的兼容性.....

- jQuery

1. 简化DOM操作
2. 制作底层API（如xhr）
3. 制作炫酷动画
4. 解决浏览器兼容性问题

- Bootstrap

1. 用class决定元素的功能和样式
2. “组件”开始出现
3. 工程化的问题开始显现

#### 曙光初现

- Nodejs出现

1. NodeJS v0.0.1-2009年
2. 利用v8和libuv，让JS代码运行于浏览器之外
3. Node出现之前，构建脚本往往需要使用Makefile、Shell编写

```js
 var sass=require('node-sass')
 sass.render(
     {file:scss_filename,[,option...]},
     function(err,result){/*...*/}
 )
```
#### 百家争鸣

- Grunt/Gulp

1. 构建工具流开始初步形成
2. 编写简单、生态丰富

#### 语言的进化

1. ECMAScript 6的出现

1. 即ES2015，诞生于2015年6月

2. 现代的语法极大的提高了开发效率

- 箭头函数
- Clas语法
- Promise/Gennerator
- ES Module
......

#### MV*框架

- 现代mv*框架的出现

1. Angular、React、Vue
2. 单文件组件、JSX
3. 大量利用了ES6新特性

#### MV*框架

- AMD/CMD

1. 纯前端模块化方案

2. AMD:require.js

3. CMD:sea.js

- CommonJS

1. NodeJS模块化方案
2. 同步引用依赖、符合人类视觉

```js
    module.exports=function(){
        return 'a'
    }
    var a=require('./a')
```

- ES Module

1. ES6规带来的语言级模块化方案

2. 支持Node/Browser等运行时

3. 利于静态分析

```js
export default function (){ return 'a' }
import { default as a } from './a'
```
### 5.1.2 现代化的前端构建

- 我们需要怎样的前端构建

1. 性能：图片优化、合并资源、减少Polyfill体积

2. 模块化：Commonjs/ES Module-> script

3. 强力的语法转换：ES6、7、8...

4. 统一打包过程、整体分析优化：Vue单文件组件

- Babel、webpack

