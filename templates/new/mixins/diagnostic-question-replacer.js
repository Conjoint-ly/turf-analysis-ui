export default {
  methods: {
    makeTextReplaces(text) {
      return text
        .replace(/\[thumbs-(up|down)\]/ig, '<i class="fas fa-thumbs-$1"></i>')
        .replace(/\[product\s*(name)?\]/ig, this.productName)
        .replace(/\[claim\]/ig, this.claimName)
        .replace(/\[variant\]/ig, this.claimName);
    },
  },
};
