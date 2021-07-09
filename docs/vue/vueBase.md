## 2.1初识vue
### 2.1.1 创建项目
####  :tomato: 安装vueCLI
```bash
 npm i @vue/cli -g 
 #or
 yarn global add @vue/cli
```
####  :tomato: 创建项目
```bash
 vue create project
 #or
 vue ui
```
### 2.1.2 命名规则

1. cameCase：videoExampleComponent （小驼峰）
2. PascalCase：VideoExampleComponent（大驼峰）
3. kebab-case：video-example-component （烤串的命名规则）

下面我们看一下在我们vue中，怎样用上面的命名规则

####  :tomato: cameCase

- js函数、变量
```javascript
new Vue({
    el:'#app'
    data(){
        return {
            myTest:'' // 变量的命名规则 
        }
    },
    methods:{
        myFn(){ // 函数的命名规则 

        }
    }
})
```
####  :tomato: PascalCase

- js类，组件文件
```javascript
// 类
class Promise () {
    constructor(){

    }
}
// 组件文件
components/
|- TestList.vue
|- TestItem.vue
```
####  :tomato: kebab-case
- HTML

在html中大小写是不敏感的，正因为这样我们约定在模版中才采用烤串的方式，来避免混淆

```javascript
Vue.component('navigation-header', NavigationHeader)
// 在模版中显示的组件命名规则
<navigation-header></navigation-header>
```

## 2.2 模版
### 2.2.1 列表循环

- 不推荐在同一元素上使用v-if和v-for
- 非要用，记住v-for的优先级高于v-if

### 2.2.1 jsx

vue中使用jsx语法

```javascript
<script>
const grids = new Array(8).fill(1).map((_, r) => {
  return new Array(8).fill(1).map((_, c) => {
    return {
      key: `key-${r * 8 + c}`,
      ok: false
    }
  })
})
console.log('grids', grids)
export default {
  name: 'affairSelect',
  data () {
    return {
      grids
    }
  },
  render () {
    return (
      <div>
        <div class="title">test</div>
        <div class="grid">
          {
            this.grids.map((row, index) => {
              return (<div class="row" key={index}>
                {row.map((cell, i) => {
                  return <div class="cell" key={cell.key}>
                    {
                      cell.ok ? <div>Q</div> : ''
                    }
                  </div>
                })}
              </div>)
            })}
        </div>

      </div>
    )
  }
}
</script>

<style scoped></style>
```
## 2.3 数据

### 2.3.1 data为什么是一个函数

因为组件会复用，只有每个组件实例维护一份独立拷贝，才不会相互影响

```javascript
new Vue({
    el:'#app'
    data(){
        return {}
    }
})
```

## 2.4 事件&样式
### 2.4.1 事件
```vue
<template>
  <div>
    <p>{{count}}</p>
    <button @click="add($event,1)" ></button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
      return {
          count:9
      }
  },
  methods:{
      add(event,num){
          //event原生的dom事件   
          this.count+=num
      }
  }
}
</script>

<style scoped lang="scss">
</style>

```

### 2.4.2 自定义事件

自定义事件实现双向绑定
```javascript
    // 父组件
    <template>
    <div>
        我是父组件：{{msg}}
        <child @update:msg="msg=$event" :msg="msg"></child>
        // 也可以用sync修饰符去替换上面的写法，编译的时候会自动编译成上面的写法
        // <child :msg.sync="msg"></child>
    </div>
    </template>

    <script>
    import child from './child'
    export default {
    data () {
        return {
        msg: ''
        }
    },
    components: {
        child
    }
    }
    </script>

    // 子组件
    <template>
    <div>
        我是子组件：{{msg}}
        <button @click="$emit('update:msg','我是改变值的')">点击</button>
    </div>
    </template>

    <script>
    export default {
    props: ['msg']

    }
    </script>
```

### 2.4.3 样式

为了避免样式的全局污染，我们平时在style上加入scoped
```javascript
<template>
  <div class=“test”></div>
</template>

<style scoped>
 .test{
     font-size:21px
 }
</style>

// 最后编译出来的html上会添加一个属性
<div id=“app”>
  <div data-v-382addcf class=“test”></div>
</div>

// 最后编译出来style,也会以这个属性做选择器，从而做到样式的封装
<style scoped lang=“scss”>
 .test[data-v-382addcf]{
     font-size:21px
 }

 // 如果用到组件库，想修改组件库里的的样式，并且使用css的预处理器(less, sass, scss)）
 .test {
    /deep/ .van-btn{

    }
    // or /deep/在某些时候会报错,::v-deep更保险并且编译速度更快
    ::v-deep .van-btn{

    }
 }
</style>

// 如果用到组件库，想修改组件库里的的样式且style为css
<style scoped>
.test >>> .van-btn {
 
}
</style>
```

## 2.5 组件

### 2.5.1 组件注册

####  :tomato: 批量导入组件（weppack的require.context()）

```javascript
const requireComponent=require.context(
    "./components", // 当前组件的相对路径
    false, // 是否查询子目录
    /\w+\.(vue | js)$/ // 匹配组件名的正则表达式
    )
    const regExp = new RegExp(/.\/(\w+).js$/i)
    const componentName
    requireComponent.keys().forEach(fileName=>{
        const componentConfig=requireComponent(fileName)
        if(regExp.test(fileName)){
            componentName=RegExp.$1
        }
        // 全局注册组件
        Vue.component(
          componentName,
          /*
          如果这个组件选项是通过‘export defalut’导出得，
          那么就会优先使用defalut
          否则使用模块得根
          */
        componentConfig.defalut || componentConfig
        )
    })
```
####  :tomato: 按需导出

babel-plugin-import 根据这个插件进行按需导入，不同的库插件也会不同
```javascript
import { button} from 'components'
//最终会转换require得方式导入
var button=require('componets/lib/button')
require('components/lib/button/style/css')
```
### 2.5.2 生命周期

- beforeCreate 最初调用触发，data和events都不能用
- created data和events已经初始化好，data已经具有响应式；在这里可以发送请求
- beforeMount 在模版编译之后，渲染之前触发，ssr中不可用，基本用不上这个hook
- mounted 在渲染之后触发，并能访问组件中的DOM以及$ref,SSR中不可用
- beforeUpdate 在数据变化后，模版改变前触发，切勿使用它监听数据变化
- updated 在数据改变后，模版改变后触发，常用于重渲染案后的打点，性能检测或触发vue组件中非vue组件的更新
- beforeDestroy 组件卸载前触发，可以在此时清理事件、计时器或者取消订阅操作
- destroyed 卸载完毕后触发，可以做最后的打点或事件触发操作