const express =  require('express')

const app1 = express()
app1.get('/',(req,res)=>{
    res.setHeader('Set-Cookie','abc=123')
    res.send('ok')
})
app1.listen(3000)