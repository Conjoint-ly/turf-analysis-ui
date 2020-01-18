<template>
  <div
    ref="modal"
    aria-hidden="true"
    class="modal modal-lg-important fade"
    data-backdrop="static"
    data-keyboard="false"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-content">
      <div class="modal-header">
        <button
          aria-hidden="true"
          class="close"
          data-dismiss="modal"
          type="button"
        >
          &times;
        </button>
        <h4 class="modal-title">
          <editable
            :placeholder="calculationNamePlaceholder"
            :value="title"
            @update="title = $event"
          />
        </h4>
      </div>
      <div class="modal-body">
        <div>
          <div class="form-group">
            <label for="revenueTitle">Revenue's graph title</label>
            <input
              id="revenueTitle"
              v-model="xAxisTitle"
              class="form-control"
              type="text"
            >
          </div>
          <div class="form-group">
            <table class="table table-formulas">
              <tbody>
                <tr v-for="(formula, concept) in formulas" :key="concept">
                  <td>
                    <label>{{ concept }}</label>
                  </td>
                  <td>
                    <revenue-formula
                      :formula="formula"
                      @input="updateFormula(concept, $event)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="pull-left">
          <button
            class="btn btn-default"
            data-dismiss="modal"
            type="button"
            @click="onClose"
          >
            Close
          </button>
        </div>
        <button class="btn btn-success" type="button" @click="onSave">
          <i class="far fa-check" /> Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Editable from '@conjointly/turf-analysis-ui/templates/elements/editable';
import modal from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/modal';
import { clone } from 'lodash';
import RevenueFormula from '@conjointly/turf-analysis-ui/templates/components/simulations/components/revenue-formula';
import getValidators from '@conjointly/turf-analysis-ui/templates/mixins/get-validators.js';

export default {
  name: 'RevenueSettingsModal',
  components: { RevenueFormula, Editable },
  mixins: [modal, getValidators],
  props: ['revenue', 'concepts', 'calculationNamePlaceholder'],
  data() {
    return {
      title: this.revenue.title,
      xAxisTitle: this.revenue.xAxisTitle,
      formulas: clone(this.revenue.formulas),
    };
  },
  watch: {
    showModal() {
      this.title = this.revenue.title;
      this.xAxisTitle = this.revenue.xAxisTitle;
      this.formulas = clone(this.revenue.formulas);
    },
  },
  methods: {
    updateFormula(concept, e) {
      this.formulas[concept] = e.target.value;
    },
    onSave() {
      const vm = this;
      this.validate().then((valid) => {
        if (!valid.includes(false)) {
          vm.$emit('save', {
            isNew: !vm.revenue.id,
            revenue: vm.revenue,
            title: vm.title,
            xAxisTitle: vm.xAxisTitle,
            formulas: clone(vm.formulas),
          });
        }
      });
    },
    validate() {
      return Promise.all(this.getValidators().map((validate) => validate()));
    },
  },
};
</script>

<style lang="scss" scoped>
    .table-formulas {
        > tbody > tr > td {
            &:first-child {
                width: 1px;
                padding-right: 10px;
                max-width: 200px;
                vertical-align: middle;

                label {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

            padding: 0 0 5px;
            border: none;
        }
    }
</style>
