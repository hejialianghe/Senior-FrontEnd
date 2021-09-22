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

给一非空数组，某个元素只出现一次，其他元素都均出现2次；找出出现一次的那个元素？

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