## 背景

我们将从头开始重写react，遵循真实的React代码架构，没有优化和非必要功能。

如果您读过我之前的[build your own React](https://pomb.us/build-your-own-react/)，不同之处在于这篇文章基于 React16.8，所以我们现在可以使用hooks并删除与class相关的所有代码。

你可以在 Didact 存储库中找到旧博客文章和代码的历史记录。还有一个演讲涵盖了相同的内容。但这是一个独立的帖子。

## 目录

- Step0: Review(回顾)
* Step1: The createElement Function(createElement 函数)
* Step2: render Function
* Step3: Concurrent Mode (并行模式)
* Step4: Fibers
* Step5: Render 和 Commit 阶段
* Step6: Reconciliation （协调算法）
* Step7: Function Components（函数组件）
* Step8: Hooks

## 详细

### Step0:  Review(回顾)

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
以上就是一个React Element ，一个具有两个属性（type与props）的对象。（好吧，它还有更多，但我们只关心这两个）。

这个type是一个字符串，它指定了我们要创建DOM node节点的类型，tagName是你想要通过document.createElement创建HTML元素时传递给它的字符串；它也可以是个函数，但我们将它留给Step7

props是另一个对象，它具有JSX属性中的所有键和值。它还具有特殊属性：children。

children在本例中是一个字符串，但它通常是一个包含更多elements的数组。这就是为什么elements也是树。

我们需要替换的另一段React代码：ReactDOM.render。

render是 React 更改 DOM 的地方，所以让我们手动实现dom的更新。

首先我们使用element type属性创建了一个 DOM node ，在这个例子中是h1 。

然后我们将所有 element props 分配给这个DOM node，在这里是只有一个 title。

```javascript
const node = document.createElement(element.type)
node["title"] = element.props.title
```

:::tip
为了避免混淆，我将使用 “element” 来指代 React元素，使用 “node” 来指代 DOM 元素。
:::

然后，我们为子节点创建节点。我们只有一个字符串作为子节点，所以我们创建了一个文本节点。

```javascript
const text = document.createTextNode("")
text["nodeValue"] = element.props.children
```

使用textNode而不是设置innerText，接下来我们以后以相同的方式处理。还要注意我们如何设置nodeValue标题，这个过程与给 h1 设置 title props类似，这就像是字符串中带有这样一个 props: {nodeValue: "hello"}。

最后，我们将textNode 添加至 h1，将h1添加至 container 。

现在我们有了和以前一样的app，但没有使用React。

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
​
const container = document.getElementById("root")
​
const node = document.createElement(element.type)
node["title"] = element.props.title
​
const text = document.createTextNode("")
text["nodeValue"] = element.props.children
​
node.appendChild(text)
container.appendChild(node)
```
---
### Step1: The createElement Function(createElement 函数)

让我们从另一个app重新开始。这一次，我们将用我们自己的React版本替换官方React代码。

我们将编写自己的 createElement。

<font color="red">*让我们将 JSX 转换为 JS，这样我们就能实现 createElement 函数的调用了*</font>

正如我们在上一步中看到的，element是带有 type 和 props的对象。我们的函数唯一需要做的就是创建该对象。

```javascript
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
);
```
<font color="red">*我们使用扩展运算符处理props，children使用rest参数语法，这样children将始终是一个数组。*</font>

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
```
**举例：**
- createElement("div") 返回：

```json
{
  "type": "div",
  "props": { "children": [] }
}
```
- createElement("div", null, a)

```json
{
  "type": "div",
  "props": { "children": [a] }
}
```
- createElement("div", null, a, b)

```json
{
  "type": "div",
  "props": { "children": [a, b] }
}
```
数组children还可以包含字符串或数字等原始值。因此我们为所有不是对象的内容创建一个独立的元素，并为其创建一个特殊的类型： TEXT_ELEMENT 。

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
			children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```
React在没有子元素时不会包装原始值或创建空数组，但我们这样做是因为它能简化我们的代码，且对于我们的库来说，我们更倾向于简洁的代码而不是性能优化。
我们仍在使用React的createElement。
```javascript
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
)
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
为了替换它，我们给我们的库取个名字；这个名字需要听起来像 React，同时又能暗示它的教学目的；我们将其称为 Didact.
```javascript
const Didact = {
  createElement,
}
​
const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
)
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
但我们仍然希望在这里使用 JSX。我们如何告诉 babel 使用Didact的createElement而不是React的？
如果我们有这样的注释，当 babel转译JSX 时，它将使用我们定义的函数。
```js
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```
---
### Step2:render Function
接下来，我们需要编写函数的ReactDOM.render版本;目前，我们只关心向DOM添加内容。我们稍后会处理更新和删除。
我们首先使用element类型创建 DOM 节点，然后将新节点附加到容器中。
```javascript
function render(element, container) {
  const dom = document.createElement(element.type)
​
  container.appendChild(dom)
}
```
我们递归地为每个孩子做同样的事情。
```diff
function render(element, container) {
  const dom = document.createElement(element.type)
​
+ element.props.children.forEach(child =>
    render(child, dom)
  )
​
  container.appendChild(dom)
}

```

---
### Step3: Concurrent Mode (并行模式)
---
###  Step4:  Fibers
---
### Step5:  Render 和 Commit 阶段 
---
###  Step6: Reconciliation （协调算法）
---
###  Step7: Function Components 函数组件 
---
###  Step8:  Hooks 
