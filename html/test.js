async function async1() { 
console.log('1');
console.log(await async2()); console.log('2'); 
} 

async function async2() {
    console.log('3');
    return '0'; 
} 

setTimeout(function() {
 console.log('4'); 
new Promise(function(resolve) { console.log('5'); resolve(); })
.then(function() { console.log('6') })

})

 async1(); 

 new Promise(function(resolve) { console.log('7'); resolve(); })
 .then(function() { console.log('8'); }); 

 console.log('9');




