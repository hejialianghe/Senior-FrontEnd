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
### 2.1.1 开始前的配置

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

可以配置针对改项目的配置文件，在跟目录创建.vscode/settings.json

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
    "*.tsx": "typescriptreact"
  },

  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}

```

### 2.1.2 线上项目编辑器

[codesandbox](https://codesandbox.io/)


## 2.1 组件和JSX

### 2.1 编写react元素



