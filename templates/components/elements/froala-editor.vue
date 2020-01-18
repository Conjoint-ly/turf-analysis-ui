<template>
  <div class="editor">
    <froala
      v-if="!disabled"
      :config="froalaConfigLocal"
      :value="value"
      :on-manual-controller-ready="initializeFroala"
      tag="textarea"
      :name="name"
      @input="$emit('input', $event)"
    />
    <div v-else class="well well-sm fr-view" v-html="value" />
  </div>
</template>

<script>
export default {
  name: 'FroalaEditor',
  props: {
    value: { type: String, required: true },
    name: { type: String, default: 'editor' },
    froalaConfig: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      initControls: null,
    };
  },
  computed: {
    froalaConfigLocal() {
      return { ...this.froalaConfig, placeholderText: false };
    },
  },
  methods: {
    initializeFroala(initControls) {
      this.initControls = initControls;
      this.initControls.initialize();
      this.initControls.getEditor()('html.set', this.value);
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
