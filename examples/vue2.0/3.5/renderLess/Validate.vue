<template>
    <div class="Validate">
        <slot :validate="validate"></slot>
        {{errmsg}}
    </div>
</template>

<script>
export default {
  props: ['value', 'rules'],
  data () {
    return {
      errmsg: ''
    }
  },
  methods: {
    validate () {
      let check
      var validate = this.rules.reduce((pre, cur) => {
        check = cur && cur.test && cur.test(this.value)
        this.errmsg = check ? '' : cur.message
        return pre && check
      }, true)
      return validate
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">

</style>
