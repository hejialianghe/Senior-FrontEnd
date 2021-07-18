require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')

const app = express()
const serverRouter = require('./serverRouter')
// 用于加载静态资源
app.use(express.static('build'));

app.use('/',serverRouter)


app.listen(3003)