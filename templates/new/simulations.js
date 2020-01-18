import Vue from 'vue';
import Validator from 'simple-vue-validator';
import VueInputAutowidth from 'vue-input-autowidth';
import app from '@conjointly/turf-analysis-ui/templates/new/components/simulations/index';
import { store } from '@conjointly/turf-analysis-ui/templates/new/components/simulations/store';

const el = document.getElementById('tabSimulations');

if (el) {
  Vue.use(Validator);
  Vue.use(VueInputAutowidth);

  window.simulations = new Vue({
    store,
    render: (h) => h(app, {
      props: {
        experimentId: Number(el.getAttribute('experimentId')),
        isMaxDiff: Boolean(el.getAttribute('isMaxDiff')),
        segments: JSON.parse(el.getAttribute('segments')),
        attributes: JSON.parse(el.getAttribute('attributes')),
        applicability: JSON.parse(el.getAttribute('applicability')),
        initWorksheets: JSON.parse(el.getAttribute('initWorksheets')),
        experimentType: String(el.getAttribute('experimentType')),
        csrfToken: String(el.getAttribute('csrfToken')),
        priceObject: JSON.parse(el.getAttribute('priceObject')),
      },
    }),
  }).$mount('#tabSimulations');
}
