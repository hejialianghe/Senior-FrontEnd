
// 路由模块，业务模块
const express=require('express')
const router=express.Router()
const Template=require('../model/template')

router.get('/templateList',async (req,res,next)=>{
    console.log(999);
    const temps=await Template.find({}).sort({update_at:-1})
    console.log(888,temps);
    res.json({
        code:200,
        msg:'sucess',
        data:temps
    })
})
module.exports=router