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
            <button
              :disabled="processing"
              class="btn btn-default"
              title="Copy this scenario"
              type="button"
              @click.stop.prevent="copyScenario"
            >
              <i class="far fa-clone fa-fw" />
            </button>
            <button
              v-if="scenarioCount > 1"
              :disabled="scenarioCount < 2 || processing"
              class="btn btn-default"
              title="Remove this scenario"
              type="button"
              @click.stop.prevent="deleteScenario"
            >
              <i class="far fa-minus-circle fa-fw" />
            </button>
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
import copy from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/copy';
import editable from '@conjointly/turf-analysis-ui/templates/elements/editable';
import FlexibleHeader from '@conjointly/turf-analysis-ui/templates/elements/flexible-header';

export default {
  name: 'ScenarioHeader',
  components: { editable, FlexibleHeader },
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
