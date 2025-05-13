// 1*2*3*4*5
// let total = 1
// for(let i =2;i<=5;i++){
//   total =  i*total
// }

// console.log('total',total)

// // 5的阶乘 = 5* recursion(4)
// function recursion (n){
//   if(n===1){
//     return 1
//   }
//   return n * recursion(n-1)
// }
// recursion(5)

// console.log('recursion',recursion(5))


// 1 1 2 3 5 8 13
// 13 
function feibonaqi (n){
    if(n===1 || n ===2){
      return 1
    }

  return feibonaqi(n-1) + feibonaqi(n-2)
}

console.log('feibonaqi(7)',feibonaqi(7))