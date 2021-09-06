## 2.1 搭建 React 环境

安装 nodejs+vscode，用 nvm 去管理 node 版本

### 2.1.1 create-react-app

文档地址：[create-react-app](https://www.html.cn/create-react-app/docs/getting-started/)

创建一个项目：npx create-react-app my-app

建一个 ts 项目：npx create-react-app my-app --typescript

终端输入：`yarn eject` （慎用，会把潜藏的 react-script 弹射到应用层，此操作不可逆）

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

#### 安装第三方插件

在 vscode 商店里下载

- simple react 快速生成 react 模版，可以看插件具体文档

  编辑器中输入`cc`生成类组件，`sfc`生成函数示组件

- prettier 格式化代码

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
  bracketSpacing: true,
}
```

- 配置 vscode 编辑配置文件

可以配置针对该项目的配置文件，在根目录创建.vscode/settings.json

settings.json 配置信息

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

## 2.2 组件和 JSX

### 2.2.1 编写 react 元素

react 元素就是一个 javascript 对象

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

jsx 是 javascript 的语法扩展，使用 xml 标记的方式直接声明界面

#### jsx 是什么

- 不是模版引擎语言

模版引擎语言 Angular 和 vue 中 template 的语法，js 模版的作用就是输入模版的字符串+数据，经过渲染得到渲染过的字符串；jsx 不是这样的模版引擎，它是带语法糖的 ATX，其实是抽象的语法树，语法糖放到了构建阶段，所以运行的时候不需要解析。

- 声明示方式创建 UI，处理 UI 逻辑

- 遵循 javascript 语法，无学习门槛

#### react 通过 babel 将 jsx 转换浏览器识别的语言

[bable](https://www.babeljs.cn/repl)

```js
const ele = (
  <div className="root">
    <p>hello</p>
  </div>
)

// 转换后
var ele = /*#__PURE__*/ React.createElement(
  'div',
  {
    className: 'root',
  },
  /*#__PURE__*/ React.createElement('p', null, 'hello')
)
// 通过createElement创建元素
```

react 通过层层嵌套的方法，把我们输入的语句转换成浏览器识别的代码，这就是`jsx`背后的原理

#### jsx 规则

- 在 jsx 中潜入表达式，用`{}`包裹
- 大写开头作为定义组件，小写 tag 作为原生的 dom 节点
- jsx 标签可以有特定属性和子元素
- jsx 只能有一个根元素

#### jsx 实践

```jsx
class main extends Components {
  constructor(props) {
    super(props)
    this.state = {
      name: 'zs',
      age: 12,
    }
  }
  addage() {
    return this.state.age + 12
  }
  render() {
    const flag = true
    const list = [1, 2, 3]
    return (
      // jsx需要一个根元素
      <div className="main">
        <p>{this.state.name}</p>
        <p>{this.state.age > 18 ? '成年' : '未成年'}</p>
        <p>{this.addage.call(this)}</p>
        {/* 三元表达式判断显示元素 */}
        {flag ? <p>元素1</p> : <p>元素1</p>}
        {/* 只能用map循环 */}
        {list.map((item) => {
          return <div key="item">{item}</div>
        })}
      </div>
    )
  }
}
```

jsx 需要一个根元素包裹，因为 jsx 是通过 babel 进行转译，其实就是通过`React.createElement()`，它的第一个参数需要一个元素，如果出现 2 个就无法识别了

#### Fragments

用 Fragments 替换根元素，而且此标签不渲染到页面中

```jsx
class main extends Components {
  render() {
    return (
      <React.Fragment>
        <p>{this.state.name}</p>
        <p>{this.state.age > 18 ? '成年' : '未成年'}</p>
        <p>{this.addage()}</p>
      </React.Fragment>
    )
  }
}
// 或者用react提供的简洁方法
class main extends Components {
  render() {
    return (
      <>
        <p>{this.state.name}</p>
        <p>{this.state.age > 18 ? '成年' : '未成年'}</p>
        <p>{this.addage()}</p>
      </>
    )
  }
}
```

为什么使用 Fragments

- 可以包含并列的子元素
- 编写表格组件，包裹子元素让 html 生效

### 2.2.3 拓展学习资料

[Babel 和 ATS 抽象语法树 1](https://juejin.im/post/5ab9f2f3f265da239b4174f0)

[Babel 和 ATS 抽象语法树 2](https://github.com/barretlee/babel-plugin-ast)

## 2.3 props、列表渲染、条件渲染

什么是 props？

当 react 元素作为自定义组件，将 jsx 所接受的属性转换成单个对象传递给组件，这个对象被称为“props”（就是父组件传递给子组件的对象）

- props 是组件的固有属性
- 不可在组件内部对 props 进行修改
- 更新 props：需要通过父组件重新传入新的 props，更新子组件（单向数据流）

### 2.3.1 示例

```jsx
const listData={name:'react'}
  // 父组件
  funtion App (){
    return (
      <div>
        {/* 传递数据listData*/}
        <ListItem data={listData}></ListItem>
      <div>
    )
  }
```

```jsx
  // 子组件
  class ListItem extends Component {
   constructor(props){
     super(props) //子类中调用父类构造函数
   }
    render() {
        return (
            <div>
             <div>
             {/* 通过props拿到值 */}
              {this.props.data.name}
            <div>
          <div>
         );
    }
}
```

#### 函数示组件

- 函数组件也叫无状态组件
- 组件内部没有 this
- 没有声明周期

改写如下

```jsx
  // 子组件
  funtion ListItem (props){
    return (
      <div>
        <div>
          {/* 通过props拿到值 */}
         {props.data.name}
        <div>
      <div>
    )
  }
```

当前组件如果是纯展示组件，可以用函数组件，函数组件是一个纯函数，用函数组件可以得到性能的提升

### 2.3.2 列表渲染

```jsx
const listData=[{name:'react',id:1},{name:'vue',id:2}]
  // 父组件
  funtion App (){
    return (
      <div>
        {/* 传递数据listData*/}
       {
         listData.map(item=>{
           return <ListItem data={item} key={item.id}/>
         })
       }
      <div>
    )
  }
```

### 2.3.3 条件渲染

条件渲染的主要方法

- 使用三目运算符
- 使用函数做条件判断
- 使用与运算符 && 判断

```jsx

  class ListItem extends Component {
   constructor(props){
     super(props) //子类中调用父类构造函数
   }
   renderList(){
     if(this.props.data.name==='react'){
       return <div>jsx</div>
     }else {
       return <div>template</div>
     }
   }s
   render(){
    return (
      <div className='listItem'>
        {/* 使用三目运算符*/}
        <div className={`thend-grid`${this.props.data.name==='react'?'-blue':'-green'}}>
         {this.props.data.name==='react'?'jsx':'template'}
        <div>
          {/*使用函数做条件判断*/}
        {this.renderList.call(this)}
          {/*使用与运算符 && 判断*/}
        {this.props.data.name==='react' && <div>jsx</div>}
      <div>
    )
   }
  }

```

### 2.3.4 拓展学习资料

[列表渲染进阶知识](https://zhuanlan.zhihu.com/p/41237949)

[更多的条件渲染的方式](https://juejin.im/post/5ab0bff06fb9a028d444696b)

## 2.4 CSS in React

### 2.4.1 行内样式

```jsx
  <div style={{fontSize:18;color:red}}></div>
```

### 2.4.2 引入 css 样式表

```jsx
     src/
        components/
          ListItem/
            index.jsx
            index.css //也可以用scss，文件命名index.css
  // 我们在index.css 定义样式
    .title{
      color:red;
    }

 //在ListItem导入
    import './index.css'
    class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数
   }

   render(){
    return (
      <div className='listItem'>
        <span className='title'>header<span>
      <div>
    )
   }
  }
```

上面的在 index.css 写法，里面的样式是全局样式，会造成全局污染，可以用 css module 解决

#### css module

- 不使用选择器，使用 class 名定义样式
- 不层叠 class，使用一个 class 定义样式
- 用过 compose 来组合

```jsx
       src/
        components/
          ListItem/
            index.jsx
            index.module.css //命名方式加入module
  // 我们在index.css 定义样式
    .title{
      color:red;
    }

 //在ListItem导入对象
    import style from 'index.module.css'
    class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数
   }

   render(){
    return (
      <div className='listItem'>
        <span className={style.title}>header<span>
      <div>
    )
   }
  }
```

### 2.4.3 css 管理进阶

css 管理工具

- Styled-component
- Classnames

```jsx
       src/
        components/
          ListItem/
            index.jsx
            index.module.css //命名方式加入module
  // 我们在index.css 定义样式
    .title{
      color:red;
    }
    .themd {
      background:'red'
    }

 //在ListItem导入对象
    import style from 'index.module.css'
    import classnames from 'classnames/bind'
    const cls=classnames.bind(style)

    import cn from 'classnames'
    class ListItem extends Component {
     constructor(props){
     super(props) //子类中调用父类构造函数
   }

   render(){
     const flag=true
     const _cn=cn({
       'themd':flag
     })
    return (
      <div className='listItem'>
        {/* css Module+classnames/bind */}
        {/* css module 结合 classnames 可以添加2个类名 */}
        <span className={cls('title','themd')}>header<span>
        {{/* classnames */}
        <span className={_cn}></span>
      <div>
    )
   }
  }
```

### 2.4.4 扩展

[css module](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

[styled component](https://www.styled-components.com/)

[在 React 中使用 css 预编译](https://juejin.im/post/5c3d67066fb9a049f06a8323)
