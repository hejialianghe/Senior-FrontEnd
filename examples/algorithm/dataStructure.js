
// 2.2 数组

// 2.2.1  找出出现一次的数字
// const arr = [2,5,6,7,5,6,2]

// const num = arr.reduce((total,cur)=>total ^ cur)

// console.log("num",num)

// 2.2.2 两数求和问题

// const nums = [5, 7, 8, 2, 4]
// const target = 9
// const res ={}
// let result = []
// nums.forEach((item,i)=>{
//     if(typeof res[target-item] ==='number'){
//         result.push([item,target-item])
//     }else{
//         res[item] = i
//     }
// })

// console.log('result',result)

// 2.2.3 合并2个有序数组
// let num1 = [1,3,5,8,10,16];
// let num2  = [2,4,5,6,7,9];

// let x = num1.length-1
// let y = num2.length-1
// let m = x+y+1
// while(y>=0){
//  if(num1[x]>num2[y]){
//     num1[m] = num1[x]
//     x--
//  }else{
//     num1[m] = num2[y]
//     y--
//  }
//  m--
// }
// console.log('num1',num1)

// 2.3.4 缺少的数字

// const lostArr = [3, 5, 4, 6, 8, 9, 1, 2, 0]

// const len = lostArr.length
// const termial = (len+1)*len/2
// console.log('termial',termial)


// 2.4.2 反转一个链表

const linked={
   head:{
     value:1,
     next:{
       value:2,
       next:{
         value:3,
         next:{
          value:4,
          next:null
         }
       }
     }
   }
 }

//  function reverseLiked (linked){
//    let head= linked.head
//    let result = null
//    while(head){
//     // temp 临时储存的变量
//      let temp = head.next
//      head.next = result
//      result = head
//      head = temp
//    }
//     return result
//   }
  
// console.log('反转链表1',reverseLiked(linked))


function reverseList(head) {
   if (!head || !head.next) {
       return head;
   }

   // 递归调用，反转剩余部分的链表
   console.log('反转前1')
   let newHead = reverseList(head.next);

   // 将当前节点的下一个节点的指针指向当前节点，实现反转
   head.next.next = head;
   head.next = null;
   console.log('反转后2',head)
   return newHead;
  }
console.log('反转链表3',reverseList(linked.head))