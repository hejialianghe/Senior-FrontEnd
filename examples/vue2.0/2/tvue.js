class tvue {
    constructor (options){
     console.log('options',options)
        this.$options=options
    
        // 数据响应化
        this.$data=options.data
        this.observe(this.$data)
        this.$data.age=23
    }
    observe(value){
      if(Array.isArray(value)){

      }else{
          this.walk(value)
      }
    }
    walk(obj){
        const keys=Object.keys(obj)
        keys.forEach(key=>{
            // 传入对象和属性名
            this.defineReactive(obj,key,obj[keys])
            // 代理data中的属性到vue 实例上
            this.proxyData(key)
        })
    }
    defineReactive(obj,key,val){
        val=obj[key]
        Object.defineProperty(obj,key,{
            get:function reactiveGetter(){
        
                return val
            },
            set:function reactiveSetter (newVal){
                console.log(8888888888888, newVal)
               val=newVal
            }
        })
    }
    proxyData (key) {

    }
}
const vm= new tvue({
    el: "#app",
    data: {
      name: "I am test.",
      age: 12,
      html: "<button>这是一个按钮</button>"
    }
})
console.log(vm)