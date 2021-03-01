const express = require('express')
const app = express()

app.post('/product',(req,res)=>{
    const contentType =  req.headers['content-type']
    let requestText=""
    // http请求基于tcp，tcp会把传的数据，分成一个个分包；并不是一次传过来的；req不仅是一个请求对象，也继承了流的性质
    // 流代表了未来的数据，当数据来的时候把数据给装起来
    req.on('data',(buffer)=>{
        // utf-8 用1到4个字节描述一个字符，世界上有太多字符了，像a、b、c这样的一个字节就描述完了
        console.log('buffer',buffer.length)
        requestText += buffer.toString('utf-8')
    })
    req.on('end', ()=>{
        console.log('contentType',contentType)
        switch(contentType) {
            case "application/json" :
            // console.log('requestText',JSON.parse(requestText))
            res.set('content-type','application/json')
            res.status(201).send(JSON.stringify({success:'ok'}))
            break
        }
    })

})

app.put('/product/:id',(req,res)=>{
    console.log(req.params.id)
    res.sendStatus(204)
})
app.listen(3000,()=>{
    console.log('启动成功');
})