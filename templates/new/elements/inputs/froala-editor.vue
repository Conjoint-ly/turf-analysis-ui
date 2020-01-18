<template>
  <div class="editor">
    <froala
      v-if="!disabled"
      :config="buildFroalaConfig()"
      :name="name"
      :on-manual-controller-ready="initializeFroala"
      :value="content"
      tag="textarea"
      @input="$emit('input', $event)"
    />
    <div v-else class="well well-sm fr-view" v-html="value" />
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'FroalaEditor',
  props: {
    value: { type: String, required: true },
    name: { type: String, default: 'editor' },
    froalaConfig: { type: Object },
    disabled: { type: Boolean },
  },
  data() {
    return {
      controls: null,
      initialized: false,
      initializedDelayed: false,
    };
  },
  computed: {
    content() {
      if (this.initialized) return this.value;

      if (this.initializedDelayed) this.controls.getEditor()('html.set', this.value);

      return '';
    },
  },
  methods: {
    initializeFroala(initControls) {
      this.controls = initControls;
      this.controls.initialize();
      this.controls.getEditor()('html.set', this.value);
      this.initializedDelayed = true;
      window.initFroalaDoubleClick($(this.$el).find('textarea'));
    },
    appendText(html) {
      if (html && html.length > 0 && !this.disabled) {
        const oldHtml = $(`<div>${this.getEditor()('html.get')}</div>`);
        const lastEl = oldHtml.find('> *').last();

        if (lastEl.length > 0) {
          lastEl.append(html);
        } else {
          oldHtml.append(html);
        }

        const newHtml = window.safeHTML(oldHtml.html());

        this.$el.querySelector('.fr-element.fr-view').dispatchEvent(new Event('mousedown'));
        this.$nextTick(() => this.$emit('input', newHtml));
      }
    },
    getEditor() {
      return this.controls.getEditor();
    },
    buildFroalaConfig() {
      return {
        ...window.froalaDefaultOptions,
        ...this.froalaConfig,
        events: {
          'froalaEditor.initialized': () => {
            this.initialized = true;
            this.$emit('input', this.value);
          },
        },
      };
    },
  },
  destroy() {
    this.initControls.destroy();
  },
};
</script>

<style scoped>
    .well.fr-view {
        margin-bottom: 0;
    }
</style>
