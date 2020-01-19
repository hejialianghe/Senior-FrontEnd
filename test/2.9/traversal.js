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
let num = 0;
// 缓存函数
let momoize=(func,hasher)=>{
    let cache ={}
    return function (...args) {
        let key= ""+(hasher?hasher.apply(this,args):args[0])
        if(!cache[key]){
            cache[key]=func.apply(this,args)
        }
        console.log('cache',cache)
        return cache[key]  
    }
}
// 值相加函数
let run =(linkedList, callback)=>{
    let head=linkedList.head
    while(head){
        callback(head.value)
        head=head.next
    }
    return num
}

var _momoize=momoize(run)

function traversal(linkedList, callback) {
    _momoize(linkedList, callback)
}

// 调用2次，第二次会读取缓存函数
traversal(LinkedList, current => (num += current));

traversal(LinkedList, current => (num += current));
