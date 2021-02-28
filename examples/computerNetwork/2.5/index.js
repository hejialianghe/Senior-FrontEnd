const express= require('express')
const app = express()
app.get('/x',(req,res)=>{
 res.set("Cache-Control","max-age=600")
    res.send('x5')
})
app.listen(3000)