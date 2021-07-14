require('@babel/register')({
    presets:['@babel/preset-env','@babel/preset-react']
})

const express = require('express')

const app = express()
const serverRouter = require('./serverRouter')
app.use('/',serverRouter)


app.listen(3001)