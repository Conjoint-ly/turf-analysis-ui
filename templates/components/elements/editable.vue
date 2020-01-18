<template>
  <div class="editable-wrapper">
    <span
      v-if="!editable || disabled"
      :title="title"
      :style="maxWidth ? {'max-width': maxWidth} : ''"
      :class="disabled ? 'readonly' : ''"
      @click.stop.prevent="click"
      v-text="text ? text : placeholder"
    />
    <input
      v-else
      ref="input"
      v-model="text"
      v-autowidth="{maxWidth: maxWidth, minWidth: '10px'}"
      :placeholder="placeholder"
      @blur="blur"
      @keypress.enter="$event.target.blur()"
    >
  </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
  name: 'Editable',
  props: {
    value: { type: String },
    title: { type: String },
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
  created() {
    this.blur = debounce(() => {
      this.editable = false;
      const text = this.text.trim();
      if (text && text !== this.value) {
        this.$emit('update', text);
      } else {
        this.$nextTick(() => {
          this.text = this.value;
        });
      }
    }, 200, { leading: true });
  },
  methods: {
    click() {
      if (!this.disabled) {
        this.editable = true;
        this.$nextTick(() => {
          this.$refs.input.focus({ preventScroll: true });
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0;
        });
      }
    },
  },
};
</script>
