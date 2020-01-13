<template>
    <li :class="{ 'scenario-tab': true, active: isActive }">
        <a href="#" v-on="!isActive ? { '!click': onSelectScenario } : { click: onDumpClickHandler }">
            <flexible-header>
                <editable
                    :disabled="!isActive"
                    :value="scenario.name"
                    @update="onUpdateScenarioName"
                    maxWidth="600px"
                    placeholder="Enter scenario name..."
                    title="Click to rename this scenario"
                >
                </editable>
                <template #append>
                    <div class="btn-group btn-group-xs header-btn-group" v-show="isActive">
                        <button
                            :disabled="processing"
                            @click.stop.prevent="copyScenario"
                            class="btn btn-default"
                            title="Copy this scenario"
                            type="button"
                        >
                            <i class="far fa-clone fa-fw"></i>
                        </button>
                        <button
                            :disabled="scenarioCount < 2 || processing"
                            @click.stop.prevent="deleteScenario"
                            class="btn btn-default"
                            title="Remove this scenario"
                            type="button"
                            v-if="scenarioCount > 1"
                        >
                            <i class="far fa-minus-circle fa-fw"></i>
                        </button>
                        <button
                            :disabled="scenarioCount < 2 || !showAdvancedSettings || processing"
                            @click.stop.prevent="onDeleteExceptScenario"
                            class="btn btn-default"
                            title="Remove all scenarios except this one"
                            type="button"
                            v-if="scenarioCount > 1 && showAdvancedSettings"
                        >
                            <i class="far fa-dumpster-fire"></i>
                        </button>
                        <button
                            :disabled="processing"
                            class="scenario-drag-handle btn btn-default btn-xs"
                            title="Drag and drop to re-order scenarios"
                            type="button"
                            v-if="scenarioCount > 1"
                        >
                            <i class="far fa-arrows fa-fw"></i>
                        </button>
                    </div>
                </template>
            </flexible-header>
        </a>
    </li>
</template>

<script>
    import copy from "@/components/simulations/mixins/copy";
    import editable from "@/elements/editable";
    import FlexibleHeader from "@/elements/flexible-header";

    export default {
        mixins: [copy],
        components: {editable, FlexibleHeader},
        name: "scenario-header",
        props: ["scenario", "scenarioIndex", "scenarioCount", "isActive", "processing", "showAdvancedSettings"],
        methods: {
            onSelectScenario: function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.$emit("selectScenario", this.scenarioIndex);
            },
            copyScenario: function () {
                this.$emit("copyScenario", this.scenario.id);
            },
            deleteScenario: function () {
                this.$emit("deleteScenario", this.scenarioIndex, true);
            },
            onDeleteExceptScenario: function () {
                this.$emit("deleteExceptScenario", this.scenarioIndex);
            },
            onUpdateScenarioName: function (name) {
                this.$emit("update-scenario-name", {scenario: this.scenario, name});
            },
            onDumpClickHandler(e) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };
</script>

<style scoped>
    .header-btn-group {
        display: flex;
        margin-left: 10px;
    }
</style>
