<template>
    <div class="worksheet-source-of-business">
        <div class="position-relative">
            <div @click="onRunSimulation" class="charts-overlay flex-container" v-show="isDirty">
                <div class="flex-margin">
                    <span v-if="processing"><i class="far fa-spinner fa-spin fa-fw"></i> Please wait...</span>
                    <span v-else><i class="far fa-server fa-fw"></i> Need to re-calculate included worksheets</span>
                </div>
            </div>
            <div class="charts">
                <div class="row">
                    <div class="col-md-12">
                        <movements-in-preference-share-chart
                            :data="movementsInPreferenceShareChartData(worksheet)"
                            @column-chart-select="onColumnChartSelect"
                            chart-type="ColumnChart"
                            ref="movementsPreferenceShareChart"
                        >
                        </movements-in-preference-share-chart>
                    </div>
                </div>
            </div>
        </div>
        <scenario-headers :processing="false" :show-advanced-settings="true" :worksheet="worksheet"></scenario-headers>
        <div class="form-horizontal">
            <div class="tab-content">
                <div class="form-group form-group-last">
                    <choose-source-of-business
                        :choose-on-select="true"
                        :scenario="currentScenario"
                        :worksheets="worksheets"
                        @choose="onChooseSourceOfBusiness"
                        ref="chooseSourceOfBusiness"
                    ></choose-source-of-business>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ScenarioHeaders from "@/components/simulations/components/scenario-headers";
    import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
    import ChooseSourceOfBusiness from "@/components/simulations/components/choose-source-of-business";
    import MovementsInPreferenceShareChart
        from "@/components/simulations/components/movements-in-preference-share-chart";

    export default {
        name: "worksheet-source-of-business",
        props: ["worksheet"],
        components: {MovementsInPreferenceShareChart, ChooseSourceOfBusiness, ScenarioHeaders},
        computed: {
            ...mapState({
                worksheets: state => state.worksheets.worksheets
            }),
            ...mapGetters({
                currentScenario: "getCurrentScenario",
                movementsInPreferenceShareChartData: "getMovementsInPreferenceShareChartData",
                isDirtyWorksheet: "isDirty",
                getProcessing: "getProcessing"
            }),
            processing() {
                return this.getProcessing(this.worksheet.id);
            },
            isDirty() {
                return this.isDirtyWorksheet(this.worksheet.id);
            }
        },
        methods: {
            ...mapActions(["hideConcept", "runSourceOfBusinessSimulation", "validateSourceOfBusinessWorksheet"]),
            ...mapMutations({
                changeSourceOfBusinessScenario: "CHANGE_SOURCE_OF_BUSINESS_SCENARIO",
                setCurrentScenario: "SET_CURRENT_SCENARIO"
            }),
            onRunSimulation() {
                const vm = this;
                window.clearNotifierTopic("run-simulation");
                this.validateSourceOfBusinessWorksheet(this.worksheet).then(valid => {
                    if (valid) {
                        this.runSourceOfBusinessSimulation(this.worksheet.id);
                    } else {
                        window.newNotifier({
                            topic: "run-simulation",
                            message: `You have some validation errors in ${this.worksheet.name} tab.`,
                            type: "danger"
                        });
                    }
                }).catch(errorObject => {
                    if (errorObject.invalidSourceOfBusinessScenario) {
                        vm.setCurrentScenario(errorObject.scenarioIndex);
                        vm.$nextTick(function () {
                            vm.showChooseSourceOfBusiness = true;
                        });
                    }
                    window.newNotifier({
                        topic: "run-simulation",
                        message: `You have some validation errors in ${this.worksheet.name} tab.`,
                        type: "danger"
                    });
                });
            },
            onChooseSourceOfBusiness({newWorksheetId, newScenario, baselineWorksheetId, baselineScenario}) {
                const vm = this;
                return new Promise(resolve => {
                    vm.changeSourceOfBusinessScenario({
                        scenario: vm.currentScenario,
                        newWorksheetId,
                        newScenario,
                        baselineWorksheetId,
                        baselineScenario
                    });
                    resolve();
                }).then(() => {
                    vm.$nextTick(() => {
                        // vm.onRunSimulation();
                    });
                });
            },
            onColumnChartSelect: function (color) {
                this.hideConcept({color, worksheetId: this.worksheet.id}).then(isApplyHide => {
                    if (isApplyHide && !window.notifierExists("concept-hidden")) {
                        window.Notifier(
                            "concept-hidden",
                            "warning",
                            "The concept you have clicked on is now hidden from the chart.",
                            null,
                            4000
                        );
                    }
                });
            }
        }
    };
</script>

<style scoped></style>
