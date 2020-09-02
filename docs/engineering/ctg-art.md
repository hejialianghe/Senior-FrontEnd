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


## 5.3 不得不提的babel:基本概念

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

语言级的某一种概念的写法，不可被语言中的其他概念实现

举个例子

```js
// 1. 箭头函数
(a,b,c)=>a+b+c
// 2. Class类
 class A {}
// 3. ES模块
import * as ext from ‘fs-ext’
```

#### feature

- Feature 就是指API

实例方法、静态方法、全局对象等

举个例子

```js
// 1. promise
new Promise().then()
//2. Object.keys
Object.keys({a:1})
// 3. [].inculdes
[1,2,3].includes(2)
```

### 5.3.3 puugin / preset / env

### plugin

- 插件

babel本身不会对代码做任何操作，所有功能都靠插件实现

- 有哪些插件？

1. @bable/plugin-transform-arrow-functions

2. @babel/plugin-transform-destructuring

3. @bable/plugin-transform-classes

4. ......

### preset

- preset是什么？

A set of plugins，一组插件的集合

- 官方preset

1. @babel/preset-env

2. @babel/preset-flow

3. @babel/preset-react

4. @babel/preset-typescript

```js
module.exports=function (){
    return {
        plugins:[
            "pluginA",
            "pluginB",
            "pluginC"
        ]
    }
}
```

### env

- nev的出现

@bable/preset-env是一种更加智能的preset，让我们指需要根据我们的目标环境，快速配置babel

- env的配置例子

```js
{
    "target":">0,25%,not dead"
}

{
    "target":{"chrome":"58","ie":"11"}
}
```

### 5.3.4 扩展资料

[browserlist项目地址](https://github.com/browserslist/browserslist)

[compat-table项目地址](https://github.com/kangax/compat-table)

## 5.4 不得不提的babel：使用

### 5.4.1 Babel的使用方式

- 直接require

```js
const bable=require("@babel/core")
babel.transform(code,options,function(){
    result // =>{code,map,ast}
})
```

- babel-cli

```js
babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/* .test.js"

babel -node --inspect --presets @babel/preset-env -- script.js --inspect
```

- Webpack / Rollup

```js
    module:{
        rules:[
            test:/\.m?js$/,
            exclude:/(node_modules | bower_components)/,
            use:{
                loader:'babel-loader',
                options:{
                    presets:['@bable/preset-env']
                }
            }
        ]
    }
```

### 5.4.2 Babel 的配置 

#### 配置的位置

- 项目根目录的.babelrc.json

对整个项目生效

- 工程根目录的babel.config.json

对整个工程生效（可跨项目）

- package.json的babel字段

相当于.babel.json

#### plugin

- plugin的使用

```js
module.exports={
    // "@babel/preset-env" ,下面配置的是简写，如果工程配置中找不到包，可能是被简写了
    presets:["@babel/env"],
    // same as "@babel/plugins-transform-arrow-functions"
    plugins:["@babel/transform-arrow-function"]
}
```
- plugin的几种配置


```js
// 以下三种配置方式等价
module.exports={
  “plugins”:[
      "pluginA":,
      ["pluginA"],
      ["pluginA",{}] // 如果plugin配置成数组，第一项是插件名称，第二项是配置
  ]
}
```
利用以下方式，我们可以将配置传入插件

```js
module.exports={
  “plugins”:[
      [
          "transform-async-to-module-method",
          {
              "module":"bluebird",
              "method":"coroutine"
          }
      ]
  ]
}
```

- plugin的顺序

1. Plugins在preset之前执行
2. Plugin之间从前往后依次执行

babel为什么这么设计呢？

因为preset配置的是比较成熟的语法，plugin主要配置一些更新特性，plugin在preset之前执行是保证这些新特性是最先被转换的，保证preset只关心比较稳定的语法

#### preset

- preset的使用

```js
{
    "preset":[
        ["@bable/preset-env",{
            "loose":true,
            "modules":false
        }]
    ]
}
```
为什么preset也需要配置呢？

因为preset本质就是一组plugin的集合,plugins可以配置，当然preset也可以配置，甚至preset可以依赖另一个preset

- preset的本质

```js
    module.exports=()=>({
        presets:[
            "@babel/preset-env"
        ],
        plugins:[
            [
                "@babel/plugin-proposal-class-properties",
                {loose:true}
            ],
            "@babel/plugin-proposal-object-rest-spread"
        ]
    })
```
- preset的顺序

1. preset在plugin之后执行
2. preset之间从后往前依次执行

```js   
// 执行顺序 c->b->a，这个设计babel文档中说是历史原因造成的
{
    "preset":[
        "a","b","c"
    ]
}
```

#### preset-env

- preset-env的配置

preset-env是最常用的preset，大部分情况下你只需用这一个preset就可以了

1. 主要就是useBuiltins和target两个配置
2. useBuiltins用来配置polyfill
3. target用来告诉preset-env选择哪个插件

```js   
{
    "presets":[
        [
            "@babel/preset-env",
            {
                "useBuiltIns":"entry",
                "target":{
                    "esmodules":true,
                    "chrome":"58",
                    "ie":"11",
                    "node":"current"
                }
            }
        ]
    ]
}
```
- targets的配置

这个配置项是我们支持的平台是什么

```js   
{
    "targets" :{"chrome":"58","ie":"11"}
}
// or
{
    "targets" : "> .5%  and not last 2 versions"
}
```

1. 可以是描述浏览器版本的对象，也可以是字符串（browserlist）
2. browserlist完整语法
3. 也可以将browserlist写在.browserslistrc中

- usebuiltins的配置

三种取值：“usage”、“entry”、“false”，默认是false

用于自动注入polyfill代码

1. false：什么也不做/不自动注入polyfill

2. entry:根据环境配置自动注入polyfill

3. usage:根据实际使用自动注入polyfill

### 5.4.3 polyfill

#### Babel的Polyfiill

- Babel 7.4之前

统一使用@babel/polyfill

- babel 7.4之后

新的形式更有利于babel做进一步的转换

```js
import "core-js/stable";
import "regenerator-runtime/runtime"
```
core-js用于polyfill大部分的ES新feature

regenerator-runtime/runtime用于转换generator函数

由于polyfill会用于运行时，所以要以`dependencies`方式安装

#### Polyfill的使用

- 直接引入？

官方不建议直接引入，因为太大了，建议将preset-env的useBuiltins和corejs搭配使用。

- useBuiltIns:“entry”

在target配置为chrome71的条件下使用：

```js
import 'core-js/stable'

// ------------------------

import "core-js/modules/es.array.unscopables.flat";
import "core-js/modules/es.array.unscopables.flat-map";
import "core-js/modules/es.object.form-entries";
import "core-js/modules/web.immediate"
```
- useBuiltins:false

Babel什么都不做，完全由你自己决定如何polyfill

- useBuiltins: "usage"

 根据使用情况自动加入poilfill

```js
// a.js
var set =new Set([1,2,3])

// 转换后
import 'core-js/module/es.array.iterator';
import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.set';
var set = net Set([1,2,3])
```
 <font color="red">**似乎完美了吗？**</font>

 ```js
 export class Animal {
     makeSound(){
         console.log('hi')
     }
 }

//  ----------------------------

"use strict"
require("core-js/modules/es6.object.define-property")
function _classCallCheck(instance,constructor){//....}
function _defineProperties(target,props){//....}
function _createClass(Constructor,protoProps,staticProps){//....}
 ```
 Polyfill函数被内联的写进文件里，如果工程中大量使用class语法，必然会出现大量的重复的polyfill

 <font color="red">**解决方法**</font>

 yarn add -D @babel/plugins-transform-runtime

yarn add @babel/runtime 

 ```js
 var _classCallCheck2=_interopRequireDefault(
     require('@babel/runtime/helpers/classCallCheck')
 )
  var _classCallClass2=_interopRequireDefault(
     require('@babel/runtime/helpers/createClass')
 )
 ```
 
 让所有polyfill函数从@babel/runtime引入

  <font color="red">**带来的好处**</font>

  1. 减小包的体积
  2. 不会影响到全局环境

 <font color="red">**最终配置**</font>

 ```js
 module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage'
      }]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties"
    ['@babel/plugin-transform-runtime'],
}
 ```

## 5.5 不得不提的babel：插件开发

### 5.5.1 Babel的插件的本质

#### 插件长什么样？

```js
export default function (){
    return {
        visitor:{
            Indentifier(path){
                const name=path.node.name;
                path.node.name=name
                 .split("")
                 .reverse()
                 .join("")
            }
        }
    }
}
```
#### 从代码到AST

```js
function square () {
    return n*n
}
```
Babel和ESlint一样，使用EStree规范生成AST结构，可以使用[AST Explore](https://astexplorer.net/)查看

#### 节点（Node）

- AST 每一层都拥有相同的结构，我们称之为节点（Node）
- 一个AST可以由单一的节点或成百上千个节点构成
- 它们组合在一起可以描述用于静态分析的程序语法

```js
{
    type:"FunctionDeclaration",
    id:{.....},
    params:[......]
    body:{.....}
}

{
    type:"FunctionDeclaration",
    name:...
}

{
    type:"FunctionDeclaration",
    operator:......,
    left:{......},
    right:{...}
}
```

#### 遍历

babel编译经过3个步骤，解析->变换->生成；其中解析和生成我们都不用关注，我们只用关注变换，先要转换AST，我们
需要对其进行递归的树形遍历

```js

    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 37,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 15,
        "name": "square"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 37,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 25,
            "end": 35,
            "argument": {
              "type": "BinaryExpression",
              "start": 32,
              "end": 35,
              "left": {
                "type": "Identifier",
                "start": 32,
                "end": 33,
                "name": "n"
              },
              "operator": "*",
              "right": {
                "type": "Identifier",
                "start": 34,
                "end": 35,
                "name": "n"
              }
            }
          }
        ]
      }
    }
  
```
1. 从FunctionDeclaration 开始遍历

2. id节点，它是一个identifier，没有任何子节点属性

3. params数组，访问其中的任何一项，都是identifier

4. body -> BlockStatement -> body

5. ReturnStatement -> argument -> BinaryExpression

6. ......

#### 访问者模式

- 遍历AST的过程，其实就是不断访问各个节点的过程

- Babel的插件，就是顺理成章地使用了访问者模式

```js
const MyVisitor ={
    Indentifier:{
        enter(){
           console.log("Entered")
        },
        exit(){
            console.log("EXited")
        }
    }
}
```
 访问者的每个方法都能获取2个参数，第一个参数是`path`,

 - path

 path是我们对节点的引用

 ```js
    {
        type:"FunctionDeclaration",
        id:{
            type:"Identifier",
            name:"square"
        }
        ......
    }
    // path拿到父节点
    {
        "parent":{
            "type":"FunctionDeclaration",
            "id":{}
            .....
        },
        "node":{
            "type":"Identifier",
            "name":"square"
        }
    }
 ```
 1. path方法可以帮助我们访问父节点，帮助我们取得上下文信息。
 2. path方法上面有很多工具方法，帮助我们方便的操作AST。

- State

插件的“状态，比如：
当前plugin的信息、plugin传入的配置参数，甚至处理过程中的自定义状态

```js
{
    plugins:[
        ["my-plugin",{
            "options":true,
            "options":false
        }]
    ]
}
// babel中通过state拿到配置参数
{
    visitor:{
        FunctionDeclartion(path,state){
            console.log(state.opts)
            // {option1:true,option2:false}
        }
    }
}
```

- 完整面貌

```js
export default function (babel) {
    // babel的一些工具方法
    const {type:t,template}=babel
    return {
        name:"a-demo-plugin",
        visitor:{
            Indentifier(path,state){},
            ASTNodeTypeHere(path,state){}
        }
    }
}
```
一个babel对象为入参，以包含插件名和visitor的对象为返回值的函数

### 5.5.2 Babel的插件开发工具

| 工具  |  作用  | 
| :---: | :----: |
|  @babel/parser  | 将源代码解析称AST | 
|  @babel/generator  | 将AST生成js代码  | 
|  @babel/code-frame  | 生成错误信息 | 
|  @babel/helpers   | 提供一些内置的帮助函数 | 
|  @babel/template |  为parser提供模版引擎| 
|  @babel/types  | 主要用于处理节点类型相关的问题（判断、创建） | 
|  @babel/traverse | 工具类，用来遍历AST树 | 

### 5.5.3 Babel的插件实战

#### 实现一个Optional Chaining

```js
foo?.bar 
// --------------- 把上面的转换成下面的
foo==null?void 0: foo.bar
```
想要转换，就先对比2段代码的AST结构，利用[astexplorer](https://astexplorer.net/)工具分别拿到json格式的AST，拿到2段转换后的json后，在利用[diffchecker](https://www.diffchecker.com/diff)网站对比一下前后变换。

![](~@/engineering/diffast.png)