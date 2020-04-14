class tvue {
    constructor (options){
        this.$options=options
    
        // 数据响应化
        this.$data=options.data
        this.observe(this.$data)
     
        new Compile(options.el,this)

        if(options.created){
            options.created.call(this)
        }
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
        const dep=new Dep()
        Object.defineProperty(obj,key,{
            get:function reactiveGetter(){
                if(Dep.target){
                    dep.addDep(Dep.target)
                }
                return val
            },
            set:function reactiveSetter (newVal){
                console.log(222, newVal)
                val=newVal
               dep.notify()
              
            }
        })
    }
    proxyData (key) {
        Object.defineProperty(this,key,{
            get(){
              return this.$data[key]  
            },
            set(newVal){
                this.$data[key]=newVal
            }
        })

    }
}
// Dep用来管理watcher
class Dep {
    constructor(){
        // 存放watcher实例
        this.deps=[]
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(){
        this.deps.forEach(dep=>dep.update())
    }
}

class Watcher {
    constructor(vm,key,cb){
        this.vm=vm;
        this.key=key;
        this.cb=cb
        // 把当前的wathcer实例指定到Dep静态属性target上
        Dep.target=this;
        this.vm[this.key] // 触发getter添加依赖
        Dep.target=null
    }
    update(){
        this.cb.call(this.vm,this.vm[this.key])
    } 
}

