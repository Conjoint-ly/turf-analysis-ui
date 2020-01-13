<template>
    <div aria-hidden="true" class="modal modal-xl-important fade" ref="adjustmentModal" role="dialog" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" class="close" data-dismiss="modal" type="button">&times;</button>
                <h4 class="modal-title">Availability adjustment</h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning" v-if="scenario_.concepts.length > 20">
                    <i class="far fa-exclamation-triangle"></i> Availability adjustment is <b>not recommended</b> for
                    simulations with over 20 concepts.
                </div>
                <div class="table-responsive">
                    <table class="reportTable" style="width: 100%;">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Simulated preference shares</th>
                            <th>Observed volume share</th>
                            <th>Relative availability (adjustment factor)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr :key="concept.id" v-for="concept in scenario_.concepts">
                            <td>{{ concept.name }}</td>
                            <td>
                                <input-number-percentage
                                    :disabled="true"
                                    :value="concept.simulatedPreferenceShare"
                                />
                            </td>
                            <td>
                                <input-number-percentage v-model="concept.actualMarketShare"/>
                            </td>
                            <td>
                                <input-number-percentage v-model="concept.relativeAvailability"/>
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
                                <input-number-percentage v-model="scenario_.none.actualMarketShare"/>
                            </td>
                            <td>
                                <input-number-percentage v-model="scenario_.none.relativeAvailability"/>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <hr/>
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
                    <button class="btn btn-default" data-dismiss="modal" type="button">Close</button>
                </div>
                <button
                    @click="runAvailability"
                    class="btn btn-primary"
                    data-loading-text="<i class='far fa-spinner fa-spin fa-fw'></i> Calculating..."
                    ref="calculateRelativeAvailability"
                    type="button"
                >
                    <i class="far fa-upload"></i> Calculate
                </button>
                <button @click="applyAdjustment" class="btn btn-success" type="button">
                    <i class="far fa-check"></i> Apply
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from "jquery";
    import copy from "@/components/simulations/mixins/copy";
    import inputNumberPercentage from "@/components/elements/input-number-percentage";
    import {mapState} from "vuex";

    export default {
        mixins: [copy],
        name: "market-share-adjustment",
        props: ["scenario", "showModal"],
        components: {inputNumberPercentage},
        data: function () {
            return {
                scenario_: null
            };
        },
        delimiters: ["${", "}"],
        template: "#market-share-adjustment",
        created: function () {
            this.syncScenario();
        },
        computed: {
            ...mapState({
                experimentId: state => state.simulations.experimentId,
                csrfToken: state => state.simulations.csrfToken
            }),
            totalSimulatedPreferenceShare: function () {
                let result = 0.0;
                for (let i = 0; i < this.scenario_.concepts.length; i++) {
                    result += this.scenario_.concepts[i].simulatedPreferenceShare || 0;
                }
                if (this.scenario_.none) {
                    result += this.scenario_.none.simulatedPreferenceShare || 0;
                }
                return Math.round(result * 10000) / 100;
            },
            totalActualMarketShare: function () {
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
                get: function () {
                    const scenario = this.copy(this.scenario_);
                    const scenario_ = {
                        concepts: []
                    };

                    scenario.concepts.forEach(function (concept) {
                        scenario_.concepts.push({
                            simulatedPreferenceShare: concept.simulatedPreferenceShare,
                            actualMarketShare: concept.actualMarketShare
                        });
                    });

                    if (scenario.none) {
                        scenario_.none = {
                            simulatedPreferenceShare: scenario.none.simulatedPreferenceShare,
                            actualMarketShare: scenario.none.actualMarketShare
                        };
                    }

                    return scenario_;
                },
                set: function (data) {
                    const vm = this;
                    data.concepts.forEach(function (_concept, j) {
                        const concept = vm.scenario_.concepts[j];
                        concept.relativeAvailability = parseFloat(_concept.relativeAvailability);
                    });
                    if (data.none) {
                        vm.scenario_.none.relativeAvailability = parseFloat(data.none.relativeAvailability);
                    }
                }
            }
        },
        methods: {
            syncScenario: function (up) {
                if (up) {
                    this.$emit("onSyncScenario", this.copy(this.scenario_));
                } else {
                    this.scenario_ = this.copy(this.scenario);
                }
            },
            applyAdjustment: function () {
                $(this.$refs.adjustmentModal).modal("hide");
                this.$parent.applyAdjustmentStatus = true;
                this.syncScenario(true);
            },
            runAvailability: function () {
                const vm = this;
                const $btn = $(vm.$refs.calculateRelativeAvailability).button("loading");
                const data = this.copy(vm.scenarioData, true);
                data["csrf_token"] = vm.csrfToken;

                $.post(
                    "/reports/" + vm.experimentId + "/run-availability/",
                    data,
                    function (response) {
                        window.clearNotifierTopic("run-availability");
                        vm.scenarioData = response;
                    },
                    "json"
                ).fail(function (jqXHR) {
                    window.newNotifier({topic: "run-availability", type: "danger", message: jqXHR.responseText});
                    // console.log("ERROR: " + textStatus);
                }).always(function () {
                    $btn.button("reset");
                });
            }
        },
        watch: {
            showModal: function () {
                this.syncScenario();
                $(this.$refs.adjustmentModal).modal("show");
            }
        }
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
