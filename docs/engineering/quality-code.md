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

