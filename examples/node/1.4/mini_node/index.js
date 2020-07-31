const http=require('http')
const url =require('url')
const fs=require('fs')
const path =require('path')
const qs=require('qs')
const noFound = (req,res)=>{
    fs.readFile(path.join(__dirname,'404.html'),(err,data)=>{
        if(err){
            res.write(404,'no found')
        }else {
            res.writeHead(200,{'Content-type':"text/html;charset=utf-8"})
            res.write(data)
            res.end()
        }
    })
}
const writeDb=(thunk)=>{
    fs.appendFile(path.join(__dirname,'db'),thunk,(err) => {
        if (err) throw err;
        console.log('数据已被追加到文件');
      })
}
http.createServer((req,res)=>{
    // 1.路由处理
    // 2.静态资源托管
    // 3.HTTP verb
    // 4. store
  
    // url.parse解析后会返回一个url对象，pathname是什么？
    // 例如：http://nodejs.cn/api/url.html#url_u，pathname是指/api/url.html#url_u
    var pathName=url.parse(req.url).pathname

    if(pathName.startsWith('/api')){
        const method=req.method
        if(method==='GET'){
            const query= qs.parse(url.parse(req.url).query)
            const resData ={
                code:200,
                data:query,
                msg:'sucess'
            }
            res.end(JSON.stringify(resData))
        } else if(method==='POST'){
            const contentType=req.headers['content-type']
            
            if(contentType===  'application/json'){
                console.log(contentType,url.parse(req.url));
                let postData=''
                req.on('data',(thunk)=>{
                    console.log(999)
                    postData+=thunk
                    writeDb(thunk)
                })
                req.on('end',(thunk)=>{
                    res.end(JSON.stringify({
                        code:200,
                        data:postData,
                        msg:'sucess'
                    }))
                })
            }
          
        }
        
    }


    if(pathName ==='/'){
        pathName=path.join(__dirname,'index.html')
    }
    // extname返回扩展名，就是.后面的,如果没有.就返回空字符串
    const extName=path.extname(pathName)
    if(extName === '.html') {
        fs.readFile(pathName,(err,data)=>{
            if(err){
                noFound(req,res)
            }else {
                res.writeHead(200,{'Content-type':"text/html;charset=utf-8"})
                res.write(data)
                res.end()
            }
        })
    }


}).listen(1000)