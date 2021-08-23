

const  arr = [5,6,2,8,4,3,1]

for (let i =1;i<arr.length;i++){
    let current = arr[i]
    let preIndex= i-1
    while(preIndex>=0 && current<arr[preIndex]){
        arr[preIndex+1]=arr[preIndex]
        preIndex--
    }
    arr[preIndex+1]=current
}

console.log('--------',arr)