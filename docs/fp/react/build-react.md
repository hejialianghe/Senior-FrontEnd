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
+    render(child, dom)
+  )
​
  container.appendChild(dom)
}
```
我们还需要处理文本元素，如果元素类型为TEXT_ELEMENT，我们创建一个文本节点而不是常规节点。
```diff
function render(element, container) {
+  const dom =
+    element.type == "TEXT_ELEMENT"
+      ? document.createTextNode("")
+       : document.createElement(element.type)
​
​  element.props.children.forEach(child =>
    render(child, dom)
   )
​
  container.appendChild(dom)
}
```
我们在这里需要做的最后一件事是将 element props 分配给节点。
```diff
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
​
+ const isProperty = key => key !== "children"
+ Object.keys(element.props)
+    .filter(isProperty)
+   .forEach(name => {
+     dom[name] = element.props[name]
+   })
​
  element.props.children.forEach(child =>
    render(child, dom)
  )
​
  container.appendChild(dom)
}

```

就是这样。我们现在有一个可以将 JSX渲染到DOM的库。

---
### Step3: Concurrent Mode (并行模式)

但。。。在我们开始添加更多代码之前，我们需要一个重构

这个递归调用有问题。

一旦我们开始渲染，我们不会停止，直到我们渲染了完整的元素树。如果元素树很大，则可能会阻塞主线程太久。如果浏览器需要执行高优先级作，例如处理用户输入或保持动画流畅，则必须等到渲染完成。

因此，我们将工作分解为小单元，完成每个单元后，如果有其他需要完成的事情，我们将让浏览器中断渲染。

我们用来requestIdleCallback制作一个循环。你可以把它看requestIdleCallback是一个setTimeout ，但浏览器会在主线程空闲时运行回调，而不是我们告诉它何时运行。

React不再使用 requestIdleCallback，现在，它使用scheduler package 。但对于这个用例，它在概念上是相同的。

requestIdleCallback还给了我们一个 deadline 参数。我们可以使用它来检查浏览器需要再次控制之前我们还有多少时间

截至 2019 年 11 月，Concurrent 模式在 React 中还不稳定。循环的稳定版本看起来更像这样：

```js
while (nextUnitOfWork) {
  nextUnitOfWork = performUnitOfWork(
    nextUnitOfWork
  )
}
```

要开始使用循环，我们需要设置第一个工作单元，然后编写一个performUnitOfWork函数，该函数不仅执行工作，还返回下一个工作单元。

```js
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
​
function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
```
---
###  Step4:  Fibers
要组织工作单元，我们需要一个数据结构：fibers树。

我们将为每个element提供一个fiber，并且每个fiber将是一个工作单元。

让我给你看一个例子。

假设我们想要渲染一个像这样的个element树：

```jsx
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
```
![](~@/fp/react/fiber1.png)

​在渲染阶段，我们将创建根Fiber节点并将其设为 nextUnitOfWork。剩余的工作将在 performUnitOfWork 函数中完成，该函数会对每个 Fiber 节点执行以下三个步骤：​

1. ​创建当前Fiber对应的 DOM 元素

2. 为element’s的子元素创建fiber(Reconcile)

3. ​选择下一个工作单元（nextUnitOfWork）​

这种数据结构的设计目标之一，是便于快速定位下一个待处理的工作单元（next unit of work）。为此，每个 Fiber 节点都包含指向其第一个子节点（first child）、相邻兄弟节点（next sibling）和父节点（parent）的链接。

![](~@/fp/react/fiber2.png)

当我们完成对某个Fiber节点的处理后，如果它有子节点，那么该子节点将成为下一个工作单元（遵循深度优先遍历原则）。

从我们的示例中，当我们完成div对fiber的工作时，下一个工作单元将是h1光纤。

![](~@/fp/react/fiber3.png)

若当前 Fiber 节点没有子节点，则将其兄弟节点（sibling）设为下一个工作单元（遵循深度优先遍历规则）。

例如，当 p Fiber 节点没有子节点时，处理完p后，下一个工作单元将是其兄弟节点 a Fiber（假设 a 是 p 的相邻兄弟节点）。

![](~@/fp/react/fiber4.png)

如果某个Fiber节点既没有子节点也没有兄弟节点，则会回溯到其父节点的兄弟节点（即“叔叔节点”，如示例中的 a 和 h2 Fiber）。

![](~@/fp/react/fiber5.png)

如果父节点也没有兄弟节点，我们将持续向上回溯父节点链，直到找到某个祖先节点存在兄弟节点，或者最终抵达根节点（root）。如果已回溯到根节点且无更多任务，则意味着本次渲染的所有工作均已完成。

现在让我们将其放入代码中。

首先，让我们从render函数中删除此代码。

我们将创建 DOM 节点的部分保留在它自己的函数中，我们稍后会使用它。

```js
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}
```
在函数中render，我们设置为nextUnitOfWork纤程树的根。

```js
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}
```
然后，当浏览器准备就绪时，它将调用我们的workLoop，我们将开始在根上工作。

当浏览器准备就绪时（例如主线程空闲），它将调用我们的workLoop​，此时我们会从根Fiber（root）开始处理整个 Fiber 树的协调（Reconciliation）任务。

```js
function performUnitOfWork(fiber) {
  // 1.首先，我们创建一个新的DOM节点，并将其追加到父节点中（通常在React的提交阶段完成，而非协调阶段）。
  // 我们将DOM节点关联并跟踪在fiber.dom 属性中，以便后续操作（如更新、插入或删除）能直接通过 Fiber 节点引用对应的真实 DOM。
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
​

 // 随后，我们为每个子元素（child）创建一个新的 Fiber 节点，并将其链接到当前 Fiber 的子节点链表中。
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    // ​我们会将新创建的 Fiber节点加入Fiber树中，根据其是否为父节点的第一个子元素，将其设置为父节点的子节点（child）或前一个子节点的兄弟节点（sibling）。
​
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }

​//最终，我们会按照以下顺序查找下一个工作单元（next unit of work）：​优先子节点（child），其次是兄弟节点（sibling），然后是父节点的兄弟节点（“叔叔节点”），依此类推向上回溯，直到找到下一个待处理的 Fiber 或抵达根节点。
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```
这就是我们的 performUnitOfWork .

---
### Step5:  Render 和 Commit 阶段 
我们这里有另一个问题。

我们在处理每个element时，都会向DOM添加一个新节点。请记住，浏览器可能会在我们完成整个树的渲染之前中断我们的工作。这种情况下，用户将看到不完整的UI界面。而这正是我们需要避免的情况。

所以我们需要从这里删除改变 DOM 的部分。

```diff
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
- if (fiber.parent) {
-   fiber.parent.dom.appendChild(fiber.dom)
- }
  ...
}
```
相反，我们将追踪Fiber树的根节点。我们将其称为"进行中根节点"（work in progress root）或简写为wipRoot

```diff
function render(element, container) {
+  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
+  nextUnitOfWork = wipRoot
}
​
let nextUnitOfWork = null
let wipRoot = null
```
当我们完成所有工作时（通过没有下一个工作单元来判断），就会将整个Fiber树提交到DOM。

```diff
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
​
+ if (!nextUnitOfWork && wipRoot) {
+    commitRoot()
+  }
​
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
```
我们通过commitRoot函数实现这一过程。在该函数中，我们会递归地将所有节点附加到DOM树。

```diff
function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```
---
###  Step6: Reconciliation （协调算法）
---
###  Step7: Function Components 函数组件 
---
###  Step8:  Hooks 
