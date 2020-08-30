const Koa=require('koa')
const Router=require('koa-router')
const bodyParser=require('koa-bodyparser')
const fs=require('fs')
const app=new Koa()
const router= new Router()

app.use(bodyParser({
    enableTypes:['json'],
    jsonLimit:'10mb'
}))
app.use(router.routes(),router.allowedMethods())

router.get('/',(ctx)=>{
    const order=fs.readFileSync('orderList.json','utf8')
    return ctx.body=JSON.parse(order)
})
router.post('/addList',(ctx)=>{
    let body=ctx.request.body
    let keys=Object.keys(body)
    console.log( keys);
    if(!keys.includes('id')){
        console.log(88888);
        return ctx.body='参数错误'
    }
    let order=fs.readFileSync('orderList.json','utf8')
    let _order=eval(order)
    _order.push(ctx.request.body)

    fs.writeFileSync('orderList.json',JSON.stringify(_order))
    return ctx.body=_order
})
app.listen(4000,()=>{
    console.log('server is runing  4000')
})