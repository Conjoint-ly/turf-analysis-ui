<template>
  <span
    ref="colorpicker"
    class="input-group-addon input-group-colorpicker"
    :style="{'background-color': colorValue}"
    @click="togglePicker"
  >
    <input v-model="colorValue" type="hidden">
    <swatches-picker
      v-if="displayPicker"
      ref="swpicker"
      :value="colors"
      @input="updateColor"
    />
  </span>
</template>

<script>
import * as VueColor from 'vue-color';

export default {
  name: 'Colorpicker',

  components: {
    'swatches-picker': VueColor.Swatches,
  },
  props: ['color'],
  data() {
    return {
      colors: {
        hex: '#000000',
      },
      colorValue: '',
      displayPicker: false,
    };
  },
  watch: {
    colorValue(color) {
      this.$emit('input', color);
    },
  },
  mounted() {
    this.setColors(this.color);
  },
  methods: {
    setColors(color) {
      this.colors.hex = color;
      this.colorValue = color;
    },
    showPicker() {
      document.addEventListener('click', this.documentClick);
      this.displayPicker = true;
      this.$nextTick(function () {
        const container = this.$refs.colorpicker;
        const position = container.getBoundingClientRect();
        const swatch = container.getElementsByClassName('vc-swatches')[0];
        const offset = 5;
        const delta = position.top + offset + swatch.offsetHeight - window.height;
        swatch.style.top = `${position.top + offset - (delta > 0 ? delta + 10 : 0)}px`;
        swatch.style.left = `${position.left + offset}px`;
      });
    },
    hidePicker() {
      document.removeEventListener('click', this.documentClick);
      this.displayPicker = false;
    },
    togglePicker() {
      this.displayPicker ? this.hidePicker() : this.showPicker();
    },
    documentClick(e) {
      const el = this.$refs.colorpicker;
      const { target } = e;
      if (el !== target && !el.contains(target)) {
        this.hidePicker();
      }
    },
    updateColor(color) {
      this.setColors(color.hex);
    },
  },
};
</script>

<style scoped>

</style>
