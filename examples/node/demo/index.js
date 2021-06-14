const fs = require('fs');

function someAsyncOperation(callback) {
 // nodejs 一般没有加sync都是异步的
 fs.readFile(__dirname, callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
 const delay = Date.now() - timeoutScheduled;
 // 计算多延迟多少毫秒打印这一句
 console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

someAsyncOperation(() => {
 const startCallback = Date.now();
 while (Date.now() - startCallback < 200) {
   // do nothing
 }
});