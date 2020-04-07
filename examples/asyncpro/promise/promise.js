function Promise (excutor){
    var self=this
    self.onResolvedCallback=[]
    function resolve (value){
        console.log(value)
    }
    excutor(resolve)
}

Promise.prototype.then=function(onResolved){
    var self=this
    return new Promise(resolve=>{
        self.
    })
}