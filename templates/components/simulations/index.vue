<template>
    <div class="tab-pane fade tab-pane-vue-google-charts" id="tabSimulations">
        <div class="alert alert-danger" role="alert" v-if="isMaxDiff">
            <i class="far fa-scarecrow"></i> Simulations on MaxDiff experiments produce highly indicative results.
            Please use choice-based conjoint for better measurement of preference shares.
        </div>
        <form :class="!saved ? 'dirty' : ''" action="#" id="simulationAreYouSureForm"></form>
        <div class="worksheet-wrapper">
            <div
                class="worksheet-list"
                style="width: 25%;"
                v-resize:right.percent.hideable="{ hiddenFlag: 'hiddenWorksheetList' }"
                v-show="!hiddenWorksheetList"
            >
                <draggable
                    :stop-propagation="true"
                    :value="worksheets"
                    @end="onWorksheetDropped"
                    @input="onUpdateWorksheets"
                    class="nav nav-pills nav-stacked"
                    direction="horizontal"
                    role="tablist"
                    tag="ul"
                    v-bind="{ handle: '.worksheet-drag-handle', animation: 150, forceFallback: true }"
                >
                    <worksheet-header
                        :is-active="currentWorksheetIndex === worksheetIndex"
                        :key="worksheet.id"
                        :processing="processing(worksheet.id)"
                        :worksheet="worksheet"
                        :worksheet-index="worksheetIndex"
                        :worksheetNamePlaceholder="worksheetNamePlaceholder"
                        :worksheets-count="worksheets.length"
                        :what-if-worksheets-count="whatIfWorksheetsCount"
                        v-for="(worksheet, worksheetIndex) in worksheets"
                        v-on:copy-worksheet="onCopyWorksheet"
                        v-on:delete-worksheet="onDeleteWorksheet"
                        v-on:select-worksheet="onSelectWorksheet"
                    >
                    </worksheet-header>
                </draggable>
            </div>
            <div :style="worksheetStyle" class="worksheet">
                <div class="form-pill">
                    <flexible-header>
                        <template v-slot:prepend></template>
                        <template v-slot:default>
                            <editable
                                :placeholder="worksheetNamePlaceholder"
                                :value="currentWorksheet.name"
                                @update="onUpdateWorksheetName"
                                ref="nameEditor"
                                title="Click to rename this worksheet"
                            ></editable>
                        </template>
                        <template v-slot:append>
                            <div class="btn-group btn-group-xs header-btn-group">
                                <show-worksheet-list-button v-model="hiddenWorksheetList"></show-worksheet-list-button>
                                <button
                                    @click="onShowAllConcepts"
                                    class="btn btn-primary btn-xs"
                                    type="button"
                                    v-if="isWhatIf && hiddenConcepts"
                                >
                                    <i class="far fa-eye"></i> Un-hide all concepts
                                </button>
                                <button
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    class="btn btn-xs btn-default"
                                    data-target="#exportMenu"
                                    data-toggle="dropdown"
                                    type="button"
                                >
                                    <i class="far fa-download fa-fw"></i> Export <span class="caret"></span>
                                </button>
                                <div id="exportMenu">
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li>
                                            <a
                                                @click.prevent="exportWorksheet"
                                                href="#"
                                                title="Export data"
                                                type="button"
                                            >
                                                Export data
                                            </a>
                                        </li>
                                        <li v-if="isWhatIf">
                                            <a
                                                @click.prevent="exportPreferenceShareAsPicture"
                                                href="#"
                                                title="Export preference share chart as picture"
                                                type="button"
                                            >
                                                Export preference share chart as picture
                                            </a>
                                        </li>
                                        <li v-if="isWhatIf && hasRevenue">
                                            <a
                                                @click.prevent="exportRevenueChartAsPicture"
                                                title="Export revenue chart as picture"
                                                type="button"
                                            >
                                                Export revenue chart as picture
                                            </a>
                                        </li>
                                        <li v-if="isSourceOfBusiness">
                                            <a
                                                @click.prevent="exportMovementsPreferenceShareAsPicture"
                                                href="#"
                                                title="Export movements preference share chart as picture"
                                                type="button"
                                            >
                                                Export movements preference share chart as picture
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    class="btn btn-xs btn-default"
                                    data-target="#revenueMenu"
                                    data-toggle="dropdown"
                                    type="button"
                                    v-if="isWhatIf"
                                >
                                    <i class="far fa-usd-circle fa-fw"></i> Revenue and profitability
                                    <span class="caret"></span>
                                </button>
                                <div id="revenueMenu">
                                    <ul class="dropdown-menu dropdown-menu-right" v-if="isWhatIf">
                                        <li>
                                            <a
                                                @click.prevent="setRevenue('DEFAULT')"
                                                href="#"
                                                title="Default revenue calculation"
                                                type="button"
                                            >
                                                Default revenue calculation
                                            </a>
                                        </li>
                                        <li
                                            :key="revenue.id"
                                            @click.prevent="setRevenue(revenue.id)"
                                            class="dropdown-anchor"
                                            v-for="revenue in revenues"
                                        >
                                            <flexible-header>
                                                <a :title="revenue.title" href="#" type="button">
                                                    {{ revenue.title || calculationNamePlaceholder }}
                                                </a>
                                                <template #append>
                                                    <div
                                                        class="btn-group btn-group-xs"
                                                        role="group"
                                                        style="display: flex"
                                                    >
                                                        <button
                                                            @click.prevent.stop="onChangeRevenue(revenue.id)"
                                                            class="btn btn-default btn-xs"
                                                        >
                                                            <i class="far fa-cog fa-fw"></i>
                                                        </button>
                                                        <button
                                                            @click.prevent.stop="onRemoveRevenue(revenue.id)"
                                                            class="btn btn-default btn-xs"
                                                        >
                                                            <i class="far fa-trash fa-fw"></i>
                                                        </button>
                                                    </div>
                                                </template>
                                            </flexible-header>
                                        </li>
                                        <li class="divider" role="separator"></li>
                                        <li>
                                            <a
                                                @click.prevent="onAddRevenue"
                                                href="#"
                                                title="Add new calculation"
                                                type="button"
                                            >
                                                <i class="far fa-plus-circle fa-fw"></i>
                                                Add new calculation
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    class="btn btn-default btn-xs"
                                    href="https://conjoint.online/guides/preference-share-simulation/"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    title="Learn more about simulations"
                                    type="button"
                                >
                                    <i aria-hidden="true" class="far fa-question-circle"></i>
                                </a>
                            </div>
                        </template>
                    </flexible-header>
                </div>
                <component
                    :is="'worksheet-' + currentWorksheet.type"
                    :worksheet="currentWorksheet"
                    ref="worksheet"
                ></component>
            </div>
        </div>
        <revenue-settings-modal
            :calculation-name-placeholder="calculationNamePlaceholder"
            :concepts="currentWorksheet.scenarios[0].concepts"
            :revenue="revenue"
            :show-modal="showRevenueSettingsModal"
            @close="showRevenueSettingsModal = false"
            @save="onRevenueSettingsSave"
            v-if="isWhatIf"
        >
        </revenue-settings-modal>
    </div>
</template>

<script>
    import $ from "jquery";
    import "../../../../assets/js/jquery.are-you-sure";
    import draggable from "vuedraggable";
    import WorksheetHeader from "./components/worksheet-header";
    import copy from "./mixins/copy";
    import validate from "./mixins/validate";
    import getValidators from "@/mixins/get-validators.js";
    import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
    import resize from "@/directives/resize";
    import editable from "@/elements/editable";
    import FlexibleHeader from "@/elements/flexible-header";
    import ShowWorksheetListButton from "@/components/simulations/components/show-worksheet-list-button";
    import exportService from "@/services/export";
    import {SOURCE_OF_BUSINESS, WHAT_IF} from "@/components/simulations/worksheet-types";
    import WorksheetWhatIf from "@/components/simulations/components/worksheet-what-if";
    import WorksheetSourceOfBusiness from "@/components/simulations/components/worksheet-source-of-business";
    import RevenueSettingsModal from "@/components/simulations/components/revenue-settings-modal";

    export default {
        mixins: [copy, validate, getValidators],
        name: "simulations",
        directives: {resize},
        components: {
            RevenueSettingsModal,
            WorksheetHeader,
            draggable,
            ShowWorksheetListButton,
            FlexibleHeader,
            editable,
            WorksheetWhatIf,
            WorksheetSourceOfBusiness
        },
        data: function () {
            return {
                worksheetNamePlaceholder: "Enter worksheet name...",
                scenarioNamePlaceholder: "Enter scenario name...",
                calculationNamePlaceholder: "Enter calculation name...",
                hiddenWorksheetList: false,
                hash: null,
                revenueId: "DEFAULT",
                showRevenueSettingsModal: false
            };
        },
        props: {
            experimentId: {type: Number, required: true},
            isMaxDiff: {type: Boolean, required: true},
            experimentType: {type: String, required: true},
            segments: {type: Array, required: true},
            attributes: {type: Array, required: true},
            // fixme here can be Array or Object
            applicability: {required: true},
            initWorksheets: {type: Array, required: true},
            csrfToken: {type: String, required: true},
            priceObject: {type: Object}
        },
        computed: {
            ...mapState({
                worksheets: state => state.worksheets.worksheets,
                saved: state => state.worksheets.saved
            }),
            ...mapGetters({
                currentWorksheet: "getCurrentWorksheet",
                currentWorksheetIndex: "getCurrentWorksheetIndex",
                worksheetByIndex: "getWorksheetByIndex",
                getProcessing: "getProcessing",
                hasHiddenConcepts: "hasHiddenConcepts",
                hasRevenueByWorksheetId: "getHasRevenueByWorksheetId",
                getForExportToCsv: "getForExportToCsv",
                getForExportSourceOfBusinessToCsv: "getForExportSourceOfBusinessToCsv",
                getRevenue: "getRevenue",
                getRevenues: "getRevenues"
            }),
            revenues() {
                return this.getRevenues(this.currentWorksheet.id);
            },
            revenue() {
                return this.getRevenue(this.currentWorksheet.id, this.revenueId);
            },
            whatIfWorksheetsCount() {
                return this.worksheets.filter(w=>w.type===WHAT_IF).length
            },
            isWhatIf() {
                return this.currentWorksheet.type === WHAT_IF;
            },
            isSourceOfBusiness() {
                return this.currentWorksheet.type === SOURCE_OF_BUSINESS;
            },
            processing() {
                return function (worksheetId) {
                    return this.getProcessing(worksheetId);
                };
            },
            worksheetStyle() {
                return {paddingLeft: this.hiddenWorksheetList ? 0 : 10 + "px"};
            },
            hiddenConcepts: function () {
                return this.currentWorksheet && this.isWhatIf && this.hasHiddenConcepts(this.currentWorksheet.id);
            },
            hasRevenue: function () {
                return this.hasRevenueByWorksheetId(this.currentWorksheet.id);
            }
        },
        created: function () {
            this.init({
                worksheets: this.initWorksheets,
                applicability: this.applicability,
                attributes: this.attributes,
                segments: this.segments,
                experimentId: this.experimentId,
                experimentType: this.experimentType,
                csrfToken: this.csrfToken,
                priceObject: this.priceObject
            });
        },
        mounted: function () {
            const vm = this;

            $(document).on("click", ".btn-save-worksheets", function () {
                vm.onSaveWorksheets($(this));
            });

            $(document).on("click", ".btn-adjust-scenarios-settings", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const $target = $(e.target);
                vm.onAdjustScenariosSettings({
                    worksheetId: String($target.data("worksheet_id")),
                    scenarioId: String($target.data("scenario_id")),
                    field: String($target.data("field"))
                });
            });

            $(document).on("click", ".btn-adjust-concepts-names-to", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const $target = $(e.target);
                vm.onAdjustConceptNamesTo({
                    worksheetId: String($target.data("worksheet_id")),
                    action: String($target.data("action"))
                });
            });

            // Ctrl+S for saving
            $(window).keydown(function (e) {
                if (e.ctrlKey || e.metaKey) {
                    switch (String.fromCharCode(e.which).toLowerCase()) {
                        case "s":
                            e.preventDefault();
                            vm.onSaveWorksheets($(".btn-save-worksheets"));
                            break;
                    }
                }
            });

            $("form#simulationAreYouSureForm").areYouSure();
        },
        methods: {
            ...mapActions([
                "init",
                "selectWorksheet",
                "deleteWorksheet",
                "copyWorksheetByIndex",
                "checkDirtyAndRunSimulation",
                "adjustScenariosSettings",
                "adjustConceptNamesTo",
                "saveWorksheets"
            ]),
            ...mapMutations({
                setCurrentWorksheet: "SET_CURRENT_WORKSHEET",
                updateWorksheets: "UPDATE_WORKSHEETS",
                showAllConcepts: "SHOW_ALL_CONCEPTS",
                setWorksheetName: "SET_WORKSHEET_NAME",
                setCurrentRevenueId: "SET_CURRENT_REVENUE_ID",
                addRevenueToWorksheet: "ADD_REVENUE_TO_WORKSHEET",
                changeRevenue: "CHANGE_REVENUE",
                removeRevenueFromWorksheet: "REMOVE_REVENUE_FROM_WORKSHEET"
            }),
            showWorksheetsSavingNotifier() {
                if (!window.notifierExists("simulations-save")) {
                    window.newNotifier({
                        topic: "simulations-save",
                        message: `Save your latest changes.<button type="button"  title="Press Ctrl+S to save" class="btn btn-default btn-xs btn-save-worksheets" style="margin-top: 10px" data-loading-text="<i class='far fa-spinner fa-spin'></i> Saving..."><i class="far fa-save fa-fw"></i> Save simulations </button>`,
                        type: "info",
                        hideClose: true
                    });
                }
            },
            hideWorksheetsSavingNotifier() {
                if (window.notifierExists("simulations-save")) {
                    window.clearNotifierTopic("simulations-save");
                }
            },
            setRevenue(revenueId) {
                this.revenueId = revenueId;
                this.setCurrentRevenueId({worksheetId: this.currentWorksheet.id, revenueId});
            },
            onAddRevenue() {
                this.setRevenue("DEFAULT");
                this.$nextTick(function () {
                    this.showRevenueSettingsModal = true;
                });
            },
            onChangeRevenue(revenueId) {
                this.setRevenue(revenueId);
                this.$nextTick(function () {
                    this.showRevenueSettingsModal = true;
                });
            },
            onRemoveRevenue(revenueId) {
                if (confirm("Are you sure?")) {
                    this.removeRevenueFromWorksheet({worksheetId: this.currentWorksheet.id, revenueId});
                    if (this.revenueId === revenueId) {
                        this.setRevenue("DEFAULT");
                    }
                }
            },
            onSaveWorksheets($btn) {
                const vm = this;
                vm.saveWorksheets($btn).catch(errorObject => {
                    vm.$nextTick(() =>
                        vm.validate().then(() => {
                            let field;
                            if (errorObject.invalidConceptNames) {
                                field = document.getElementsByClassName("has-error-concept-name")[0];
                            } else if (errorObject.invalidAttributes) {
                                field = document.getElementsByClassName("has-error-concept-attribute")[0];
                            } else if (errorObject.invalidSourceOfBusinessScenario) {
                                field = document.getElementsByClassName("has-error-in-source-of-business")[0];
                            }
                            if (field) {
                                field.focus();
                                field.scrollIntoView();
                            }
                        })
                    );
                });
            },
            onAdjustConceptNamesTo(payload) {
                this.adjustConceptNamesTo(payload).then(() => {
                    window.clearNotifierTopic("set-scenario-lockToBrand");
                });
            },
            onAdjustScenariosSettings(payload) {
                this.adjustScenariosSettings(payload).then(window.clearNotifierTopic(`set-scenario-${payload.field}`));
            },
            onUpdateWorksheets($event) {
                this.updateWorksheets({worksheets: $event});
            },
            onUpdateWorksheetName(name) {
                this.setWorksheetName({worksheet: this.currentWorksheet, name});
            },
            onSelectWorksheet(worksheetIndex) {
                this.selectWorksheet(worksheetIndex);
            },
            onRevenueSettingsSave({isNew, revenue, title, xAxisTitle, formulas}) {
                this.showRevenueSettingsModal = false;
                if (isNew) {
                    this.addRevenueToWorksheet({
                        worksheetId: this.currentWorksheet.id,
                        revenue: {title, xAxisTitle, formulas}
                    });
                } else {
                    this.changeRevenue({
                        worksheetId: this.currentWorksheet.id,
                        revenueId: revenue.id,
                        title,
                        xAxisTitle,
                        formulas
                    });
                }
            },
            onWorksheetDropped(e) {
                this.setCurrentWorksheet(e.newIndex);
            },
            onCopyWorksheet(worksheetIndex) {
                this.copyWorksheetByIndex(worksheetIndex);
            },
            async onDeleteWorksheet(index) {
                const worksheet = this.worksheets[index];
                if (confirm("Are you sure that you want to delete " + worksheet.name + "?")) {
                    if (this.worksheets.length > 1) {
                        await this.deleteWorksheet(index);
                    }
                }
            },
            onShowAllConcepts() {
                this.showAllConcepts(this.currentWorksheet.id);
            },
            exportPreferenceShareAsPicture() {
                const vm = this;
                vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
                    exportService.exportGGraphAsPicture(
                        //todo refactor?
                        vm.$refs.worksheet.$refs.simulatedPreferenceShareChart.getChartObject(),
                        (vm.currentWorksheet.name.trim() || "export") + ".png"
                    );
                });
            },
            exportMovementsPreferenceShareAsPicture() {
                const vm = this;
                vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
                    exportService.exportGGraphAsPicture(
                        //todo refactor?
                        vm.$refs.worksheet.$refs.movementsPreferenceShareChart.getChartObject(),
                        (vm.currentWorksheet.name.trim() || "export") + ".png"
                    );
                });
            },
            exportRevenueChartAsPicture() {
                const vm = this;
                vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
                    exportService.exportGGraphAsPicture(
                        // todo rafactor?
                        vm.$refs.worksheet.$refs.revenueChart.getChartObject(),
                        (vm.currentWorksheet.name.trim() || "export") + ".png"
                    );
                });
            },
            exportWorksheet: function () {
                const vm = this;
                vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
                    const table =
                        vm.currentWorksheet.type === WHAT_IF
                            ? vm.getForExportToCsv(vm.currentWorksheet.id)
                            : vm.getForExportSourceOfBusinessToCsv(vm.currentWorksheet.id);
                    window.exportToCsv("Experiment " + vm.experimentId + " - " + vm.currentWorksheet.name + ".csv",
                        table);
                });
            }
        },
        watch: {
            saved() {
                if (!this.saved) {
                    this.showWorksheetsSavingNotifier();
                } else {
                    this.hideWorksheetsSavingNotifier();
                }
            },
            hiddenWorksheetList() {
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
            },
            hiddenConcepts() {
                if (!this.hiddenConcepts) {
                    window.clearNotifierTopic("concept-hidden");
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #revenueMenu {
        ul {
            max-width: 600px;
        }
    }

    .worksheet-wrapper {
        > .worksheet-list {
            float: left;
            border-right: 1px solid #eee;
            padding-left: 0;
            padding-right: 10px;
        }

        > .worksheet {
            width: auto;
            overflow-x: hidden;
            -ms-overflow-x: hidden;
            padding-left: 10px;
            padding-right: 0;
        }
    }

    .header-btn-group {
        display: flex;
    }

    .form-pill {
        margin-bottom: 15px;
        padding: 9px 15px;
        border-radius: 4px;
        background: #eee;
        z-index: 10;
        box-shadow: 0 -1px 0 1px white;
    }
</style>

<style lang="scss">
    .worksheet {
        .row,
        .col-md-6,
        .col-md-12,
        .form-horizontal .form-group {
            padding-left: 0;
            padding-right: 0;
            margin-left: 0;
            margin-right: 0;
        }

        .form-pill {
            .editable-wrapper {
                span:hover {
                    background: #ddd;
                }
            }
        }

        .flexible-header-title {
            .editable-wrapper {
                span:not(.readonly),
                input {
                    height: 21px;
                }
            }
        }

        .dropdown-anchor {
            .flexible-header {
                padding: 3px 10px 3px 20px;

                .flexible-header-prepend-last {
                    margin-right: 0;
                }

                a {
                    text-decoration: none;
                    color: $dropdown-link-color;
                }

                &:hover,
                &:focus {
                    color: $dropdown-link-hover-color;
                    text-decoration: none;
                    background-color: $dropdown-link-hover-bg;
                }
            }
        }
    }
</style>
