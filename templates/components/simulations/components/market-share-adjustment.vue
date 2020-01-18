<template>
  <div
    ref="adjustmentModal"
    aria-hidden="true"
    class="modal modal-xl-important fade"
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
          Availability adjustment
        </h4>
      </div>
      <div class="modal-body">
        <div v-if="scenario_.concepts.length > 20" class="alert alert-warning">
          <i class="far fa-exclamation-triangle" /> Availability adjustment is <b>not recommended</b> for
          simulations with over 20 concepts.
        </div>
        <div class="table-responsive">
          <table class="reportTable" style="width: 100%;">
            <thead>
              <tr>
                <th />
                <th>Simulated preference shares</th>
                <th>Observed volume share</th>
                <th>Relative availability (adjustment factor)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="concept in scenario_.concepts" :key="concept.id">
                <td>{{ concept.name }}</td>
                <td>
                  <input-number-percentage
                    :disabled="true"
                    :value="concept.simulatedPreferenceShare"
                  />
                </td>
                <td>
                  <input-number-percentage v-model="concept.actualMarketShare" />
                </td>
                <td>
                  <input-number-percentage v-model="concept.relativeAvailability" />
                </td>
              </tr>
              <tr v-if="scenario_.none">
                <td>{{ scenario_.none.name }}</td>
                <td>
                  <input-number-percentage
                    :disabled="true"
                    :value="scenario_.none.simulatedPreferenceShare"
                  />
                </td>
                <td>
                  <input-number-percentage v-model="scenario_.none.actualMarketShare" />
                </td>
                <td>
                  <input-number-percentage v-model="scenario_.none.relativeAvailability" />
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <hr>
                </td>
              </tr>
              <tr class="total">
                <td><b>Total</b></td>
                <td>
                  <div><b>{{ totalSimulatedPreferenceShare }}%</b></div>
                </td>
                <td>
                  <div><b>{{ totalActualMarketShare }}%</b></div>
                </td>
                <td><span>&nbsp;</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <div class="pull-left">
          <button class="btn btn-default" data-dismiss="modal" type="button">
            Close
          </button>
        </div>
        <button
          ref="calculateRelativeAvailability"
          class="btn btn-primary"
          data-loading-text="<i class='far fa-spinner fa-spin fa-fw'></i> Calculating..."
          type="button"
          @click="runAvailability"
        >
          <i class="far fa-upload" /> Calculate
        </button>
        <button class="btn btn-success" type="button" @click="applyAdjustment">
          <i class="far fa-check" /> Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import copy from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/copy';
import inputNumberPercentage from '@conjointly/turf-analysis-ui/templates/components/elements/input-number-percentage';
import { mapState } from 'vuex';

export default {
  name: 'MarketShareAdjustment',
  delimiters: ['${', '}'],
  components: { inputNumberPercentage },
  mixins: [copy],
  props: ['scenario', 'showModal'],
  data() {
    return {
      scenario_: null,
    };
  },
  created() {
    this.syncScenario();
  },
  template: '#market-share-adjustment',
  computed: {
    ...mapState({
      experimentId: (state) => state.simulations.experimentId,
      csrfToken: (state) => state.simulations.csrfToken,
    }),
    totalSimulatedPreferenceShare() {
      let result = 0.0;
      for (let i = 0; i < this.scenario_.concepts.length; i++) {
        result += this.scenario_.concepts[i].simulatedPreferenceShare || 0;
      }
      if (this.scenario_.none) {
        result += this.scenario_.none.simulatedPreferenceShare || 0;
      }
      return Math.round(result * 10000) / 100;
    },
    totalActualMarketShare() {
      let result = 0.0;
      for (let i = 0; i < this.scenario_.concepts.length; i++) {
        result += this.scenario_.concepts[i].actualMarketShare || 0;
      }
      if (this.scenario_.none) {
        result += this.scenario_.none.actualMarketShare || 0;
      }
      return Math.round(result * 10000) / 100;
    },
    scenarioData: {
      get() {
        const scenario = this.copy(this.scenario_);
        const scenario_ = {
          concepts: [],
        };

        scenario.concepts.forEach((concept) => {
          scenario_.concepts.push({
            simulatedPreferenceShare: concept.simulatedPreferenceShare,
            actualMarketShare: concept.actualMarketShare,
          });
        });

        if (scenario.none) {
          scenario_.none = {
            simulatedPreferenceShare: scenario.none.simulatedPreferenceShare,
            actualMarketShare: scenario.none.actualMarketShare,
          };
        }

        return scenario_;
      },
      set(data) {
        const vm = this;
        data.concepts.forEach((_concept, j) => {
          const concept = vm.scenario_.concepts[j];
          concept.relativeAvailability = parseFloat(_concept.relativeAvailability);
        });
        if (data.none) {
          vm.scenario_.none.relativeAvailability = parseFloat(data.none.relativeAvailability);
        }
      },
    },
  },
  methods: {
    syncScenario(up) {
      if (up) {
        this.$emit('onSyncScenario', this.copy(this.scenario_));
      } else {
        this.scenario_ = this.copy(this.scenario);
      }
    },
    applyAdjustment() {
      $(this.$refs.adjustmentModal).modal('hide');
      this.$parent.applyAdjustmentStatus = true;
      this.syncScenario(true);
    },
    runAvailability() {
      const vm = this;
      const $btn = $(vm.$refs.calculateRelativeAvailability).button('loading');
      const data = this.copy(vm.scenarioData, true);
      data.csrf_token = vm.csrfToken;

      $.post(
        `/reports/${vm.experimentId}/run-availability/`,
        data,
        (response) => {
          window.clearNotifierTopic('run-availability');
          vm.scenarioData = response;
        },
        'json',
      ).fail((jqXHR) => {
        window.newNotifier({ topic: 'run-availability', type: 'danger', message: jqXHR.responseText });
        // console.log("ERROR: " + textStatus);
      }).always(() => {
        $btn.button('reset');
      });
    },
  },
  watch: {
    showModal() {
      this.syncScenario();
      $(this.$refs.adjustmentModal).modal('show');
    },
  },
};
</script>

<style lang="scss" scoped>
    .reportTable {
        tr.total {
            font-weight: bold;
            text-align: left;
        }
    }
</style>
