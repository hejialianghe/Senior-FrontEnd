
  ### 2.1 冒泡排序

  ####   个人理解：
  
  比较2个元素，如果顺序错误就把他们交换过来，这个名字的由来就是较小的元素由于交换慢慢“浮”到数列的顶端，它的特点是每一次排序完；右边的总是最大的数值。

  ####  大佬理解：

  冒泡 排序 是比较形象的 一种排序算法， 就像小气泡在水底不断往上冒泡，直到变大。那他的算法过程就是这样的，依次比较俩个相邻的节点，然后将较大的放置在后，较小的放置在前，直到排序完成

  ####   算法步骤：

  - 比较相邻的元素，如果第一个比第二个大，就交换它们的位置。

  - 对每对相邻元素作同样的工作，这步做完后，最后的元素会是最大的数。

  - 针对所有的元素重复以上的步骤，除了最后一个。直到没有任何一对数字需要比较。
  ####  菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/bubble-sort.html)

  ####   案例： 给数组`[2,4,3,5,1,5]`进行排序
   ``` javascript
     let arr = [2,4,3,5,1,5]
     // 正向遍历
      function bubbleSort1(src) {
        let arr = [...src] // 做浅拷贝，避免影响原数组
        let len = arr.length;
        let current
        for (let i=0;i<len-1;i++){ 
          //为什么arr.length-1-i？因为每次遍历完后最大值肯定在最右边，数组的后面的那段其实已经是排序好，无需在排序
            for(let j=0;j<len-1-i;j++){
                if(arr[j]>arr[j+1]){
                  current=arr[j]
                  arr[j]=arr[j+1]
                  arr[j+1]=current
                };
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
        let arr=[...src] //做浅拷贝，避免影响原数组
          for (let i=arr.length-1;i>0;i--){
          for(let j=0;j<i;j++){
              if(arr[j]>arr[j+1]){
                [arr[j],arr[j+1]]=[arr[j+1],arr[j]]
              }  
          }
      }
      return arr
     }
      console.log(bubbleSort1(arr)) // [ 1, 2, 3, 4, 5, 5 ]
      console.log(bubbleSort2(arr)) // [ 1, 2, 3, 4, 5, 5 ]
      //2个方法都会循环10次
  ```
  ### 2.2 插入排序
  ####  个人理解：
  
  先把第二元素存起来，然后跟前面的元素进行比较，如果符合规则就插入比较元素的前面或后面；然后在把第3个元素存起来，在跟前面的元素进行比较，如果符合规则就插入比较元素的前面或后面；以此慢慢递进完成排序。
   
（正序：插入就是每次新取一个数，然后倒序地往前找，找到比它小的就插入后面）

  ####  大佬理解：
  
  其实插入排序就和打扑克的时候抓牌一样，新摸一张，然后再已排好的队列里面去插入它。

  ####  算法步骤：
  
  将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。

  从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。

  ####   菜鸟教程给出生动的展示图：[点击我](https://www.runoob.com/w3cnote/insertion-sort.html)

  ####  案例： 给数组`[2,4,3,5,1,5]`进行排序
  ``` javascript
      function insertionSort (src) {
        let arr=[...src]
        let current
        let preIndex
        for(let i=0;i<arr.length;i++){
          let current =arr[i+1]
          let preIndex=i
          while(preIndex>=0 && (current<arr[preIndex])){
              arr[preIndex+1]= arr[preIndex]
              arr[preIndex]=current
              preIndex--
          }
      }
        return arr
    }
   console.log(insertionSort(arr)) // [ 1, 2, 3, 4, 5, 5 ]
  ```
  总结：现在可以用sort排序，可以看v8的源码去了解它[点击我](https://github.com/v8/v8/blob/master/third_party/v8/builtins/array-sort.tq)
  