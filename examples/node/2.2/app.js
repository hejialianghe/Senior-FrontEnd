const Koa=require('./koa')
const app=new Koa()
app.use((req,res)=>{
    res.writeHead(200)
    res.end('hell new koa')
})
app.listen(2000,()=>{
    console.log('server is run 2000');
})