require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')

const app = express()
const serverRouter = require('./serverRouter')

app.use("/build", express.static('build'));
app.use('/',serverRouter)
// 用于加载静态资源


app.listen(3003)