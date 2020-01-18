<template>
  <div class="row" style="margin-bottom: 15px">
    <div class="col-md-12">
      <draggable
        :stop-propagation="true"
        :value="worksheet.scenarios"
        class="nav nav-tabs nav-tabs-inline"
        role="tablist"
        tag="ul"
        v-bind="{
          disabled: processing,
          handle: '.scenario-drag-handle',
          animation: 150,
          group: 'worksheet-' + worksheet.id + '-scenarios',
          forceFallback: true
        }"
        @end="onScenarioDropped"
        @input="onUpdateScenarios"
      >
        <scenario-header
          :key="scenario.id"
          :is-active="selectedScenarioIndex === scenarioIndex"
          :processing="processing"
          v-for="(scenario, scenarioIndex) in worksheet.scenarios"
          :scenario="scenario"
          :scenario-count="worksheet.scenarios.length"
          :scenario-index="scenarioIndex"
          :show-advanced-settings="showAdvancedSettings"
          @copyScenario="onCopyScenario"
          @deleteExceptScenario="onDeleteExceptScenario"
          @deleteScenario="onDeleteScenario"
          @selectScenario="onSelectScenario"
          @update-scenario-name="onUpdateScenarioName"
        />
      </draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ScenarioHeader from './scenario-header';

export default {
  name: 'ScenarioHeaders',
  components: {
    Draggable,
    ScenarioHeader,
  },
  props: ['processing', 'worksheet', 'showAdvancedSettings'],
  computed: {
    ...mapGetters({ selectedScenarioIndex: 'getCurrentScenarioIndex' }),
  },
  methods: {
    ...mapActions(['deleteExceptScenario', 'copyScenario', 'selectScenario']),
    ...mapMutations({
      setCurrentScenario: 'SET_CURRENT_SCENARIO',
      setScenarioName: 'SET_SCENARIO_NAME',
      updateScenarios: 'UPDATE_SCENARIOS',
      deleteScenario: 'DELETE_SCENARIO',
    }),
    selectLastScenario() {
      this.selectScenario(this.worksheet.scenarios.length - 1);
    },
    onScenarioDropped(e) {
      this.setCurrentScenario(e.newIndex);
    },
    onUpdateScenarioName({ scenario, name }) {
      this.setScenarioName({ scenario, name });
    },
    onUpdateScenarios($event) {
      this.updateScenarios({ worksheet: this.worksheet, scenarios: $event });
    },
    onCopyScenario(scenarioId) {
      this.copyScenario({ worksheetId: this.worksheet.id, scenarioId });
    },
    onDeleteScenario(scenarioIndex, selectLastIndex) {
      this.deleteScenario({ scenarios: this.worksheet.scenarios, scenarioIndex });
      if (selectLastIndex) {
        this.selectLastScenario();
      }
    },
    onDeleteExceptScenario(scenarioIndex) {
      this.deleteExceptScenario({ worksheet: this.worksheet, scenarioIndex }).then(() => {
        this.selectScenario(0);
      });
    },
    onSelectScenario(scenarioIndex) {
      this.selectScenario(scenarioIndex);
    },
  },
};
</script>

<style scoped></style>
