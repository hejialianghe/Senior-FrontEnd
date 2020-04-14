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
用于表单元素<input>、<textarea>及<select>上创建双向数据绑定的语法糖

```javascript

<template>
  <div>
    <input type="text" v-model="text"></input>
    //  v-model是下面的语法糖
    <input type="text" :value="text" @input="text=$event.target.value"></input>
  </div>
</template>

<script type="text/ecmascript-6">
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

## 3.3 双向绑定


