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
    VS Code/Atom/Vim/Sublime Text   在写代码的同时就可以实时对代码进行检查
  - 构建工具集成
    Webpack/Rollup/Gulp/Grunt  在构建过程中进行代码检查

🚀 ESLint 的配置
   - 配置文件格式
     javascript，JSON或者YAML，也可以在package.json中的eslintConfig字段
   - ESLint配置的主要内容
     1. Parser：ESLint使用哪种解析器
     2. Environments：选择你的代码跑在什么环境中（browser/node/commonjs/es6/es2017/worker）
     3. Globals：除了Env之外，其他需要额外指定的全局变量
     4. Rules：规则
     5. Plugins：一组以上配置项以及processor集合，往往用于特定类型文件的代码检查，如.md文件
     6. Extends：你想继承的配置

#### parser配置

```json
{
    "parser":"esprima",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    }
}
```
-  parser
 指定ESlint使用哪种解析器：Espree（type默认）、Esprima、Babel-ESLint、@typescript-eslint/parser，一般不需指定

- parserOptions
 配置parser的参数，parser会接收这些参数，并影响其解析代码的行为

####  Evironments、Globals
```json
{
    "env":{
        "browser":true,
        "node":true
    },
    "globals":{
        "var1": "writable",
        "var2": "readonly",
        "var3": "off"
    }
}
```
- Environments 预置环境
  browser/node/commonjs/shared-node-browser/es6/es2017/es2020/worker/amd

- globals
  globals是env之外需要额外指定的全局变量，有三种配置值：
  1. writeable - 可写
  2. readonly - 只读
  3. off - 不支持

#### Rules

  ESLint无默认开启规则，但提供了推荐开启的规则："extends"："eslint:recommended",可在这里查看所有内置规则的列表：[Rules](https://eslint.org/docs/rules/)

```json
{
    "rules": {
        // 允许非全等号
        "eqeqeq": "off",
        // 尽可能使用花括号
        "curly": "error",
        // 双引号
        "quotes": ["error","double"],
        // 除了warn和error之外，对console.*方法发出警告
        "no-console": ["warn", { "allow": ["warn","error"]}],
        // 必须写分号，除了lastInOneLineBlock
        "semi": [2, "always", {"omitLastInOneLineBlock":true}],
        // plugin1 中的规则，不是内置规则
        "plugin1/rule1": "error"
    }
}
```
- 错误级别

  1. "off"或0 关闭规则
  2. "warn"或1 将规则视为一个警告
  3. "error"或2 将规则视为一个错误

- 配置形式
  
  1. 值：数字或字符串，表示错误级别
  2. 数组：第一项是错误级别，之后的各项是对该规则的额外的配置

#### Plugins

ESLint的插件是对一系列rules、environments、globals、processors等配置的封装，以`eslint-plugin-vue`为例：
```js
// eslint-plugin-vue 的入口文件index.js
// 这个配置集成好了一些配置，用户如果有需要可以直接继承它，不需要额外指定
module.exports = {
    rules: {
        'array-bracket-newline': require('./rules/array-bracket-newline'),
        'array-bracket-spacing': require('./rules/array-bracket-spacing'),
        'arrow-spacing': require('./rules/arrow-spacing')
        // ......
    },
    config: {
        base: require('./configs/base'),
        essential: require('./configs/essential'),
        'no-layout-rules': require('./configs/no-layout-rules'),
        recommended: require('./configs/recommended')
        // .....
    },
    // processors 在被ESLlint处理之前都会被eslint-plugin-vue处理一便
    processors: {
     '.vue': require('./processor')
  }
}
```
使用方式
1. 可以单独引用规则
2. 可以直接使用（继承）eslint-plugin-vue配置好的config
3. 预处理器的作用：解析.vue文件

#### Plugins的使用

使用`eslint-plugin-vue`的vue工程为例子

```js
module.exports= {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/essential", // eslint-plugin-vue
        "eslint:recomended",
        "@vue/prettier"
    ],
    parseroption: {
        parser: "babel-eslint"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production"
            ? "warn" : "off",
        "no-debugger":  process.env.NODE_ENV === "production"
            ? "warn" : "off"
    }
}
```
更灵活的配置：

```js
{
    "plugins": [
        "vue", // eslint-plugin-vue
        "html"
    ],
    "rules": {
        "vue/no-unused-vars": "error",
        "vue/array-bracket-spacing": "error"
    }
    // ...
}
```
<font style="color:red">extends和plugins的区别，extends是全家桶，继承插件的全部配置；plugins是DIY,是根据自己的情况在Rules里进行配置。</font>

#### Extends

Extends是一种非常灵活的ESLint配置机制，使用Extends可以依次递归地应用每一个eslint配置文件，实现灵活的组合
```json
 {
     // 继承单个配置
     "extends": "eslint:recommended",
     // 继承多个配置，后面的可能覆盖前面的
     "extends": ["eslint:recommended","plugin:react/recommended"],
     "extends": [
         "./node_modules/coding-standard/eslintDefaults.js",
         "./node_modules/coding-standard/.eslintrc-es6",
         "./node_modules/coding-standard/.eslintrc-jsx"
     ]
 }
```
- 可以用extends来全家桶式地使用第三方配置好的规则
- extends可以嵌套
- 使用extends之后，我们的rules可以覆盖重写第三方规则、只改变第三方规则的错误等级、添加新的规则

### 2.1.3 编写自己的ESLint规则

规则：no-caller，禁止argutments.caller和arguments.callee的使用

- meta部分主要包括规则的描述、类别、文档地址、修复方式以及配置下schema等信息
- create则需要定义一个函数用于返回一个包含遍历规则的对象，并且该函数会接收context对象作为参数
- [ESLint开发指南](https://eslint.org/docs/developer-guide/architecture)

```js
module.exports= {
    meta:{
        type:"suggestion",
        docs: {
            descripttion: "disallow the use of `arguments.caller`"+"or `arguments.callee`",
            category:"Best Practices",
            recommended: false,
            url: "http://eslint.org/docs/rules/no-caller"
        },
        schema: [],
        messages: {
            unexpected: "Avoid arguments.{{prop}}"
        }
    },
    create(context) {
        return {
            MemberExpression(node){
                const objetName = node.object.name,
                      propertyName= node.property.name;
                if(objectName === "arguments" &&
                  !node.computed &&
                  propertyName &&
                  propertyName.match(/^calle[er]$/u)
                ){
                    context.report({ // context eslint全局上下文，report输出错误日志
                        node,
                        messageId: "unexpexted",
                        data : { prop : propertyName}
                    })
                }
            }
        }
    }
}
```




