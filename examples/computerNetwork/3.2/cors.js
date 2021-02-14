const express = require('express');
const app1 = express();

app1.get('/',function(req,res){
    res.send('hello')
})

app1.listen(3000)

const app2 = express()
app2.get('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
app2.options('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.set('Access-Control-Allow-Headers','content-type')
    res.set('Access-Control-Allow-Methods','PUT')
    res.sendStatus(200)
})
app2.post('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
app2.put('/api',function(req,res){
    res.set('Access-Control-Allow-Origin','http://www.dev.com')
    res.send('go')
})
app2.listen(3001)