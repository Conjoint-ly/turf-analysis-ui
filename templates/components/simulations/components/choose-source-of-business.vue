<template>
    <div class="parts">
        <div class="part">
            <div class="form-group">
                <label for="baselineWorksheet">Baseline scenario's worksheet</label>
                <select
                    :class="{
                        'has-error dont-touch has-error-in-source-of-business': validation.hasError('baselineWorksheet')
                    }"
                    class="form-control"
                    id="baselineWorksheet"
                    v-bind="{ validation }"
                    v-model="baselineWorksheet"
                    v-on="{ change: chooseOnSelect ? onChoose : onNone }"
                >
                    <option :key="w.id" :value="w" v-for="w in whatIfWorksheets">{{ w.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="baselineScenario">Baseline scenario</label>
                <select
                    :class="{
                        'has-error dont-touch has-error-in-source-of-business': validation.hasError('baselineScenario')
                    }"
                    class="form-control"
                    id="baselineScenario"
                    v-bind="{ validation }"
                    v-model="baselineScenario"
                    v-on="{ change: chooseOnSelect ? onChoose : onNone }"
                >
                    <option :key="s.id" :value="s" v-for="s in baselineScenarioOptions">{{ s.name }}</option>
                </select>
            </div>
        </div>
        <div class="divider"><i class="far fa-caret-right"></i></div>
        <div class="part">
            <div class="form-group">
                <label for="newWorksheet">New scenario's worksheet</label>
                <select
                    :class="{
                        'has-error dont-touch has-error-in-source-of-business': validation.hasError('newWorksheet')
                    }"
                    class="form-control"
                    id="newWorksheet"
                    v-bind="{ validation }"
                    v-model="newWorksheet"
                    v-on="{ change: chooseOnSelect ? onChoose : onNone }"
                >
                    <option :key="w.id" :value="w" v-for="w in whatIfWorksheets">{{ w.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newScenario">New scenario</label>
                <select
                    :class="{
                        'has-error dont-touch has-error-in-source-of-business': validation.hasError('newScenario')
                    }"
                    class="form-control"
                    id="newScenario"
                    v-bind="{ validation }"
                    v-model="newScenario"
                    v-on="{ change: chooseOnSelect ? onChoose : onNone }"
                >
                    <option :key="s.id" :value="s" v-for="s in newScenarioOptions">{{ s.name }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    import {WHAT_IF} from "@/components/simulations/worksheet-types";
    import validators from "@/components/simulations/validators/source-of-business-worksheet";

    export default {
        name: "choose-source-of-business",
        props: ["worksheets", "scenario", "chooseOnSelect"],
        data: function () {
            return {
                newScenarioId: null,
                newWorksheetId: null,
                baselineScenarioId: null,
                baselineWorksheetId: null
            };
        },
        computed: {
            newWorksheet: {
                get() {
                    return this.whatIfWorksheets.find(w => w.id === this.newWorksheetId) || null;
                },
                set(value) {
                    this.newWorksheetId = value && value.id;
                }
            },
            newScenario: {
                get() {
                    return this.newScenarioOptions.find(s => s.id === this.newScenarioId) || null;
                },
                set(value) {
                    this.newScenarioId = value && value.id;
                }
            },
            baselineWorksheet: {
                get() {
                    return this.whatIfWorksheets.find(w => w.id === this.baselineWorksheetId) || null;
                },
                set(value) {
                    this.baselineWorksheetId = value && value.id;
                }
            },
            baselineScenario: {
                get() {
                    return this.baselineScenarioOptions.find(s => s.id === this.baselineScenarioId) || null;
                },
                set(value) {
                    this.baselineScenarioId = value && value.id;
                }
            },
            whatIfWorksheets() {
                return this.worksheets.filter(w => w.type === WHAT_IF);
            },
            newScenarioOptions() {
                if (!this.newWorksheetId) return [];
                if (!this.newWorksheet) return [];
                const scenarios = this.newWorksheet.scenarios;
                return this.baselineScenarioId ? scenarios.filter(s => s.id !== this.baselineScenarioId) : scenarios;
            },
            baselineScenarioOptions() {
                if (!this.baselineWorksheetId) return [];
                if (!this.baselineWorksheet) return [];
                const scenarios = this.baselineWorksheet.scenarios;
                return this.newScenarioId ? scenarios.filter(s => s.id !== this.newScenarioId) : scenarios;
            }
        },
        methods: {
            init() {
                const newWorksheetId = this.scenario && this.scenario.newWorksheetId;
                this.newWorksheetId =
                    this.whatIfWorksheets.filter(w => w.id === newWorksheetId).length !== 0 ? newWorksheetId : null;
                const baselineWorksheetId = this.scenario && this.scenario.baselineWorksheetId;
                this.baselineWorksheetId =
                    this.whatIfWorksheets.filter(w => w.id === baselineWorksheetId).length !== 0
                        ? baselineWorksheetId
                        : null;
                const newScenarioId = this.scenario && this.scenario.newScenarioId;
                this.newScenarioId = this.newScenarioOptions.filter(o => o.id === newScenarioId) ? newScenarioId : null;
                let baselineScenarioId = this.scenario && this.scenario.baselineScenarioId;
                this.baselineScenarioId = this.baselineScenarioOptions.filter(o => o.id === baselineScenarioId)
                    ? baselineScenarioId
                    : null;
            },
            onChoose() {
                const vm = this;
                vm.$validate().then((valid) => {
                        if (valid) {
                            vm.$emit("choose", {
                                newWorksheetId: vm.newWorksheetId,
                                newScenario: vm.newScenario,
                                baselineWorksheetId: vm.baselineWorksheetId,
                                baselineScenario: vm.baselineScenario
                            });
                        }
                    }
                );
            },
            onNone() { /*this.$validate();*/}
        },
        mounted: function () {
            this.init();
            this.$watch("$props", this.init, {deep: true});
        },
        validators
    };
</script>

<style lang="scss" scoped>
    .parts {
        display: flex;

        .part {
            flex-grow: 1;
        }

        .divider {
            display: flex;
            align-items: center;
            padding-right: 5px;
            padding-left: 5px;
        }
    }
</style>
