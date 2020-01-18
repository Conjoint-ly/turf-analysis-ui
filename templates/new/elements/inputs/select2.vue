<template>
  <select
    :disabled="disabled"
    :name="name"
    class="form-control"
    :multiple="multiple"
  >
    <slot>
      <option
        v-for="(option, index) in options"
        :key="index"
        :disabled="option.disabled"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </slot>
  </select>
</template>

<script>
import $ from 'jquery';

export default {
  props: {
    value: { type: String, required: true },
    name: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
  },
  watch: {
    value(value) {
      $(this.$el).val(value);
    },
    options() {
    },
  },
  mounted() {
    const vm = this;
    $(this.$el).select2({
      escapeMarkup(markup) {
        return markup;
      },
      templateResult(data) {
        return data.html;
      },
      templateSelection(data) {
        return data.text;
      },
    }).val(this.value).trigger('change')
      .on('change', function () {
        vm.$emit('input', this.value);
      });
  },
  destroyed() {
    $(this.$el).off().select2('destroy');
  },
};
</script>

<style>
    .input-group .select2-container a.select2-choice {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
</style>
