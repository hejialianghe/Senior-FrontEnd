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
