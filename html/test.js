async function async1 () {
    await  1
    console.log(1)
}
Promise.resolve().then(res=>{
    console.log(3)
})
async1()
console.log(2)
