<template>
    <div>
        <!-- 姓名验证 -->
        <validate #default="{validate}" :rules="nameReles" :value="name">
            <input type="text" @blur="validate" v-model="name">
        </validate>
        <!-- 年龄验证 -->
        <validate #default="{validate}" :rules="ageRules" :value="age">
            <input type="text" @blur="validate" v-model="age">
        </validate>

    </div>
</template>

<script>
import Validate from './Validate'
export default {
  data () {
    return {
      age: '',
      name: '',
      ageRules: [ // 姓名的验证规则
        {
          test (value) {
            return /^\d+$/g.test(value)
          },
          message: '请输入数字'
        }
      ],
      nameReles: [ // 年龄的验证规则
        {
          test (value) {
            return /^[a-z]+$/g.test(value)
          },
          message: '请输入英文字母'
        }
      ]
    }
  },
  components: {
    Validate
  }
}
</script>

<style scoped lang="scss">
input{
    border: 1px solid #000;
}
</style>
