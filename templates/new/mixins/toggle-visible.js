export default {
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
  },
};
