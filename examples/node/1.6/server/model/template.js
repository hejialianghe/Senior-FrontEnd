// 数据模型
const mongoose=require('mongoose')
const templateSchema=mongoose.Schema({
    name:String,
    template:String,
    data:String
})
//第一个参数 当前模型名称，第二个参数 schema
module.exports=mongoose.model('template',templateSchema)

