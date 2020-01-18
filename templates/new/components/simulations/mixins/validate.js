export default {
  methods: {
    validate() {
      return new Promise((resolve) => {
        Promise.all(this.getValidators().map((validate) => validate())).then((values) => {
          resolve(!values.includes(false));
        });
      });
    },
  },
};
