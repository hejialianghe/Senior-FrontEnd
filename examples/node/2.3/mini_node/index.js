const http=require('http')
const url =require('url')
http.createServer(function(req,res){

    let pathName=url.parse(req.url)
    console.log(888,pathName);
    res.write('hello world')
    res.end()
}).listen('3000')