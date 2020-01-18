<template>
  <select>
    <slot />
  </select>
</template>

<script>
import $ from 'jquery';

export default {
  props: ['options', 'value'],
  watch: {
    value(value) {
      $(this.$el)
        .val(value);
    },
    options() {},
  },
  mounted() {
    const vm = this;
    $(this.$el)
      .select2({
        escapeMarkup(markup) {
          return markup;
        },
        templateResult(data) {
          return data.html;
        },
        templateSelection(data) {
          return data.text;
        },
      })
      .val(this.value)
      .trigger('change')
      .on('change', function () {
        vm.$emit('input', this.value);
      });
  },
  destroyed() {
    $(this.$el).off().select2('destroy');
  },
};
</script>
