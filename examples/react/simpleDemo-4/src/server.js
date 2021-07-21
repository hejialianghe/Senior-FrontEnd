require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')
const app = express()
const serverRouter = require('./server/serverRouter')
const apiRouter = require('./server/apiRouter')

// api接口
app.use("/api/", apiRouter);
// 用于加载静态资源
app.use("/build", express.static('build'));
// 服务端渲染
app.use('/',serverRouter)

app.listen(3003)