## 4.1 nextTick(异步队列更新)

### 4.1.1 异步更新队列

当模版中存在多处变量依赖的时候，每个变量修改的时候，都会导致一次渲染，是否可以优化？

我们平时工作，产品A向你提出一个需求；产品B又像你提出一个需求，过一段时间他们又轮番轰炸，那我们可以先把手里的工作做完，然后在统一处理它们的需求，我们vue中的针对变量的修改也是这样做的，把要处理的任务放到任务队列中，等同步的任务完成以后在统一处理变量的更新。

下面是一段简单的响应式的实现

```javascript
// 收集依赖类
class Dep {
  constructor() {
    this.deps = []
  }
  depend(dep) {
    this.deps.push(dep)
  }
  notify() {
    const deps = this.deps.slice()
    for (let i = 0; i < deps.length; i++) {
      deps[i]()
    }
  }
}
// 将数据转换成响应式
function observe(obj) {
  const keys = Object.keys(obj)
  keys.forEach((item) => {
    reactive(obj, item, obj[item])
  })
}
function reactive(obj, key, val) {
  val = data[key]
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function () {
      if (update) {
        dep.depend(update)
      }
      return val
    },
    set: function (newVal) {
      val = newVal
      dep.notify()
    }
  })
}
// 更新函数
let update
function watch(fn) {
  update = fn
  update()
  update = null
}
var data = {
  age: '',
  name: ''
}

observe(data) //调用oserve
let str
watch((update) => {
  console.log('触发了更新函数')
  str = '我的姓名' + data.name + '年龄' + data.age
  document.getElementById('app').innerText = str
})
// 更改数据，触发视图更新
data.name = '张三'
data.age = 3
```
我们运行这段代码，看看我们更改2次data中数据会触发几次更新函数；下面显示更新了3次，第一次我们可以忽略，因为在`watch`函数中调用了一次，这是为了访问data函数中的name和age，从而触发它们的`getter`把更新函数添加`Dep`中去，其实触发2次很多人觉得没什么，但是我们更改多次模版中依赖的变量时候，每次都要diff对比，然后更新dom，显然是白白的性能浪费，现在我们想做的是我不管你操作几次模版中依赖的变量，我统一处理，一次diff对比！

![](~@/vue/nextTick1.png)

我们想要只触发一次dom更新，就引出了宏任务和微任务，不懂的可以看本博客`javascript进阶/Event Loop机制`，全局的代码是宏任务，宏任务执行完会去任务队列查找微任务并执行；那我们可以这样做，把更新函数都放到
微任务中去执行，那这样你不管更改几次模版依赖的数据，我都可以统一处理更新函数,`Promise`then方法的回调属于微任务，可以把更新函数放到then这里面处理。

```javascript
// 收集依赖
class Dep {
  constructor() {
    this.deps = []
  }
  depend(dep) {
    this.deps.push(dep)
  }
  notify() {
    const deps = this.deps.slice()
    for (let i = 0; i < deps.length; i++) {
      queueJob(deps[i])
    }
  }
}

const queue = [] //存储任务
const nextTick = (cb) => Promise.resolve().then(cb)
// 往队列中添加任务
var queueJob = (job) => {
  if (!queue.includes(job)) {
    queue.push(job)
    // 把整个任务放到.then里去执行，这些任务相对与宏任务，它们是一个异步的过程
    nextTick(()=>{
       let job
       while ((job = queue.shift()) !== undefined) {
       job()
     }   
    })
  }
}

```

从上面可以看出，在更新依赖函数`notify`函数中，我们调用`queueJob`方法，往队列中添加任务，同时把一个回调传给`primise`的then方法，在回调中我们去执行任务，这样就能做到不管修改几次模版中依赖的数据，我都可以先不更新，做到统一处理。

完整的代码

```javascript
  <div id="app"></div>
// 收集依赖
class Dep {
  constructor() {
    this.deps = []
  }
  depend(dep) {
    this.deps.push(dep)
  }
  notify() {
    const deps = this.deps.slice()
    for (let i = 0; i < deps.length; i++) {
      queueJob(deps[i])
    }
  }
}

function oserve(obj) {
  const keys = Object.keys(obj)
  keys.forEach((item) => {
    reactive(obj, item, obj[item])
  })
}
// 将数据转换成响应式
function reactive(obj, key, val) {
  val = data[key]
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function () {
      if (update) {
        dep.depend(update)
      }
      return val
    },
    set: function (newVal) {
      val = newVal
      dep.notify()
    }
  })
}
// 更新函数
let update
function watch(fn) {
  update = fn
  update()
  update = null
}
var data = {
  age: '',
  name: ''
}

const queue = []
const nextTick = (cb) => Promise.resolve().then(cb)
var queueJob = (job) => {
  if (!queue.includes(job)) {
    queue.push(job)
    nextTick(flushjobs)
  }
}
var flushjobs = () => {
  let job
  while ((job = queue.shift()) !== undefined) {
    job()
  }
}
oserve(data)
let str
watch((update) => {
  console.log('触发了更新函数')
  str = '我的姓名' + data.name + '年龄' + data.age
  document.getElementById('app').innerText = str
})
// 更改数据，触发视图更新
data.name = '张三'
data.age = 3
```
![](~@/vue/nextTick2.png)

上图我们可以发现，更新2次数据，其实只触发了一次更新函数

### 4.1.2 nextTick

在下一次DOM更新循环结束之后执行延迟回调

```javacsript
    Vue.nextTick([callback,context])
    Vm.$nextTick([callback])
```
-  将回调延迟到下次DOM更新循环之后执行
-  通常用于在修改数据之后使用这个方法，在回调中获取更新后的DOM