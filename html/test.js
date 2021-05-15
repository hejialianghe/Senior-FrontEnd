function Test(){
  const p=  new Promise((r)=>{
        r(1)
    })
    p.then(res=>{
        console.log('res2',res);
    })
    return p
}
Test().then(res=>{
    console.log('res',res);
})