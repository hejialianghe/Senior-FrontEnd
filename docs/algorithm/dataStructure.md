JavaScript 常用的数据结构：

- [字符串](#_2-1-字符串)
- [数组](#_2-2-数组)
- [栈](#_2-3-栈和队列)
- [队列](#_2-3-栈和队列)
- [链表](#_2-4-链表)
- 树

## 2.1 字符串

字符串是由零个和多个字符组成的有序序列，是 JavaScript 最基础的数据结构，也是学习编程的基础。

### 2.1.1 翻转整数

示例：

```bash
输入: 123
输出: 321

输入: -123
输出: -321
```

```js
function reverse(params) {
  if (typeof params !== 'number') return

  const value =
    params > 0
      ? String(params)
          .split('')
          .reverse()
          .join('')
      : String(params)
          .slice(1)
          .split('')
          .reverse()
          .join('')
          
  const result = x > 0 ? parseInt(value, 10) : 0 - parseInt(value, 10);
  return result
}
```

#### 复杂度分析

- 时间复杂度： O(n) reverse 函数时间复杂度为 O(n)，n 为整数长度,最好的情况为 O(1)。

- 空间复杂度： O(n) 代码中创建临时对 value 象， n 为整数长度，因此空间复杂度为 O(n),最好的情况为 O(1)。

### 2.1.2 反转字符串

示例：

```bash
输入: china
输出: anihc
```

#### 方法 1

```js
function reverse(params) {
  if (typeof params !== 'string') return
  // 反转字符串
  return params.split('').reverse().join('')
}
```

#### 方法 2 首尾替换法

如果在面试过程中回答出第一种可能不是面试官想要的，就像排序问题，你回答 sort api，面试官不需要你去回答 api。

```js
function reverse(str) {
  const params = str.split('')
  const n = params.length
  for (let i = 0; i < n / 2; i++) {
    [params[i], params[n - i - 1]] = [params[n - i - 1], params[i]]
  }
  return params.join('')
}
```

#### 复杂度分析

时间复杂度: O(n)

空间复杂度: O(1)

reverse 中没有新开辟的内存空间

### 2.1.3 验证回文字符串

`回文字符串`就是从中间分开，2 边完全对称；顺读和倒读都一样的字符串。

```bash
'youuoy'
```

#### 方法 1

```js
function isPalindrome(params) {
  //去除 非单词字符、非数字
  const arr = params.toLowerCase().replace(/[^A-Za-z0-9]/g, '')
  // 反转
  const reverseStr = arr.split('').reverse().join('')
  return reverseStr === params
}
```

#### 复杂度分析

时间复杂度: O(n) 该解法中， toLowerCase() , replace() , split() , reverse() , join() 的时间复杂度都为 O(n)，且都在独立的循环中执行，因此，总的时间复杂度依然为 O(n)。

空间复杂度: O(n) 该解法中，申请了 1 个大小为 n 的字符串和 1 个大小为 n 的数组空间，因此，空间复杂度 为 O(n∗2) ，即 O(n)。

#### 方法 2

代码：

```js
function isPalindrome(params) {
  //去除 非单词字符、非数字
  const arr = params
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, '')
    .split('')

  // 双指针
  let i = 0
  let j = arr.length - 1
  while (i < j) {
    // 首尾是否相等
    if (arr[i] === arr[j]) {
      i++
      j--
    } else {
      return false
    }
  }
  return true
}
```

#### 复杂度分析

时间复杂度: O(n) 该解法中 while 循环最多执行 n/2 次，即回文时，因此，时间复杂度为 O(n)。

空间复杂度: O(n) 该解法中，申请了 1 个大小为 n 的数组空间，因此，空间复杂度为 O(n)。

## 2.2 数组

### 2.2.1 找出出现一次的数字

描述：给一非空数组，某个元素只出现一次，其他元素都均出现 2 次；找出出现一次的那个元素？

示例：

```bash
输入: [1,6,3,3,1,]
输出: 6
```

#### 方法 1： 分组法

用分组法，时间和空间的复杂度都偏高，理解分组的思想才是重点。

```js
function singleNumber(arr) {
  const arrGroups = arr.map((item) => {
    return arr.filter((ele) => item === ele)
  })
  return arrGroups.find((item) => item.length === 1)[0]
}
```

复杂度分析：

- 时间复杂度: O(n2)

使用了 map 和 filter ，嵌套遍历，故为 O(n2) 。

- 空间复杂度: O(n)

map 方法创建了一个长度为 n 的数组，占用了 n 大小的空间。

#### 方式 2： 异或比较法

异或运算符可以将两个数字比较，由于有一个数只出现了一次，其他数皆出现了两次，类似乘法 则无论先后顺序，最后相同的数都会异或成 0，唯一出现的数与 0 异或就会得到其本身，该方法是最优解，直接通过比较的方式即可得到只出现一次的数字。

```js
function singleNumber(arr) {
  return arr.reduce((accumulator, currentValue) => accumulator ^ currentValue)
}
```

复杂度分析：

时间复杂度: O(n)

仅用 reduce 方法遍历，一层遍历，故为 O(n) 。

空间复杂度: O(1)

空间复杂度为常量，占用空间没有随数据量 n 的大小发生改变，故为 O(1)。

### 2.2.2 两数求和的问题

描述：给定一个整数数组 nums 和一个目标值 target，在数组中找出和为目标值 target 的两个整数？

示例：

```bash
输入: num1 [1,6,3,4,7]  target 9
输出: [6,3]
```

2 层循环的时间复杂度是 O(n^2),O(1)没有开启新的空间。

遇到 2 层循环，我们就应该反思一下，能不能空间换时间，把它换成一层循环。

#### 方式 1：利用 map

几乎所有求和的问题，我们都可以转化为求差的问题，这道题就是典型的例子；通过求差使问题变的更简单。

我们用 target 减当前元素，得到差值，然后去 map 对象中找差值；没有就存下当前元素，每遍历一个新数字都去 map 对象中查找；直到找到目标元素为止。我们把 2 层循环简化到一层循环，可以说是空间换时间。

```js
const nums = [5, 7, 8, 2, 4]
const target = 9
const res = {}
let lookup = []
function toSum(list) {
  list.find((item, i) => {
    // 查看当前元素所对应的目标元素是否存在map对象中
    if (res[target - item]) {
      lookup = [item, target - item]
      return true
    } else {
      res[item] = i
      return false
    }
  })
}
```

复杂度分析：

时间复杂度: O(n)

我们只遍历了包含有 n 个元素的列表一次，在 map 中进行的每次查找只花费 O(1) 的时间, 因此总的复杂度为 O(n)

空间复杂度: O(n)

### 2.2.3 合并 2 个有序数组

描述：给两个有序数组 num1 和 num2，把 num2 合并到 num1 中。

示例：

```bash
输入: num1 [1,3,5,8]  num2 [2,4,5,6,7]
输出: num1 [1,2,3,4,5,5,6,7,8]
```

#### 方式 1： 双指针

用 2 个指针指向数组的末尾，每次只对指针指向的元素进行比较，取出较大的元素放在 num1 的末尾往前补。

为什么从后往前补？

因为 num1 前面有元素，从前往后补，会替换掉原来的元素。

```js
// 2个有序数组
const num1 = [1, 3, 5, 8]
const num2 = [2, 4, 5, 6, 7]

let k = num1.length - 1
let j = num2.length - 1
// m是num1和num2合并后长度
let m = k + j + 1

while (k >= 0 && j >= 0) {
  if (num2[j] > num1[k]) {
    num1[m] = num2[j]
    j--
  } else {
    num1[m] = num1[k]
    k--
  }
  m--
}
// 特殊情况：1.num1先遍历完，2.num2先遍历完。
// num2先遍历完，我们不用处理，因为我们就是把num2合并到num1。
// num1先遍历完，我们把num2全部复制到num1中。
while (j >= 0) {
  num1[m] = num2[j]
  j--
  m--
}
```

复杂度分析：

时间复杂度: O(n)

我们只遍历了包含有 n 个元素的列表一次

空间复杂度: O(n)

有 2 个数组，有一个数组在不断增加

### 2.2.4 三数之和

描述：给定一个包含 n 个整数的数组 nums ，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ?找出所有满足条件且不重复的三元组。

示例：

```bash
输入: num1 [-1, 0, 1, 2, -1, -4]
输出: 满足要求的三元组集合：[ [ -1, -1, 2 ], [ -1, 0, 1 ] ]
```

三数求和问题，固定其中一个数，在剩下的数中寻找两个数和这个固定数相加是等于 0。

似乎需要三层循环才能解决，不过现在我们有双指针，定位效率大大提高；双指针可以做到空间换时间，可以帮助我们降低问题的复杂度。

#### 方式 1： 双指针

```js
const nums = [-1, 0, 1, 2, -1, -4]
function threeNum(list) {
  list.sort()) // 双指针需要有序数组
  const uniqueMap = []

  for (let k = 0; k < list.length; k++) {
    let m = k + 1
    let n = list.length - 1
    while (m < n) {
      const sum = list[k] + list[m] + list[n]
      // 三数之和大于0，说明右边的数过大，需要左移
      if (sum > 0) {
        n--
      } else if (sum < 0) {
      // 三数之和小于0，说明左边的数过小，需要右移
        m++
      } else {
        // 符合条件存起来
        uniqueMap.push([list[k], list[m], list[n]])
        //下面是为了去重，当前m指向的数和右边的数相等，就往右移动
        const leftVaule = list[m]
        while (m < n && leftVaule === list[m]) {
          m++
        }
        //下面是为了去重，当前n指向的数和左边的数相等，就往左移动
        const rightVaule = list[n]
        while (n > m && rightVaule === list[n]) {
          n--
        }
      }
    }
    // 去重，k和右边的数相等了，就往右移动
    while (k < list.length - 1 && nums[k] === nums[k + 1]) {
      k++
    }
  }
  return uniqueMap
}

threeNum(nums)
```

在上面这道题中，左右指针一起从两边往中间位置相互迫近，这样的特殊双指针形态，被称为“对撞指针”。

什么时候你需要联想到对撞指针？

这里我给大家两个关键字——“有序”和“数组”。
没错，见到这两个关键字，立刻把双指针法调度进你的大脑内存。普通双指针走不通，立刻想对撞指针！

复杂度分析：

时间复杂度: O(n^2)

数组遍历 O(n) ，双指针遍历 O(n) ，因此复杂度为 O(n) ∗ O(n) 为 O(n2)

空间复杂度: O(n)

uniqueMap 可能在不断的开启新空间

## 2.3 栈和队列

#### 栈（stack）

栈是一种特殊的列表，它按照`先进后出`的原则存储数据；先进入的数据被压在栈底，后进去的数据在栈顶。需要读取数据的时候需要从栈顶开始。

我们可以想象一下，我们放盘子，先放入下面盘子，拿盘子的时候最后才能拿到。

栈的主要操作就是`入栈`、`出栈`，在 js 中栈和队列的实现一般都依赖数组；可以看做栈和队列是特别的数组。（用链表来实现也是可以的，用链表来实现会比数组麻烦很多）

![](~@/jsasvanced/stack.png)

### 2.3.1 栈的实现

```js
class Stack {
  constructor() {
    this.data = []
  }
  push(value) {
    this.data.push(value)
  }
  pop() {
    return this.data.pop()
  }
}

const stack = new Stack()
// 入栈
stack.push(1)
stack.push(2)

while (stack.data.length) {
  console.log('出栈', stack.pop())
}
```

#### 队列（queue）

队列是`先进先出`的数据结构，跟我们的`栈`不一样，队列的概念比较好理解；它就像我们去食堂买饭一样，先去的  先打到饭；后去的后打到饭。

队列的操作有 2 种：插入元素、删除元素。

- 只可以向尾部插入元素
- 只可以头部移除元素

### 2.3.2 队列的实现

```js
class Queue {
  constructor() {
    this.data = []
  }
  unQueue(value) {
    this.data.push(value)
  }
  deQueue() {
    return this.data.shift()
  }
}

const stack = new Queue()
// 入队
stack.unQueue(1)
stack.unQueue(2)

while (stack.data.length) {
  console.log('出对', stack.deQueue())
}
```

### 2.3.3 有效括号

给定一个只包括 '('，')'，'{'，'}'，'['，']'的字符串，判断字符串是否有效

示例：

```bash
输入:  输入: '()';
输出: true;
```

```bash
输入: '()[]{}';
输出: true;
```

```bash
输入: '()]{';
输出: false;
```

遇见匹配的问题，最好的解决方案就是`stack`结构，js 中没有栈结构，可以用数组来模拟。

此题的解决方案就是遇到`左括号`push 到数组里（数组后面回说是栈），遇到`右括号`可以从栈顶取出跟`右括号对比`，匹配成功执行出栈操作，遍历完毕；栈中无元素，说明是有效字符串。

```js
const brackets = '([{}])'

function isValid(b) {
  const stack = []
  // 也可以用对象模拟，map对象是括号的匹配规则
  const map = new Map([
    ['}', '{'],
    [']', '['],
    [')', '('],
  ])
  for (let item of b) {
    if (!map.has(item)) {
      stack.push(item)
    } else if (!stack.length || stack.pop() !== map.get(item)) {
      return false
    }
  }
  return !stack.length
}

isValid(brackets) // true
```

复杂度分析：

时间复杂度: O(n) 遍历了 1 次 有 n 个元素的空间

空间复杂度: O(n)

### 2.3.4 缺失的数字

给定一个包含 0, 1, 2, ..., n 中 n 个数的序列，找出 0 .. n 中没有出现在序列中的那个数。

示例：

```bash
输入:  [3,5,4,6,8,9,1,2,0];
输出: 7;
```

#### 方法 1： 分组法计算法

通过计算如果不缺少一个数字的情况下总和应该多少，缺少一个数字总合多少；它们之差就是缺少的那个数字。

```js
const lostArr = [3, 5, 4, 6, 8, 9, 1, 2, 0, 2]

function lostNumber(arr) {
  const total = arr.reduce((total, num) => {
    return total + num
  }, 0)

  const length = arr.length
  const termial = ((1 + length) * length) / 2
  return termial - total
}

lostNumber(lostArr) //7
```

复杂度分析：

时间复杂度: O(n) ，2 次遍历数组，所以最终的时间复杂度是 O(n)

空间复杂度: O(1)，会有 3 个临时变量，不会随着入参数组的增加而增加，所以空间复杂度是 O(1)

### 2.3.5 滑动窗口问题

给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

示例：

```bash
输入:  nums = [3,5,4,-6,8,9,-1,2,0] 和k=3
输出: [5,5,8,9,9,9,2]
```

什么是滑动窗口？

k 代表窗口的范围，每次滑动窗口往前进一步，直到窗口无法前进。

下面是窗口滑动的过程：

[3,5,4],-6,8,9,-1,2,0

3,[5,4,-6],8,9,-1,2,0

3,5,[4,-6,8],9,-1,2,0

3,5,4,[-6,8,9],-1,2,0

3,5,4,-6,[8,9,-1],2,0

3,5,4,-6,8,[9,-1,2],0

3,5,4,-6,8,9,[-1,2,0]

1. 双指针+遍历

窗口的本质就是约定范围，如果想约定范围我们就应该想到双指针；我们可以定义一个`left`左指针,定义一个`right`右指针；分别指向窗口的两端，通过不断移动左右指针来达到移动窗口的目的。

```js
function maxSlidingWindow(nums, k) {
  const maxArr = []
  for (let i = 0; i <= nums.length - k; i++) {
    const left = i
    const right = k + i
    const kNums = nums.slice(left, right)
    const maxNum = Math.max(...kNums)
    maxArr.push(maxNum)
  }
  return maxArr
}
```

上面的解法其实还可以优化，每次我们滑动窗口都需要找出最大值，每次滑动窗口只移动一位；其实当前窗口前 2 位数是上一次后 2 位数；
在当前窗口找最大值时候，上一次比较过的数在本次窗口还要比较，那是不是重复比较了？

2. 双端队列

每次我们滑动窗口，此时滑动窗口少了一个元素，又增加了一个元素；每次窗口移动时，只根据发生变化的元素对最大值进行更新，那么复杂度是不是降低了？

双端队列可以完美解决这个问题，双端队列的核心就是维护一个`有效递减的队列`,在遍历的时候尝试将每个元素推入队列中，要求必须递减，如果当前要推入的元素比队列的最后一个元素大，就移除最后一个元素，然后当前元素在跟队列的最后一个元素再次比较；比最后一个元素大就移除最后一个元素，最终当前元素小于最后元素为止，停下并将当前元素放入队列中。

需要注意的是最大元素不在当前窗口内要及时清除掉。

```js
function maxSlidingWindow(nums, k) {
  const maxArr = []
  const doubleEndedQueue = []
  const len = nums.length
  for (let i = 0; i < len; i++) {
    while (
      doubleEndedQueue.length &&
      nums[i] > nums[doubleEndedQueue[doubleEndedQueue.length - 1]]
    ) {
      doubleEndedQueue.pop()
    }
    doubleEndedQueue.push(i)

    while (doubleEndedQueue.length && doubleEndedQueue[0] <= i - k) {
      doubleEndedQueue.shift()
    }
    if (i >= k - 1) {
      maxArr.push(nums[doubleEndedQueue[0]])
    }
  }
  return maxArr
}
```

## 2.4 链表

相对于数组，链表是一种稍微复杂的数据结构，掌握起来也要比数组稍微难一些。链表通过指针将不连续的内存串联起来。
数组的线性序是由数组的下标来决定的，而 链表的的顺序是由各个对象中的指针来决定。

在多数编程语言中，数组的长度是固定的，一旦被填满，要再加入数据将会变得非常困难。在数组
中，添加和删除元素也比较麻烦，因为需要把数组中的其他元素向前或向后移动。

JavaScript 的数组被实现成了对象，与 Java 相比，效率偏低。 在实际开发中，不能单靠复杂度就决定使用哪个数据结构，没有一种数据结构是完美的，否则其他的数据结构不都被淘汰了。

链表的结构可以由很多种，它可以是单链表或双链表，也可以是已排序的或未排序的，环形的或非环形的。如果一个链表是单向的，那么链表中的每个元素没有指向前一个元素的指针。已排序的和
未排序的链表较好理解

由于链表是非连续的，想要访问第 i 个元素就没数组那么方便了，需要根据指针一个结点一个结点 地依次遍历，直到找到相应的结点。
数组在插入或删除元素时，为了保证数据的连续性，需要对原有的数据进行挪动。然而链表在插入
或删除时，不要挪动原来的数据，因为链表的数据本身就是非连续的空间，因此在链表中插入、删
除数据是非常快的。

### 2.4.1 设计一个链表

```js
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class linkedList {
  constructor() {
    this.head = new Node('A')
  }
  // 查找节点
  find(item) {
    let node = this.head
    while (node !== item && node !== null) {
      node = node.next
    }
    return node
  }
  // 移除节点
  remove(item) {
    const prevNode = this.findPrev(item)
    if (prevNode.next !== null) {
      prevNode.next = prevNode.next.next
    }
  }
  // 插入节点
  insert(el, item) {
    const newNode = new Node(el)
    const currentNode = this.find(item)
    newNode.next = currentNode.next
    currentNode.next = newNode
  }
  // 找当前节点上一个节点
  findPrev(item) {
    let node = this.head
    while (node.next !== null && node.next.value !== item) {
      node = node.next
    }
    return node
  }
}
```
### 2.4.2 反转一个链表

示例：

```js
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

1. 用迭代的方法实现。

```js
const linked={
  head:{
    value:1,
    next:{
      value:3,
      next:{
        value:5,
        next:null
      }
    }
  }
}
let head = linked.head
let next = null
let pre= null
while(head){
  next = head.next // 先存下后面的链表
  head.next = pre // 当前的指针指向上一个
  pre =head // 把反转的链表存起来
  head =next // 取出存下来的链表，继续遍历
}
// pre 就是最终反转的链表
```
