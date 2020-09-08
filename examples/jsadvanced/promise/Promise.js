(function(window){ 
 // executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
function Promise(executor){
    const self=this
    self.status='pending'
    self.state=undefined
    self.callback=[]

    function resolve(value){ 
        if(self.status!=='pending') return
        self.status='resolved'
        self.state=value

     if(self.callback.length>0){
        self.callback.map(item=>{
           setTimeout(()=>{
                item.onResolved(value)
           })
        })
      }
    }
    function reject (reason) {
        self.status='rejected'
        self.state=reason

     if(callback.length>0){
        callback.map(item=>{
           setTimeout(()=>{
                item.onRejected(value)
           })
        })
      }
    }
    executor(resolve,reject)
 }


 /**
  * then方法指定了成功的和失败的回调函数
  * 返回一个新的promise对象
  */
 Promise.prototype.then=function(onResolved,onRejected){
     const seft=this
     seft.callback.push({
        onResolved,
        onRejected
     })

 }
 /**
  * 传入失败回调
  * 返回一个新的Promise
  */
 Promise.prototype.catch=function(OnRejected){

 }
 /**
  * 返回一个指定结果成功的promise
  */
 Promise.resolve=function(value){

 }
 /**
  * 返回一个指定reason失败的promise
  */
 Promise.reject=function(reason){
     
}
/**
 * 所有成功才成功，有一个失败就失败
 */
Promise.all=function(promises){
     
}
/**
 * 第一个成功就成功，如果不成功就失败
 */
Promise.race=function(promises){
     
}
window.Promise=Promise
})(window)