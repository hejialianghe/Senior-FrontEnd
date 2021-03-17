const express =  require('express')
const app1 = express()
const app2 = express()

app1.set('etag',false)
app1.get('/',(req,res)=>{
    res.setHeader('Set-Cookie','abc=123;SameSite=None;Secure')
    res.send('ok')
})


app2.get('/',(req,res)=>{
 res.setHeader('Set-Cookie','apc=123')
 res.setHeader(
     "Access-Control-Allow-Origin",
     "http://www.dev.com"
 )
 res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
)
 res.send('ok')
})
app1.listen(3000)
app2.listen(3001)