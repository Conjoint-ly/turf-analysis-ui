import $ from 'jquery';

export default {
  props: {
    showModal: Boolean,
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
  watch: {
    showModal() {
      if (this.showModal) {
        $(this.$refs.modal).modal('show');
        const vm = this;
        $(this.$refs.modal).off('hidden.bs.modal').on('hidden.bs.modal', () => {
          vm.$emit('close');
        });
      } else {
        $(this.$refs.modal).modal('hide');
      }
    },
  },
};
