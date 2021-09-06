## 5.1 React Virtual DOM 原理

### 5.1.1 Virtual DOM 是什么？

官方定义：virtual DOM 是一种编程理念（数据驱动视图），将 ui 虚拟的保持到内存中，并且通过某些库渲染成真实的 dom，这个过程又叫做协调。

总结：virtual dom 是一种编程理念，将 ui 节点抽象成 js 对象。

#### ui 节点抽象

Learn Once，Write anywhere：因为提供了对 HTML DOM 的抽象，所以在 web 开发中，通常不需要去调用 DOM API，也是因为抽象，所以 React 也可以开发 Native（React Native）

#### Virtual dom 构建 UI

以我们经常见的 web 开发为例，来看下 React 是怎么通过 Virtual DOM 渲染成 HTML 元素的。

```jsx
    class App extends Component {
        state={
            text:'Virtual DOM'
        }
        render () {
            const {text}=this.state
            return (
                <div>
                    {text}
                <div>
            )
        }
    }
```

可以看到 React 是通过 render 方法渲染 Virtual DOM ，从而绘制出真实 DOM。意味着每次修改 state 的值就会执行 render 方法

### 5.1.2 Virtual DOM VS 原生 DOM

- 原生 DOM 更新

DOM API 调用更新 UI

- Virtual DOM 更新

1. 每次 render 都会产生一份新的’react dom‘
2. Virtual DOM 要对新旧‘react dom’进行比较，从而确定在旧‘dom’的基础上进行多少变更
3. 确定最优的变更策略之后调用 DOM API 更新

Virtual DOM 数据结构

```js
const globaldom = {
  tagname: 'html',
  children: [
    {
      tagname: 'head',
    },
    {
      tagname: 'body',
      children: [
        {
          tagName: 'div',
          attributes: {
            className: 'test',
          },
        },
      ],
    },
  ],
}
```

对 UI 节点抽象

在 Virtual DOM 中，对 HTML 节点进行抽象，用 js 对象的形式表示 HTML

改变了过去对 HTML 节点的理解

呈现在用户面前的页面就是一个复杂的递归对象

### 5.1.3 Virtual DOM Diff

- Virtual DOM 如何提搞性能

1. 我们将 render 产生的 Virtual DOM 简称 ‘Vdom’
2. 通常调用 setState 方法触发 Vdom 更新
3. 通过对比新旧‘Vdom’确定最优实现新的‘vdom’所需的操作

- Virtual DOM Diff 的层次

1. 层级级别的比较
2. 元素级别的比较

#### Component Diff

![](~@/react/componentdiif.png)

假设将图中的 D 节点更换成 G 节点，会把 D 节点删掉，然后创建 G 节点；只会同层级比较，这样会降低 diff 的复杂度，大概率下面的层级不一样的。

#### Element Diff

1. createChild
2. moveChild
3. removeChild

我们元素之间的对比中，会有 3 种情况：创建节点、删除节点、移动节点

- 创建节点

```js
    createChild:function(child,afterNode,mountImage){
        return makeInserMarku(mountImage,afterNode,child._mountIndex)
    }
```

- 删除节点

```js
    removeChild:function(child,node){
        return makeRemove(child，node)
    }
```

- 移动节点

假设我们把节点 3 移动到第一的位置

![](~@/react/moveChild.png)

```js
// 老的节点和新的节点相同，说明需要移动节点
if(preChild===nextChild){
    updates=enqueue(updates,this.moveChild(preChild,lastPlaceNode,nextIndex,lastIndex))
    lastIndex=Math.max(preChild._mountIndex,lastIndex)
    preChild._mountIndex=nextIndex
}
// 移动的方法
moveChild:function (child,afterNode,toIndex,lastIndex){
    // _mountIndex是这个元素在原有节点的顺序，lastIndex是这次要更新的顺序
    if(child._mountIndex<lastIndex){
        return makeMove(child,afterNode,toIndex)
    }
}
```

在实际中最后一个节点移动到第一位置的时候，不是把最后一个节点直接移动到第一的位置，而是把这个节点前面的节点依次往后移动，直到最后一个节点成为第一的位置。

### 5.1.3 扩展资料

[Virtual DOM 定义](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)

[Virtual DOM Node](https://mithril.js.org/vnodes.html)

[VDom 与 DOM 的区别](https://reactkungfu.com/2015/10/the-difference-between-virtual-dom-and-dom/)

[React 性能优化：Virtual Dom 原理浅析](https://juejin.im/entry/5af99e786fb9a07ac90d5664)

[[译] Virtual Dom 和 Diff 算法](https://juejin.im/post/5c504f736fb9a049ef26fcd3)

## 5.2 React Reconciler（react 协调的过程）

### 5.2.1 React Reconclier(15 版本)

## 5.3 new componentLifecyle（新生命周期）

### 5.3.1 React 组件新生命周期详解

老的生命周期

![](~@/react/oldLIfeCycle.png)

react 16.3 增加了 getDeriveStateFromProps 和 getSnapshotBeforeUpdate 2 个静态方法

![](~@/react/react16.3.png)

react 16.4 中增加了在 setState 和 forceUpdate()都会执行这个静态方法`getDeriveStateFromProps`

![](~@/react/newLifecycle.png)

### 5.3.2 挂载阶段

1. 挂载阶段的函数

- constructor 构造函数，初始化 state，以及为事件处理函数绑定实例
- getDeriveStateFromProps 新增的静态方法，返回一个新的 state，或者是 null，静态方法里的，这里面的 this 是指向全局变量
- render 渲染函数
- componentDidMount 挂载成功后立即调用

2. 更新阶段的函数

- getDeriveStateFromProps props 变化或者 state 方法触发
- shouldComponentUpdate 判断是否进行更新
- render 函数
- getSnapshotBeforeUpdate 生命周期方法在更新之前（如：更新 DOM 之前）被调用。此生命周期的返回值将作为第三个参数传递给 componentDidUpdate。（通常不需要，但在重新渲染过程中手动保留滚动位置等情况下非常有用。）
- componentDidUpdate 更新后会被立即调用

3. 卸载阶段的函数

- componentWillUnmount 卸载函数，组件卸载及销毁之前直接调用，主要用于清除一些在组件生命周期订阅，真实 DOM 事件以及 setTimeout/setinterval 的返回值

#### 异常捕获

- componentDidCatch 生命周期方法在后代组件抛出错误后被调用，方法接受两个参数（err，info），分别是错误信息和错误组件的栈信息
- getDerivedStateFromError 在后代组件抛出错误后调用，接受一个参数（error）表示具体的错误信息

### 5.3.3 新版组件升级

- componetWillMount (17.0 被移除)
  - render 方法之前调用，在此调用 setState 并不会触发再次渲染
  - 通常会在这个方法中进行页面标题的一些修改以及其他与再次 render 不相关的操作
- UNSAFE_componentWillMount （16.3 新增不安全的生命周期引入别名）

  - 与 state 相关的操作挪到 constructor 方法中执行
  - 异步操作挪到 componentDidMount 中执行

- componentWillUpdate(17.0 被移除)
  - 在组件收到新的 props 或 state 时，会在渲染之前调用
  - 方法内不能调用 setState，触发循环，内存泄漏
- UNSAFE_componentWillUpdate（16.3 新增不安全的生命周期引入别名）

  - 应该在 shouldComponentUpdate

- componentWillReceiveProps(17.0 被移除)
  - 接受父级传递过来最新的 props，转化为组件内的 state
  - 判断是否进行更新或者执行异步请求数据
- UNSADFE_componentWillReceiveProps（16.3 新增不安全的生命周期引入别名）
  - 与渲染相关的 props 直接渲染，不需要处理为组件内的 state
  - 异步数据请求在 componentDidUpdate 中处理
  - getDerivedStateFromPropss 方法替换，需要考虑生命周期的执行顺序
