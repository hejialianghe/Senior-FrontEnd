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
 console.log(bubbleSort1(arr)) // [ 1, 2, 3, 4, 5, 5 ]