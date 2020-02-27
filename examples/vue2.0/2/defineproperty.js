let mayun={
    money:"1000亿"
}

Object.defineProperty(mayun,'money',{
    get(){
        console.log('我被读取了')
    },
    set(newVal){
        console.log('我被设置了',newVal)
    }
})
mayun.money
mayun.money="10000亿"