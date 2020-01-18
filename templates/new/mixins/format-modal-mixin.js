export default {
  data() {
    return {
      currentItemIndexFormatted: null,
      $modal: null,
    };
  },
  computed: {
    currentItemFormatted() { // Must be overloaded
      return null;
    },
  },
  methods: {
    openOptionModal(itemIndex) {
      this.currentItemIndexFormatted = itemIndex;
      this.$nextTick(() => {
        this.$modal = $(this.$refs.formatModal).find('.modal');
        this.$modal.modal();
        this.$modal.on('hidden.bs.modal', () => {
          this.currentItemIndexFormatted = null;
          this.$modal = null;
        });
        this.$forceUpdate();
      });
    },
    closeOptionModal(data) {
      Object.entries(data).forEach(([field, value]) => {
        this.$emit('updateItemField', {
          index: this.index,
          itemIndex: this.currentItemIndexFormatted,
          field,
          value,
        });
      });
      this.$modal.modal('hide');
    },
  },
};
