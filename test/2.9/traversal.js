const NodeD = {
    value: 4,
    next: null
  };

  const NodeC = {
    value: 3,
    next: NodeD
  };

  const NodeB = {
    value: 2,
    next: NodeC
  };

  const NodeA = {
    value: 1,
    next: NodeB
  };

  const LinkedList = {
    head: NodeA
  };
let sum = 0;
let momoize=(func,hasher)=>{
    let cache ={}
    return function (...args) {
        console.log(99999999999,args)
        let key= ""+(hasher?hasher.apply(this,args):'aa')
        if(!cache[key]){
            cache[key]=func(...args)
        }
        

        return cache[key]  
    }
}
let run =(linkedList, callback)=>{

    let head=linkedList.head
    while(head){
        callback(head.value)
        head=head.next
    }
}

var _momoize=momoize(run)
function traversal(linkedList, callback) {
   
    _momoize(linkedList, callback)

}

traversal(LinkedList, current => (sum += current));
traversal(LinkedList, current => (sum += current));
console.log(sum)