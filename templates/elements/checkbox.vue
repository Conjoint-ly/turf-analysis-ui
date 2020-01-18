<template>
  <label class="bootstrapswitch-inner">
    <input
      type="checkbox"
      :name="name"
      :value="value"
      :checked="value === 1"
      :disabled="disabled"
      @change.prevent="$emit('input', $event.target.checked ? 1 : 0)"
    >
    <span />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    name: { type: String, required: false, default: '' },
    value: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
label.bootstrapswitch-inner > span::before {
	padding: 2px 6px !important;
}
</style>
