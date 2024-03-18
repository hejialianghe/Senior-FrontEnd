
// 2.2 数组

// 2.2.1  找出出现一次的数字
// const arr = [2,5,6,7,5,6,2]

// const num = arr.reduce((total,cur)=>total ^ cur)

// console.log("num",num)

// 2.2.2 两数求和问题

const nums = [5, 7, 8, 2, 4]
const target = 9
const res ={}
let result = []
nums.forEach((item,i)=>{
    if(typeof res[target-item] ==='number'){
        result.push([item,target-item])
    }else{
        res[item] = i
    }
})

console.log('result',result)