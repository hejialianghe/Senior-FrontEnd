(function(window){ 
    const PENDING = 'pending'
    const FULFILLED = 'fulfilled'
    const REJECTED = 'rejected'
 // executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
function Promise(executor){

    const self=this
    self.status=PENDING
    self.state=undefined
    self.callbackQueues=[]

    function resolve(value){ 
    if(self.status!==PENDING) return
        self.status=FULFILLED
        self.state=value

     if(self.callbackQueues.length>0){
        self.callbackQueues.map(item=>{
           setTimeout(()=>{
                item.onResolved(value)
           })
        })
      }
    }
    function reject (reason) {
    if(self.status!==PENDING) return
        self.status=REJECTED
        self.state=reason

     if(self.callbackQueues.length>0){
        self.callbackQueues.map(item=>{
           setTimeout(()=>{
                item.onRejected(value)
           })
        })
      }
    }
   try {
    executor(resolve,reject)
   }catch(err){
       reject(err)
   }
 }


 /**
  * then方法指定了成功的和失败的回调函数
  * 返回一个新的promise对象
  * 根据状态存onResolved和onResolved或调用onResolved和onRejected
  * 返回的promise的结果由onResolved和onRejected决定
  */
 Promise.prototype.then=function(onResolved,onRejected){
    onResolved=typeof onResolved==='function' ? onResolved : value=>value
    onRejected=typeof onRejected==='function'?onRejected : ()=> {throw reason}
     const seft=this
    return new Promise((resolve,reject)=>{
        function handle (callback){
            try {
                const result =callback(seft.state)
                if(result instanceof Promise){
                   result.then(
                    (res)=>{
                        resolve(res)
                    },
                    err=>{reject(err)})
                  
                }else {
                    resolve(result)
                }
            }catch(err){
                reject(err)
            }
        }
        if(seft.status===PENDING){
            seft.callbackQueues.push({
                onResolved(value){
                    onResolved(value)
                },
                onRejected(reason) {
                    onRejected(reason)
                }
             })
         }else if(seft.status===FULFILLED){
            setTimeout(()=>{
                handle(onResolved)
            })
         }else {
            setTimeout(()=>{
                handle(onRejected)
            })
         }
    })

 }
 /**
  * 传入失败回调
  * 返回一个新的Promise
  */
 Promise.prototype.catch=function(OnRejected){
    return this.then(undefined,OnRejected)
 }
 /**
  * Promise函数对象的resove方法
  * 返回一个指定结果成功的promise
  */
 Promise.resolve=function(value){
    return new Promise((resolve,reject)=>{
        if(value instanceof Promise){
            value.then(resolve,reject)
        }else {
            resolve(value)
        }
     })
 }
 /**
  *  Promise函数对象的reject方法
  * 返回一个指定reason失败的promise
  */
 Promise.reject=function(reason){
     return new Promise((resove,reject)=>{
        reject(reason)
     })
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