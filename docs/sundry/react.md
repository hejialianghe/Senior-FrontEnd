## 【译】build-your-own-react

### 背景

我们将从头开始重写react，遵循真实的React代码架构，没有优化和非必要功能。

如果您读过我之前的[build your own React](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5)，不同之处在于这篇文章基于 React16.8，所以我们现在可以使用hooks并删除与class相关的所有代码。

你可以在 Didact 存储库中找到旧博客文章和代码的历史记录。还有一个演讲涵盖了相同的内容。但这是一个独立的帖子。

* [Step0: Review(回顾)](#0)
* [Step1: The createElement Function(创建函数组件)](#1)
* [Step2: render Function](#2)
* [Step3: Concurrent Mode (并行模式)](#3)
* [Step4: Fibers](#4)
* [Step5: Render 和 Commit 阶段](#5)
* [Step6: Reconciliation （协调算法）](#6)
* [Step7: Function Components 函数组件](#7)
* [Step8: Hooks](#8)


### Step1:  Review(回顾) <a name="0"></a>

我们先回顾一些基本概念，如果你对React、JSX、DOM元素的工作原理比较了解，你可以跳过这一步。

我们将使用以下三行代码的定义一个React App。

```javascript
const element = <h1 title="foo">Hello</h1> // 定义一个react元素
const container = document.getElementById("root") // 从DOM 中获取了一个 DOM node
ReactDOM.render(element, container) // 将 React 元素渲染到容器中
```

下一步我们将react代码替换成普通的javascript代码。

在第一行中，我们用JSX定义的React元素，这不是合规的js代码，因此我们要将其转换成合规的js代码。

JSX 通过Babel等构建工具转换为JS。转换过程通常很简单：将标签(tags)代码替换成createElement的调用，并将标签(tag)名、props 和 children 作为参数传入。

```javascript
const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)
```

React.createElement 根据参数创建对象。除了一些验证之外，这就是它所做的全部工作。因此，我们可以放心地将函数调用替换为其输出。

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```
以上就是一个 React Element ，一个具有两个属性（type与props）的对象。（好吧，它还有更多，但我们只关心这两个）。


### Step1: The createElement Function(创建函数组件) <a name="1"></a>
  
### Step2:render Function <a name="2"></a>

### Step3: Concurrent Mode (并行模式) <a name="3"></a>
### Step4:  Fibers <a name="4"></a>

### Step5:  Render 和 Commit 阶段 <a name="5"></a>
### Step6: Reconciliation （协调算法）<a name="6"></a>

### Step7: Function Components 函数组件 <a name="7"></a>
### Step8:  Hooks <a name="8"></a>
