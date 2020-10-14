let arr=[3,5,2,9,10,4,88]

for(let i=0;i<arr.length;i++){
    let current =arr[i+1]
    let preIndex=i
    while(preIndex>=0 && (current<arr[preIndex])){
        arr[preIndex+1]= arr[preIndex]
        arr[preIndex]=current
        preIndex--
    }
}

console.log(arr);