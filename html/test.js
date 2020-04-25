function store(){
    this.state={}
    if(store.install){
        return store.install
    }
    store.install=this
}

store.install=null
var s1=new store()
var s2=new store()
s1.state.a=1
console.log(s1,s2) // store { state: { a: 1 } } store { state: { a: 1 } }