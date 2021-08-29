const arr = [5, 8, 0, 6, 2, 3, 7]
[5, 3, 0, 6, 2, 8, 7]

// 冒泡排序
function bubbling(src) {
  const arr = [...src]
  let len = arr.length
  let current
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      if (arr[j] > arr[j + 1]) {
        current = arr[j + 1]
        arr[j + 1] = arr[j]
        arr[j] = current
      }
    }
  }
  return arr
}

// 插入排序
function insert(src) {
  const arr = [...src]
  const len = arr.length
  let temp, j // temp是一个基准值
  for (let i = 1; i < len; i++) {
    j = i
    temp = arr[i]
    while (j > 0 && temp < arr[j - 1]) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = temp
  }
  return arr
}

// function quickSort (arr) {

//     if (arr.length <= 1) {
//         return arr;
//         }
//         var pivotIndex = Math.floor(arr.length / 2);// 3
//         var pivot = arr.splice(pivotIndex, 1)[0];// 5
//         var left = [];
//         var right = [];

//         for (var i = 0; i < arr.length; i++) {
//         if (arr[i] < pivot) {
//         left.push(arr[i]);
//         console.log('arr',left);
//         } else {

//         right.push(arr[i]);
//         }
//         }

//         return quickSort(left).concat([pivot], quickSort(right));
// }
// console.log('快速排序',quickSort([1,2,3,4,5]));

//快速排序入口
function quickSort(arr, left = 0, right = arr.length - 1) {
  // 定义递归边界，若数组只有一个元素，则没有排序必要
  if (arr.length > 1) {
    // lineIndex表示下一次划分左右子数组的索引位
    const lineIndex = partition(arr, left, right)
    console.log('lineIndex', arr[lineIndex])
    // 如果左边子数组的长度不小于1，则递归快排这个子数组
    if (left < lineIndex - 1) {
      // 左子数组以 lineIndex-1 为右边界
      quickSort(arr, left, lineIndex - 1)
    }
    // 如果右边子数组的长度不小于1，则递归快排这个子数组
    if (lineIndex < right) {
      // 右子数组以 lineIndex 为左边界
      quickSort(arr, lineIndex, right)
    }
  }
  return arr
}
// 以基准值为轴心，划分左右子数组的过程
function partition(arr, left, right) {
  // 基准值默认取中间位置的元素
  let pivotValue = arr[Math.floor(left + (right - left) / 2)]
  // 初始化左右指针
  let i = left
  let j = right
  // 当左右指针不越界时，循环执行以下逻辑
  while (i <= j) {
    // 左指针所指元素若小于基准值，则右移左指针
    while (arr[i] < pivotValue) {
      i++
    }
    // 右指针所指元素大于基准值，则左移右指针
    while (arr[j] > pivotValue) {
      j--
    }

    // 若i<=j，则意味着基准值左边存在较大元素或右边存在较小元素，交换两个元素确保左右两侧有序
    if (i <= j) {
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
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

// console.log('快排2',quickSort(arr));

function quickSort(data) {
  const arr = [...data]
  if (arr.length <= 1) {
    return arr
  }
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

//  [5, 8, 0, 6, 2, 3, 7]

// function selectionSort() {
//   let minInndex, temp
//   for (let i = 0; i < arr.length - 1; i++) {
//     minInndex = i
//     for (let j = i + 1; j < arr.length; j++) {
//       if (arr[j] < arr[minInndex]) {
//         minInndex = j
//       }
//     }
//     temp = arr[i]
//     arr[i] = arr[minInndex]
//     arr[minInndex] = temp
//   }
//   return arr
// }

// console.log('selectionSort(arr)', selectionSort(arr))

//  [5, 8, 9, 6, 2, 3, 7]
//  [5, 3, 9, 6, 2, 8, 7]
// const function  quickSort (arr) {
 
//     const left = 0
//     const right = right.length-1
//     partition(arr,left,right,benchmark)
    
// } 

// function partition (arr,left,right) {
//     const benchmark = arr[arr.length-1/2]
//     const 
//     while(arr[left]<benchmark)   {
//         left ++ 
//     }

//     while(arr[right]>benchmark)   {
//         right -- 
//     }
    
//     if(left)
// }

const arr1 = [8, 5, 9,10, 6, 9, 8, 7]
2
function quickSort(arr, left, right) {
    var len = arr.length,
        partitionIndex,
        left = typeof left != 'number' ? 0 : left,
        right = typeof right != 'number' ? len - 1 : right;

    if (left < right) {
        partitionIndex = partition(arr, left, right);
        quickSort(arr, left, partitionIndex-1);
        quickSort(arr, partitionIndex+1, right);
    }
    return arr;
}

function partition(arr, left ,right) {     // 分区操作
    var pivot = left,                      // 设定基准值（pivot）
        index = pivot + 1;
    for (var i = index; i <= right; i++) {
        if (arr[i] < arr[pivot]) {
            swap(arr, i, index);
            index++;
        }        
    }
    swap(arr, pivot, index - 1);
    return index-1;
}

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

console.log('quickSort(arr1)',quickSort(arr1))