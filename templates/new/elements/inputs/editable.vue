<template>
  <div class="editable-wrapper">
    <span
      v-if="!editable || disabled"
      :class="disabled ? 'readonly' : ''"
      :style="maxWidth ? { 'max-width': maxWidth } : ''"
      :title="title"
      @click.stop.prevent.exact="click"
      v-html="value ? value : placeholder"
    />
    <input
      v-else
      ref="input"
      v-model="text"
      v-autowidth="{ maxWidth: maxWidth, minWidth: '10px' }"
      :placeholder="placeholder"
      @blur="blur"
      @input="$emit('input')"
      @keypress.enter="$event.target.blur()"
    >
  </div>
</template>

<style scoped>
    span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    input {
        max-width: 100%;
    }
</style>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'Editable',
  props: {
    value: { type: String, default: '' },
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    maxWidth: { type: String, default: '' },
  },
  data() {
    return {
      text: this.value,
      editable: false,
    };
  },
  watch: {
    value() {
      this.text = this.value;
    },
  },
  created() {
    this.blur = debounce(
      () => {
        this.editable = false;
        const text = this.text ? this.text.trim() : '';
        if (text !== this.value) {
          this.$emit('update', text);
        } else {
          this.$nextTick(() => {
            this.text = this.value;
          });
        }
      },
      200,
      { leading: true },
    );
  },
  methods: {
    click() {
      if (!this.disabled) {
        this.editable = true;
        this.text = this.value;
        this.$nextTick(() => {
          this.$refs.input.focus({ preventScroll: true });
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0;
        });
      }
    },
    update() {
      this.$emit('change');
    },
  },
};
</script>
