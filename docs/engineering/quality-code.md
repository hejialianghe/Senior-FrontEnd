## 3.2 测试基础

### 3.2.1 测试的基本概念

#### 测试框架（jest）

- 开箱即用 基本不需要额外的配置即可使用
- 功能强大 自带断言、测试覆盖率工具，支持Mock、Snapshot、异步测试等
- 应用广泛 已经成为vue cli和create-react-app默认集成的测试框架
- 文档丰富 [jest](https://jestjs.io/docs/en/getting-started)

#### test suit / test case

Test Case 

测试用例，表示对一个功能点的测试;
在jest中他是一个名为test的函数，第一个参数它是test case 的名称，第二个参数是一个实际执行的函数；这个函数
没有报错才能算这个测试用例通过了

Test Unit

测试套件，表示一组相关用例的分组;
在jest中一个名为describe的函数，第一个参数是Test suit的名称，第二个参数是一个实际执行的函数；Test case（测试用例）应该在
这个函数的函数体中，test Unit本身没有什么逻辑，它只是把用例分组，这样无论是编写还是在生成测试报告的时候都会使我们的工作显得更加有条理性。


```js
const myBeverage={
    delicious: true,
    sour: false
}

// test unit
describe('my beverage',()=>{
    // test case
    test('is delicious',()=>{
        expect(myBeverage.delicious).toBeTruthy()
    })
    test('is not sour',()=>{
        expect(myBeverage.sour).toBeFalsy()
    })
})
```
### 3.2.2 断言

#### 断言（assertion）是什么？

- 在程序设计中，断言 是一种一阶逻辑，目的是表示与验证开发者预期的结果。
- 当程序运行到断言的位置时，对于的断言应该为真；若断言为假时，程序会终止并给错误信息。

#### js中的断言

- 浏览器：console.assert (看起来很像断言，但只输出错误信息不报错，所以我们不认为它是一个真正的断言)
- Node：assert模块 （真正的断言）
- 第三方自定义：例如Vux
```js
    function assert (condition,msg){
        if(!condition){
            throw new Error(`[Vuex]${msg}`)
        }
    }
```
#### jest中的断言

jest中内置了很多断言方法，不过称作“Matcher”

#### Matcher的使用

```js  
    // 测试data这个对象
    test('object assignment',()=>{
        const data = {one : 1};
        data['two']=2;
        // 预测data这个对象是否与toEqual传入的对象相等
        expect(data).toEqual({one:1,two:2})
    })
    // expect(something).toBe(something) 这里的toBe是具体的判断方法
```
jest中的Matchers,包含各种数据类型的各种判断方法

更多Matchers：[传送门](https://jestjs.io/docs/en/expect)

```js
test("null",()=>{
    const n = null;
    expect(n).toBeNull()
    expect(n).toBeDefined()
    expect(n).not.toBeUndefined()
    expect(n).not.toBeTruthy()
    expect(n).toBeFalsy()
})
test('two plus two',()=>{
    const value = 2+2
    expect(value).toBeGreaterThan(3)
    expect(value).toBeGreaterThaOrEqual(3.5)
    expect(value).toBeLessThan(5)
    expect(value).toBeLessThanOrEqual(4.5)
    expect(value).toBeLessThanOrEqual(4.5)
    expect(value).toEqual(4)
})
```

### 3.2.3 异步测试

测试中难免遇到异步逻辑，jest也提供了异步测试支持

下面的用例可以得到预期的结果吗？

```js
    test("the data is peanut butter",()=>{
        function callback (data) {
            expect(data).toBe('peanut butter')
        }
        fetchData(callback)
    })
```
上面错误案例❌

- jest会认为这是一个同步的用例
- 在回调执行之前用例就执行结束了

```js
    test("the data is peanut butter",done=>{
        function callback (data) {
            try{
             expect(data).toBe('peanut butter')
             done()
            }catch(error){
                done(error)
            }
        }
        fetchData(callback)
    })
```
测试异步回调的正确姿势，利用done参数，传递错误

promise和async/await场景下的异步测试

```js
test('the data is peanut butter',()=>{
    return fetchData().then(data=>{
        expect(data).toBe('peanut butter')
    })
})
test('the data is peanut butter',()=>{
    await expect(fetchData()).resolves.toBe('peanut butter')
})
```

### 3.2.4 环境准备

有些时候我们在测试之前，要做一些环境准备的工作，在测试之后把环境清理恢复到初始状态

- beforeEach（每个用例之前）
- afterEach（每个用例之后）
- beforeAll （所有的用例之前）
- afterAll （所有的用例之后）

```js
// 在该文件中的所有test运行之前，都会执行
beforeEach(()=>{
    return initializeCityDatabase()
})
test('city database has Vienna',()=>{
    expect(isCity('Vienna')).tiBeTruthy()
})

describe('matching cities to foods',()=>{
    // 只会在这个test suit（套件）的每个test前运行
    beforeEach(()=>{
        return initialzeFoodDatabase()
    })
    test('Vienna<3 sausage',()=>{
        expect('Vienna<3 sausage',()=>{
            expect(
                isValidCityFoodPair('Vienna','Wiener Schnitzel').toBe(true)
            )
        })
    })
})
```

### 3.2.5 Mock

Mock是一种覆盖原有函数、类的实际实现，来检测其调用情况的一种测试方法

```js
const mockCallback= jest.fn(x=>42 + x)
forEach([0,1],mockCallback)

// mockCallback被调用2次
expect(mockCallback.mock.calls.length).toBe(2);
// mockCallback的第一次调用的第一个参数应该是0
expect(mockCallback.mock.calls[0][0]).toBe(0);
// mockCallback的第二次调用的第一个参数应该是1
expect(mockCallback.mock.calls[1][0]).toBe(1);
// mockCallback的第一次调用的结果应该是42
expect(mockCallback.mock.results[0].value).toBe(42);
```
可以通过Mock函数的.mock属性，拿到Mock函数调用的各种信息

Mock 一个第三方模块

```js
// usesr.is
import axios  from 'axios';
class Users {
    static all() {
        return axios.get('/users.json')
               .then(resp=> resp.data)
    }
}
export default Users
```
mock原有的axios，这样不依赖网络也可以测试
```js
// uses.test.is
import axios  from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users',()=>{
    const users = [{name:'Bob'}];
    const resp = {data: users};
    axios.get.mockResolvedValue(resp)
    return Users.all()
        .then(data=> expect(data))
        .toEqual(users)
})
```
[更多Mock用法](https://jestjs.io/docs/en/mock-function-api)

### 3.2.6 Snapshot

快照是一种非常强大的测试工具，一般用于UI组件的测试

```js
    import React from 'react';
    import Link from '../Link.jsx';
    import renderer from 'react-test-renderer';

    it('renders correctly',()=>{
        const tree = renderer
        .cteate(
            <Link page="http://www.facebook.com">
            Facebook
            </Link>
        )
        .toJSON();
        expect(tree).toMatchSnapshot();
    })
```

对于这个Link组件的测试用例，这个组件第一次运行的时候会生成快照，快照的结构如下图所示，从第二次开始jest都会把当前组件和以前生成的快照做对比；
看看他们是否吻合，快照测试相当于以某一版本的UI为基础，把这次的ui拍成一张照片放在那里；之后每次测试都以当前的ui和之前的照片做对比，如果不一致就
报错，快照测试可以防止我们无意中修改了组件，由于快照在第一次才会拍下，如果想改组件必须手动修改快照，在jest中可以用__updateShapshot修改。

```js
exports[`renders correctly 1`] =`
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[function]}
  onMouseLeave={[function]}
>
Facebook
</a>
`
```
第一次：生成快照
第2...N次：使用快照对比现有组件

### 3.2.7 测试覆盖率

我们用测试覆盖率衡量一个工程的测试代码的完整程度

jest内置了istanbul模块，可以从以下4个纬度统计测试覆盖率“

- statements 语句覆盖率 所有语句的执行率 （重要）
- Brancher 分支覆盖率  所有代码分支如 if、三目运算的执行率 （重要）
- Functions 函数覆盖率 所有函数的被调用率
- Lines 行覆盖率  所有有效代码行的执行率和语句类似，但是计算方式略有差别

## 3.6 监控和异常上报

### 3.6.1 初识监控

#### 异常捕获

- 常见的捕获方式

```js
// 浏览器
window.onerror //全局异常捕获
window.addEventListener('error') // js错误、静态资源加载错误
window.addEventListener('unhandledrejection') //没有catch的Promise错误

// node端
process.on('uncaughtException') // 全局异常捕获
process.on('uncaughtException') // 没有catch的Promise错误
```

- 利用框架、三方库本身能力

- Vue.config.errorHandler
- React.ErrorBoundary

### 3.6.2 Sentry监控

#### 简单介绍

- 知名的开源监控方案
- 不仅可用于前端，也可以用于后端应用
- 开箱即用的错误收集、错误上报、数据分析、监控告警功能

### 优化点

数据爆炸

解决方案：

前端监控的一个显著特点：容易短时间产生海量数据

- 采集端考虑：采样后上报（sampleRate）将采样率设置为0.1，那么它只上报十分之一的错误；错误发生10次，只会上报一次。
- 手机端考虑：生产者消费者模式-利用消息队列控制消息消费速度。

效果增强

- 更多的告警方式。
- 收集用户反馈，获得用户的主观意见和建议。
- 更丰富的上下文信息：用户操作录像等（rrweb）。

