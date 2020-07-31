var http=require('http')
http.createServer(function(req,res){
    res.write('Hello world')
    res.end()
}).listen(8888)