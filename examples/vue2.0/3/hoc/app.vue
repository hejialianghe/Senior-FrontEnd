<template>
  <div id="app">
    <img width="25%" src="./assets/logo.png">
    <validate-input :rules="rules"/>
  </div>
</template>

<script>
import CustomInput from "./components/CustomInput";
import ValidateHoc from "./components/hoc.js";
const ValidateInput = ValidateHoc(CustomInput);

export default {
  name: "App",
  data() {
    return {
      rules: [
        {
          test: function(value) {
            return /\d+/.test(value);
          },
          message: "请输入一个数字"
        }
      ]
    };
  },
  components: {
    ValidateInput
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
