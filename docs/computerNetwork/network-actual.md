## 2.5 缓存、清理缓存和HTTP缓存

### 2.5.1 缓存

- 缓存将被用到的数据，让数据访问更快
  - 命中：在缓存中找到了请求的数据
  - 不命中/穿透：缓存中没有需要的数据
  - 命中率：命中次数/总次数
  - 缓存大小：缓存中一共可以存多少数据
  - 清空策略：如果缓存空间不够数据如何让被替换

<img width="300px" src="~@/network/cache.png">

#### 清空策略（FIFO）

这是一种清空策略，它是先进先出；假如我们现在有100条数据，存储的方向是从一个链表的尾部插入，从一个链表的头部取出；假设我们是这样的一个算法。
当我们现有的数据小于100的时候，我们可以一直存入；当现有数据等于100的时候，我们每存入一个就需要取出一个，从头部存入，从尾部取出；这样就会产生一个结果，
我们最早存入的数据最早取出，这样就构成了先进先出。

<img width="500px" src="~@/network/FIFO.png">

#### LRU-Least Frequently used(使用频率最低的)

当缓存不够时，优先清除使用频率最低的

<img width="500px" src="~@/network/Frequently.png">

#### LRU-Least recently used(最近使用的)

假如最近一年前的记录，最近使用了，会更新成最近的

<img width="500px" src="~@/network/recently.png">

### 2.5.2 http缓存

http缓存，主要是通过协议头，分别为协商缓存和强制缓存。
#### :tomato: Cache-Control <Badge text="重要" type="tip"/>

这个头定义所有缓存都要遵守的行为，不管是协商缓存还是强制缓存

- 可缓存性（要不要缓存）

大体有2种情况，一种是客户端要不要缓存，还有一种是中间方要不要缓存；因为我们一个请求从发出到响应可能还经历了其他服务器，可能还经过中间的代理服务器，这里定义了中间的服务器它们需不需缓存。

如果允许中间方缓存就定义成`public`。

如果不允许中间方缓存，只允许端缓存我们就定义成`private`。

如果需要所有人都不缓存那就定义成`no-store`。

如果你希望要不要缓存是一个协商的行为，那么你可以用`no-cache`,就是每次请求前先问一下服务端是不是最新的，如果不是最新的就不用再次请求。

这几个值可以组合。

- 可缓存性

| 值  |  含义  |
| :---: | :--: |
|  public  | 允许所有方缓存 |
|  private  | 值允许浏览器缓存 |
|  no-cache  | 每次必须先询问服务器资源是都已经更新 |
|  no-store  | 不实用缓存 |

- 缓存期限（要不要缓存）

| 值  |  含义  |
| :---: | :--: |
|  max-age  | 秒（存储周期） |
|  s-maxage | 秒（共享缓存如代理等，存储周期） |

#### Cache-Control 常用用法

不同文件，`cache-control`不同的用法：

第一个文件：react、vue、jquery这些库我们会把期限设置成最大，原因是这种更新周期是非常慢的，如果要更新这个文件我们可以更改文件名的hash值，这样文件名变了又可以请求新的文件了。如果我们什么都不写，就是允许公有方，像cdn、代理服务器它们都可以缓存这个文件。

第二个文件：这种自己的库，会设置成private，就是我们不允许中间方缓存，这里面可能有我们敏感的算法；造成不必要的麻烦，如果变化不大的情况下，max-age也设置成很大的值。

第三个文件：变化情况不大的情况下，max-age可以设置成很大的值。

第四个文件：图片的名字也没有带hash，可能存在一个更新问题，所以我们把它的时间设置成一天。

<img width="500px" src="~@/network/max-age.png">

#### :tomato: 强制缓存 <Badge text="重要" type="tip"/>

强制使用缓存，不去服务器对比；（缓存生效不再发送请求）

```js
Cache-control:max-age=600
Expires:<最后期限> // 写一个具体日期，到什么时候失效，现在基本不用了
```
案例：

```diff
const express= require('express')
const app = express()
app.get('/x',(req,res)=>{
+ res.set("Cache-Control","max-age=600")
    res.send('x3')
})
app.listen(3000)
```
max-age=0 等于0的情况和no-cache的情况一样，每次都向服务器询问

#### :tomato: 协商缓存1 <Badge text="重要" type="tip"/>

协商使用缓存，每次需要向服务器请求对比，缓存生效下不传回body

服务端先返回一个`Last-Modified`告诉客户端这个资源最后修改时间，然后客户端每次发请求都回带上`if-Modified-Since`;如果资源变化了，服务就会知道，就会返回新的资源和新的Last-Modified

```js
返回：Last-Modified：<昨天> 
请求：if-Modified-Since：<昨天>
```

```diff
const express= require('express')
const app = express()
app.set('etag',false) // 先把etag关掉，因为它也是一种缓存,现在我们只用一种，好演示一些
app.get('/x',(req,res)=>{
res.set("Last-Modified","Sun Feb 28 2021 23:24:47 GMT+0800") // 如果资源变了需要更新这个时间
    res.send('x3')
})
app.listen(3000)
```

#### :tomato: 协商缓存2 <Badge text="重要" type="tip"/>

这个是用的最多的协商缓存，服务端在返回任何数据的时候，就会带上一个E-Tag；这个不用我们配置

```js
返回：E-Tag:1234
请求: if-None-Match:1234
```

#### :tomato: 总结

1. 发布新的静态资源的时候，如何更新缓存？

每次发布的文件名都不同，这是用的最多的一种策略，因为我们的静态资源在html加载，或者被js引用到了；最后把这些引用都改成新的；webpack都有这些功能。