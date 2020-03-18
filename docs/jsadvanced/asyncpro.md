## 3.1 理解异步
### 3.1.1 同步与异步
🔥先看2段代码
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
<font color="red">**同步**</font>：调用之后得到结果，在干别的任务

<font color="red">**异步**</font>：调用之后不管结果，继续干别的任务

🔥单线程的js怎么实现异步？

如果按照js是单线程的，上面的代码2应该是123才符合单线程的表现；现在为什么是132呢，那异步怎么实现的呢？

🔥学习异步之前先了解一下什么是进程？什么是线程？
 ![](~@/asyncpro/proandthr.png)
打个比方：假如cpu是一个工厂，进程就是一个车间；线程就是工人，一个进程有多个线程，它们之间资源共享，也就内存空间共享。

linux下 查看进程：

ps (process status)  列出系统中当前运行进程的快照

top (table of processes) 动态实时查看进程

kill 9 进程pid 杀死进程

🔥回答单线程的js怎么实现异步？

 通过浏览器的内核多线程实现异步

### 3.1.2 javaScript单线程

🔥浏览器是一个多进程的架构
我们打开一个浏览器就会启动以下进程，我们所要关心的是渲染进程，渲染进程是浏览器的核心进程
![](~@/asyncpro/singlethread.png)

🔥渲染进程下的多线程
![](~@/asyncpro/multithreading.png)
<font color="red">**GUI线程**</font>：负责渲染页面，解析html、css；构建DOM树和渲染树

<font color="red">**js引擎线程**</font>： js引擎线程负责解析和执行js程序，我们经常听到的chrome的v8引擎就是跑在js引擎线程上的，js引擎线程只有一个，所有说js的单线程语言的原因，那其实语言没有单线程多线程之说，因为解释这个语言的是
的线程是单线程；js引擎线程与gui线程互斥，当浏览器执行javaScript程序的时候，GUI渲染线层会保存在一个队列当中；直到js程序执行完成，才会接着执行；如果js的执行时间过长，会影响页面的渲染不连贯，所有我们要尽量控制js的大小

<font color="red">**定时触发线程**</font>：为什么setTimeout不阻塞后面程序的运行，那其实setTimeout不是由js引擎线程完成的，是由定时器触发线程完成的，所以它们可以是同时进行的，那么定时器触发线程在这定时任务完成之后会通知事件触发线程往任务队列里添加事件

<font color="red">**事件触发线程**</font>：将满足触发条件的事件放入任务队列，一些异步的事件会放到异步队列中

<font color="red">**异步HTTP请求线程**</font>：用与处理ajax请求的，当请求完成时如果有回调函数就通知事件触发线程往任务队列中添加任务

🔥异步场景

1. 定时器
2. 网络请求
3. 事件绑定
4. ES6 Promise
### 3.1.3 定时器

🔥定时器的执行过程

 代码在执行栈中执行，然后1=>2=>3=>4

![](~@/asyncpro/asynctask.png)

🔥定时器示例

![](~@/asyncpro/asynctaskele.png)
1. `console.log(1)`先入栈执行，执行完出栈
2. 遇到`setTimeout` 调用setTimeout这个webapi，通知定时触发线程定时2秒钟
3. `console.log(3)`入栈执行，执行完出栈
4. 栈中已经空了，去检查任务队列，此时还为到2秒钟，任务队列中还没有任务；这是一个循环检查的过程，等到2秒钟后
事件触发线程往任务队列中添加了定时器的事件，这时候再去检查的时候已经有了定时器的异步任务，我们取出这个任务放到执行栈中执行，这时候打印出了2

🔥定时器的问题
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

 🔥定时器的应用场景
 1. 防抖节流
 2. 到计时
 3. 动画 （有丢帧问题）
## 3.2 Event Loop机制
以前js是在浏览器环境中运行，由于chrome对v8做了开源；所以js有机会在服务端运行；浏览器和node都是js的运行环境，它们相当于是一个宿主，宿主能提供一个能力能帮助js实现Event Loop

 🔥浏览器的Event Loop
 
 🔥node.js的Event Loop

## 3.3 异步编程方法-发布/订阅
## 3.4 深入理解promise
## 3.5 Generator函数及其异步的应用
## 3.6 深入理解async/await
