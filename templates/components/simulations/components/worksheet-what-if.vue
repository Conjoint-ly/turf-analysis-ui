<template>
    <div class="worksheet-what-if">
        <div class="position-relative">
            <div @click="onRunSimulation" class="charts-overlay flex-container" v-show="isDirty">
                <div class="flex-margin">
                    <span v-if="processing"><i class="far fa-spinner fa-spin fa-fw"></i> Please wait...</span>
                    <span v-else><i class="far fa-server fa-fw"></i> Click to re-calculate</span>
                </div>
            </div>
            <div class="charts">
                <div class="row">
                    <div :class="[hasRevenue ? 'col-md-6' : 'col-md-12']">
                        <preference-share-chart
                            :chart-type="chartType"
                            :data="adjustedPreferenceShareChartData"
                            :elasticity-chart="elasticityChart"
                            :elasticity-chart-variable-concept="elasticityChartVariableConcept"
                            :scenarios="worksheet.scenarios"
                            @columnChartSelect="onColumnChartSelect"
                            ref="simulatedPreferenceShareChart"
                            v-if="elasticityChart !== undefined"
                        >
                        </preference-share-chart>
                    </div>
                    <div class="col-md-6">
                        <revenue-chart
                            :chart-type="chartType"
                            :data="revenueChartData"
                            :x-axis-title="revenue.xAxisTitle"
                            @columnChartSelect="onColumnChartSelect"
                            ref="revenueChart"
                            v-if="elasticityChart !== undefined"
                            v-show="hasRevenue"
                        />
                    </div>
                </div>
            </div>
        </div>
        <scenario-headers
            :processing="processing"
            :show-advanced-settings="showAdvancedSettings"
            :worksheet="worksheet"
        ></scenario-headers>
        <div class="form-horizontal">
            <div class="tab-content">
                <scenario-block
                    :processing="processing"
                    :scenario="currentScenario"
                    :scenarios-count="worksheet.scenarios.length"
                    :scenario-index="currentScenarioIndex"
                    :worksheet-id="worksheet.id"
                    @copy-scenario-with-other-levels="onCopyScenarioWithOtherLevels"
                    @set-scenario-field="onSetScenarioField"
                ></scenario-block>
            </div>
        </div>
    </div>
</template>

<script>
    import copy from "@/components/simulations/mixins/copy";
    import validate from "@/components/simulations/mixins/validate";
    import getValidators from "@/mixins/get-validators.js";
    import PreferenceShareChart from "./preference-share-chart";
    import RevenueChart from "./revenue-chart";
    import ScenarioBlock from "./scenario-block";
    import {mapActions, mapGetters, mapState} from "vuex";
    import ScenarioHeaders from "@/components/simulations/components/scenario-headers";

    export default {
        mixins: [copy, validate, getValidators],
        props: {
            worksheet: {Object, required: true}
        },
        components: {
            ScenarioHeaders,
            PreferenceShareChart,
            RevenueChart,
            ScenarioBlock
        },
        computed: {
            ...mapState({
                priceObject: state => state.simulations.priceObject,
                experimentId: state => state.simulations.experimentId,
                revenueId(state) {
                    return state.worksheets.currentRevenueIds[this.worksheet.id] || "DEFAULT";
                }
            }),
            ...mapGetters({
                hasRevenueByWorksheetId: "getHasRevenueByWorksheetId",
                getWorksheetElasticityChart: "getWorksheetElasticityChart",
                getWorksheetElasticityChartVariableConcept: "getWorksheetElasticityChartVariableConcept",
                getChartData: "getChartData",
                getRevenueChartData: "getRevenueChartData",
                currentScenario: "getCurrentScenario",
                currentScenarioIndex: "getCurrentScenarioIndex",
                isDirtyWorksheet: "isDirty",
                getProcessing: "getProcessing",
                hasDifferentFieldInScenarios: "hasDifferentFieldInScenarios",
                getShowAdvancedSettings: "getShowAdvancedSettings",
                getRevenue: "getRevenue"
            }),
            revenue() {
                return this.getRevenue(this.worksheet.id, this.revenueId);
            },
            showAdvancedSettings() {
                return this.getShowAdvancedSettings(this.currentScenario);
            },
            processing() {
                return this.getProcessing(this.worksheet.id);
            },
            hasRevenue() {
                return this.hasRevenueByWorksheetId(this.worksheet.id);
            },
            elasticityChart() {
                return this.getWorksheetElasticityChart(this.worksheet.id);
            },
            elasticityChartVariableConcept() {
                return this.getWorksheetElasticityChartVariableConcept(this.worksheet.id);
            },
            chartType() {
                return this.elasticityChart ? "AreaChart" : "ColumnChart";
            },
            adjustedPreferenceShareChartData() {
                return this.getChartData({worksheetId: this.worksheet.id, field: "adjustedPreferenceShare"});
            },
            revenueChartData() {
                return this.getRevenueChartData({worksheetId: this.worksheet.id, formulas: this.revenue.formulas});
            },
            scenarioCount() {
                return this.worksheet.scenarios.length;
            },
            isDirty() {
                return this.isDirtyWorksheet(this.worksheet.id);
            }
        },
        methods: {
            ...mapActions([
                "hideConcept",
                "copyScenarioWithOtherLevels",
                "validateWorksheet",
                "runSimulation",
                "selectScenario"
            ]),
            onRunSimulation() {
                window.clearNotifierTopic("run-simulation");
                this.validateWorksheet(this.worksheet).then(valid => {
                    if (valid) {
                        this.runSimulation(this.worksheet.id);
                    } else {
                        window.newNotifier({
                            topic: "run-simulation",
                            message: `You have some validation errors in ${this.worksheet.name} tab.`,
                            type: "danger"
                        });
                    }
                }).catch(errorObject => {
                    this.selectScenario(errorObject.scenarioIndex).then(() => {
                        const vm = this;
                        vm.$nextTick(() =>
                            vm.validate().then(() => {
                                let field;
                                if (errorObject.invalidConceptNames) {
                                    field = document.getElementsByClassName("has-error-concept-name")[0];
                                } else if (errorObject.invalidAttributes) {
                                    field = document.getElementsByClassName("has-error-concept-attribute")[0];
                                }
                                if (field) {
                                    field.focus();
                                    field.scrollIntoView();
                                }
                            })
                        );
                    });
                    window.newNotifier({
                        topic: "run-simulation",
                        message: `You have some validation errors in ${this.worksheet.name} tab.`,
                        type: "danger"
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
            },
            onCopyScenarioWithOtherLevels({scenarioId, scenarioIndex, conceptIndex, attribute, levelValue}) {
                this.copyScenarioWithOtherLevels({
                    worksheet: this.worksheet,
                    scenarioId,
                    scenarioIndex,
                    conceptIndex,
                    attribute,
                    levelValue
                });
            },
            onSetScenarioField({scenarioId, field, text}) {
                const worksheetId = this.worksheet.id;
                if (this.hasDifferentFieldInScenarios({worksheetId, field})) {
                    window.newNotifier({
                        topic: `set-scenario-${field}`,
                        type: "warning",
                        message: `Worksheet has a different ${text} across its scenarios. <a href="#"
                                class="btn btn-default btn-xs btn-adjust-scenarios-settings"
                                data-worksheet_id="${worksheetId}"
                                data-scenario_id="${scenarioId}"
                                data-field="${field}"
                                >
                                <i class="far fa-wrench"></i> Standardise settings</a>
`
                    });
                } else {
                    window.clearNotifierTopic(`set-scenario-${field}`);
                }
            }
        },
        watch: {
            hasRevenue: function () {
                if (typeof Event === "function") {
                    // modern browsers
                    window.dispatchEvent(new Event("resize"));
                } else {
                    // for IE and other old browsers
                    // causes deprecation warning on modern browsers
                    const evt = window.document.createEvent("UIEvents");
                    evt.initUIEvent("resize", true, false, window, 0);
                    window.dispatchEvent(evt);
                }
            }
        }
    };
</script>

<style scoped>
    .charts {
        min-height: 400px;
    }
</style>
