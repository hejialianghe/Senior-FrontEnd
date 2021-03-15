const app = require('express')()
const path =  require('path')

const htmlFile =  path.resolve(__dirname, "page/spa.html")
// product/123
app.get(/\/product(s|\/\d+)/,(req,res)=>{
    res.sendFile(htmlFile)
})

app.listen(3000)