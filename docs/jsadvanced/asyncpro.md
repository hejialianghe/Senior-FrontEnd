## 预习资料
### 《3.1-理解异步》预习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  官方图解：Chrome 快是有原因的，现代浏览器的多进程架构！ | [阅读地址](https://juejin.im/post/5bd7c761518825292d6b0217)  |  学习这篇文章可以了解浏览器的架构以及每个模块负责的工作，宏观上了解浏览器的工作原理。  |
|  进程与线程的一个简单解释 | [阅读地址](https://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)  |  文章生动形象的比喻了进程和线程，将抽象的概念形象化了 |
|  浏览器进程？线程？傻傻分不清楚 | [阅读地址](https://imweb.io/topic/58e3bfa845e5c13468f567d5)  |  文重点讲解线程、进程的区别，以及浏览器内核的多线程 |
|  定时器标准| [阅读地址](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers  )  |  规范对定时器的说明 |
### 《3.2-Event Loop机制》预习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  Event Loops标准 | [阅读地址](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops )  |  标准对Event Loops的说明  |
|  Node.js 事件循环，定时器和 process.nextTick() | [阅读地址](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#what-is-the-event-loop)  |  介绍了nodejs的事件循环和定时器 |
|  调用栈 | [阅读地址](https://developer.mozilla.org/zh-CN/docs/Glossary/Call_stack)  |  介绍js运行调用栈 |
|  JS中的栈内存堆内存 | [阅读地址](https://juejin.im/post/5d116a9df265da1bb47d717b)  |  --- |
### 3.3-异步编程方法-发布/订阅》拓展学习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  EventEmitter实现源码 | [阅读地址](https://github.com/nodejs/node/blob/master/lib/events.js)  |  阅读文档后在看  |
|  FsWatch实现源码 | [阅读地址](https://github.com/nodejs/node/blob/master/lib/internal/fs/watchers.js )  | 阅读文档后在看 |
### 《3.4-深入理解promise》预习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  promise 基础 | [阅读地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)  |  ---  |
|  promises A+规范| [阅读地址](https://github.com/promises-aplus/promises-spec)  | --- |
|  promises A+规范测试工具用例工具 | [阅读地址](https://github.com/promises-aplus/promises-tests)  | --- |
### 《3.5-Generator函数及其异步的应用》预习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  可迭代协议 迭代器协议 | [阅读地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%8D%8F%E8%AE%AE)  |  介绍可迭代协议和迭代器协议  |
|  协程 | [阅读地址](https://cnodejs.org/topic/58ddd7a303d476b42d34c911)  | 介绍协程 |
|  co源码| [阅读地址](https://github.com/tj/co  )  | 分析源码 |

## 3.1 理解异步
### 3.1.1 同步与异步
####  :tomato: 先看2段代码
```javascript
//代码1
const test = () => {
  let t = +new Date();
  while (true) {
    if (+new Date() - t >= 2000) {
      break;
    }
  }
};
console.log(1);
test();
console.log(2);
console.log(3);
// 执行结果 1 2 3

// 代码2
console.log(1);
setTimeout(() => {
  console.log(2);
}, 2000);
console.log(3);

// 执行结果 1 3 2
```
代码1都是同步任务，代码2有异步任务setTimeout；所有执行结果不同

<font color="red">**同步**</font>：主线程上排队执行的任务，只有前面的任务执行完，才能执行后面的任务

<font color="red">**异步**</font>：是指不进入主线程，而是进入`任务队列`的任务,只有`任务队列`通知主线程，某个
任务可以执行了，该任务才会进入主线程执行

####  :tomato: 单线程的js怎么实现异步？

如果按照js是单线程的，上面的代码2应该是123才符合单线程的表现；现在为什么是132呢，那异步怎么实现的呢？

####  :tomato: 学习异步之前先了解一下什么是进程？什么是线程？
 ![](~@/asyncpro/proandthr.png)
打个比方：假如cpu是一个工厂，进程就是一个车间；线程就是工人，一个进程有多个线程，它们之间资源共享，也就内存空间共享。

linux下 查看进程：

ps (process status)  列出系统中当前运行进程的快照

top (table of processes) 动态实时查看进程

kill 9 进程pid 杀死进程

####  :tomato: 回答单线程的js怎么实现异步？

 通过浏览器的内核多线程实现异步

### 3.1.2 javaScript单线程

####  :tomato: 浏览器是一个多进程的架构
我们打开一个浏览器就会启动以下进程，我们所要关心的是渲染进程，渲染进程是浏览器的核心进程
![](~@/asyncpro/singlethread.png)

####  :tomato: 渲染进程下的多线程
![](~@/asyncpro/multithreading.png)
<font color="red">**GUI线程**</font>：负责渲染页面，解析html、css；构建DOM树和渲染树

<font color="red">**js引擎线程**</font>： js引擎线程负责解析和执行js程序，我们经常听到的chrome的v8引擎就是跑在js引擎线程上的，js引擎线程只有一个，所有说js的单线程语言的原因，那其实语言没有单线程多线程之说，因为解释这个语言的是
的线程是单线程；js引擎线程与gui线程互斥，当浏览器执行javaScript程序的时候，GUI渲染线层会保存在一个队列当中；直到js程序执行完成，才会接着执行；如果js的执行时间过长，会影响页面的渲染不连贯，所有我们要尽量控制js的大小

<font color="red">**定时触发线程**</font>：为什么setTimeout不阻塞后面程序的运行，那其实setTimeout不是由js引擎线程完成的，是由定时器触发线程完成的，所以它们可以是同时进行的，那么定时器触发线程在这定时任务完成之后会通知事件触发线程往任务队列里添加事件

<font color="red">**事件触发线程**</font>：将满足触发条件的事件放入任务队列，一些异步的事件会放到异步队列中

<font color="red">**异步HTTP请求线程**</font>：用与处理ajax请求的，当请求完成时如果有回调函数就通知事件触发线程往任务队列中添加任务

####  :tomato: 异步场景

1. 定时器
2. 网络请求
3. 事件绑定
4. ES6 Promise
### 3.1.3 定时器

####  :tomato: 定时器的执行过程

 代码在执行栈中执行，然后1=>2=>3=>4

![](~@/asyncpro/asynctask.png)

####  :tomato: 定时器示例

![](~@/asyncpro/asynctaskele.png)

<font color="red">**执行过程解释**</font>：
1. `console.log(1)`先入栈执行，执行完出栈
2. 遇到`setTimeout` 调用setTimeout这个webapi，通知定时触发线程定时2秒钟
3. `console.log(3)`入栈执行，执行完出栈
4. 栈中已经空了，去检查任务队列，此时还为到2秒钟，任务队列中还没有任务；这是一个循环检查的过程，等到2秒钟后
事件触发线程往任务队列中添加了定时器的事件，这时候再去检查的时候已经有了定时器的异步任务，我们取出这个任务放到执行栈中执行，这时候打印出了2

####  :tomato: 定时器会带来的问题
 1. 定时任务可能不能按时执行
 ```javascript
  const test = () => {
  let t = +new Date();
  while (true) {
    if (+new Date() - t >= 5000) {
      break;
    }
  }
};
setTimeout(() => {
  console.log(2);
}, 2000);
test();
// 等到5秒钟后才打印出了2
```
为什么呢？

因为test是会耗时5秒钟的同步任务，异步任务只能等待同步任务执行完之后才能执行，也就是说只能等5秒钟后才能检查的任务队列里的任务。

 2. 定时器嵌套5次之后最小间隔不能低于4ms

 ####  :tomato: 定时器的应用场景
 1. 防抖节流
 2. 到计时
 3. 动画 （有丢帧问题）

## 3.2 Event Loop机制
以前js是在浏览器环境中运行，由于chrome对v8做了开源；所以js有机会在服务端运行；浏览器和node都是js的运行环境，它们相当于是一个宿主，宿主能提供一个能力能帮助js实现Event Loop

####  :tomato: js单线程问题

  所有任务都在一个线程上完成，一旦遇到大量任务或遇到一个耗时的任务，网页就可能出现假死，也无法响应用户的行为

####  :tomato: Event Loop是什么

Event Loop是一个程序结构，用于等待和发送信息的事件。
简单说就是在程序中设置2个线程，一个负责程序本身的运行，称为“主线程”；另一个负责主线程和其他进程（主要是各种I/O操作）的通信
被称为“Event Loop线程”（也可以翻译为消息线层）

js就是采用了这种机制，来解决单线程带来的问题。

 ### 3.2.1 浏览器的Event Loop

  ####  :tomato: 异步实现

  1. 宏观：浏览器多线程（从宏观来看是多线程实现了异步）
  2. 微观：Event Loop，事件循环（Event Loop翻译是事件循环，是实现异步的一种机制）

  ####  :tomato: 先看一个例子
 ```javascript

    console.log(1)
    setTimeout(function () {
    console.log(2)
    },0)
    Promise.resolve().then(function (){
    console.log(3)
    })
    console.log(4)
    // 1 4 3 2
 ```
 ![](~@/asyncpro/eventlooptest1.png)
  1和4是同步任务肯定是最先执行，现在要看异步任务，现在要看的是`promise`的回调为什么在定时器前面执行，那为什么`promise`后放入，为什么先执行呢？那是因为Event Loop的机制是有微任务的说法的；现在往下看。

   ####  :tomato: 宏任务（普通任务）和微任务

   ![](~@/asyncpro/taskandmicrotask.png)
   <font color="red">**宏任务（task）**</font>：

   1. script：script整体代码
   2. setImmediate：node的一个方法
   3. setTimeout和setInterval
   4. requestAnimationFrame
   5. I/O
   6. UI rendering

   ......

   <font color="red">**微任务（microtask）**</font>：

   1. Object.observe:监听对象变化的一个方法
   2. MutationObserver:可以监听Dom结构变化的一个api
   3. postMessgae:window对象通信的一个方法
   4. Promise.then catch finally
   5. process.nextTick
   
  ####  :tomato: Event Loop的运行过程

  ![](~@/asyncpro/eventloopfn.png)
   线程都有自己的数据存储空间，上图可以看见`堆`和`栈`，堆的空间比较大，所以存储一些对象；栈的空间比较小，
   所以存储一些基础数据类型、对象的引用、函数的调用；函数调用就入栈，执行完函数体里的代码就自动从栈中移除这个函数，这就是我们所说的调用栈；
   栈是一个先进后出的数据结构，当最里面的函数出栈的时候，这个栈就空了；当我们调用时候会调用一些异步函数，
   这个异步函数会找他们的异步处理模块，这个异步模块包括定时器、promise、ajax等，异步处理模块会找它们各自
   对应的线程，线程向任务队列中添加事件，看我们的蓝色箭头，表示在任务队列中添加事件，橘色的箭头是从任务队列中取事件，取出这个事件去执行对应的回调函数；

   有3个点要注意
   1. 我们整个大的script的执行是全局任务也是一个宏任务的范畴，
   2. 当宏任务执行完，会去执行所有的微任务，
   3. 微任务全部执行完在去执行下一个宏任务，那什么时候去执行一个微任务呢，是等调用栈为空的时候，
   调用栈不为空的时候，任务队列的微任务一直等待；微任务执行完又去取任务队列里的宏任务，去依次
   执行宏任务，执行宏任务的时候就要检查当前有没有微任务，如果有微任务就去执行完所有微任务，然后
   再去执行后续的宏任务

####  :tomato: 代码示例1

![](~@/asyncpro/eventlooptest2.png)

<font color="red">**执行步骤**</font>：
1. 大的script是个宏任务，检查任务队列是否为空，当前不为空，然后执行1和8行代码；那么打印出了1和4
2. 执行完1和8行代码后去检查微任务队列，微任务队列不为空，执行了Promise的回调，此时打印出了3
3. 执行完Promise的回调后，在检查微任务队列，现在微任务队列为空，进行重新渲染一便
4. 在去检查任务队列，现在任务队列中有了定时器的事件，又打印出了2
 
<font color="red">**注意点**</font>：
1. 一个Event Loop有一个或多个task queue（任务队列）
2. 每个个Event Loop有一个microtask queue（微任务队列）
3. requestAnimationFrame 不在任务队列也不在为任务队列，是在渲染阶段执行的
4. 任务需要多次事件循环才能执行完，微任务是一次性执行完的
5. 主程序和和settimeout都是宏任务，一个promise是微任务，第一个宏任务（主程序）执行完，执行全部的微任务（一个promise），再执行下一个宏任务（settimeout）

####  :tomato: 代码示例2

 ```javascript

   console.log("start");

    setTimeout(() => {
    console.log("setTimeout");
    new Promise(resolve => {
        console.log("promise inner1");
        resolve();
    }).then(() => {
        console.log("promise then1");
    });
    }, 0);

    new Promise(resolve => {
    console.log("promise inner2"); //同步执行的
    resolve();
    }).then(() => {
    console.log("promise then2");
    });

    // 打应结果
    /*
     start
     promise inner2
     promise then2
     setTimeout
     promise inner1
     promise then1
    */

 ```
####  :tomato: 代码示例3

 ```javascript
    async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
    }

    async function async2() {
    return Promise.resolve().then(_ => {
        console.log("async2 promise");
    });
    }

    console.log("start");
    setTimeout(function() {
    console.log("setTimeout");
    }, 0);

    async1();

    new Promise(function(resolve) {
    console.log("promise1");
    resolve();
    }).then(function() {
    console.log("promise2");
    });

    /*
        start
        async1 start
        promise1
        async2 promise
        promise2
        async1 end
        setTimeout
    */
 ```
<font color="red">**执行步骤**</font>：

1. 先执行主线程的同步任务（也是宏任务), 先执行`start`然后遇到了setTimeout，把它放到下一次宏任务中执行，我们叫它宏2；然后调用 async1()函数，执行了`async1 start`；又调用了async2函数执行Promise.resolve().then；由于then的回调函数是微任务，就把它放到微任务队列中，我们叫它微1；遇见await是等待的意思，需要把第一轮的微任务执行完，在执行await下面的内容，我们在执行new Promise(),打印了`promise1`,又调用了resolve()改变了promise状态，这个then的回调我们叫它微2；第一轮宏任务执行完毕。

2. 第一轮宏热任务执行完毕后，我们检查微任务队列中的微任务，把它全部执行完，就打印了`async2 promise`、`promise2`

3. 第一轮微任务执行完，就执行await后面的内容`async1 end`

4. await后面的内容执行完后又执行宏任务`setTimeout`

[推荐一篇Event Loop测试题](https://juejin.cn/post/6844904077537574919)

### 3.2.2 node.js的Event Loop
####  :tomato: node.js架构

![](~@/asyncpro/nodeframework.png)
<font color="red">**有3层组成**</font>
1. 第一层：node-core是node.js api的核心库。
2. 第二层：包装和暴露libuv和js的其他低级功能。
3. 第三层：v8和libuv这个库属于第三层的东西，v8引擎是chrome开源的js引擎，也是js运行服务端的基础，libuv是第三方的库，是nodejs异步编程
的基础，是node底层的io引擎，是c语言编写的事件驱动的库；负责node api的执行，它会将不通的任务分配给不同的线程，从而形成了Event Loop事件
循环；它以异步的方式将任务的执行结果返回给v8引擎；那我们说node是非阻塞io单线程，实现这个非阻塞的原因就在与libuv，node.js的Event Loop都是这个库实现的。

####  :tomato: node.js的Event Loop

![](~@/asyncpro/nodeeventloop.png)
<font color="red">**执行的几个阶段**</font>
1. <font color="blue">**timers阶段：执行setTimeout和setInterval的回调**</font>
2. pending callbacks：系统操作的回调
3. idle，pepare：内部使用
4.  <font color="blue">**poll：等待新的I/O事件进来**</font>
5. <font color="blue">**check：执行setImmediate回调**</font>
6. close callbacks：内部使用

<font color="red">**只需关注1、4、5阶段**</font>

<font color="blue">每个阶段都有一个callbacks的先进先出的队列需要执行，当event loop运行到一个指定阶段时，该阶段的
fifo队列将会被执行，当队列callback执行完或者执行的callbacks数量超过该阶段的上限时，event loop会转入下一个阶段。
</font>

####  :tomato: poll阶段

![](~@/asyncpro/poll.png)
1. 先判断poll队列是否空或受到限制，否的话执行poll队列的callback；循环执行，直到空为止；是的话执行下一步
2. 等待callback加入poll阶段，在poll阶段空闲的时候，检查timer是否到时间

####  :tomato: 案例1

 ```javascript

const fs = require('fs');

function someAsyncOperation(callback) {
  fs.readFile(__dirname, callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

someAsyncOperation(() => {
  const startCallback = Date.now();
  while (Date.now() - startCallback < 200) {
    // do nothing
  }
});
 // 打印结果 202ms have passed since I was scheduled
 ```
 1. 读文件进入`poll`阶段，然后进入会回调，读文件一般会需要几毫秒，我们这里用了2毫秒，在回调了我们使用了while循环；
 延迟了200毫秒
 2. 执行完poll队列，现在是空闲状态，检查有没有到时间的定时器；然后有setTimeout，就执行了setTimeout的回调

####  :tomato: 案例2

```javascript

const fs = require('fs');
fs.readFile(__filename, _ => {
    setTimeout(_ => {
        console.log("setTimeout");
      }, 0);
      setImmediate(_ => {
          console.log("setImmediate");
      });
}); 
/*
  打印结果 setImmediate
          setTimeout
*/
 ```
 可以根据`poll阶段`的图来看，check阶段比timer阶段先执行，执行到读取文件的回调时，先看是否设置了setImmediate的回调，如果有就进去check阶段，在等待callbakc加入poll队列空闲的时候才会检测是否有timer；所以`setImmediate`比`setTimeout`先执行

 ####  :tomato: process.nextTick()

 `process`进程的意思，process.nextTick()是一个异步的node API，但不属于event loop的阶段，它的作用是当调用这个方法的时候，event loop会先停下来，先执行这个方法的回调

 ```javascript

const fs = require('fs');
fs.readFile(__filename, _ => {
    setTimeout(_ => {
        console.log("setTimeout");
      }, 0);
      setImmediate(_ => {
          console.log("setImmediate");
      });
}); 
/*
  打印结果 nextTick1
          setImmediate
          nextTick2
          setTimeout
*/
 ```
 1. 首先`fs.readFile`的回调进入poll阶段，遇到`process.nextTick()`会暂停event loop，先打印其回调；
 2. 打印`process.nextTick()`回调之后，会进入`setimmediate`的check阶段，然后打印setImmediate，然后`process.nextTick()`又打印了nextTick2
 3. 在检测有没有到时间的定时器，然后进入timer阶段，打印了setTimeout

## 3.3 异步编程方法-发布/订阅

### 3.3.1 理解发布/订阅

####  :tomato: 异步编程的几种方式

![](~@/asyncpro/asyncpro.png)

####  :tomato: 回调的形式实现请求

```javascript
function ajax(url, callback) {
    // 实现省略
}
ajax("./test1.json", function(data) {
    console.log(data);
    ajax("./test2.json", function(data) {
        console.log(data);
        ajax("./test3.json", function(data) {
            console.log(data);
        });
    });
});
 ```
####  :tomato: 发布订阅的形式
 ```javascript
// 发布订阅应用
function ajax(url, callback) {
    // 实现省略
}

const pbb = new PubSub();
ajax("./test1.json", function(data) {
    pbb.publish("test1Success", data);
});
pbb.subscribe("test1Success", function(data) {
    console.log(data);
    ajax("./test2.json", function(data) {
        pbb.publish("test2Success", data);
    });
});
pbb.subscribe("test2Success", function(data) {
    console.log(data);
    ajax("./test3.json", function(data) {
        pbb.publish("test3Success", data);
    });
});
pbb.subscribe("test2Success", function(data) {
    console.log(data);
});
 ```
 1. 我们通过 `pbb.publish`这个方法发布`test1Success`这个事件
 2. 然后去订阅这个事件

 ####  :tomato: 发布和订阅图例
 ![](~@/asyncpro/publisher.png)

### 3.3.2 实现事件发布/订阅
####  :tomato: 发布和订阅类的实现
 ```javascript
class PubSub {
    constructor() {
        this.events = {};
    }
    // 发出一个事件
    publish(eventName, data) {
        if(this.events[eventName]){
            this.events[eventName].forEach(cb => {
                cb.apply(this, data)
            });
        }
    }
    // 订阅一个事件
    subscribe(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }
    }
    // 取消一个事件
    unSubcribe(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(
                cb => cb !== callback
            );
        }
    }
}
```
####  :tomato: 发布和订阅的优缺点
优点
- 松耦合
- 灵活（多次去订阅一个事件）
缺点
- 无法确保消息被触发或者触发几次

<font color="red">**发布订阅是promise之前的一个主流的解决请求高耦合的方案**</font>

### 3.3.3 node.js的发布/订阅

参考资料：/examples/jsadvanced/3.3/nodePubSub.js

## 3.4 深入理解promise
 
 因为es6的promise是按照A+规范来写的，如果我们想要理解promise源码，需要先看A+规范

### 3.4.1 promise A+规范
####  :tomato: 术语
- promise 一个有then方法的对象或函数，其行为符合本规范
- thenable 一个定义了then方法的对象或函数
- value（值） 任何javaScript的合法值（包括 undefined,thenable或promise）
- exception（异常） throw语句抛出的值
- reason（拒绝原因） 表示promise被拒绝原因的值

####  :tomato: promise的状态
![](~@/asyncpro/promisestatus.png)

pending：等待,可以转换成fulfilled或rejected状态

fulfilled：完成，拥有一个不可变的终值

rejected：拒绝，拥有一个不可变的据因

一个promise的状态被改变了，就不能在改变了

####  :tomato: promise的then方法

一个promise必须提供一个then方法以访问最终值value和reason

promise的then方法接受两个参数

  ```javascript
  promise.then(onFulfilled, onRejected)
  ```

 - then 方法的参数
      - 两个函数参数，都是可选参数
      - onFulfilled在promise完成后被调用，onRejected在promise被拒绝执行后调用；onFulfilled和onRejected如果不是函数，其必须被忽略
 - then方法的调用：可以调用多次
 - then方法的返回值：promise

 <font color="red">**1. onFulfilled和onRejected都是可选参数**</font>（参数可选）

   - onFulfilled不是一个函数，则被忽略
   - onRejected不是一个函数，则被忽略
  

<font color="red">**2. 如果onFulfilled是一个函数**</font>（onFulfilled特性）

   - 它必须在promise fulfilled后调用，且promise的value为其第一个参数
   - 它不能在promise fulfilled前调用
   - 其调用次数不可超过一次
  
<font color="red">**3. 如果onRejected是一个函数**</font>（onRejected特性）

   - 它必须在promise rejected后调用，且promise的reason为其第一个参数
   - 它不能在promise rejected前调用
   - 其调用次数不可超过一次

<font color="red">**4. onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用**</font>（调用时机）

<font color="red">**5. onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）**</font>（调用要求）
 
<font color="red">**6. then 方法可以被同一个 promise 调用多次**</font>（多次调用）

  - 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
  - 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

<font color="red">**7. then 方法必须返回一个 promise 对象**</font>（返回）

  ```javascript
  promise2 = promise1.then(onFulfilled, onRejected);
  ```

  then方法必须返回一个promise，它实现了链式调用，它的返回值必须有then方法，所以它返回的是一个promise；
  既然then方法返回一个promise，那么这个返回的promise的值是怎么确定的呢？假如我们返回的promsie是promise2
  那规范中分了3种情况；我们根据这3种情况来确定promsie2的值和状态是什么？

  返回的primise2的值和状态是怎样确定的？A+规范分了3种情况

  1. onFulfilled 不是函数，promise1的状态是fulfilled

   state：fulfilled
   value：同promise1

  2. onRejected不是函数，promise1的状态是rejected

  state：rejected
  reason：同promise1

  3. onFullfilled或者onRejected，return x（onFullfilled或者onRejected有一个返回值，这个返回值是x，这个时候规范定义了一个解析过程）

  ####  :tomato: promise解析过程
  - 抽象模型resolve(promise,x)
  - 如果promise和x指向相同的值
    如果他们指向相同的值，就形成了循环引用；所以就return resolve(promise,new TypeError('cant be the same'))
  - 如果x是一个promsie,状态有3种
  - 如果x是一个对象或一个函数
  - 如果x不是对象也不是函数

 ```javascript
  function resolve (promise,x){
    // 如果promise和x指向相同的值
    if(x===promise){
      return reject(promise,new TypeError('cant be the same'))
    }
    //如果x是一个promsie
    if(isPromise(x)){
      if(x.state==='pending'){
        return x.then(()=>{
          resolve(promise,x.value)
        },()=>{
          reject(promise,x.value)
        })
      }
      if(x.state==='fulfilled'){
        return fulfill(promise,x.value)
      }
      if(x.state==='rejected'){
        return reject(promise,v.value)
      }
      // 如果x是一个对象或一个函数
    }else if(isObject(x) || isFuction(x)){
      let then
      try {
        then = x.then
      }catch(e){
        return reject(promise,e)
      }

      if(isFunction(then)){
        let isCalled=false
        try {
          then.call(x,function reslovePromise(y){
            if(isCalled){
              return
            }
            isCalled=true
            resolve(promise,y)
          },function rejectPromise (r) {
            if(isCalled){
              return
            }
            isCalled=true
            reject(promise,r)
          })
        } catch(e){
          if(!isCalled){
            return reject(promise,e)
          }
        }
      }else {
        return fulfill(promise,x)
      }
      // 如果x不是对象也不是函数
    }else {
      return fulfill(promise,x)
    }
  }
 ```
  ####  :tomato: 案例
  ```javascript
  const promise = Promise.
    resolve(1).
    then(2).
    then(Promise.resolve(3)).
    then(console.log);
     // 或
    const promise1 = Promise.resolve(1);
    const promise2 = promise1.then(2);
    const promise3 = promise2.then(Promise.resolve(3));
    const promise4 = promise3.then(console.log); 

    // 1
 ```
 Promise1是resolved状态，它的value是1，then方法不函数的参数会忽略掉；promise2的状态也是resolved状态；Value也是1；
 第三步的参数还是会忽略掉，promise3的状态也是resolved状态；Value也是1；第四步console.log是个函数，所以会打印出1.


### 3.4.2 ES6 Promise API
####  :tomato: Promise构造函数
 ```javascript
  new Promise( function(resolve,reject){
    // resolve(value)
    // reject(reson)
  })

  // 函数作为参数
  resolve函数将promise的状态从pending变成resolved（fulfilled）
  reject函数将promise状态从pending变成rejected
 ```
####  :tomato: Promise的静态方法

| 方法  |  说明  |
| :---: | :--------: |
| Promise.resolve(param) | 等同于 new Promise(function (resolve.,reject){resolve(param)})  |
| Promise.reject(reason) | 等同于 new Promise(function (resolve.,reject){reject(reason)}) |
| Promise.all([p1,...,pn])| 输入一组promise返回一个新的promise，全部promise都是fulfilled结果才是fulfilled状态；如果有一个失败，结果promise就是失败 |
| Promise.allSettled([p1,...,pn])| 输入一组promise返回一个新的promise，所有的promise状态改变后，结果promise变成fulfilled |
| Promise.race([p1,...,pn])| 输入一组promise返回一个新的promise，结果promise的状态跟随第一个变化的promsie状态，最先返回promise是成功的，结果promise就是成功，否则就是失败|

####  :tomato: Promise的实例方法

| 方法  |  说明  |
| :---: | :--------: |
| promise.then（onFulfilled，onRejected） | promise状态改变之后的回调，返回新的promise对想 |
| Promise.catch(reason) | 同promise.then(null,onRejected),promise状态为rejected回调 |
| Promise.finally(function（reason）{  })| 不管promise的状态如何都会执行 |

 then和catch都会返回一个新的promise，链式调用的时候catch会冒泡到最后一层

### 3.4.3 promise实践

3秒后亮一次红灯,再过2秒亮一次绿灯,在过1秒亮一次黄灯,用promise实现多次交替亮灯的效果

 ```javascript
  function light (color,second) {
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        console.log(color)
        resolve()
      },second*1000)
    })
  }

  let list =[
    {
      color:'red',
      time:3
    },
    {
      color:'green',
      time:2
    },
    {
      color:'yellew',
      time:1
    }
  ]

  function orderLights (list) {
    let promise=Promise.resolve()
    list.forEach(item=>{
      promise=promise.then(function () {
        return light(item.color,item.time)
      })
    })
    promise.then(function(){
      orderLights(list)
    })
  }
  orderLights(list)
 ```

## 3.5 Generator函数及其异步的应用
### 3.5.1 Generator函数
Generator函数可以直接生成迭代器，也是es6异步编程的解决方案

 - es6异步编程解决方案
 - 声明：通过function *声明
 - 返回值：符合可迭代协议和迭代器协议的生成器对象
 - 在执行时能暂停，又能从暂停出继续执行

 生成器对象原型上有3个方法：1.next(param); 2.return(param) 3.throw(param)

####  :tomato: 先看2个概念：迭代器vs生成器
 - 迭代器
   - 有next方法，执行返回结果对象
 结果对象包含：1.value  2.done
 
 用es5自己写一个迭代器，让大家看的更清楚
 ```javascript
  function createIterator (item) {
  var i=0;
  return {
    next:function () {
      var done = i>=item.length;
      var value= !done?item[i++] : undefined
      return {
        done:done,
        value:value
      }
    }
  }
}

var iterator=createIterator([1,2,3])
console.log(iterator.next()) // { done: false, value: 1 }
console.log(iterator.next()) // { done: false, value: 2 }
console.log(iterator.next()) // { done: false, value: 3 }
console.log(iterator.next()) // { done: true, value: undefined }
 ```
 ####  :tomato: 迭代协议
 1. 可迭代协议
  - [Symblo.iterator]属性
  - 内置可迭代对象
    - String Array Map Set等
 2. 迭代器协议
  - next方法
    - done
    - value

 ####  :tomato:  yield关键字
  - 只能出现在Generator函数
  - 用来暂停和恢复生成器函数
  - next执行
    - 遇yield暂停，将紧跟yield表达式的值作为返回的对象的value
    - 没有yield，一直执行到return，将return的值作为返回的对象的value
    - 没有return，将undefined作为返回的对象的value
  - next参数
    - next方法可以作为一个参数，该参数会被当作一个yield表达式的返回值

 案例1
  ```javascript
  function* createIterator (){
    let first = yield 1
    let second=yield first+2
    yield second+3
  }
  let iterator=createIterator()
  iterator.next() // {value:1,done:false}
  iterator.next(4) // {value:6,done:false}
  iterator.next(5)// {value:8,done:false}
  iterator.next() // {value:undefined,done:false}
 ```
 运行流程：
  1. 第一次next遇到yield会把yield后面跟的表达式的值作为返回对象的value，这个表达式是1，所以value是1

  2. 第二个next执行的时候，上一次next执行的时候yield 1返回了，但是first的值还未赋值；因为我们执行
    yield的时候就停了，停了之后到第二个next执行的时候会才会从first这个值开始执行，next传入了参数4会把
    第一次执行的yield值改变，所以这个时候fisrt是4，那么first+2是6，这时候还没执行完done是false，value是6

  3. 第三次执行next，传入了5，那么second是5，所以value是8

  4. 第四次执行next，前一次执行完next后，看着代码已经执行完了，然而相当于后面还有return undefined

####  :tomato:  yield* 生成器函数/可迭代对象
  - 委托其他可迭代对象
  - 作用：复用生成器

 案例2
  ```javascript
  function* generator1 (){
    yield 1
    yield 2
  }
  function* gennerator2 (){
    yield 100
    yield* generator1()
    yield 200
  }
let g2=generator2()
g2.next() {value:100,done:false}
g2.next() {value:1,done:false}
g2.next() {value:2,done:false}
g2.next() {value:200,done:false}
g2.next() {value:undefined,done:ture}
 ```
 ####  :tomato:  return(param)
 - 给定param值终结遍历器，param可缺省

  案例3
  ```javascript
    function* createIterator (){
      yield 1
      yield 2
      yield 3
    }
   let iterator=createIterator（）
   iterator.next(); {value:1,done:false}
   iterator.return(); {value:undefined,done:false}
   iterator.next();{value:undefined,done:false}
 ```
 ####  :tomato: thorow(param)
 - 让生成器对象内部抛出错误
   案例4
 ```javascript
  function* createIterator(){
    let first = yield 1;
    let second;
    try {
      second=yield first+2
    }catch(e){
      second = 6
    }
    yield seond+3
  }
  let  iterator=createIterator()
  iterator.next() // {value:1,done:false}
  iterator.next(10) // {value:12,done:false}
  iterator.throw(new Error('error')) // {value:9,done:false}  遇到yield才会暂停
  iterator.next() //{value:undefined,done:true}
 ```
 ####  :tomato: 协程
 - 一个线程存在多个协层，但同时只能执行一个
 - Genrator函数的协层在ES6的实现
 - Yield挂器x协程（交给其他协程），next唤醒x协程

 ####  :tomato: Generator函数的应用
  回调函数的写法
   ```javascript
    function readFilesByCallback() {
    const fs = require("fs");
    const files = [
        "/Users/kitty/testgenerator/1.json",
        "/Users/kitty/testgenerator/2.json",
        "/Users/kitty/testgenerator/3.json"
    ];
    fs.readFile(files[0], function(err, data) {
        console.log(data.toString());
        fs.readFile(files[1], function(err, data) {
            console.log(data.toString());
            fs.readFile(files[2], function(err, data) {
                console.log(data.toString());
            });
        });
    });
}
// 调用
readFilesByCallback();
 ```
generator函数的写法
```javascript
  function* readFilesByGenerator() {
      const fs = require("fs");
      const files = [
          "/Users/kitty/testgenerator/1.json",
          "/Users/kitty/testgenerator/2.json",
          "/Users/kitty/testgenerator/3.json"
      ];
      let fileStr = "";
      function readFile(filename) {
          fs.readFile(filename, function(err, data) {
              console.log(data.toString());
              f.next(data.toString());
          });
      }
      yield readFile(files[0]);
      yield readFile(files[1]);
      yield readFile(files[2]);
  }
  // 调用
  const f = readFilesByGenerator();

  f.next();
 ```
 缺点：需要在readFile函数内部调用生成器f，不是很优雅，thunk能把这个耦合能解开来，不用在函数内部调用函数外部的变量

### 3.5.2 Thunk函数
- 求职策略 传值调用，传名调用sum（x+1，x+2）
    - 传值调用就是在计算sum之前先计算x+1和x+2的值，这2个值有了才传入sum函数里面计算
    - 传名调用是等函数内部用到x+1和x+2的时候在计算
- thunk函数是传名调用的实现方式之一
- 可以实现自动执行Generator函数
```javascript
  const fs = require("fs");
  const Thunk = function(fn) {
    return function(...args) {
      return function(callback) {
        return fn.call(this, ...args, callback);
      };
    };
  };
  const readFileThunk = Thunk(fs.readFile);

  function run(fn) {
    var gen = fn();
    function next(err, data) {
      var result = gen.next(data);
      if (result.done) return;
      result.value(next);
    }
    next();
  }

  const g = function*() {
    const s1 = yield readFileThunk("/Users/kitty/testgenerator/1.json");
    console.log(s1.toString());
    const s2 = yield readFileThunk("/Users/kitty/testgenerator/2.json");
    console.log(s2.toString());
    const s3 = yield readFileThunk("/Users/kitty/testgenerator/3.json");
    console.log(s3.toString());
  };

  run(g);
 ```
## 3.6 深入理解async/await
### 3.6.1  async函数
####  :tomato: async
- 一个语法糖 是异步操作更简单
- 返回值 返回值是一个promise对象
  - return的值是promise resolved时候的value
  - Throw的值是Promise rejected时候的reason

```javascript
   async function test (){
     return 1
   }
   const p = test()
   console.log(p) // 打印出一个promise，状态是resolved，value是1
   p.then( function (data){
     console.log(data) //1
   })
```

```javascript
   async function test (){
     throw new Error('error')
   }
   const p = test()
   console.log(p) // 打印出一个promise，状态是rejected，value是error
   p.then( function (data){
     console.log(data) //打印出的promise的reason 是error
   })
```
可以看出async函数的返回值是一个promise

####  :tomato: await
 - 只能出现在async函数内部或最外层
 - 等待一个promise对象的值
 - await的promise的状态为rejected，后续执行中断

await可以await promise和非promsie，如果非primse，例如：await 1就返回1

![](~@/asyncpro/await.png)

await为等待promise的状态是resolved的情况
```javascript
  async function async1 (){
    console.log('async1 start')
    await async2() // await为等待promise的状态，然后把值拿到
    console.log('async1 end')
  }
  async function async2(){
    return Promsie.resolve().then(_=>{
      console.log('async2 promise')
    })
  }
  async1()
  /*
    打印结果
    async1 start
    async2 promise
    async1 end
  */
```
await为等待promise的状态是rejected的情况
```javascript
 async function f() {
   await Promise.reject('error')
   //后续代码不会执行
   console.log(1) 
   await 100
 }
 
 // 解决方案1
  async function f() {
   await Promise.reject('error').catch(err=>{
     // 异常处理
   })
   console.log(1) 
   await 100
 }

 // 解决方案2
  async function f() {
    try {
      await Promise.reject('error')
    }catch(e){
      // 异常处理
    }finally {

    }
   console.log(1) 
   await 100
 }
```
####  :tomato: async函数实现原理

实现原理：Generator+自动执行器

async函数是Generator和Promise的语法糖

### 3.6.2 应用

####  :tomato: 用async函数方案读取文件
```javascript
async function readFilesByAsync() {
    const fs = require("fs");
    const files = [
        "/Users/kitty/testgenerator/1.json",
        "/Users/kitty/testgenerator/2.json",
        "/Users/kitty/testgenerator/3.json"
    ];
    const readFile = function(src) {
        return new Promise((resolve, reject) => {
            fs.readFile(src, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    };

    const str0 = await readFile(files[0]);
    console.log(str0.toString());
    const str1 = await readFile(files[1]);
    console.log(str1.toString());
    const str2 = await readFile(files[2]);
    console.log(str2.toString());
}
```
## 3.7 手写Promise

### 3.7.1 先实现整体结构

定义一个模块

```js
// 我们用es5的自执行函数定义模块，如果用AMD规范的需要编译，用自执行函数方便我们一会调用测试
(function (window) {
  function Promise () {

  }
  window.Promise=Promise
})(window)

```
基本结构

```js
(function(window){ 
 // executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
function Promise(executor){

 }
 /**
  * then方法指定了成功的和失败的回调函数,如果指定的不是函数，会忽略该值
  * 返回一个新的promise对象，该promsie的结果onResolved和onRejected决定，状态由上个Promise决定
  */
 Promise.prototype.then=function(onResolved,onRejected){

 }
 /**
  * 传入失败回调
  * 返回一个新的Promise,由于已经捕获错误了，会返回一个成功的Promise
  */
 Promise.prototype.catch=function(OnRejected){

 }
 /**
  * 返回一个指定结果成功的promise
  */
 Promise.resolve=function(value){

 }
 /**
  * 返回一个指定reason失败的promise
  */
 Promise.reject=function(reason){
     
}
/**
 * 返回一个新Promsie
 * 所有的promise成功才成功，有一个失败就失败
 */
Promise.all=function(promises){
     
}
/**
 * 返回一个新Promsie
 * 传入的数组中第一个返回的Promise成功就成功，如果不成功就失败(第一个promise不是你传入的第一个，比如请求接口，最新拿到结果的是第一个)
 */
Promise.race=function(promises){
     
}
window.Promise=Promise
})(window)
```

### 3.7.2 实现Promise内部的resolve和reject

当我们`new promise((resolve,reject)=>{})`时会传入一个回调函数，我们这里叫executor(执行器)，promise拿到这个方法以后，
调用这个executor方法并传入resolve和reject方法，让用户控制promise是成功还是失败；调用resolve是成功，调用reject是失败。

```js{16,35}
(function(window){ 
// 常量定义3promise的三个状态
    const PENDING = 'pending'
    const FULFILLED = 'fulfilled'
    const REJECTED = 'rejected'
// executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
function Promise(executor){
// 存一下this，因为代码中调用resolve时，在全局下调用的，此时resolve里面this是window
// 关于this指向问题，就是谁调用就指向谁，当然也可以用箭头函数处理这个问题
    const self=this 
    self.status=PENDING
    self.state=undefined //存传的值
    self.callbackQueues=[] // 存回调队列

  // 让promise成功的函数
  function resolve(value){ 
    if(self.status!==PENDING) return
        self.status=FULFILLED
        self.state=value
    /*
      这里会让人感到疑惑？下面是干什么的？
      onResolved是then方法的第一个参数，onRejected是第二个参数
      其实promise用了发布订阅的设计模式，promise把then方法的OnResolved和OnRejected方法存到一个数组里
      不懂没关系，可以看下面的我分析的代码执行步骤
    */
     if(self.callbackQueues.length>0){
        self.callbackQueues.map(item=>{
           setTimeout(()=>{
                item.onResolved(value)
           })
        })
      }
    }
// 让promsie失败的函数
  function reject (reason) {
  // 如果不是pending状态，就没必要往下了，因为promise的状态一旦改变就无法在更改
    if(self.status!==PENDING) return 
        self.status=REJECTED
        self.state=reason

     if(self.callbackQueues.length>0){
        self.callbackQueues.map(item=>{
           setTimeout(()=>{
                item.onRejected(value)
           })
        })
      }
    }
// 捕获executor函数里意外错误，如果错误改变状态
   try {
    executor(resolve,reject)
   }catch(err){
       reject(err)
   }
 }
 /**
  * then方法指定了成功的和失败的回调函数
  * 返回一个新的promise对象
  */
 Promise.prototype.then=function(onResolved,onRejected){
     const seft=this
     seft.callbackQueues.push({
        onResolved,
        onRejected
     })
 }
 window.Promise=Promise
})(window)
```
#### 分析一下代码执行步骤

```html
    <script src="./Promise.js"></script>
    <script>
        new Promise((resolve,reject)=>{
          setTimeout(()=>{
            resolve(1)
          })
        }).then(res=>{
            console.log(res);
        })
    </script>
```
1. `new Promise()` 会传入一个回调函数到构造函数Promise中，然后执行Promise里的代码。
2. 开始就是 `const self=this ` 的执行，这些不是重点，重点是执行`executor(resolve,reject)`,并传入resolve和reject函数。
3. 开始执行`executor`函数，函数里执行了`setTimeout`，我们知道`setTimeout`是异步执行的，接下来会执行`then`方法。
3. 执行then方法并传入了`onResolved`函数，then方法里把传入的`onResolved`push到了`callbackQueues`数组里。
4. 同步的代码执行完了，开始执行异步任务了，显然是指行setTimeout里resovle方法。
5. 在resolve方法里开始判断不是`pending`状态就退出，然后就把状态改成`fulfilled`,把传过来的值存到`state`里；然后执行`callbackQueues`
里的函数，callbackQueues里存的then方法传回调函数，调用里面的回调把`state`值传进去。

上面代码只是简单的实现了`then`方法，接下来我们具体实现

### 3.7.3 实现Promise原型上的then方法

 <font color="red">**看到这么多代码不要慌张，我会拆分详细讲解，then方法是Promise的重点，其他方法都then方法有关系**</font>


 我们要先明确then方法实现了什么？

 1. 返回一个新的Promsie
 2. 新的promise的值由上一个Promsie的onResolved和onRejected的结果决定

 ```js
  Promise.prototype.then=function(onResolved,onRejected){
    const self= this 
    /*
     我们为什么把判断写到promise里面？

     因为我们需要根据上一个Promsie的状态去改变当前这个返回的promise的状态
     上一个promsie的状态可以根据seft.status拿到，我们要改变返回的这个promise的状态，
     就是调用resolve或reject，我们只有写在promise里面才到调用这两个函数
    */
    return new Promise((resolve,reject)=>{
      // 我们调用then方法的时候 ，promise可能是以下三种状

      // 如果是pending状态，那么说明Promsie内部的resolve还没执行，因为如果执行了，resolve函数会改变状态的
      // 由于resolve函数还未执行，我们也拿不到传过来的值，先把回调函数放到callbackQueues数组中
      if(seft.status===PENDING){ 
          seft.callbackQueues.push({
                onResolved,
                onRejected
          })

      }else if(seft.status===FULFILLED){
        // 用self.state 拿到当前promsie state的值，把值传递给使用者传入的第一个回调函数
        onResolved(self.state)
        
      else {
         // 用self.state 拿到当前promsie state的值，把值传递给使用者传入的第二个回调函数
         onRejected(self.state)
        }
    })

  }

 ```

上面我们实现了，返回一个promsie，并调用了传递过来的onResolved和onRejected函数，接下来我们改变这个返回promise的状态

```js
 Promise.prototype.then=function(onResolved,onRejected){
    const self= this 
    return new Promise((resolve,reject)=>{
      if(seft.status===PENDING){ 
          seft.callbackQueues.push({
                onResolved,
                onRejected
          })

     // 当前Promise fulfilled状态时
      }else if(seft.status===FULFILLED){
        /*
          const p = new Promise((resolve,reject)=>{resolve(1)})
          p.then((res)=>{
            return 2
             or 
            return new Promise((resolve,reject)=>{resolve(2)})
          })
        */
        // 我们调用onResolved拿到函数的返回值，这个返回值，也有可能是一个promise
        const result= onResolved(self.state)
        if(result instance Promise){
          result.then(res=>{ // 调用then方法拿到值
            resolve(res) // 改变返回的这个promise状态为fulfilled，并传入了值
          })
        } else {
            resolve(result) // 改变返回的这个promise状态为fulfilled，并传入了值
        }
       
      // 当前Promise 为rejected状态时，下面的实现方法跟上面基本一样
      // 为什么我们下面也调用resolve，因为onRejected这个函数中已经捕获了错误
      // 一旦有onRejected函数捕获了错误，错误就不再往下传递，让下一个promise成功！
      else {
          const result= onRejected(self.state)
        if(result instance Promise){
          result.then(res=>{ // 调用then方法拿到值
            resolve(res) // 改变返回的这个promise状态为fulfilled，并传入了值
            })
          } else {
            resolve(result) // 改变返回的这个promise状态为fulfilled，并传入了值
          }
        }
    })

  }
```

把相同的代码封装成一个函数handle,我们知道promsie的then的回调函数是异步的，所以setTimeout模拟then方法的异步问题

```js
Promise.prototype.then=function(onResolved,onRejected){
  
    const self= this 
    return new Promise((resolve,reject)=>{
      // 把相同的代码封装起来,并用try catch捕获错误
      /*
        像这种情况，使用者如果抛出错误，直接让下个promise也就是当前返回的promise状态为失败
       then(res=>{
         throw '我抛出错误'
       })
      */
    function handle (callback){
        try {
           const result= callback(self.state)
            if(result instance Promise){
              result.then(res=>{ 
                resolve(res) 
              })
            } else {
                resolve(result) 
          }
         }catch(reason){
          reject(reason)
        } 
      }
     // 当前Promise pending状态时
      if(seft.status===PENDING){ 
          seft.callbackQueues.push({
                onResolved,
                onRejected
          })

     // 当前Promise fulfilled状态时
      }else if(seft.status===FULFILLED){
         setTimeout(()=>{
            handle(onResolved)
         })
      // 当前Promise 为rejected状态时
      else {
        setTimeout(()=>{
           handle(onRejected)
          })
        }
    })
  }
```
then方法已经实现的差不多了，但是promise为pending状态时，我们没有去改变返回那个promise的状态，改变状态需要调用resolve或reject
然而我们并没有调用

```js
Promise.prototype.then=function(onResolved,onRejected){
  // 如果传入的不是函数，就用默认函数，并把上一个promse的值往下传递
  const onResolved=typeof onResolved ==='fucntion' ? onResolved :(value)=>value
  // 如果传入的不是函数，就给默认函数，并抛出错误，让返回的这个promsie为失败状态
  const onResolved=typeof onRejected ==='fucntion' ? onRejected :(reason)=>{throw reason}

    const self= this 
    return new Promise((resolve,reject)=>{

    function handle (callback){
        /*省略*/
      }
     // 当前Promise pending状态时
      if(seft.status===PENDING){ 
          seft.callbackQueues.push({
                onResolved()=>{
                  handle(onResolved)
                },
                onRejected()=>{
                 handle(onRejected)
              }
          })
     
      }else if(seft.status===FULFILLED){// 当前Promise fulfilled状态时
        /*省略*/
     
      else {  // 当前Promise 为rejected状态时
         /*省略*/
        }
    })
  }
```

then完整代码

```js
 /**
  * then方法指定了成功的和失败的回调函数
  * 返回一个新的promise对象，它实现了链式调用
  * 返回的promise的结果由onResolved和onRejected决定
  */
Promise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : value => value
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
  const seft = this

  return new Promise((resolve, reject) => {
    function handle (callback) {
      try {
        const result = callback(seft.state)
        if (result instanceof Promise) {
          result.then(
            (res) => {
              resolve(res)
            },
            err => {
              reject(err)
            }
          )
        } else {
          resolve(result)
        }
      } catch (err) {
        reject(err)
      }
    }
    // 当是Promise状态为pending时候，将onResolved和onRejeactd存到数组中callbackQueues
    if (seft.status === PENDING) {
      seft.callbackQueues.push({
        onResolved (value) {
          handle(onResolved)
        },
        onRejected (reason) {
          handle(onRejected)
        }
      })
    } else if (seft.status === FULFILLED) {
      setTimeout(() => {
        handle(onResolved)
      })
    } else {
      setTimeout(() => {
        handle(onRejected)
      })
    }
  })
}
```

### 3.7.4 实现promsie原型的catch方法

```js
 /**
  * 传入失败回调
  * 返回一个新的Promise
  */
 // 第一个参数不传，then里面会有默认参数，传入OnRejected回调函数
 // then 方法里会调用OnRejected并传入拒绝的理由
 Promise.prototype.catch=function(OnRejected){
    return this.then(undefined,OnRejected)
 }
```

### 3.7.5 Promise.resolve

```js
 /**
  * Promise函数对象的resove方法
  * 返回一个指定结果成功的promise
  */
 // 这个简单 让返回的promise成功就行
 Promise.resolve=function(value){
    return new Promise((resolve,reject)=>{
        if(value instanceof Promise){
            value.then(resolve,reject)
        }else {
            resolve(value)
        }
     })
 }
```

### 3.7.6 Promise.reject

```js
 /**
  *  Promise函数对象的reject方法
  * 返回一个指定reason失败的promise
  */
  // 这个简单 让返回的promise失败就行
 Promise.reject=function(reason){
     return new Promise((resove,reject)=>{
        reject(reason)
     })
}
```

### 3.7.7 Promise.all
```js
/**
 * 所有成功才成功，有一个失败就失败
 * 返回一个的Promise，这个promise的结果由传过来的数组决定，一个失败就是失败
 */
// 这个也不难，循环传入的数组，把成功的promise的返回的值放到values中
// 只有当values和promises相同时，说明全部成功，这时候返回一个成功的数组，有一个失败就失败
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let values = []
    promises.map(item => {
      if (item instanceof Promise) {
        item.then(
          (res) => {
            values.push(res)
          }
          , reject)
      } else {
        // 为了正确的放入values，所以也让其异步
        setTimeout(() => {
          values.push(item)
        })
      }
    })
    // 这里用setTiemeout是因上面的then方法是异步的，让下面的代码也异步，才能拿到最终的values数组
    setTimeout(() => {
      if (values.length === promises.length) {
        resolve(values)
      }
    })
  })
}
```

### 3.7.8 Promise.race

```js
/**
 * 第一个成功就成功，如果不成功就失败(就是最先拿到谁的值，就成功)
 * 返回一个Promsie
 */
//  这个简单，只要发现一个promsie成功了，就让返回的promsie成功
Promise.race=function(promises){
    return new Promise((resolve,reject)=>{
        promises.map(item=>{
            if(item instanceof Promise) {
                item.then(
                    resolve
                    ,reject)
            }else {
                resolve(item)
            }
        })
    })  
}
```
### 3.7.9 总结

我们要实现promsie应该先看A+规范，上一章有中文的翻版，当然也可以去网上看英文版，那我总结一下重点：

1. promise用了发布订阅的设计模式。

2. 重点在then方法，它实现了返回一个新的promise，这个promsie的状态由上一个promsie的状态所决定。

3. 调用resolve和reject去改变promise的状态

[完整代码](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/jsadvanced/promise)


## 3.8 Web Workers的多线程机制

### 3.8.1 Web Workers介绍

- web Workers
  - 一个Web API-> 浏览器能力 -> 提供一个js可以运行的环境
  - Web应用程序可以在独立于主线层的后台线程中，运行一个脚本操作
  - 关键点：性能考虑

web Workers主要处理一些耗时的任务，比如一家公司老板忙不来，肯定会招一些人，这些会承担一些公司的脏活累活，占用时间比较多的活，老板只做一些核心的事情。所以web worker是来分担主线程的负担的，所以web worker的意义在于一些耗时的任务从主线层剥离出来，让worker做这些耗时的处理；
那么主线程专注于页面的渲染和交互，那么我们访问的页面的性能会更好。

#### worker的主要方法

- onerror、onmessage、onmessageerror、postMessage、importScripts、close

#### :tomato: worker线程和主线程的通信


<img width="500px" src="~@/network/worker-info.png">

我们知道worker是一个线程，那么主线程指派任务给worker线程是怎样通信的呢？就设计到2个线程之间的通信。

主线程有一个`postMessage`方法用来通知worker线程任务，worker有一个`onMessage`的方法用来接收主线程的任务，接收到主线程的消息之后就去工作，工作完之后worker也有一个`postMessage`方法用来通知主线程干完了；主线程也有一个`onMessage`方法，能获取到worker的工作已经做完了，以及结果是什么。

### 3.8.2 实战一个web worker的案例

这个案例是我们把耗时的斐波那契数列放到worker里计算

1. index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./main.js"></script>
</body>
</html>
```

2. main.js

```js
//  new Worker 之后，worker进行工作
const worker = new Worker("worker.js")

worker.onmessage = function (e) {
 console.log('拿到worker通知的数据',e)
 worker.postMessage("message收到了")
}
```

3. worker.js

worker线程去计算斐波那契数列

```js
function fibonacci (n) {
    if(n===1 || n ==2) {
        return 1
    }
    return fibonacci(n-2) + fibonacci(n-1)
}
// 告诉主线程
postMessage(fibonacci(40))

// 收到主线程的消息
onmessage = function (e) {
    console.log('好的，拿到了就好',e);
}
```
#### 当你点开index.html会出现报错

![](~@/jsasvanced/worker-err.png)

这个报错是什么原因呢？

因为我们用worker是限制的，不是本地跑一个html就行，`new Worker("worker.js")`里的参数不能通过本地路径去取的，不支持file协议；需要起一个静态资源服务，我们可以用`browser-sync`。

```bash
npm install -g browser-sync # 下载

browser-sync -s # 启动，注意启动服务要在index.html这个文件夹
```

启动完之后，访问http://localhost:3000/index.html

源代码地址：Senior-FrontEnd/examples/jsadvanced/3.8/

### 3.8.3 worker的能力是受限制的

####  预习资料
| 预习资料名称  |  链接  | 备注 |
| :---: | :--------: | :------: |
|  Blob对象用法 | [阅读地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)  | 	嵌入式webworkers会用到Blob |
|  JavaScript中的Blob对象 | [阅读地址](https://juejin.im/entry/5937c98eac502e0068cf31ae)  | 掘金上比较基础的一篇文章 |


- 与主线程脚本同源

  在主线程下运行的worker必须与主线程同源

- 与主线程上下文不同
  - 在worker下无法操作dom，可以操作Navigator、location等，就是不会引起页面混乱的可以用。
  - 不能执行alert等

- 不能读取本地文件
   - 所有加载的文件来源于网络，不来来源于file协议。

可以在worker.js下打印this看一下它的全局对象

#### 嵌入式worker

我们刚刚了解到，`new Worker(woker路径)`里的路径不能去从本地读取的，但是我们现在很多都是模块的写法，很多都会用到`require.js`,那么有没有简单的方法在项目中使用workers呢？看下面案例。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
   <!-- type="javascript/worker" 写上这个类型，里面的脚本是不会执行的 -->
    <script type="javascript/worker" id="worker">
      function fibonacci (n) {
            if(n===1 || n ==2) {
                return 1
            }
            return fibonacci(n-2) + fibonacci(n-1)
        }

        postMessage(fibonacci(40))
    </script>
    <script>
       // 拿到worker里的代码字符串
        var workerScript = document.querySelector('#worker').textContent
        // Blob ：二进制大对象
        var blob = new Blob([workerScript],{type:'text/javascript'})
        // blob:null/9d8594c9-1783-46f9-8001-c6112af6a15a 可以在浏览器中访问，可以看见worker里的代码
        var worker = new Worker(window.URL.createObjectURL(blob))
        worker.onmessage = function (e) {
            console.log('拿到worker通知的数据',e)
            worker.postMessage("message收到了")
        }
    </script>
</body>
</html>
```

#### webworkify

如果按照上面的写法，在2个script标签里面写，显得不是很优雅；于是前辈给我们封装了`webworkify`,它也是利用`blob`、`createObjectURL`。

### 3.8.4 Web Worker的使用场景

- 解决的痛点
  - js执行复杂运算时阻塞了页面渲染
- 使用场景
  - 复杂运算
  - 渲染优化（canvas有个离线的api结合worker）
  - 流媒体数据处理

#### 哪些项目中用到了Web worker？

- flv.js
 用h5的标签去播放flv格式的视频，用于直播、录播，它去解码http-flv格式的视频，通过Media SourceExtensions,解码的过程就是在workers里执行的。

了解SharedWorker和ServiceWOrker（pwa的基础，可以做页面的缓存优化）

## 3.9 Service Workers

### 3.9.1 初识 Service Workers

Service Worker（以下简称sw）是基于WEB Worker而来的。

Service Workers的本质充当WEB应用程序、浏览器与网络（可用时）之间的代理服务器，这个API旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用来采取适当的动作，更新来自服务器的资源，它还提供入口推送通知和访问后台同步API。

#### :tomato: service worker的特点 <Badge text="重要" type="tip"/>

- 网站必须使用HTTPS，除了本地开发环境（localhost）
- 运行于浏览器，可以控制打开的作用域范围下所有的页面请求，可拦截请求和返回，缓存文件；sw可以通过fetch这个api，来拦截网络和处理网络请求，再配合cacheStorage来实现web页面的缓存管理以及与前端postMessage通信
- 单独的作用域范围，单独的运行环境和执行环境
- 不能操作页面DOMM，可以通过是事件机制来处理
- 完全异步，同步API（如XHR和localStorage）不能再service work中使用，sw大量使用promise
- 一旦被 install，就永远存在，除非被 uninstall或者dev模式手动删除
- 响应推送
- service worker是事件驱动的worker，生命周期与页面无关。 关联页面未关闭时，它也可以退出，没有关联页面时，它也可以启动。

#### :tomato: service worker的生命周期 <Badge text="重要" type="tip"/>

<font color="red">注册 -> 安装 -> 激活 -> 废弃</font>

- installing（安装中）

  这个状态发生在service worker注册之后，表示开始安装，同时会进入service Worker的install事件中，触发install的事件回调指定一些静态资源进行离线缓存
- install(安装后)

  安装完成，进入了waiting状态，等待其他Service worker被关闭，所以当前脚本尚未激活，处于等待中；可以通过self.skipWaiting()跳过等待

- activating（激活中）

  等待激活，在这个状态下没有被其他的Servie Worker控制的客户端，允许当前worker完成安装，并且清除了了其他的worker以及关联缓存的旧缓存资源（在acitive的事件回调中，可以调用self.clients.claim()）

- activated（激活后）

  在这个状态会处理actived事件回调，并且提供处理功能性事件：fetch（请求）、sync（后台同步）、push（推送）
   
- redundant（废弃）

  表示一个 Service Worker 的生命周期结束

#### service worker的优势

1. 支持离线访问
2. 加载速度快
3. 离线状态下的可用性

就算已经关闭了页面，它也能帮助我们继续发送代理的请求

#### service worker的安全策略

由于service worker功能强大，可以修改任何通过它的请求，因此需要对其进行一定的安全限制

1. 使用https或者本地的localhost才能使用Service Worker

2. Service Worker都有一个有限的控制范围，这个范围通过放置Service Worker的js文件的目录决定的，也就是Service Worker所在目录以及所有的子目录。

也可以通过注册Service Worker的时候传入一个`scope`选项，用来覆盖默认的作用域，但是只能将作用域的范围缩小，不能将它扩大。

```js
navigator.serviceWorker.register('serviceworker.js', { scope: '/' })
``` 

### 3.9.1 小试牛刀

源码地址：/Senior-FrontEnd/examples/jsadvanced/3.9

1. 新建index.html

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document1</title>
</head>
<body>
    <div>test1</div>
    <script src="./sw.js"></script>
    <script>
        window.onload = function() {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('./sw.js', { scope: '/' }).then(registration=>{
                console.log('ServiceWorker 注册成功！作用域为: ', registration.scope) 
              }).catch(err=>{
                console.log('ServiceWorker 注册失败: ', err)
              })
            }
        }
    </script>
</body>
</html>
```
2. 新建sw.js

```js
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('cache').then((cache) => {
        // 缓存index.html文件
        return cache.add('./index.html')
      })
    )
  })
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 匹配返回缓存资源
        return caches.match('./index.html')
      })
    )
  })
```
3. 启动一个服务

```bash
browser-sync -s # 在3.9文件夹下
```
4. 打开地址：http://localhost:3000

![](~@/jsasvanced/sw1.png)

5. 关闭服务

关闭刚刚启动的服务，发现照样能访问资源，只不过控制台会出现一行报错`sw.js:1 Uncaught SyntaxError: Unexpected token '<'`

:::tip 查看自己的浏览器上有哪些网站用了service worker
浏览器访问：chrome://serviceworker-internals/
:::
##  总结

这章我们学习了异步编程的解决方法

回调->发布订阅->promise->Generator->async/await



