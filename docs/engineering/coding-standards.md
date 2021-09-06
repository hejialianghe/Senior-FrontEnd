## 2.1 代码规范

### 2.1.1 社区已有的规范

#### HTML/CSS

- Google HTML/CSS/JS 规范
  著名的谷歌前端规范，大二全

- AIrbnb Style 规范（包括 CSS 和 Sass）
  AIrbnb 的样式规范，不仅包含 css 规范，亦包含 Sass 的规范

#### javaScript 规范

- Airbnb javaScript 规范
  Airbnb 的 javascript 编码规范
- javascript Standard Style
  Standard 规范，影响力最大的 JS 编码规范，生态丰富，提供了开箱即用的各种 lint 规则和编辑器插件

#### 框架相关

- Vue style Guide
  VueJS 官方推荐的编码规范

- Airbnb React/JSX Style Guide
  Airbnb javascript 规范的 React/JSX 部分

### 2.1.2 建立代码规范 - ESLint

- Eslint 介绍
  一款高度可配置的 javaScript 静态代码检测工具，已经成为 js 代码检查的事实标准

- 特效

  - 完全的可插拔，一切行为都通过配置产生
  - 任意 rule 之间都是独立的

- 原理
  先通过解析器（parser）将 javaScript 代码解析为抽象语法树（AST），再调用规则对 AST 进行检查，从而实现对代码的检查

- AST 浅析
  AST 是一种可遍历的、描述代码的树状结构，利用 AST 可以方便地分析代码的结构和内容[https://astexplorer.net/](https://astexplorer.net/)

- ESLint CLI

```bash
eslint -h
```

- CLI 之外
  - 编辑器的集成
    VS Code/Atom/Vim/Sublime Text 在写代码的同时就可以实时对代码进行检查
  - 构建工具集成
    Webpack/Rollup/Gulp/Grunt 在构建过程中进行代码检查

:tomato: ESLint 的配置

- 配置文件格式
  javascript，JSON 或者 YAML，也可以在 package.json 中的 eslintConfig 字段
- ESLint 配置的主要内容
  1.  Parser：ESLint 使用哪种解析器
  2.  Environments：选择你的代码跑在什么环境中（browser/node/commonjs/es6/es2017/worker）
  3.  Globals：除了 Env 之外，其他需要额外指定的全局变量
  4.  Rules：规则
  5.  Plugins：一组以上配置项以及 processor 集合，往往用于特定类型文件的代码检查，如.md 文件
  6.  Extends：你想继承的配置

#### parser 配置

```json
{
  "parser": "esprima",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
```

- parser
  指定 ESlint 使用哪种解析器：Espree（type 默认）、Esprima、Babel-ESLint、@typescript-eslint/parser，一般不需指定

- parserOptions
  配置 parser 的参数，parser 会接收这些参数，并影响其解析代码的行为

#### Evironments、Globals

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "var1": "writable",
    "var2": "readonly",
    "var3": "off"
  }
}
```

- Environments 预置环境
  browser/node/commonjs/shared-node-browser/es6/es2017/es2020/worker/amd

- globals
  globals 是 env 之外需要额外指定的全局变量，有三种配置值：
  1. writeable - 可写
  2. readonly - 只读
  3. off - 不支持

#### Rules

ESLint 无默认开启规则，但提供了推荐开启的规则："extends"："eslint:recommended",可在这里查看所有内置规则的列表：[Rules](https://eslint.org/docs/rules/)

```json
{
  "rules": {
    // 允许非全等号
    "eqeqeq": "off",
    // 尽可能使用花括号
    "curly": "error",
    // 双引号
    "quotes": ["error", "double"],
    // 除了warn和error之外，对console.*方法发出警告
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    // 必须写分号，除了lastInOneLineBlock
    "semi": [2, "always", { "omitLastInOneLineBlock": true }],
    // plugin1 中的规则，不是内置规则
    "plugin1/rule1": "error"
  }
}
```

- 错误级别

  1. "off"或 0 关闭规则
  2. "warn"或 1 将规则视为一个警告
  3. "error"或 2 将规则视为一个错误

- 配置形式

  1. 值：数字或字符串，表示错误级别
  2. 数组：第一项是错误级别，之后的各项是对该规则的额外的配置

#### Plugins

ESLint 的插件是对一系列 rules、environments、globals、processors 等配置的封装，以`eslint-plugin-vue`为例：

```js
// eslint-plugin-vue 的入口文件index.js
// 这个配置集成好了一些配置，用户如果有需要可以直接继承它，不需要额外指定
module.exports = {
  rules: {
    'array-bracket-newline': require('./rules/array-bracket-newline'),
    'array-bracket-spacing': require('./rules/array-bracket-spacing'),
    'arrow-spacing': require('./rules/arrow-spacing'),
    // ......
  },
  config: {
    base: require('./configs/base'),
    essential: require('./configs/essential'),
    'no-layout-rules': require('./configs/no-layout-rules'),
    recommended: require('./configs/recommended'),
    // .....
  },
  // processors 在被ESLlint处理之前都会被eslint-plugin-vue处理一便
  processors: {
    '.vue': require('./processor'),
  },
}
```

使用方式

1. 可以单独引用规则
2. 可以直接使用（继承）eslint-plugin-vue 配置好的 config
3. 预处理器的作用：解析.vue 文件

#### Plugins 的使用

使用`eslint-plugin-vue`的 vue 工程为例子

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential', // eslint-plugin-vue
    'eslint:recomended',
    '@vue/prettier',
  ],
  parseroption: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
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

<font style="color:red">extends 和 plugins 的区别，extends 是全家桶，继承插件的全部配置；plugins 是 DIY,是根据自己的情况在 Rules 里进行配置。</font>

#### Extends

Extends 是一种非常灵活的 ESLint 配置机制，使用 Extends 可以依次递归地应用每一个 eslint 配置文件，实现灵活的组合

```json
{
  // 继承单个配置
  "extends": "eslint:recommended",
  // 继承多个配置，后面的可能覆盖前面的
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "extends": [
    "./node_modules/coding-standard/eslintDefaults.js",
    "./node_modules/coding-standard/.eslintrc-es6",
    "./node_modules/coding-standard/.eslintrc-jsx"
  ]
}
```

- 可以用 extends 来全家桶式地使用第三方配置好的规则
- extends 可以嵌套
- 使用 extends 之后，我们的 rules 可以覆盖重写第三方规则、只改变第三方规则的错误等级、添加新的规则

### 2.1.3 编写自己的 ESLint 规则

规则：no-caller，禁止 argutments.caller 和 arguments.callee 的使用

- meta 部分主要包括规则的描述、类别、文档地址、修复方式以及配置下 schema 等信息
- create 则需要定义一个函数用于返回一个包含遍历规则的对象，并且该函数会接收 context 对象作为参数
- [ESLint 开发指南](https://eslint.org/docs/developer-guide/architecture)

```js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      descripttion:
        'disallow the use of `arguments.caller`' + 'or `arguments.callee`',
      category: 'Best Practices',
      recommended: false,
      url: 'http://eslint.org/docs/rules/no-caller',
    },
    schema: [],
    messages: {
      unexpected: 'Avoid arguments.{{prop}}',
    },
  },
  create(context) {
    return {
      MemberExpression(node) {
        const objetName = node.object.name,
          propertyName = node.property.name
        if (
          objectName === 'arguments' &&
          !node.computed && // 必须是静态的属性访问方式a.b而不是a[b]
          propertyName &&
          propertyName.match(/^calle[er]$/u)
        ) {
          context.report({
            // context eslint全局上下文，report输出错误日志
            node, // 出错的节点
            messageId: 'unexpexted', // 报错的提示信息
            data: { prop: propertyName }, // prop 和meta中的message结合渲染出正确的提示信息
          })
        }
      },
    }
  },
}
```

:tomato: 案例：检查 class 是否包含 constructor 构造方法

利用这个网站[astexplorer](https://astexplorer.net/)比较有 constructor 和没有 constructor 的变化，然后劫持`ClassDeclaration`
看里面的节点是否有`MethodDefinition`和 kind 是不是`constructor`

```js
// no-constructor.js
module.exports = {
  meta: {
    docs: {
      description: 'required class constructor',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    return {
      ClassDeclaration(node) {
        const body = node.body.body
        const result = body.some(
          (element) =>
            element.type === 'MethodDefinition' &&
            element.kind === 'constructor'
        )
        if (!result) {
          context.report({
            node,
            message: 'no constuctor found',
          })
        }
      },
    }
  },
}
```

- meta 部分
- create 部分-在什么时机价差？-ClassDeclaration
- create 部分-怎么检查？-遍历 AST
- 怎么知道 AST 的结构呢？[astexplorer](https://astexplorer.net/)

完整代码可以查看项目根目录<font style="color:red">/examples/engineering/2.1/coding-standards</font>

### 2.1.4 Stylelint 介绍

Stylelint 是目前生态最丰富的样式代码检查方案，主要有如下特点：

- 社区活跃
- 插件化，功能强大
- 不仅支持 css，还支持 scss、sass 和 less 等预处理器
- 已在 Facebook、GitHub 和 WordPress 等大厂得到广泛应用

### 2.1.5 建立代码规范- Prettier

- prettier 是啥？

一个流行的代码格式化的工具

- 为什么需要 Prettier

1. Prettier 称自己最大的作用是：可以让大家停止对“代码格式”的无意义的辩论。
2. Prettier 在一众工程化工具中非常特殊，它毫不掩饰地称自己是“有主见的”，且严格控制配置项的数量，它对默认格式的选择，完全遵循`让可读性最高`这一标准
3. Prettier 认为，在代码格式化方面牺牲一些灵活性，可以让开发者带来更多的收益，不得承认 Prettier 是对的。

#### Prettier VS Linters

Prettier 认为 lint 规则分为两类

1. 格式优化类：max-len、no-mixed-spaces-and-tabs、keyword-spacing、comma-style
2. 代码质量类：no-unused-vars、no-extra-bind、no-implicit-globals、prefer-promise-reject-errors

prettier 只关注第一类，且不会以报错的形式告知格式问题，而是在允许开发者按自己的方式编写代码，但是会在 特定时机（save、commit）将代码格式化
为可读性最好的形式

:tomato: Prettier 的配置

```json
// .prettierrc
{
  "parser": "babylon", //使用parser
  "printWidth": 80, // 换行字符串阀值
  "tabWidth": 2, // 缩进空格数
  "useTabs": false, // 使用空格缩进
  "semi": true // 句末加分号
  //......
}
```

:tomato: Prettier 使用

在很多方式去触发 Prettier 的格式化行为：Cli、Watch Changes、git hook 与 linter 集成

- Watch Changes

```js
// package.json
{
    "script": {
        "prettier-watch": "onchange '**/*.js --prettier --write {{changed}}"
    }
}
```

#### 与 ESlint 集成

```js
yarn add --dev eslint-config-prettier eslint-plugin-prettier
```

eslint-config-prettier : 禁止 eslin 中与 prettier 相冲突的规则，当 eslint 与 prettier 相冲突时，eslint 的规则不会报错。
eslint-plugin-prettier：让 eslint 以 prettier 的规则去检查代码，格式化的代码全部听 prettier。

```json
// .eslintrc.json
{
  "extends": ["plugin:prettier/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## 2.2 版本规范和 Changelog

### 2.2.1 npm 包的版本

#### Semantic Versioning

![](~@/engineering/semantic.png)

前面的是正式版本，后面的是 pre-release 版本

- major

主版本，一般代表这 Breaking Change，例如 vue1.x 和 vue2.x、webpack 3.x 和 webpack4.x

- minor

次版本，一般代表着新的 feature 的出现

- patch

一般不包含新功能，知识 bugfix 或和功能关系不大的修改

- pre-release
  - alpha
  - beta
  - ...
  - rc(release candidate)

预发行版本，一般用于正式版发行前的验证、联调和测试，和正式版本好之间用-连接

- 大小比较

```js
2.3.2 > 2.2.17 > 2.2.17-beta.1 > 2.2.17-beta.0 > 2.2.17-alpha.1 > 2.2.16
```

#### 版本范围

```js

// 1. - 表示范围，边界可等

- 案例： 1.2.3-2.3.4   // 大于等于1.2.3 小于等于 2.3.4

// 2. x 表示通配，和各种语言的通配符一样

x 案例：1.2.x  // 大于等于1.2.0 小于1.3.0

// 3. ～ 表示限制minor版本的升级

～ 案例：～1.2.3  //  大于1.2.3 小于1.3.0

// ^ 表示允许第二个非零的版本的升级

^ 案例：^1.2.3 // 大于1.2.3 小于2.0.0
^ 案例：^0.2.3 // 大于0.2.3 小于0.3.0
^ 案例：^0.0.3 // 大于0.0.3 小于0.0.4
```

#### 为什么我们要遵循 Semantic Versioning ？

- 为了让我们的版本语义和 npm 社区统一，可以让我们的 npm 包可以正确的被用户使用
- 享受社区生态带来的遍历，让我们可以利用社区现有的方案，更灵活的管理依赖的版本

### 2.2.2 changelog

- 什么是 changelog？

Changelog 是以时间为倒序的列表，记录所有版本的重大变化

- 为什么要有 Changelog？

为什么让我提供库和框架的用户了解每个版本发生了哪些变化，提供多于版本号的信息

### 2.2.3 自动化的 npm 包版本控制和 Changelog

- release-it
  - 根据 git commit 自动生成版本号
  - 自动生成 Changelog
  - 丰富的 hooks 用来定制发版逻辑
  - 提供插件机制，高度可扩展

release-it 配置文件

```json
{
  "hooks": {
    "after:bump": "auto-changelog -p"
  },
  "git": {
    "changelog": "auto-changelog --stdout --commit-limit false",
    "requireCleanWorkingDir": false,
    "requireUpstream": true,
    "requireCommits": false,
    "addUntrackeFiles": false,
    "commit": true,
    "commitMessage": "version release ${version}",
    "commitArgs": "",
    "tag": true,
    "tagName": "${version}",
    "tagAnnotation": "Release ${version}",
    "taArgs": "",
    "push": true,
    "pushArgs": "--follow-tags",
    "pushRepo": "origin"
  },
  "npm": {
    "publish": true,
    "publishPath": ".",
    "access": null,
    "otp": null
  },
  "plugins": {
    "@release-it/conventional-changlog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
}
```

package.json

```json
{
  "script": {
    "release": "release-it",
    "release:alpha": "release-it --preRelease=alpha",
    "release:beta": "release-it --preRelease=beta"
  }
}
```

案例：

```bash
git add .
git commit -m"feat: update xxx"
yarn release
# 一路回车
```

### 扩展学习资料

:::tip .npmrc-npm 的配置文件

由于国内网络问题，部分常用的二进制依赖下载速度较慢，为了加速二进制依赖下载，我们可以利用.npmrc 配置国内的镜像源：

ELECTRON_MIRROR = "https://npm.taobao.org/mirrors/electron/" electron

PHANTOMJS_CDNURL = "https://npm.taobao.org/mirrors/phantomjs/" phantomjs

SASS_BINARY_SITE = "https://npm.taobao.org/mirrors/node-sass/" node-sass
:::
