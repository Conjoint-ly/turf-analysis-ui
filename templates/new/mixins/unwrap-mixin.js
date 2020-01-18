export default {
  methods: {
    onUnwrap() {
      return this.validation.hasError();
    },
    unwrap(force) {
      if (force || this.onUnwrap()) {
        this.onValidationFailed && this.onValidationFailed();
        this.$emit('unwrap', force);
      }
    },
  },
  mounted() {
    this.$bus.on('unwrap', this.unwrap);
  },
  beforeDestroy() {
    this.$bus.off('unwrap', this.unwrap);
  },
};
