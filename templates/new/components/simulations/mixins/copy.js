export default {
  methods: {
    copy(obj, withoutId) {
      return this.$store.getters.getCopy(obj, withoutId);
    },
  },
};
