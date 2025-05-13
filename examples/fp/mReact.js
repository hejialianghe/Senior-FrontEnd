/***
 *  1.createElement
 *  2.render
 *  3.concurrentMode mode
 *  4. fiber
 *  5.commit 
 *  6.reconcilition 新的element 生成新的fiber 节点
 * 
 * requestAnimationFrame 加 MessageChannel 模拟时间分片；requestAnimationFrame用这一帧的开始时间推导出结束时间；在onMessage跟当前时间判断是否有空闲时间，然后执行分片任务
 */

// JSX转换函数
function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child =>
          typeof child === "object" ? child : createTextElement(child)
        )
      }
    };
  }
  
  function createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
  
  // 渲染核心变量
  let nextUnitOfWork = null;
  let wipRoot = null;
  let currentRoot = null;
  let deletions = null;
  let wipFiber = null; // 当前处理的fiber节点
  let hookIndex = null; // hooks索引
  
  // 主渲染函数
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element]
      },
      alternate: currentRoot
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
  }
  
  // 工作循环
  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
  
    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }
  
    requestIdleCallback(workLoop);
  }
  
  requestIdleCallback(workLoop);
  
  // 执行工作单元
  function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
      // 处理函数组件
      wipFiber = fiber;
      hookIndex = 0;
      wipFiber.hooks = [];
      const children = [fiber.type(fiber.props)];
      reconcileChildren(fiber, children);
    } else {
      // 处理原生DOM组件
      if (!fiber.dom) {
        fiber.dom = createDom(fiber);
      }
      reconcileChildren(fiber, fiber.props.children);
    }
  
    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  }
  
  // 创建DOM节点
  function createDom(fiber) {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
  
    updateDom(dom, {}, fiber.props);
    return dom;
  }
  
  // 属性更新逻辑
  const isEvent = key => key.startsWith("on");
  const isProperty = key => key !== "children" && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);
  
  function updateDom(dom, prevProps, nextProps) {
    // 事件处理
    Object.keys(prevProps)
      .filter(isEvent)
      .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
  
    // 属性更新
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = "";
      });
  
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name];
      });
  
    // 新事件绑定
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }
  
  // 协调子节点
  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;
  
    while (index < elements.length || oldFiber) {
      const element = elements[index];
      let newFiber = null;
  
      const sameType = oldFiber && element && element.type === oldFiber.type;
  
      if (sameType) {
        // 更新节点
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE"
        };
      }
      if (element && !sameType) {
        // 新增节点
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT"
        };
      }
      if (oldFiber && !sameType) {
        // 删除节点
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }
  
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
  
      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }
  
      prevSibling = newFiber;
      index++;
    }
  }
  
  // 提交阶段
  function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  }
  
  function commitWork(fiber) {
    if (!fiber) return;
  
    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;
  
    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent);
    }
  
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
  
  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }
  
  // Hooks实现
  function useState(initial) {
    const oldHook =
      wipFiber.alternate?.hooks &&
      wipFiber.alternate.hooks[hookIndex];
  
    const hook = {
      state: oldHook ? oldHook.state : initial,
      queue: []
    };
  
    // 执行队列中的action
    const actions = oldHook ? oldHook.queue : [];
    actions.forEach(action => {
      hook.state = typeof action === 'function' 
        ? action(hook.state) 
        : action;
    });
  
    const setState = action => {
      hook.queue.push(action);
      // 触发重新渲染
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot
      };
      nextUnitOfWork = wipRoot;
      deletions = [];
    };
  
    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state, setState];
  }
  
  // 导出库
  const Didact = {
    createElement,
    render,
    useState
  };
  
  /** 使用示例 ​**/
  // @jsx Didact.createElement
  function Counter() {
    const [state, setState] = Didact.useState(1);
    return (
      <div>
        <h1>Count: {state}</h1>
        <button onClick={() => setState(c => c + 1)}>+</button>
      </div>
    );
  }
  
  const App = <Counter />;
  const container = document.getElementById("root");
  Didact.render(App, container);