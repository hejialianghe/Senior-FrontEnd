const worker = new Worker("worker.js")

worker.onmessage = function (e) {
 console.log('拿到worker通知的数据',e)
 worker.postMessage("message收到了")
}