function fibonacci (n) {
    if(n===1 || n ==2) {
        return 1
    }
    return fibonacci(n-2) + fibonacci(n-1)
}

postMessage(fibonacci(40))

onmessage = function (e) {
    console.log('好的，拿到了就好',e);
}
