javascript 常用的数据结构：

- 字符串
- 数组
- 栈
- 队列
- 链表
- 树

## 2.1 字符串

字符串是由零个和多个字符组成的有序序列，是 javascript 最基础的数据结构，也是学习编程的基础。

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
  return value
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
  if (typeof params !== 'number') return
  // 反转字符串
  return params
    .split('')
    .reverse()
    .join('')
}
```

#### 方法 2 首尾替换法

如果在面试过程中回答出第一种可能不是面试官想要的，就像排序问题，你回答 sort api，面试官不需要你去回答 api。

```js
function reverse(str) {
  const params = str.split('')
  for (let i = 0; i < params.length / 2; i++) {
    ;[params[i], params[params.length - i - 1]] = [
      params[params.length - i - 1],
      params[i]
    ]
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
  const reverseStr = arr
    .split('')
    .reverse()
    .join('')
  return reverseStr === params
}
```
#### 复杂度分析

时间复杂度: O(n) 该解法中， toLowerCase() , replace() , split() , reverse() , join() 的时间复杂度都为O(n)，且都在独立的循环中执行，因此，总的时间复杂度依然为 O(n)。

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

描述：给一非空数组，某个元素只出现一次，其他元素都均出现2次；找出出现一次的那个元素？

示例：

```bash
输入: [1,6,3,3,1,]
输出: 6
```
#### 方式1： 分组法

用分组法，时间和空间的复杂度都偏高，理解分组的思想才是重点。

```js
function singleNumber(arr) {
    const arrGroups =arr.map((item)=>{
        return arr.filter((ele)=>item === ele)
     })
    return arrGroups.find((item)=>item.length===1)[0]
}
```

复杂度分析：

- 时间复杂度: O(n2)

使用了 map 和 filter ，嵌套遍历，故为 O(n2) 。 

- 空间复杂度: O(n)

map 方法创建了一个长度为 n 的数组，占用了 n 大小的空间。

#### 方式2： 异或比较法

异或运算符可以将两个数字比较，由于有一个数只出现了一次，其他数皆出现了两次，类似乘法 则无论先后顺序，最后相同的数都会异或成0，唯一出现的数与0异或就会得到其本身，该方法是最优解，直接通过比较的方式即可得到只出现一次的数字。

```js
function singleNumber(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator ^ currentValue);
}
```
复杂度分析：

时间复杂度: O(n)

仅用 reduce 方法遍历，一层遍历，故为 O(n) 。

空间复杂度: O(1)

空间复杂度为常量，占用空间没有随数据量 n的大小发生改变，故为O(1)。

### 2.2.2 两数求和的问题

描述：给定一个整数数组nums和一个目标值target，在数组中找出和为目标值target的两个整数？

示例：

```bash
输入: num1 [1,6,3,4,7]  target 9
输出: [6,3]
```

2层循环的时间复杂度是O(n^2),O(1)没有开启新的空间。

遇到2层循环，我们就应该反思一下，能不能空间换时间，把它换成一层循环。
#### 方式1：利用map

几乎所有求和的问题，我们都可以转化为求差的问题，这道题就是典型的例子；通过求差使问题变的更简单。

我们用target减当前元素，得到差值，然后去map对象中找差值；没有就存下当前元素，每遍历一个新数字都去map对象中查找；直到找到目标元素为止。我们把2层循环简化到一层循环，可以说是空间换时间。

```js
const nums=[5,7,8,2,4] 
const target = 9
const res = {}
let lookup = []
function toSum(list) {
    list.find((item,i)=>{
      // 查看当前元素所对应的目标元素是否存在map对象中
        if(res[target-item]){
            lookup=[item,target-item]
          return true
        }else {
            res[item]=i
            return false
        }
    })
}
```

复杂度分析：

时间复杂度: O(n)

我们只遍历了包含有 n 个元素的列表一次，在 map 中进行的每次查找只花费 O(1) 的时间, 因此总的复杂度为 O(n)

空间复杂度: O(n)

### 2.2.3 合并2个有序数组

描述：给两个有序数组num1和num2，把num2合并到num1中。

示例：

```bash
输入: num1 [1,3,5,8]  num2 [2,4,5,6,7]
输出: num1 [1,2,3,4,5,5,6,7,8]
```
#### 方式1： 双指针

用2个指针指向数组的末尾，每次只对指针指向的元素进行比较，取出较大的元素放在num1的末尾往前补。

为什么从后往前补？

因为num1前面有元素，从前往后补，会替换掉原来的元素。

```js
// 2个有序数组
const num1 =  [1,3,5,8]
const num2= [2,4,5,6,7]

let k = num1.length-1
let j = num2.length-1
// m是num1和num2合并后长度
let m= k+j+1

while(k>=0 && j>=0){
    if(num2[j]>num1[k]){
        num1[m]=num2[j]
        j--
    }else{
        num1[m]=num1[k]
        k--
    }
    m--
}
// 特殊情况：1.num1先遍历完，2.num2先遍历完。
// num2先遍历完，我们不用处理，因为我们就是把num2合并到num1。
// num1先遍历完，我们把num2全部复制到num1中。
while(j>=0){
    num1[m]=num2[j]
    j--
    m--
}
```
复杂度分析：

时间复杂度: O(n)

我们只遍历了包含有 n 个元素的列表一次

空间复杂度: O(n)
 
有2个数组，有一个数组在不断增加
### 2.2.4 三数之和

描述：给定一个包含n个整数的数组nums ，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ?找出所有满足条件且不重复的三元组。

示例：

```bash
输入: num1 [-1, 0, 1, 2, -1, -4]
输出: 满足要求的三元组集合：[ [ -1, -1, 2 ], [ -1, 0, 1 ] ]
```

三数求和问题，固定其中一个数，在剩下的数中寻找两个数和这个固定数相加是等于0。

似乎需要三层循环才能解决，不过现在我们有双指针，定位效率大大提高；双指针可以做到空间换时间，可以帮助我们降低问题的复杂度。
#### 方式1： 双指针

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
 
uniqueMap可能在不断的开启新空间

## 2.3 栈和队列
#### 栈（stack）

栈是一种特殊的列表，它按照`先进后出`的原则存储数据；先进入的数据被压在栈底，后进去的数据在栈顶。需要读取数据的时候需要从栈顶开始。

我们可以想象一下，我们放盘子，先放入下面盘子，拿盘子的时候最后才能拿到。

栈的主要操作就是`入栈`、`出栈`，在js中栈和队列的实现一般都依赖数组；可以看做栈和队列是特别的数组。（用链表来实现也是可以的，用链表来实现会比数组麻烦很多）

![](~@/jsasvanced/stack.png)

### 2.3.1 栈的实现

```js
class Stack {
  constructor(){
    this.data=[]
  }
  push(value){
    this.data.push(value)
  }
  pop(){
   return this.data.pop()
  }
}

const stack = new Stack()
// 入栈
stack.push(1)
stack.push(2)

while(stack.data.length){
  console.log('出栈',stack.pop())
}
```
#### 队列（queue）

队列是`先进先出`的数据结构，跟我们的`栈`不一样，队列的概念比较好理解；它就像我们去食堂买饭一样，先去的先打到饭；后去的后打到饭。

队列的操作有2种：插入元素、删除元素。
- 只可以向尾部插入元素
- 只可以头部移除元素

```js
class Queue {
  constructor(){
    this.data=[]
  }
  unQueue(value){
    this.data.push(value)
  }
  deQueue(){
   return this.data.shift()
  }
}

const stack = new Queue()
// 入队
stack.unQueue(1)
stack.unQueue(2)

while(stack.data.length){
  console.log('出对',stack.deQueue())
}
```