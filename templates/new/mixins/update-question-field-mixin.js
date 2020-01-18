export default {
  methods: {
    updateQuestionField({ field, value }) {
      this.$emit('updateQuestionField', {
        index: this.index,
        field,
        value,
      });
    },

    updateQuestionParametersField({ parameter, value, index }) {
      this.$emit('updateQuestionParametersField', {
        index: index !== undefined ? index : this.index,
        parameter,
        value,
      });
    },
  },
};
