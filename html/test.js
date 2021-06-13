// console.log(1)
//   setTimeout(() => {
//     console.log(2)
//     process.nextTick(() => {
//       console.log(3)
//     })
//     new Promise((resolve) => {
//       console.log(4)
//       resolve()
//     }).then(() => {
//       console.log(5)
//     })
//   })
//   new Promise((resolve) => {
//     console.log(7)
//     resolve()
//   }).then(() => {
//     console.log(8)
//   })
//   process.nextTick(() => {
//     console.log(6)
//   })
//   setTimeout(() => {
//     console.log(9)
//     process.nextTick(() => {
//       console.log(10)
//     })
//     new Promise((resolve) => {
//       console.log(11)
//       resolve()
//     }).then(() => {
//       console.log(12)
//     })
//   })
  

// setTimeout(()=>{
//     process.nextTick(()=>{
//         console.log(6);
//     })
// console.log(1);
// new Promise((r)=>{
//     r()
// }).then((res)=>{
//     process.nextTick(()=>{
//         console.log(5);
//     })
//     console.log(3);
//     new Promise((r)=>{
//         r()
//     }).then((res)=>{
//         console.log(4);
//     })
// })


// })
// setTimeout(()=>{
//     console.log(2);
// })

// setTimeout(_ => {
//     console.log("setTimeout");
//   }, 0);
//   setImmediate(_ => {
//       console.log("setImmediate");
//       process.nextTick(_=>{
//         console.log("nextTick2")
//       })
//   });
//   process.nextTick(_=>{
//     console.log("nextTick1")
//   })

// setTimeout(()=>{
//     console.log('timer1')

//     Promise.resolve().then(function() {
//         console.log('promise1')
//     })
// }, 0)

// setTimeout(()=>{
//     console.log('timer2')

//     Promise.resolve().then(function() {
//         console.log('promise2')
//     })
// }, 0)

setTimeout(() => {          // callback1
    console.log(111);
    setTimeout(() => {        // callback2
      console.log(222);
    }, 0);
    setImmediate(() => {      // callback3
      console.log(333);
    })
    process.nextTick(() => {  // callback4
      console.log(444);  
    })
  }, 0);
  
  setImmediate(() => {        // callback5
    console.log(555);
    process.nextTick(() => {  // callback6
      console.log(666);  
    })
  })
  
  setTimeout(() => {          // callback7              
    console.log(777);
    process.nextTick(() => {  // callback8
      console.log(888);   
    })
  }, 0);
  
  process.nextTick(() => {    // callback9
    console.log(999);  
  })