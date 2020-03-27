// let arr=[]
// arr.__proto__.newPush=function mutator (val){
//   console.log('访问到了')
function light (color,second) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log(color)
      resolve()
    },second*1000)
  })
}

let list =[
  {
    color:'red',
    time:3
  },
  {
    color:'green',
    time:2
  },
  {
    color:'yellew',
    time:1
  }
]

function orderLights (list) {
  let promise=Promise.resolve()
  list.forEach(item=>{
    promise=promise.then(function () {
      return light(item.color,item.time)
    })
  })
  promise.then(function(){
    orderLights(list)
  })
}
orderLights(list)