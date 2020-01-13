<template>
    <div class="row" style="margin-bottom: 15px">
        <div class="col-md-12">
            <draggable
                :stop-propagation="true"
                :value="worksheet.scenarios"
                @end="onScenarioDropped"
                @input="onUpdateScenarios"
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
            >
                <scenario-header
                    :is-active="selectedScenarioIndex === scenarioIndex"
                    :key="scenario.id"
                    :processing="processing"
                    :scenario="scenario"
                    :scenario-count="worksheet.scenarios.length"
                    :scenario-index="scenarioIndex"
                    :show-advanced-settings="showAdvancedSettings"
                    @copyScenario="onCopyScenario"
                    @deleteExceptScenario="onDeleteExceptScenario"
                    @deleteScenario="onDeleteScenario"
                    @selectScenario="onSelectScenario"
                    @update-scenario-name="onUpdateScenarioName"
                    v-for="(scenario, scenarioIndex) in worksheet.scenarios"
                ></scenario-header>
            </draggable>
        </div>
    </div>
</template>

<script>
    import ScenarioHeader from "./scenario-header";
    import Draggable from "vuedraggable";
    import {mapActions, mapGetters, mapMutations} from "vuex";

    export default {
        name: "scenario-headers",
        props: ["processing", "worksheet", "showAdvancedSettings"],
        components: {
            Draggable,
            ScenarioHeader
        },
        computed: {
            ...mapGetters({selectedScenarioIndex: "getCurrentScenarioIndex"})
        },
        methods: {
            ...mapActions(["deleteExceptScenario", "copyScenario", "selectScenario"]),
            ...mapMutations({
                setCurrentScenario: "SET_CURRENT_SCENARIO",
                setScenarioName: "SET_SCENARIO_NAME",
                updateScenarios: "UPDATE_SCENARIOS",
                deleteScenario: "DELETE_SCENARIO"
            }),
            selectLastScenario: function () {
                this.selectScenario(this.worksheet.scenarios.length - 1);
            },
            onScenarioDropped: function (e) {
                this.setCurrentScenario(e.newIndex);
            },
            onUpdateScenarioName({scenario, name}) {
                this.setScenarioName({scenario, name});
            },
            onUpdateScenarios($event) {
                this.updateScenarios({worksheet: this.worksheet, scenarios: $event});
            },
            onCopyScenario: function (scenarioId) {
                this.copyScenario({worksheetId: this.worksheet.id, scenarioId});
            },
            onDeleteScenario: function (scenarioIndex, selectLastIndex) {
                this.deleteScenario({scenarios: this.worksheet.scenarios, scenarioIndex});
                if (selectLastIndex) {
                    this.selectLastScenario();
                }
            },
            onDeleteExceptScenario: function (scenarioIndex) {
                this.deleteExceptScenario({worksheet: this.worksheet, scenarioIndex}).then(() => {
                    this.selectScenario(0);
                });
            },
            onSelectScenario(scenarioIndex) {
                this.selectScenario(scenarioIndex);
            }
        }
    };
</script>

<style scoped></style>
