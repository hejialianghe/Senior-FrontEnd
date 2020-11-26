## 3.2 测试基础

### 3.2.1 测试的基本概念

#### 测试框架（jest）

- 开箱即用 基本不需要额外的配置即可使用
- 功能强大 自带断言、测试覆盖率工具，支持Mock、Snapshot、异步测试等
- 应用广泛 已经成为vue cli和create-react-app默认集成的测试框架
- 文档丰富 [jest](https://jestjs.io/docs/en/getting-started)

#### test suit / test case

Test Case 

测试用例，表示对一个功能点的测试,在jest中他是一个名为test的函数，第一个参数它是test case 的名称，第二个参数是一个实际执行的函数；这个函数
没有报错才能算这个测试用例通过了

Test Suit

测试套件，表示一组相关用例的分组，在jest中一个名为describe的函数，第一个参数是Test suit的名称，第二个参数是一个实际执行的函数；Test case（测试用例）应该在
这个函数的函数体中，test Suit本身没有什么逻辑，它只是把用例分组，这样无论是编写还是在生成测试报告的时候都会使我们的工作显得更加有条理性。


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

