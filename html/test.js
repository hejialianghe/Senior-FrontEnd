
async function sync (){
  setInterval(async()=>{
    await Promise.resolve(1)
    console.log('----21')
  },2000)
   console.log('------')
}
sync()