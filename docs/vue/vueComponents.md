## 3.1 自定义指令

```javascript
  // 第一个参数是自定义指令的名称，第二个参数对象里面包含着钩子函数 
    Vue.directive('test',{
        // 只调用一次，指令第一次绑定元素的时调用
        // 在这里可以进行一次性的初始化设置
        bind：function (el,binding,vnode){},
        // 被绑定元素插入父节点时调用
         // 仅保证父节点存在，但不一定已被插入文档中
        inserted:function(el,binding,vnode){}，
        // 所有组件的Vnode更新时调用
        // 但是可能发生在其子Vnode更新之前
        // 指令的值可能发生了改变，也可能没有
        // 但是可以通过比较更新前后的值来忽略不必要的模版更新
        update：function（el，binding，vnode，oldVnod){},
        // 指令所在组件的Vnode及其子VNode全部更新后调用
        componentUpdate：function (el，binding，vnode，oldVnod){},
        // 只调用一次，指令与元素解绑时调用
        upbind:function (el,binding,vnode){},

    })
```
## 3.2 双向绑定

### 3.2.1 v-model

```vue
// 用于表单元素<input>、<textarea>及<select>上创建双向数据绑定的语法糖
<template>
  <div>
    <input type="text" v-model="text"/>
    // v-model是下面的语法糖
    <input type="text" :value="text" @input="text=$event.target.value"></input>
  </div>
</template>

<script>
export default {
  data(){
      return {
          text:""
      }
  }
}
</script>

```

### 3.2.2 .sync修饰符的双向绑定

- v-bind: msg
- v-on:update:msg

## 3.3 组件设计

重复做的组件，可以抽象出来，通过slot作用域外层修改数据而保持内部的稳定


```vue
// 父组件
<template>
  <div>
      <child>
      <!-- 作用域插槽，任何没有被包裹在带有 v-slot 的 
      <template> 中的内容都会被视为默认插槽的内容 -->
          <template>
              <div>内容1</div>
          </template>

        <!-- 具名插槽 -->
         <template v-slot:header>
              <div>头部2</div>
          </template>

        <!-- 拿到slot内部组件的内容在父作用域显示 -->
         <template #main="{user}">
             <!--  v-slot:main="{user}" 简写#main="{user}"-->
              <div>{{user.name}}</div>
          </template>

      </child>
  </div>
</template>

// 子组件
<template>
  <div>
      <slot name="header"></slot>
    <!-- 为了让 user 在父级的插槽内容中可用
    ，我们可以将 user 作为 <slot> 元素的一个 attribute 绑定上去，
    绑定在 <slot> 元素上的 attribute 被称为插槽 prop -->
      <slot name="main" v-bind:user="user">laowang</slot>
      <!-- 一个不带 name 的 <slot> 出口会带有隐含的名字“default” -->
      <slot ></slot>
  </div>

</template>

<script>
export default {
  data () {
    return {
      user: {
        name: 'zhangsan',
        age: 18
      }
    }
  }

}
</script>
```
## 3.4 插件
Mixin是可以轻松被一个子类或一组子类继承功能的类，目的是函数复用

🔥vue.mixin
全局注册的mixin会影响所有创建的Vue实例
- 同名钩子函数会合并为一个数组，混入对象的钩子将在组件自身钩子之前调用
- 二者的methods、components和directives，将被合并为同一个对象，若对象健名冲突时，取组件对象的健值对

## 3.5 组件复用

有3种方式完成组件复用
- Mixin
- HOC
- Renderless组件

### 3.5.1 Mixin

🔥缺陷
- 打破原有组件的封装，找个方法可能要全局搜索，可能忘记了在什么地方
- 增加组件复杂度
- 可能会出现命名冲突的问题
- 仅仅只是对逻辑的复用，模版不能复用

### 3.5.2 HOC （higher order component）高阶组件

函数接受一个组件作为参数，并返回一个新组件，可复用的逻辑在函数中实现

相比Mixin的优点
- 模版可复用
- 不会出现命名冲突（本质上是一个HOC是套了一层父组件）
不足
- 组件复杂度高，多层嵌套，调试会很痛苦

### 3.5.1 RenderLess组件（推荐使用）

- 复用的逻辑沉淀在包含slot插槽的组件
- 接口由插槽Prop来暴露

优点 

 - 模版可复用
 - 不会出现命名冲突
 - 复合依赖倒置原则
 - 复用的接口来源清晰

