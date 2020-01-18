<template>
  <div class="modal-scrollable" :style="{visibility: visibility}">
    <div
      class="modal fade modal-overflow animated"
      :class="[isVisible, hasSize, shaking]"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" @click="cancel">
            &times;
          </button>
          <h4 class="modal-title">
            <span v-if="!header.component" class="display-table-cell">{{ header }}</span>
            <component
              :is="header.component"
              v-else
              v-bind="header.props"
              v-on="header.listeners"
            />
          </h4>
        </div>

        <div class="modal-body">
          <component :is="body.component" v-bind="body.props" v-on="body.listeners" />
        </div>

        <div v-if="footer.visible" class="modal-footer">
          <template v-if="!footer.component">
            <button type="button" class="btn btn-default" @click="cancel">
              {{ footer.cancel }}
            </button>

            <button
              v-if="isLoading"
              type="button"
              class="btn btn-success"
              disabled
              @click="save"
            >
              <i class="far fa-spinner fa-spin" />
              {{ footer.loading }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-success"
              @click="save"
            >
              {{ footer.save }}
            </button>
          </template>
          <component
            :is="footer.component"
            v-esle
            v-bind="footer.props"
            v-on="footer.listeners"
          />
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="[isVisible]" @click="shake" />
  </div>
</template>

<style scoped>
    .modal-scrollable {
        z-index: 1050;
    }

    .modal {
        display: block;
        border: none;
    }
</style>

<script>
const defaults = {
  header: {
    title: 'Modal Title',
    component: null,
    props: {},
    listeners: {},
  },
  body: {
    component: null,
    props: {},
    listeners: {},
  },
  footer: {
    save: 'Save',
    cancel: 'Cancel',
    visible: true,
    loading: 'Loading...',
    component: null,
    props: {},
    listeners: {},
  },
};

export default {
  data() {
    return {
      size: '',
      visible: false,
      header: {},
      body: {},
      footer: {},
      shaken: false,
      isLoading: false,
    };
  },
  computed: {
    visibility() {
      return this.visible ? 'visible' : 'hidden';
    },
    isVisible() {
      return this.visible ? 'in' : '';
    },
    hasSize() {
      if (this.size == 'large') return 'modal-lg-important';

      if (this.size == 'medium') return 'modal-md-important';

      return '';
    },
    shaking() {
      return this.shaken ? 'shake' : '';
    },
  },
  beforeMount() {
    this.$bus.$on('modal@open', (params) => this.open(params));
    this.$bus.$on('modal@close', this.close);
    this.$bus.$on('modal@loading-start', this.start);
    this.$bus.$on('modal@loading-stop', this.stop);
    this.$bus.$on('modal@next', this.next);
  },
  beforeDestroy() {
    this.$bus.$off('modal@open');
    this.$bus.$off('modal@close');
    this.$bus.$off('modal@loading-start');
    this.$bus.$off('modal@loading-stop');
  },
  methods: {
    cancel() {
      this.$modal.cancel();
    },
    save() {
      this.$modal.save();
    },
    open(params) {
      this.header = typeof params.header === 'string'
        ? params.header
        : { ...defaults.header, ...params.header };
      this.body = { ...defaults.body, ...params.body };
      this.footer = { ...defaults.footer, ...params.footer };
      this.size = params.size;
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.reset();
    },
    next(params) {
      this.close();
      setTimeout(() => this.open(params), 300);
    },
    reset() {
      this.header = { ...defaults.header };
      this.body = { ...defaults.body };
      this.footer = { ...defaults.footer };
    },
    shake() {
      this.shaken = false;
      this.$nextTick(() => {
        this.shaken = true;
      });
    },
    start() {
      this.isLoading = true;
    },
    stop() {
      this.isLoading = false;
    },
  },
};
</script>
