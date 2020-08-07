const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const templateRouter=require('./routes/template')
const app=express()
mongoose.connect('mongodb://127.0.0.1:27017/temp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
var db=mongoose.connection
db.on('error',function(){
    console.log('监听错误');
})
db.once('open',function(){
    console.log('数据库连接成功');
})
require('./middleware/index')(app)
// 用bodyParser处理post请求，在req加入body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use('/xhr/v1/',templateRouter)
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})
app.listen(2000,()=>{
    console.log('server is running on http://localhost:2000')
})