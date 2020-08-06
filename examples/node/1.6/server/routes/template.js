
// 路由模块，业务模块
const express=require('express')
const router=express.Router()
const Template=require('../model/template')

// 查询模版列表
router.get('/templateList',async (req,res,next)=>{
    const temps=await Template.find({}).sort({update_at:-1})
    res.$success(temps)
})
// 添加列表
router.post('/templateCreate',async (req,res,next)=>{
    console.log(888,req.body);
    const temps =await Template.create(req.body)
    res.$success(temps)
})
// 查询模版详情
router.get('/templateDetail',async (req,res,next)=>{
    const { id }=req.query
    const temps = await Template.findById({_id:id})
   res.$success(temps)
})
// 更新模版
router.put('/templateChange/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndUpdate({_id:id},req.body,{
        new:true
    })
   res.$success(temps)
})
// 删除模版
router.delete('/templateDelate/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndRemove({_id:id})
   res.$success(temps)
})
module.exports=router