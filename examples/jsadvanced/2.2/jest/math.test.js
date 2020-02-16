const { add } = require('./math')
test ('加法测试',()=>{
    expect(add(1,2)).toBe(3)
})