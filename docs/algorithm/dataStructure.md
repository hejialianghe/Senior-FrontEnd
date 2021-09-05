javascript常用的数据结构：

- 字符串
- 数组
- 栈
- 队列
- 链表
- 树

## 2.1 字符串

字符串是由零个和多个字符组成的有序序列，是javascript最基础的数据结构，也是学习编程的基础。

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
  if(typeof params !== 'number') return

  const value = params>0? 
              String(params).split('').reverse().join(''): 
              String(params).slice(1).split('').reverse().join('')
  return value
}
```
#### 复杂度分析

- 时间复杂度 O(n)

reverse 函数时间复杂度为 O(n)，n为整数长度,最好的情况为O(1)。

- 空间复杂度 O(n)

代码中创建临时对value象， n为整数长度，因此空间复杂度为 O(n),最好的情况为O(1)。

### 2.1.1 反转字符串

示例：
```bash
输入: china
输出: anihc
```

#### 方法1

```js
function reverse(params) {
  if(typeof params !== 'number') return
  // 反转字符串
  return  params.split('').reverse().join('')
}
```

#### 方法2 首尾替换法

如果在面试过程中回答出第一种可能不是面试官想要的，就像排序回答sort类似。

```js
function reverse(str) {
 const params=str.split('')
 for(let i=0;i<params.length/2 ;i++){
    [params[i],params[params.length-i-1]]= [params[params.length-i-1],params[i]]
 }
 return params.join('')
}
```

#### 复杂度分析

时间复杂度: O(n) 

空间复杂度: O(1)

reverse中没有新开辟的内存空间







