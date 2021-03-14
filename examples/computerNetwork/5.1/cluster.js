const cluster = require('cluster');
// 想知道机器上有多少cpu核心
const numCPUs = require('os').cpus().length
const express = require('express')

//cluster.isMaster 判断主进程还是从进程 
if(cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for(let i=0;i<numCPUs;i++){
        cluster.fork() // 又启动了一次当前文件，不过进不了主进程了，上面又isMaster判断了
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker${worker.process.pid} died`)
    })
}else {
    // Worker can share any TCP connection
    // in this case it is an HTTP server
    // 把所有的进程都监听8888
    const app =  new express()
    app.listen(8888)
    console.log(`Worker${process.pid} started`)
}
