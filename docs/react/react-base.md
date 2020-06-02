## 2.1 搭建React环境

安装nodejs+vscode，用nvm去管理node版本

### 2.1.1 create-react-app

文档地址：[create-react-app](https://www.html.cn/create-react-app/docs/getting-started/)

创建一个项目：npx create-react-app my-app

终端输入：`yarn eject` 生成一个项目的依赖

文档目录
```bash
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html    # 入口
    favicon.ico
    robots.txt    # 搜索引擎爬取配置信息
    manifest.json # 配置页面需要的meta信息
  src/            # 项目主目录
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```
### 2.1.2 开始前的配置

####  安装第三方插件

在vscode商店里下载

- simple react  快速生成react模版，可以看插件具体文档

- prettier     格式化代码

```js
  module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需不要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: true,
  // 末尾不需要逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  // endOfLine: 'lf',
  // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  bracketSpacing: true
}
```

- 配置vscode编辑配置文件

可以配置针对该项目的配置文件，在根目录创建.vscode/settings.json

settings.json配置信息
```js
{
  "eslint.autoFixOnSave": true, //eslint保存格式化
  "prettier.eslintIntegration": true, // 让prettier遵循eslint格式美化
  "eslint.enable": true, //是否开启vscode的eslint
  "files.eol": "\n",
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "html", "typescript", "typescriptreact"], //确定校验准则
  "files.associations": {
    "*.jsx": "javascriptreact"
  },

  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}

```

### 2.1.3 线上项目编辑器

[codesandbox](https://codesandbox.io/)


## 2.2 组件和JSX

### 2.2.1 编写react元素

react 元素就是一个javascript对象

```js{2}
const element=<h1>hello react</h1>
console.log(element);
// render方法将react元素渲染到页面上
ReactDOM.render(element, document.getElementById('root'));

// 打印结果
{
$$typeof: Symbol(react.element)
key: null
props:{children: "hello react"}
ref: null
type: "h1"
}
```

### 2.2.2 jsx

jsx是javascript的语法扩展，使用xml标记的方式直接声明界面

#### jsx是什么

- 不是模版引擎语言

模版引擎语言Angular和vue中template的语法，js模版的作用就是输入模版的字符串+数据，经过渲染得到渲染过的字符串；jsx不是这样的模版引擎，它是带语法糖的ATX，其实是抽象的语法树，语法糖放到了构建阶段，所以运行的时候不需要解析。

- 声明示方式创建UI，处理UI逻辑

- 遵循javascript语法，无学习门槛

#### react通过babel将jsx转换浏览器识别的语言

[bable](https://www.babeljs.cn/repl)

```js
const ele=<div className="root">
         <p>hello</p>
      </div>

  // 转换后
var ele = /*#__PURE__*/React.createElement("div", {
  className: "root"
}, /*#__PURE__*/React.createElement("p", null, "hello"));
// 通过createElement创建元素
```
react通过层层嵌套的方法，把我们输入的语句转换成浏览器识别的代码，这就是`jsx`背后的原理

#### jsx 规则

- 在jsx中潜入表达式，用`{}`包裹
- 大写开头作为定义组件，小写tag作为原生的dom节点
- jsx标签可以有特定属性和子元素
- jsx只能有一个根元素

#### jsx 实践

```jsx
  class main extends Components {
    constructor(props){
      super(props)
       this.state={
        name:"zs",
        age:12
      }
      this.addage.bind(this)
    }
    addage(){
      return this.state.age+12
    }
    render(){
      const flag=true
      const list = [1, 2, 3]
      return (
        // jsx需要一个根元素
        <div className="main">
          <p>{this.state.name}</p>
          <p>{this.state.age>18?'成年':'未成年'}</p>
          <p>{this.addage()}</p>
            {/* 三元表达式判断显示元素 */}
          {
            flag?
          <p>元素1</p>
             :
          <p>元素1</p>
          }
          {/* 只能用map循环 */}
          {list.map((item) => {
            return <div key='item'>{item}</div>
          })}
        </div>
      )
    }
  }
```
jsx需要一个根元素包裹，因为jsx是通过babel进行转译，其实就是通过`React.createElement()`，它的第一个参数需要一个元素，如果出现2个就无法识别了

#### Fragments

用Fragments替换根元素，而且此标签不渲染到页面中

```jsx
  class main extends Components {
    render(){
      return (
        <React.Fragments>
          <p>{this.state.name}</p>
          <p>{this.state.age>18?'成年':'未成年'}</p>
          <p>{this.addage()}</p>
       </React.Fragments>
      )
    }
  }
  // 或者用react提供的简洁方法
    class main extends Components {
    render(){
      return (
        <>
          <p>{this.state.name}</p>
          <p>{this.state.age>18?'成年':'未成年'}</p>
          <p>{this.addage()}</p>
       </>
      )
    }
  }
```
为什么使用Fragments

- 可以包含并列的子元素
- 编写表格组件，包裹子元素让html生效

## 2.3 props、列表渲染

什么是props？

当react元素作为自定义组件，将jsx所接受的属性转换成单个对象传递给组件，这个对象被称为“props”（就是父组件传递给子组件的对象）

- props是组件的固有属性
- 不可在组件内部对props进行修改
- 更新props：需要通过父组件重新传入新的props，更新子组件（单向数据流）
