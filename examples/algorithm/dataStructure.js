
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
let num1 = [1,3,5,8,10,16];
let num2  = [2,4,5,6,7,9];

let x = num1.length-1
let y = num2.length-1
let m = x+y+1
while(y>=0){
 if(num1[x]>num2[y]){
    num1[m] = num1[x]
    x--
 }else{
    num1[m] = num2[y]
    y--
 }
 m--
}
console.log('num1',num1)
