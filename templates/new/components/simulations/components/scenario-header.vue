<template>
  <li :class="{ 'scenario-tab': true, active: isActive }">
    <a href="#" v-on="!isActive ? { '!click': onSelectScenario } : { click: onDumpClickHandler }">
      <flexible-header>
        <editable
          :disabled="!isActive"
          :value="scenario.name"
          max-width="600px"
          placeholder="Enter scenario name..."
          title="Click to rename this scenario"
          @update="onUpdateScenarioName"
        />
        <template #append>
          <div v-show="isActive" class="btn-group btn-group-xs header-btn-group">
            <copy-button
              :disabled="processing"
              title="Copy this scenario"
              @click.stop.prevent="copyScenario"
            />
            <remove-button
              v-if="scenarioCount > 1"
              :disabled="scenarioCount < 2 || processing"
              title="Remove this scenario"
              @click.stop.prevent="deleteScenario"
            />
            <button
              v-if="scenarioCount > 1 && showAdvancedSettings"
              :disabled="scenarioCount < 2 || !showAdvancedSettings || processing"
              class="btn btn-default"
              title="Remove all scenarios except this one"
              type="button"
              @click.stop.prevent="onDeleteExceptScenario"
            >
              <i class="far fa-dumpster-fire" />
            </button>
            <button
              v-if="scenarioCount > 1"
              :disabled="processing"
              class="scenario-drag-handle btn btn-default btn-xs"
              title="Drag and drop to re-order scenarios"
              type="button"
            >
              <i class="far fa-arrows fa-fw" />
            </button>
          </div>
        </template>
      </flexible-header>
    </a>
  </li>
</template>

<script>
import copy from '@conjointly/turf-analysis-ui/templates/new/components/simulations/mixins/copy';
import CopyButton from '@conjointly/turf-analysis-ui/templates/new/elements/buttons/copy';
import RemoveButton from '@conjointly/turf-analysis-ui/templates/new/elements/buttons/remove';
import editable from '@conjointly/turf-analysis-ui/templates/new/elements/inputs/editable';
import FlexibleHeader from '@conjointly/turf-analysis-ui/templates/new/elements/layouts/flexible-header';

export default {
  name: 'ScenarioHeader',
  components: {
    editable, FlexibleHeader, CopyButton, RemoveButton,
  },
  mixins: [copy],
  props: ['scenario', 'scenarioIndex', 'scenarioCount', 'isActive', 'processing', 'showAdvancedSettings'],
  methods: {
    onSelectScenario(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('selectScenario', this.scenarioIndex);
    },
    copyScenario() {
      this.$emit('copyScenario', this.scenario.id);
    },
    deleteScenario() {
      this.$emit('deleteScenario', this.scenarioIndex, true);
    },
    onDeleteExceptScenario() {
      this.$emit('deleteExceptScenario', this.scenarioIndex);
    },
    onUpdateScenarioName(name) {
      this.$emit('update-scenario-name', { scenario: this.scenario, name });
    },
    onDumpClickHandler(e) {
      e.preventDefault();
      e.stopPropagation();
    },
  },
};
</script>

<style scoped>
    .header-btn-group {
        display: flex;
        margin-left: 10px;
    }
</style>
