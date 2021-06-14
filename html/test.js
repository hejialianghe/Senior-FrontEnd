console.log(1)
  setTimeout(() => {
    console.log(2)
    process.nextTick(() => {
      console.log(3)
    })
    new Promise((resolve) => {
      console.log(4)
      resolve()
    }).then(() => {
      console.log(5)

    })
    Promise.resolve().then(()=>{
      console.log('-------2')
    })
  })

  new Promise((resolve) => {
    console.log(7)
    resolve()
  }).then(() => {
    console.log(8)
  })

  process.nextTick(() => {
    console.log(6)
  })


  setTimeout(() => {
    setTimeout(()=>{
      console.log('-------')
    })
    console.log(9)
    process.nextTick(() => {
      console.log(10)
    })
    new Promise((resolve) => {
      console.log(11)
      resolve()
    }).then(() => {
      console.log(12)
    })
  })
