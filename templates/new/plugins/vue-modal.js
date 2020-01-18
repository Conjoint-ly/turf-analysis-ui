import modal from '@conjointly/turf-analysis-ui/templates/new/elements/modal/modal';

const VueModal = {
  name: 'VueModal',

  install(Vue) {
    Vue.component('modal', modal);

    Vue.prototype.$modal = {
      open(params) {
        Vue.prototype.$bus.$emit('modal@open', params);
      },
      close() {
        Vue.prototype.$bus.$emit('modal@close');
      },
      cancel() {
        Vue.prototype.$bus.$emit('modal@cancel');
      },
      save() {
        Vue.prototype.$bus.$emit('modal@save');
      },
      next(params) {
        Vue.prototype.$bus.$emit('modal@next', params);
      },
    };
  },
};

export default VueModal;
