
const http=require('http')
class Koa {

    constructor(){}
    middleware (){};
    listen (port,cb) {
        const server=http.createServer((req,res)=>{
            this.middleware(req,res)
        })
        server.listen(port,cb)
    }
    use(middleware){
        this.middleware=middleware
        return this
    }
}
module.exports=Koa