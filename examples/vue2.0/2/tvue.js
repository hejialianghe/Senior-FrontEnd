class tvue {
    constructor (options){
        this.$options=options
        
        // 数据响应化
        this.$data=options.data
        this.observe(this.$data)
    }
    observe(value){
      if(Array.isArray(value)){

      }else{
          this.walk(value)
      }
    }
    walk(obj){
        const keys=Object.keys(obj)
        for(let i=0;i<keys.length;i++){
            // 传入对象和属性名
            defineReactive(obj,key[i])
        }
    }
}
console.log([(new Array(6)).fill(0)])