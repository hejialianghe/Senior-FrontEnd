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

setTimeout(_ => {
    console.log("setTimeout");
  }, 0);
  setImmediate(_ => {
      console.log("setImmediate");
      process.nextTick(_=>{
        console.log("nextTick2")
      })
  });
  process.nextTick(_=>{
    console.log("nextTick1")
  })
