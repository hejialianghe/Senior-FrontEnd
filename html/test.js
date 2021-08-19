const  arr = [5,6,2,8,4,3,1]
let max
for(let i=0;i<arr.length-1;i++){
    console.log(arr)
    for(let j=0;j<arr.length-1-i;j++){

    if(arr[j]>arr[j+1]){
        max=arr[j]
        arr[j]= arr[j+1]
        arr[j+1]=max
    }
    }
}

console.log('arr',arr)