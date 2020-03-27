// let arr=[]
// arr.__proto__.newPush=function mutator (val){
//   console.log('访问到了')
//   this.push.call(this,val)
// }
//  arr.newPush(8)
// console.log(arr) //[ 8 ]

console.log(1)
// Promise.resolve()
// .then(function (){
//   console.log(2)
// })
new Promise((resolve,reject)=>{
  console.log(5)
  resolve()
}).then(function(){
  console.log(2)
})
setTimeout(function(){
  console.log(3)
},0)
console.log(4)