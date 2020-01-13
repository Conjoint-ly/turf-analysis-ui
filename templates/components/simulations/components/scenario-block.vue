<template>
    <div>
        <!-- todo separate by components -->
        <div class="table table-responsive">
            <table class="report-table">
                <thead>
                <tr>
                    <th title="Names of concepts">Name</th>
                    <th :key="attribute.name" v-for="attribute in attributes">{{ attribute.name }}</th>
                    <th v-show="showRelativeAvailable">
                        Relative availability
                        <a
                            @click.prevent="onResetConceptsAvailability"
                            class="btn btn-xs btn-primary"
                            href="#"
                            title="Reset relative availability"
                        >
                            Reset
                        </a>
                    </th>
                </tr>
                </thead>

                <draggable
                    :stop-propagation="true"
                    :value="scenario.concepts"
                    @input="onUpdateConcepts"
                    tag="tbody"
                    v-bind="{
                        disabled: processing,
                        handle: '.concept-drag-handle',
                        animation: 150,
                        group: 'scenario-' + scenario.id + '-concepts',
                        forceFallback: true
                    }"
                >
                    <tr :key="concept.id" v-for="(concept, conceptIndex) in scenario.concepts">
                        <td>
                            <div class="input-group">
                                <concept-name
                                    :concept="concept"
                                    :concept-index="conceptIndex"
                                    :concepts-names="conceptsNames"
                                    :name="conceptAttrName(concept)"
                                ></concept-name>
                                <colorpicker
                                    :color="concept.color"
                                    :key="concept.id"
                                    :value="concept.color"
                                    @input="onSetConceptColor(concept)($event)"
                                    title="Click to change colour of this concept"
                                ></colorpicker>
                                <div class="input-group-btn">
                                    <button
                                        :disabled="scenario.concepts.length === 1 || processing"
                                        @click="onDeleteConcept(conceptIndex)"
                                        class="btn btn-default"
                                        title="Remove this product construct"
                                        type="button"
                                    >
                                        <i class="far fa-minus-circle fa-fw"></i>
                                    </button>
                                    <button
                                        :disabled="processing"
                                        class="concept-drag-handle btn btn-default"
                                        title="Drag and drop to re-order concepts"
                                        type="button"
                                        v-show="scenario.concepts.length > 1 && showAdvancedSettings"
                                    >
                                        <i class="far fa-arrows fa-fw"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td :key="attribute.id" v-for="attribute in attributes">
                            <attribute
                                :attribute="attribute"
                                :brand-attribute="brandAttribute"
                                :concept="concept"
                                :concept-index="conceptIndex"
                                @copy-scenario-with-other-levels="onCopyScenarioWithOtherLevels"
                            ></attribute>
                        </td>
                        <td v-show="showRelativeAvailable">
                            <input-number-percentage :key="concept.id" v-model="concept.relativeAvailability"/>
                        </td>
                    </tr>
                </draggable>

                <tfoot>
                <tr v-if="scenario.none">
                    <td>
                        <div class="input-group">
                            <concept-name
                                :concept="scenario.none"
                                :concept-index="scenario.concepts.length"
                                :concepts-names="conceptsNames"
                                :name="conceptAttrName(scenario.none)"
                            ></concept-name>
                            <colorpicker
                                :color="scenario.none.color"
                                :key="scenario.id"
                                :value="scenario.none.color"
                                @input="onSetConceptColor(scenario.none)($event)"
                            ></colorpicker>
                            <span class="input-group-addon"><i class="far fa-fw"></i></span>
                        </div>
                    </td>
                    <td :key="attribute.id" v-for="attribute in attributes"></td>
                    <td v-show="showRelativeAvailable">
                        <input-number-percentage
                            :key="scenario.none.id"
                            v-model="scenario.none.relativeAvailability"
                        />
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
        <div :class="[{ 'form-group-last': !showAdvancedSettings }]" class="form-group">
            <div class="col-md-12">
                <button @click="onCreateConcept" class="btn btn-default" type="button">
                    <i class="far fa-plus-circle"></i> Add one more concept
                </button>
                <button
                    @click="showAdvancedSettings = true"
                    class="go_to_element btn btn-default m-l-1"
                    data-go-to-element="hideAdvancedSettings"
                    type="button"
                    v-show="!showAdvancedSettings"
                >
                    <i class="far fa-eye fa-fw"></i> Show advanced settings
                </button>
                <button
                    @click="hideAdvancedSettings"
                    class="btn btn-default m-l-1"
                    type="button"
                    v-show="showAdvancedSettings"
                >
                    <i class="far fa-trash fa-fw"></i> Remove advanced settings
                </button>
            </div>
        </div>
        <div id="hideAdvancedSettings"></div>
        <div v-show="showAdvancedSettings">
            <hr/>
            <div class="form-group">
                <label class="col-md-2 control-label">Type of product</label>
                <div class="col-md-10">
                    <select class="form-control" v-model="productType">
                        <option selected value="sop">
                            Low-risk or frequently purchased product: FMCG, software, etc. (appropriate in most cases)
                        </option>
                        <option value="fc">
                            High-risk or seldomly purchased product: education, life insurance, pension plans, etc.
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">Segment</label>
                <div class="col-md-10">
                    <select class="form-control" v-model.number="segment">
                        <option value="0">All responses</option>
                        <option :key="segmentOption.id" :value="segmentOption.id" v-for="segmentOption in segments">
                            {{ segmentOption.name }}
                        </option>
                    </select>
                    <p class="help-block">
                        You can
                        <a class="go_to_element" data-go-to-element="segment_hr" href="#">set up segments</a> based on
                        respondents' profile and answers to additional questions.
                    </p>
                </div>
            </div>
            <div class="form-group" v-if="brandAttribute !== false || attributes.length === 1">
                <label class="col-md-2 control-label">
                    Set concept names to match
                    {{ brandAttribute !== false ? "brand names" : "single attribute level value" }}
                </label>
                <div class="col-md-10">
                    <button @click="onCopyToNames" class="btn btn-default" type="button">
                        <i class="far fa-signature"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">Market share adjustments</label>
                <div class="col-md-10">
                    <button @click="showAdjustmentModal = !showAdjustmentModal" class="btn btn-default" type="button">
                        <i class="far fa-window fa-fw"></i> Set up availability adjustments
                    </button>
                    <p class="help-block">
                        This is an advanced feature that allows you to adjust preference shares for marketplace
                        availability based on observed volume shares shares.
                        <a
                            class="btn btn-default btn-xs"
                            href="https://conjoint.online/2019/08/25/availability-adjustment-for-preference-shares/"
                            rel="noopener noreferrer"
                            target="_blank"
                            type="button"
                        >
                            <i aria-hidden="true" class="far fa-question-circle"></i>
                        </a>
                    </p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">Check sensitivity to removal of concepts</label>
                <div class="col-md-10">
                    <div class="input-group">
                        <span class="input-group-addon">1 through to </span>
                        <input
                            :max="scenario.concepts.length"
                            class="form-control"
                            min="1"
                            placeholder="Concept count"
                            type="number"
                            v-model.number="conceptCountToCopyWithoutFirstConcept"
                        />
                        <div class="input-group-btn">
                            <button @click="onCopyWithoutFirstConcept" class="btn btn-default" type="button">
                                <i class="far fa-sort-amount-down"></i> Check
                            </button>
                        </div>
                    </div>
                    <p class="help-block">
                        Specify several concepts starting from concept 1. This function will check sensitivity to
                        removal of each of these concepts.
                    </p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">Check sensitivity to inclusion of only one concept</label>
                <div class="col-md-10">
                    <div class="input-group">
                        <span class="input-group-addon">1 through to </span>
                        <input
                            :max="scenario.concepts.length"
                            class="form-control"
                            min="1"
                            placeholder="Concept count"
                            type="number"
                            v-model.number="conceptCountToCopyWithRotating"
                        />
                        <div class="input-group-btn">
                            <button @click="onCopyWithRotating" class="btn btn-default" type="button">
                                <i class="far fa-sort-amount-up"></i> Check
                            </button>
                        </div>
                    </div>
                    <p class="help-block">
                        Specify several concepts starting from concept 1. This function will check sensitivity to
                        inclusion of only one of each of these concepts in the simulation (and exclusion of all others
                        in the range).
                    </p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label"
                >Enable segmentation based on preferences for concepts in this scenario</label
                >
                <div class="col-md-10">
                    <button :disabled="isSegregating" @click="onSegregate" class="btn btn-default" type="button">
                        <span v-if="isSegregating"><i class="far fa-spinner fa-spin"></i> Segregating...</span>
                        <span v-else><i class="far fa-divide fa-fw"></i> Segregate</span>
                    </button>
                    <p class="help-block">
                        This functionality adds a variable based on preferences for concepts in this scenario. Once it's
                        added, you can
                        <a class="go_to_element" data-go-to-element="segment_hr" href="#">set up segments</a> based on
                        this variable.
                    </p>
                </div>
            </div>
            <div class="form-group form-group-last">
                <label class="col-md-2 control-label">Investigate source of business</label>
                <div class="col-md-10">
                    <button @click="onInvestigateSourceOfBusiness" class="btn btn-default" type="button">
                        <span><i class="far fa-exchange"></i> Investigate source of business</span>
                    </button>
                    <p class="help-block">
                        Investigate source of business
                    </p>
                </div>
            </div>
        </div>
        <market-share-adjustment
            :scenario="scenario"
            :show-modal="showAdjustmentModal"
            @onSyncScenario="onSyncScenario"
        />
        <choose-source-of-business-modal
            :scenario="{
                newWorksheetId: this.worksheetId,
                newScenarioId: this.scenario.id,
                baselineWorksheetId: this.worksheetId,
                baselineScenarioId: null
            }"
            :show-modal="showChooseSourceOfBusiness"
            :worksheets="worksheets"
            @choose="onChooseSourceOfBusiness"
            @close="showChooseSourceOfBusiness = false"
        ></choose-source-of-business-modal>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import validate from "@/components/simulations/mixins/validate";
    import getValidators from "@/mixins/get-validators.js";
    import copy from "@/components/simulations/mixins/copy";
    import conceptName from "./concept-name";
    import colorpicker from "@/components/elements/colorpicker";
    import inputNumberPercentage from "@/components/elements/input-number-percentage";
    import marketShareAdjustment from "./market-share-adjustment";
    import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
    import Attribute from "@/components/simulations/components/attribute";
    import ChooseSourceOfBusinessModal from "@/components/simulations/components/choose-source-of-business-modal";

    export default {
        mixins: [copy, validate, getValidators],
        name: "scenario-block",
        components: {
            ChooseSourceOfBusinessModal,
            Attribute,
            draggable,
            conceptName,
            colorpicker,
            marketShareAdjustment,
            inputNumberPercentage
        },
        props: ["scenario", "worksheetId", "processing", "scenariosCount", "scenarioIndex"],
        data: function () {
            return {
                isSegregating: false,
                showAdjustmentModal: false,
                showChooseSourceOfBusiness: false,
                conceptCountToCopyWithoutFirstConcept: 1,
                conceptCountToCopyWithRotating: 1
            };
        },
        computed: {
            ...mapState({
                experimentId: state => state.simulations.Id,
                priceObject: state => state.simulations.priceObject,
                segments: state => state.segments.segments,
                worksheets: state => state.worksheets.worksheets
            }),
            ...mapGetters({
                attributes: "getAttributes",
                priceAttribute: "getPriceAttribute",
                brandAttribute: "getBrandAttribute",
                getShowAdvancedSettings: "getShowAdvancedSettings",
                getShowRelativeAvailable: "getShowRelativeAvailable",
                getScenarioField: "getScenarioField",
                getConceptsNames: "getConceptsNames"
            }),
            showRelativeAvailable: function () {
                return this.scenario && this.scenario.concepts && this.getShowRelativeAvailable(this.scenario);
            },
            productType: {
                get: function () {
                    return this.getScenarioField(this.worksheetId, this.scenario.id, "productType") || "sop";
                },
                set: function (value) {
                    const vm = this;
                    this.setScenarioField({
                        worksheetId: this.worksheetId,
                        scenarioId: this.scenario.id,
                        field: "productType",
                        value
                    }).then(() => {
                        vm.$emit("set-scenario-field", {
                            scenarioId: vm.scenario.id,
                            worksheetId: vm.worksheetId,
                            field: "productType",
                            text: "product type"
                        });
                    });
                }
            },
            segment: {
                get: function () {
                    return this.getScenarioField(this.worksheetId, this.scenario.id, "segment") || 0;
                },
                set: function (value) {
                    const vm = this;
                    this.setScenarioField({
                        worksheetId: this.worksheetId,
                        scenarioId: this.scenario.id,
                        field: "segment",
                        value
                    }).then(() => {
                        vm.$emit("set-scenario-field", {
                            scenarioId: vm.scenario.id,
                            worksheetId: vm.worksheetId,
                            field: "segment",
                            text: "segment"
                        });
                    });
                }
            },
            showAdvancedSettings: {
                get: function () {
                    return this.getShowAdvancedSettings(this.scenario) || false;
                },
                set: function (value) {
                    return this.setShowAdvancedSettings({scenarioId: this.scenario.id, value});
                }
            },
            conceptsNames() {
                return this.getConceptsNames(this.worksheetId, this.scenario.id);
            }
        },
        methods: {
            ...mapMutations({
                setShowAdvancedSettings: "SET_SHOW_ADVANCED_SETTINGS",
                syncScenario: "SYNC_SCENARIO",
                deleteConcept: "DELETE_CONCEPT",
                resetConceptsAvailability: "RESET_CONCEPTS_AVAILABILITY",
                updateConcepts: "UPDATE_CONCEPTS",
                setConceptColor: "SET_CONCEPT_COLOR"
            }),
            ...mapActions([
                "copyWithoutFirstConcept",
                "copyWithRotating",
                "setScenarioField",
                "runSegregate",
                "copyConcept",
                "validateScenario",
                "copyBrandsToNames",
                "copySingleAttributeToNames",
                "addSourceOfBusinessWorksheet"
            ]),
            onSetConceptColor: function (concept) {
                const vm = this;
                return function (color) {
                    vm.setConceptColor({concept, color});
                };
            },
            conceptAttrName: function (concept, isNone) {
                return (isNone ? "none" : "concept") + concept.id + ".name";
            },
            hideAdvancedSettings: function () {
                this.showAdvancedSettings = false;
                this.productType = "sop";
                this.segment = 0;
                this.resetConceptsAvailability(this.scenario);
            },
            onCreateConcept: function () {
                this.copyConcept(this.scenario.concepts);
            },
            onDeleteConcept: function (conceptIndex) {
                this.deleteConcept({concepts: this.scenario.concepts, conceptIndex});
            },
            onCopyScenarioWithOtherLevels: function ({conceptIndex, attribute, levelValue}) {
                this.$emit("copy-scenario-with-other-levels", {
                    worksheetId: this.worksheetId,
                    scenarioId: this.scenario.id,
                    scenarioIndex: this.scenarioIndex,
                    conceptIndex,
                    attribute,
                    levelValue
                });
            },
            onCopyWithoutFirstConcept: function () {
                this.copyWithoutFirstConcept({
                    worksheetId: this.worksheetId,
                    scenario: this.scenario,
                    conceptCountToCopy: this.conceptCountToCopyWithoutFirstConcept
                });
            },
            onCopyWithRotating: function () {
                this.copyWithRotating({
                    worksheetId: this.worksheetId,
                    scenario: this.scenario,
                    conceptCountToCopy: this.conceptCountToCopyWithRotating
                });
            },
            onSegregate() {
                const vm = this;
                vm.isSegregating = true;
                window.clearNotifierTopic("run-segregate");
                this.validateScenario({scenario: this.scenario, worksheetId: this.worksheetId}).then(valid => {
                    if (valid) {
                        this.runSegregate({worksheetId: this.worksheetId, scenarioId: this.scenario.id}).then(() => {
                            window.newNotifier({
                                topic: "run-segregate",
                                type: "success",
                                message:
                                    "Segregation has been done. You can now segment this report by respondents' most preferred option in this scenario."
                            });
                        }).catch(error => {
                            window.newNotifier({
                                topic: "run-segregate",
                                type: "danger",
                                message: error
                            });
                        }).finally(function () {
                            vm.isSegregating = false;
                        });
                    }
                    Promise.resolve();
                }).catch(errorObject => {
                    vm.isSegregating = false;
                    window.newNotifier({
                        topic: "run-segregate",
                        message: `You have some validation errors in "${this.scenario.name}"`,
                        type: "danger"
                    });
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
            },
            onChooseSourceOfBusiness({newWorksheetId, newScenario, baselineWorksheetId, baselineScenario}) {
                const vm = this;
                vm.showChooseSourceOfBusiness = false;
                vm.$nextTick(() => {
                    vm.addSourceOfBusinessWorksheet({
                        name: `Source of business for ${newScenario.name}`,
                        scenarioName: "Source of business 1",
                        newWorksheetId,
                        newScenario,
                        baselineWorksheetId,
                        baselineScenario
                    });
                });
            },
            onInvestigateSourceOfBusiness() {
                this.showChooseSourceOfBusiness = true;
            },
            onSyncScenario(newScenario) {
                this.syncScenario({scenario: this.scenario, newScenario});
            },
            onResetConceptsAvailability() {
                this.resetConceptsAvailability(this.scenario);
            },
            onUpdateConcepts($event) {
                this.updateConcepts({scenario: this.scenario, concepts: $event});
            },
            onCopyToNames() {
                const notify = action => {
                    if (this.scenariosCount > 1)
                        window.newNotifier({
                            topic: `set-scenario-lockToBrand`,
                            type: "warning",
                            message: `Would you like to rename concepts in all scenarios? <a href="#"
                                class="btn btn-default btn-xs btn-adjust-concepts-names-to"
                                data-worksheet_id="${this.worksheetId}"
                                data-action="${action}"
                                >
                                <i class="far fa-wrench"></i> Rename in all scenarios</a>`
                        });
                };
                if (this.brandAttribute) {
                    this.copyBrandsToNames(this.scenario).then(() => {
                        notify("copyBrandsToNames");
                    });
                } else if (this.attributes.length === 1) {
                    this.copySingleAttributeToNames(this.scenario).then(() => {
                        notify("copySingleAttributeToNames");
                    });
                }
            }
        },
        updated: function () {
            const segmentIds = this.segments.map(segment => parseInt(segment.id));
            if (this.segment !== 0 && segmentIds.indexOf(parseInt(this.segment)) === -1) {
                this.segment = 0;
            }
        }
    };
</script>

<style lang="scss" scoped>
    div#hideAdvancedSettings {
        height: 0;
    }

    div.input-group {
        min-width: 200px;
        width: 100%;
    }

    table.report-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 2px;

        tr td {
            padding-right: 4px;
        }
    }

    /*fix for always spin in ie11*/
    .far:not(.fa-spin):not(.fa-pulse) {
        animation: none;
    }
</style>
