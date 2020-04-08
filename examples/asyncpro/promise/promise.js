function Promise (excutor){
    var self=this
    self.onResolvedCallback=[]
    function resolve (value){
       setTimeout(()=>{
        self.data=value
        self.onResolvedCallback.forEach(callBack=>{
            callBack()
        })
       })
    }
    excutor(resolve)
}

Promise.prototype.then=function(onResolved){
    var self=this
    return new Promise(resolve=>{
        self.onResolvedCallback.push(function (){
            var result=onResolved(self.data)
            if(result instanceof Promise){
                result.then(resolve)
            }else {
                resolve(result)
            }
        })
    })
}