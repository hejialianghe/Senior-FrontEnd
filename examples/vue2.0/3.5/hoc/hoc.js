const ValidateHoc = Component => ({
    name: `hoc-${Component.name}`,
    props: ["rules"],
    data() {
      return {
        errMsg: "",
        value: ""
      };
    },
    methods: {
      validate(value) {
        this.value = value;
        let validate = this.rules.reduce((pre, cur) => {
          let check = cur && cur.test && cur.test(this.value);
          this.errMsg = check ? "" : cur.message;
          return pre && check;
        }, true);
        return validate;
      }
    },
    render() {
      console.log(this.value);
      return (
        <div>
          <Component on-blur={this.validate} initValue={this.value} />
          {this.errMsg || ""}
        </div>
      );
    }
  });
  
  export default ValidateHoc;
  