const cloneDeep=require('lodash/cloneDeep')
let obj = {
    name: '开心',
    car: ['宝马', '奔驰', '保时捷'],
    deive: function () { },
    age: undefined
  }
  const newObj=cloneDeep(obj)
  newObj.name='不开心'
  newObj.car[0]='自行车'
  console.log(obj,newObj)