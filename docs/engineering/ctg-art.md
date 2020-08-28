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

## 5.2 不得不提的babel：token-ast

### 5.2.1 回顾AST

#### 《代码规范》中的介绍

AST是一种可遍历的、描述代码的树状结构，利用AST可以方便的分析代码的结构和内容。

[AST Explore](https://astexplorer.net/)

### 5.2.2 编译理论

![](~@/engineering/cpn-process.png)

#### Babel中的编译

- Babel也是编译器

  输入的是高版本的ES代码，输出的是符合我们要求的低版本的ES代码，例如：ES7->ES5

- Babel的工作步骤

根据Babel文档，其工作步骤其实主要分为三步

1. 解析（Parsing）：解析代码，生成AST（抽象语法树）

2. 变换（Transformation）：操作AST（抽象语法树），修改其内容

3. 生成（Code Generation）：根据AST（抽象语法树）生成新的代码

### 5.2.3 如何实现简单编译器

#### 目标

- LISP->C

|   |  LISP  | C | 
| :---: | :--------: | :------: | 
|  2+2  | (add 2 2 ) |  add(2,2)  | 
|  4-2  | (subtract 2 2 ) |  subtract(4,2)  | 

#### parsing

- Tokenizing

![](~@/engineering/tokenizing.png)

- Tokenizer函数

![](~@/engineering/tokenizer.png)

![](~@/engineering/tokenizer2.png)

将代码转换成token

- Parser函数

![](~@/engineering/Parser.png)

将token转换为AST

#### transformation

- Traverser函数

深度优先地遍历AST树

- TransFormer函数

在遍历每一个节点时调用将旧AST转成一颗新树，就是转换为目标语言的树

#### Code Generator

- Code Generator

深度优先地遍历新的AST树，将每个节点依次组合新代码

- 最终的Compiler

1. input -> tokenizer -> tokens
2. Tokens -> parser -> ast
3. ast -> transformer -> newAst
4. newAst -> generator -> output

```js
    function compiler (input) {
        let tokens= tokenizer(input)
        let ast = parser(tokens)
        let newAst=transformer(ast)
        let output= codeGennerator(newAst)
        return output
    }
```
### 5.2.4 扩展资料

[the-super-tiny-compiler项目](https://github.com/jamiebuilds/the-super-tiny-compiler)

[国大学慕课：编译原理 哈尔滨工业大学：](http://www.icourse163.org/course/HIT-1002123007)


## 5.3 不得不提的babel

### 5.3.1 Babel的作用

#### Babel是啥？

 - Babel 是啥？

  - Babel is javaScript compiler

  - 主要将ECMAScript 2015+的代码，转换成让我们能够在更古老的浏览其和其他环境运行的、兼容性更好的、老版本javascript代码

- Babel 能干嘛？
 
 作用1: 语法转换

 ```js
    [1,2,3].map((n)=>n+1)  => [1,2,3].map(function(n){
                                    return n+1
                                 })
 ```

 作用2: Polyfill

  ```js
    Array.from(new Set([1,2,3]))
    [1,[2,3],[4,[5]]].flat(2)
    Promise.resolve(32).then(x=>console.log(x))
 ```
 让 老环境支持新的api

  作用2: 源码修改

  去除Flow/TypeScript代码中的类型标识

  ```js
    function square （n:number):number {
        return n+n
    }
    // ------transformation------
    function square （n) {
        return n+n
    }
 ```

### 5.3.2 Syntax & Feature

#### Syntax

- Syntax 