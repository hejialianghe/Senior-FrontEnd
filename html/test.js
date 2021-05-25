

// function Permutation(str) {
//     const result = [];
//     if (str) {
//       queue = str.split('')
//       PermutationCore(queue, result);
//     }
//     result.sort();
//     return [... new Set(result)];
//   }

//   function PermutationCore(queue, result, temp = "", current = "") {
//     current += temp;
//     if (queue.length === 0) {
//       result.push(current);
//       return;
//     }
//     for (let i = 0; i < queue.length; i++) {
//       temp = queue.shift();
//       console.log(queue, '2'+result, '3'+temp, '4'+current)
//       PermutationCore(queue, result, temp, current);
//       queue.push(temp);
//     }
//   }
// console.log('------',Permutation('abc'))

const arr = [{
    pohId:"AB",
    section:"STAN3",
    row:"B",
    col:"2"
},
{
    pohId:"AB",
    section:"STAN2",
    row:"A",
    col:"21"
},
{
    pohId:"AB",
    section:"STAN3",
    row:"A",
    col:"5"
},
{
    pohId:"AB",
    section:"STAN3",
    row:"A",
    col:"4"
},
{
    pohId:"AB",
    section:"AAAAAA",
    row:"A",
    col:"88"
},
{
    pohId:"Ac",
    section:"STAN3",
    row:"A",
    col:"1"
},
{
    pohId:"Ac",
    section:"STAN4",
    row:"A",
    col:"2"
}

]

// arr.sort(function(a,b){
//     const aSort = `${a.col}`
//     const bSort = `${a.col}`
//     return a.col-b.col
// });
arr.sort(function(a,b){
    const aSort = `${a.section}${a.pohId}${a.row}${b.col}`
    const bSort = `${b.section}${b.pohId}${b.row}${a.col}`
    // return  aSort.charCodeAt()-bSort.charCodeAt()
    return aSort.localeCompare(bSort)
});

arr.sort(function(a,b){

    return a.col.localeCompare(b.col)
});

console.log(arr);
  
