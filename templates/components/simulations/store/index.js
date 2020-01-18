import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import VuexValidator from '@conjointly/turf-analysis-ui/templates/plugins/vuex-validator';
import _ from 'lodash';
import { WHAT_IF } from '@conjointly/turf-analysis-ui/templates/components/simulations/worksheet-types';
import worksheets from './modules/worksheets';
import segments from './modules/segments';
import simulations from './modules/simulations';
import scenarios from './modules/scenarios';
import validations from './modules/validations';

Vue.use(Vuex);

const worksheetsWatcher = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'SET_SAVED') return;
    // fixme: hack to decrease apply clone worksheets
    if (
    // trigger only for worksheets mutations or revenues
      store._modules.root._rawModule.modules.worksheets.mutations.hasOwnProperty(mutation.type)
    ) {
      const nextWorksheets = _.cloneDeep(state.worksheets.worksheets);
      if (!_.isEqual(state.worksheets.savedWorksheets, nextWorksheets)) {
        store.commit('SET_SAVED', false);
      } else {
        store.commit('SET_SAVED', true);
      }
    }
  });
};

const options = {
  strict: process.env.NODE_ENV !== 'production',
  plugins:
        process.env.NODE_ENV !== 'production'
          ? [createLogger({ collapsed: false }), worksheetsWatcher]
          : [worksheetsWatcher],
  modules: {
    worksheets, segments, simulations, scenarios, validations,
  },
  actions: {
    init({ commit, state, dispatch }, payload) {
      commit('SET', payload);
      state.worksheets.worksheets.filter((w) => w.type === WHAT_IF).forEach((w) => {
        w.scenarios.forEach((s) => {
          s.concepts.forEach((concept) => {
            for (let i = 0; i < state.worksheets.attributes.length; i++) {
              const attribute = state.worksheets.attributes[i];
              if (concept.attributes.hasOwnProperty(attribute.value)) {
                // fixme this used side-effect of `checkApplicability` for set applicable value
                //  to concept's attribute.
                dispatch('checkApplicability', {
                  concept,
                  attribute,
                  value: concept.attributes[attribute.value],
                });
              }
            }
          });
        });
      });

      state.worksheets.worksheets.filter((w) => w.type === WHAT_IF)
        .forEach((worksheet) => dispatch('runSimulation', worksheet.id));
    },
  },
};

Vue.use(VuexValidator, { store: options });
export const store = new Vuex.Store(options);
