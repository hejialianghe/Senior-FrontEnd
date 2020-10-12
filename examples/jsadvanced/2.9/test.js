const arr=[3,1,5,9,4]

for(let i=0;i<arr.length;i++){
    let _arr=[...arr]
    for(let j=0;j<arr.length;j++){
        if(arr[i]>arr[j]){
            [arr[i],arr[i+1]]=[_arr[j+1],_arr[j]]
        }
    }
}