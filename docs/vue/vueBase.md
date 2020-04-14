## 2.1初识vue
### 2.1.1 创建项目
🔥安装vueCLI
```bash
 npm i @vue/cli -g 
 #or
 yarn global add @vue/cli
```
🔥创建项目
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

🔥cameCase

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
🔥PascalCase

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
🔥kebab-case
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
        <div class="title">八皇后问题</div>
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
## 2.4.1 事件
```javascript
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

## 2.4.2 自定义事件

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

## 2.4.2 样式

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

<style type=“text/>css”>
 .test[data-v-382addcf]{
     font-size:21px
 }
</style>
```

## 2.5 组件

### 2.5.1 生命周期

- beforeCreate 最初调用触发，data和evnets都不能用
- created data和evnets已经初始化好，data已经具有响应式；在这里可以发送请求
- beforeMount 在模版编译之后，渲染之前触发，ssr中不可用，基本用不上这个hook
- mounted 在渲染之后触发，并能访问组件中的DOM以及$ref,SSR中不可用
- beforeUpdate 在数据变化后，模版改变前触发，切勿使用它监听数据变化
- updated 在数据改变后，模版改变后触发，常用于重渲染案后的打点，性能检测或触发vue组件中非vue组件的更新
- beforeDestroy 组件卸载前触发，可以在此时清理事件、计时器或者取消订阅操作
- destroyed 卸载完毕后触发，可以做最后的打点或事件触发操作