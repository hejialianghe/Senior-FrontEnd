## 理解递归
递归是一种解决问题的方法，它先解决小问题，最终解决最初的大问题；递归通常是函数调用自身。
### 递归的定义
递归是指一个函数在其定义过程中调用自身。递归函数需要两个主要部分：

1. 基线条件（Base Case）：当满足这个条件时，递归停止。

2. 递归步骤（Recursive Step）：函数继续调用自身处理子问题

如果把上面的话翻译成js代码的话，可以写成下面这样
``` javascript
function recursion (){
    const recursionAnswer = confirm('确认终止？')
    if(recursionAnswer) return true // 基准条件
    recursion(recursionAnswer) // 递归调用
}
recursion()
```
### 递归的工作原理
递归函数在执行过程中会进行一系列的函数调用，这些调用被存储在调用栈中。每次函数调用会将当前的状态（如局部变量和当前执行的位置）压入调用栈。当递归函数返回时，状态从栈中弹出并恢复。

## 示例
### 计算阶乘
作为递归的第一个例子，我们来看看如何计算一个数的阶乘。数n的阶乘，定义为n!,表示从1到n的整数的乘积。

以下是计算5!的递归调用过程的图示：
```
factorial(5)
|
|--- 5 * factorial(4)
        |
        |--- 4 * factorial(3)
                |
                |--- 3 * factorial(2)
                        |
                        |--- 2 * factorial(1)
                                |
                                |--- 1 * factorial(0)
                                        |
                                        |--- 1

```

代码
```javascript
function factorial(n) {
    // 基线条件：当 n 为 0 时，返回 1
    if (n === 0) {
        return 1;
    }
    // 递归步骤：调用自身
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 输出 120
```
### 斐波那契数列
斐波那契数列的定义如下：
1. F(0) = 0
2. F(1) = 1
3. F(n) = F(n-1) + F(n-2)（n ≥ 2）
以下是用JavaScript实现的递归版斐波那契数列：

```javascript

function fibonacci(n) {
    // 基准情况
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    // 递归情况
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 测试
console.log(fibonacci(6));  // 输出 8
```

## 递归的优缺点
优点：

代码简洁： 递归函数往往比迭代的实现更加简洁和易于理解。
自然表达： 一些问题本身具有递归性质，用递归来表达更直观。
缺点：

- 性能开销： 每次递归调用都有开销，特别是对于深层递归，可能会导致性能问题。
- 易于引起堆栈溢出： 如果递归基准条件没有正确处理，容易导致无限递归，从而引发堆栈溢出。

## 尾递归优化
尾递归（Tail Recursion） 是指递归调用是函数中的最后一个操作。尾递归优化可以使编译器优化递归，使其不会增长调用栈，从而提高性能。

尾递归实现阶乘
```javascript
function factorial(n, acc = 1) {
    if (n === 0) {
        return acc;
    }
    return factorial(n - 1, n * acc);
}

console.log(factorial(5));  // 输出 120

```

## 递归的应用场景
递归广泛应用于许多计算机科学领域，包括但不限于：

- 数学计算： 如阶乘、斐波那契数列等。
- 数据结构： 如二叉树、图的遍历。
- 算法设计： 如分治法、回溯法。
- 字符串处理： 如正则表达式匹配、解析等。