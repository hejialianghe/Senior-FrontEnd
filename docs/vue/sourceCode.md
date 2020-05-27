## 4.1 nextTick(异步队列更新)

### 4.1.1 异步更新队列

当模版中存在多处变量依赖的时候，每个变量修改的时候，都会导致一次渲染，是否可以优化？

我们平时工作，产品A向你提出一个需求；产品B又像你提出一个需求，过一段时间他们又轮番轰炸，那我们只能先把手里的工作做完，然后在统一处理它们的需求，我们vue中的针对变量的修改也是这样做的，把要处理的任务放到任务队列中，等同步的任务完成以后在统一处理变量的更新。

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
我们运行这段代码，看看我们更改2次data中数据会触发几次更新函数；下面显示更新了3次，第一次我们可以忽略，因为在`watch`函数中调用了一次，这是为了访问data函数中的name和age，从而触发它们的`getter`把更新函数添加`Dep`中去，其实触发2次很多人觉得没什么，但是我们更改多次模版中依赖的变量时候，每次多要diff对比，然后更新dom，显然是白白的性能浪费，现在我们想做的是我不管你操作几次模版中依赖的变量，我就更新一次！

![](~@/vue/nextTick1.png)

我们想要只触发一次dom更新，就引出了宏任务和为任务，不懂的可以看本博客`javascript进阶/Event Loop机制`，全局的代码是宏任务，宏任务执行完会去任务队列查找微任务并执行；那我们可以这样做，把更新函数都放到
微任务中去执行，那这样你不管更改几次模版依赖的数据，我都可以统一处理更新函数
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
var queueJob = (job) => {
  if (!queue.includes(job)) {
    queue.push(job)
    // 把调用更新函数的事情放到.then里去做
    nextTick(()=>{
       let job
       while ((job = queue.shift()) !== undefined) {
       job()
     }   
    })
  }
}

```