<template>
  <div class="input-group">
    <input
      :disabled="disabled"
      :value="formattedValue"
      class="form-control"
      max="100"
      min="0"
      type="number"
      @input="input"
    >
    <span class="input-group-addon">%</span>
  </div>
</template>

<script>
export default {
  name: 'InputNumberPercentage',
  props: ['value', 'disabled'],
  computed: {
    formattedValue() {
      return Math.round(this.value * 10000) / 100;
    },
  },
  methods: {
    input(e) {
      this.$emit('input', e.target.value / 100);
    },
  },
};
</script>

<style scoped></style>
