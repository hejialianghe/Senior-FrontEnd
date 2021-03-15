const app = require('express')()
const path = require('path')
const fs =  require('fs')

// __dirname 当前文件相对目录
const pageDir = path.resolve(__dirname,'page')
const htmlFile = fs.readFileSync(pageDir)

function displayHtmlFile(name) {
    return (req,res)=>{
        const filePath= path.resolve(pageDir,name+".html")
        res.sendFile(filePath)
    }
}
htmlFile.forEach(file=>{
    const [name,ext] = file.split('.')
    app.get('/',name,displayHtmlFile(name))

})
app.listen(3000)