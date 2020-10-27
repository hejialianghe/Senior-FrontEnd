new Promise((r)=>{
    r()
}).then(()=>{
    console.log(1);
}).then(()=>{
    console.log(2);
}).then(()=>{
    console.log(3);
})
new Promise((r)=>{
    r()
}).then(()=>{
    console.log(4);
}).then(()=>{
    console.log(5);
}).then(()=>{
    console.log(6);
})