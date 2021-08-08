let usecallback
let count = {a:1}
function fn (params) {
    const data=count
    console.log('----',data)
    if(usecallback){
        usecallback()
    }else {
        usecallback=()=>{
            console.log(data.a)
        }
        usecallback()
    }
}
fn()
count.a=2
fn()