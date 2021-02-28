const express= require('express')
const app = express()
app.set('etag',false) // 先把etag关掉，因为它也是一种缓存,现在我们只用一种，好演示一些
app.get('/x',(req,res)=>{
res.set("Last-Modified","Sun Feb 28 2021 23:47:56 GMT+0800")
    res.send('x5')
})
app.listen(3000)