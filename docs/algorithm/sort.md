## 3.1 冒泡排序

#### 个人理解：

比较 2 个元素，如果顺序错误就把他们交换过来，这个名字的由来就是较小的元素由于交换慢慢“浮”到数列的顶端，它的特点是每一次排序完；右边的总是最大的数值。

#### 大佬理解：

冒泡 排序 是比较形象的 一种排序算法， 就像小气泡在水底不断往上冒泡，直到变大。那他的算法过程就是这样的，依次比较俩个相邻的节点，然后将较大的放置在后，较小的放置在前，直到排序完成

#### 算法步骤：

- 比较相邻的元素，如果第一个比第二个大，就交换它们的位置。

- 对每对相邻元素作同样的工作，这步做完后，最后的元素会是最大的数。

- 针对所有的元素重复以上的步骤，除了最后一个。直到没有任何一对数字需要比较。

#### 菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/bubble-sort.html)

#### 案例： 给数组`[2,4,3,5,1,5]`进行排序

```javascript
let arr = [2, 4, 3, 5, 1, 5]
// 正向遍历
function bubbleSort1(src) {
  let arr = [...src] // 做浅拷贝，避免影响原数组
  let len = arr.length
  let current
  for (let i = 0; i < len - 1; i++) {
    //为什么arr.length-1-i？因为每次遍历完后最大值肯定在最右边，数组的后面的那段其实已经是排序好，无需在排序
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        current = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = current
      }
    }
  }
  return arr
}
/*
    反向遍历实现
     - 冒泡排序第一次遍历后会将最大值放到最右边，这个值是全局的最大值
     - 标准的冒泡排序的每次遍历都会比较全部元素，虽然右侧的值以及是最大值了
     - 改进之后，每次遍历后的最大值，次大值，等等都会固定在右侧，避免的重复比较
   */
function bubbleSort2(src) {
  let arr = [...src] //做浅拷贝，避免影响原数组
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
console.log(bubbleSort1(arr)) // [ 1, 2, 3, 4, 5, 5 ]
console.log(bubbleSort2(arr)) // [ 1, 2, 3, 4, 5, 5 ]
//2个方法都会循环10次
```

## 3.2 插入排序

#### 个人理解：

先把第2元素存起来，然后跟第1个的元素进行比较，如果小于第1个元素，那么第1个元素往后挪一个位置；第二个元素放在第一个元素的位置上，如果大于前面的数值，就不用动。

在把第 3 个元素存起来，跟第2个的元素进行比较，如果符合规则（小于前面的元素），第2个元素往后挪一位。
存起来的元素在跟第1个元素比较，如果符合规则，第1个元素就往后挪一位，这时候前面没有元素可比，就把第3个元素放在第1个元素的位置上。需要注意的是如果不符合规则了，就是存的元素比比较元素大的时候，就不用往前比较了，可以插入当前的位置；在比较的过程中，被比较的元素在比较中符合规则就需要往后挪一位，这是给存起来的元素腾位置。


以此慢慢递进完成排序。

（正序：插入就是每次新取一个数，然后倒序地往前找，找到比它小的就插入后面）

#### 大佬理解：

其实插入排序就和打扑克的时候抓牌一样，新摸一张，然后再已排好的队列里面去插入它。

#### 算法步骤：

将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。

从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。

#### 菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/insertion-sort.html)

#### 案例： 给数组`[2,4,3,5,1,5]`进行排序

```javascript
function insertionSort(src) {
  let arr = [...src]
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i]
    let preIndex = i - 1
    while (preIndex >= 0 && current < arr[preIndex]) {
      // 如果current小于前面的值，那么current肯定需要往前插入，具体插入前面的哪个位置，需要跟前面的数进行对比
      // 在对比的过程中，如果current小于前面的值；那么对比的数肯定往后挪一位
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = current
  }
  return arr
}
console.log(insertionSort(arr)) // [ 1, 2, 3, 4, 5, 5 ]
```
## 3.3 选择排序

个人理解：`寻找最小值`，第一次枚举会找到当前数组的最小的一个值，放在首位；就是首位跟最小值交换位置。
第二次枚举会找到数组第二小值，然后第二位置的值跟第二小值交换位置，以此内推。
由此可见每次枚举完，左边是排序好的，右边是待排序的。
#### 菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/selection-sort.html)

```js
function selectionSort(arr) {
  
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {     // 寻找最小的数
                minIndex = j;                 // 将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
  
    }
    return arr;
}

```
## 3.4 快速排序

个人理解：快速排序主要采用分治法，`定义基准值`；左边所有都比基准值小，右边所有的都比基准值大；然后左右两边在定义基准值再次重复上次动作。

#### 菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/quick-sort-2.html)

```js

function quickSort(arr, left = 0, right = arr.length - 1) {
  // 定义递归边界，若数组只有一个元素，则没有排序必要
  if(arr.length > 1) {
      // lineIndex表示下一次划分左右子数组的索引位
      const lineIndex = partition(arr, left, right)
      // 如果左边子数组的长度不小于1，则递归快排这个子数组
      if(left < lineIndex-1) {
        // 左子数组以 lineIndex-1 为右边界
        quickSort(arr, left, lineIndex-1)
      }
      // 如果右边子数组的长度不小于1，则递归快排这个子数组
      if(lineIndex<right) {
        // 右子数组以 lineIndex 为左边界
        quickSort(arr, lineIndex, right)
      }
  }
  return arr
}
// 以基准值为轴心，划分左右子数组的过程
function partition(arr, left, right) {
  // 基准值默认取中间位置的元素
  let pivotValue = arr[Math.floor(left + (right-left)/2)]
  // 初始化左右指针
  let i = left
  let j = right
  // 当左右指针不越界时，循环执行以下逻辑
  while(i<=j) {
      // 左指针所指元素若小于基准值，则右移左指针
      while(arr[i] < pivotValue) {
          i++
      }
      // 右指针所指元素大于基准值，则左移右指针
      while(arr[j] > pivotValue) {
          j--
      }

      // 若i<=j，则意味着基准值左边存在较大元素或右边存在较小元素，交换两个元素确保左右两侧有序
      if(i<=j) {
          swap(arr, i, j)
          i++
          j--
      }

  }
  // 返回左指针索引作为下一次划分左右子数组的依据
  return i
}

// 快速排序中使用 swap 的地方比较多，我们提取成一个独立的函数
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

```


总结：现在可以用 sort 排序，可以看 v8 的源码去了解它[点击我](https://github.com/v8/v8/blob/master/third_party/v8/builtins/array-sort.tq)
