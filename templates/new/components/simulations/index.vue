<template>
  <div id="tabSimulations" class="tab-pane fade tab-pane-vue-google-charts">
    <div v-if="isMaxDiff" class="alert alert-danger" role="alert">
      <i class="far fa-scarecrow" /> Simulations on MaxDiff experiments produce highly indicative results.
      Please use choice-based conjoint for better measurement of preference shares.
    </div>
    <form id="simulationAreYouSureForm" :class="!saved ? 'dirty' : ''" action="#" />
    <div class="worksheet-wrapper">
      <div
        v-show="!hiddenWorksheetList"
        v-resize:right.percent.hideable="{ hiddenFlag: 'hiddenWorksheetList' }"
        class="worksheet-list"
        style="width: 25%;"
      >
        <draggable
          :stop-propagation="true"
          :value="worksheets"
          class="nav nav-pills nav-stacked"
          direction="horizontal"
          role="tablist"
          tag="ul"
          v-bind="{ handle: '.worksheet-drag-handle', animation: 150, forceFallback: true }"
          @end="onWorksheetDropped"
          @input="onUpdateWorksheets"
        >
          <worksheet-header
            v-for="(worksheet, worksheetIndex) in worksheets"
            :key="worksheet.id"
            :is-active="currentWorksheetIndex === worksheetIndex"
            :processing="processing(worksheet.id)"
            :worksheet="worksheet"
            :worksheet-index="worksheetIndex"
            :worksheet-name-placeholder="worksheetNamePlaceholder"
            :worksheets-count="worksheets.length"
            :what-if-worksheets-count="whatIfWorksheetsCount"
            @copy-worksheet="onCopyWorksheet"
            @delete-worksheet="onDeleteWorksheet"
            @select-worksheet="onSelectWorksheet"
          />
        </draggable>
      </div>
      <div :style="worksheetStyle" class="worksheet">
        <div class="form-pill">
          <flexible-header>
            <template v-slot:prepend />
            <template v-slot:default>
              <editable
                ref="nameEditor"
                :placeholder="worksheetNamePlaceholder"
                :value="currentWorksheet.name"
                title="Click to rename this worksheet"
                @update="onUpdateWorksheetName"
              />
            </template>
            <template v-slot:append>
              <div class="btn-group btn-group-xs header-btn-group">
                <show-worksheet-list-button v-model="hiddenWorksheetList" />
                <button
                  v-if="isWhatIf && hiddenConcepts"
                  class="btn btn-primary btn-xs"
                  type="button"
                  @click="onShowAllConcepts"
                >
                  <i class="far fa-eye" /> Un-hide all concepts
                </button>
                <button
                  aria-expanded="false"
                  aria-haspopup="true"
                  class="btn btn-xs btn-default"
                  data-target="#exportMenu"
                  data-toggle="dropdown"
                  type="button"
                >
                  <i class="far fa-download fa-fw" /> Export <span class="caret" />
                </button>
                <div id="exportMenu">
                  <ul class="dropdown-menu dropdown-menu-right">
                    <li>
                      <a
                        href="#"
                        title="Export data"
                        type="button"
                        @click.prevent="exportWorksheet"
                      >
                        Export data
                      </a>
                    </li>
                    <li v-if="isWhatIf">
                      <a
                        href="#"
                        title="Export preference share chart as picture"
                        type="button"
                        @click.prevent="exportPreferenceShareAsPicture"
                      >
                        Export preference share chart as picture
                      </a>
                    </li>
                    <li v-if="isWhatIf && hasRevenue">
                      <a
                        title="Export revenue chart as picture"
                        type="button"
                        @click.prevent="exportRevenueChartAsPicture"
                      >
                        Export revenue chart as picture
                      </a>
                    </li>
                    <li v-if="isSourceOfBusiness">
                      <a
                        href="#"
                        title="Export movements preference share chart as picture"
                        type="button"
                        @click.prevent="exportMovementsPreferenceShareAsPicture"
                      >
                        Export movements preference share chart as picture
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  v-if="isWhatIf"
                  aria-expanded="false"
                  aria-haspopup="true"
                  class="btn btn-xs btn-default"
                  data-target="#revenueMenu"
                  data-toggle="dropdown"
                  type="button"
                >
                  <i class="far fa-usd-circle fa-fw" /> Revenue and profitability
                  <span class="caret" />
                </button>
                <div id="revenueMenu">
                  <ul v-if="isWhatIf" class="dropdown-menu dropdown-menu-right">
                    <li>
                      <a
                        href="#"
                        title="Default revenue calculation"
                        type="button"
                        @click.prevent="setRevenue('DEFAULT')"
                      >
                        Default revenue calculation
                      </a>
                    </li>
                    <li
                      v-for="revenue in revenues"
                      :key="revenue.id"
                      class="dropdown-anchor"
                      @click.prevent="setRevenue(revenue.id)"
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
                              class="btn btn-default btn-xs"
                              @click.prevent.stop="onChangeRevenue(revenue.id)"
                            >
                              <i class="far fa-cog fa-fw" />
                            </button>
                            <button
                              class="btn btn-default btn-xs"
                              @click.prevent.stop="onRemoveRevenue(revenue.id)"
                            >
                              <i class="far fa-trash fa-fw" />
                            </button>
                          </div>
                        </template>
                      </flexible-header>
                    </li>
                    <li class="divider" role="separator" />
                    <li>
                      <a
                        href="#"
                        title="Add new calculation"
                        type="button"
                        @click.prevent="onAddRevenue"
                      >
                        <i class="far fa-plus-circle fa-fw" />
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
                  <i aria-hidden="true" class="far fa-question-circle" />
                </a>
              </div>
            </template>
          </flexible-header>
        </div>
        <component
          :is="'worksheet-' + currentWorksheet.type"
          ref="worksheet"
          :worksheet="currentWorksheet"
        />
      </div>
    </div>
    <revenue-settings-modal
      v-if="isWhatIf"
      :calculation-name-placeholder="calculationNamePlaceholder"
      :concepts="currentWorksheet.scenarios[0].concepts"
      :revenue="revenue"
      :show-modal="showRevenueSettingsModal"
      @close="showRevenueSettingsModal = false"
      @save="onRevenueSettingsSave"
    />
  </div>
</template>

<script>
import $ from 'jquery';
import draggable from 'vuedraggable';
import getValidators from '@conjointly/turf-analysis-ui/templates/new/mixins/get-validators.js';
import {
  mapActions, mapGetters, mapMutations, mapState,
} from 'vuex';
import resize from '@conjointly/turf-analysis-ui/templates/new/directives/resize';
import editable from '@conjointly/turf-analysis-ui/templates/new/elements/inputs/editable';
import FlexibleHeader from '@conjointly/turf-analysis-ui/templates/new/elements/layouts/flexible-header';
import ShowWorksheetListButton from '@conjointly/turf-analysis-ui/templates/new/components/simulations/components/show-worksheet-list-button';
import exportService from '@conjointly/turf-analysis-ui/templates/new/services/export';
import { SOURCE_OF_BUSINESS, WHAT_IF } from '@conjointly/turf-analysis-ui/templates/new/components/simulations/worksheet-types';
import WorksheetWhatIf from '@conjointly/turf-analysis-ui/templates/new/components/simulations/components/worksheet-what-if';
import WorksheetSourceOfBusiness from '@conjointly/turf-analysis-ui/templates/new/components/simulations/components/worksheet-source-of-business';
import RevenueSettingsModal from '@conjointly/turf-analysis-ui/templates/new/components/simulations/components/revenue-settings-modal';
import validate from './mixins/validate';
import copy from './mixins/copy';
import WorksheetHeader from './components/worksheet-header';

export default {
  name: 'Simulations',
  directives: { resize },
  components: {
    RevenueSettingsModal,
    WorksheetHeader,
    draggable,
    ShowWorksheetListButton,
    FlexibleHeader,
    editable,
    WorksheetWhatIf,
    WorksheetSourceOfBusiness,
  },
  mixins: [copy, validate, getValidators],
  props: {
    experimentId: { type: Number, required: true },
    isMaxDiff: { type: Boolean, required: true },
    experimentType: { type: String, required: true },
    segments: { type: Array, required: true },
    attributes: { type: Array, required: true },
    // fixme here can be Array or Object
    applicability: { required: true },
    initWorksheets: { type: Array, required: true },
    csrfToken: { type: String, required: true },
    priceObject: { type: Object },
  },
  data() {
    return {
      worksheetNamePlaceholder: 'Enter worksheet name...',
      scenarioNamePlaceholder: 'Enter scenario name...',
      calculationNamePlaceholder: 'Enter calculation name...',
      hiddenWorksheetList: false,
      hash: null,
      revenueId: 'DEFAULT',
      showRevenueSettingsModal: false,
    };
  },
  computed: {
    ...mapState({
      worksheets: (state) => state.worksheets.worksheets,
      saved: (state) => state.worksheets.saved,
    }),
    ...mapGetters({
      currentWorksheet: 'getCurrentWorksheet',
      currentWorksheetIndex: 'getCurrentWorksheetIndex',
      worksheetByIndex: 'getWorksheetByIndex',
      getProcessing: 'getProcessing',
      hasHiddenConcepts: 'hasHiddenConcepts',
      hasRevenueByWorksheetId: 'getHasRevenueByWorksheetId',
      getForExportToCsv: 'getForExportToCsv',
      getForExportSourceOfBusinessToCsv: 'getForExportSourceOfBusinessToCsv',
      getRevenue: 'getRevenue',
      getRevenues: 'getRevenues',
    }),
    revenues() {
      return this.getRevenues(this.currentWorksheet.id);
    },
    revenue() {
      return this.getRevenue(this.currentWorksheet.id, this.revenueId);
    },
    whatIfWorksheetsCount() {
      return this.worksheets.filter((w) => w.type === WHAT_IF).length;
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
      return { paddingLeft: this.hiddenWorksheetList ? 0 : `${10}px` };
    },
    hiddenConcepts() {
      return this.currentWorksheet && this.isWhatIf && this.hasHiddenConcepts(this.currentWorksheet.id);
    },
    hasRevenue() {
      return this.hasRevenueByWorksheetId(this.currentWorksheet.id);
    },
  },
  created() {
    this.init({
      worksheets: this.initWorksheets,
      applicability: this.applicability,
      attributes: this.attributes,
      segments: this.segments,
      experimentId: this.experimentId,
      experimentType: this.experimentType,
      csrfToken: this.csrfToken,
      priceObject: this.priceObject,
    });
  },
  mounted() {
    const vm = this;

    $(document).on('click', '.btn-save-worksheets', function () {
      vm.onSaveWorksheets($(this));
    });

    $(document).on('click', '.btn-adjust-scenarios-settings', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const $target = $(e.target);
      vm.onAdjustScenariosSettings({
        worksheetId: String($target.data('worksheet_id')),
        scenarioId: String($target.data('scenario_id')),
        field: String($target.data('field')),
      });
    });

    $(document).on('click', '.btn-adjust-concepts-names-to', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const $target = $(e.target);
      vm.onAdjustConceptNamesTo({
        worksheetId: String($target.data('worksheet_id')),
        action: String($target.data('action')),
      });
    });

    // Ctrl+S for saving
    $(window).keydown((e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (String.fromCharCode(e.which).toLowerCase()) {
          case 's':
            e.preventDefault();
            vm.onSaveWorksheets($('.btn-save-worksheets'));
            break;
          default:
            break;
        }
      }
    });

    $('form#simulationAreYouSureForm').areYouSure();
  },
  methods: {
    ...mapActions([
      'init',
      'selectWorksheet',
      'deleteWorksheet',
      'copyWorksheetByIndex',
      'checkDirtyAndRunSimulation',
      'adjustScenariosSettings',
      'adjustConceptNamesTo',
      'saveWorksheets',
    ]),
    ...mapMutations({
      setCurrentWorksheet: 'SET_CURRENT_WORKSHEET',
      updateWorksheets: 'UPDATE_WORKSHEETS',
      showAllConcepts: 'SHOW_ALL_CONCEPTS',
      setWorksheetName: 'SET_WORKSHEET_NAME',
      setCurrentRevenueId: 'SET_CURRENT_REVENUE_ID',
      addRevenueToWorksheet: 'ADD_REVENUE_TO_WORKSHEET',
      changeRevenue: 'CHANGE_REVENUE',
      removeRevenueFromWorksheet: 'REMOVE_REVENUE_FROM_WORKSHEET',
    }),
    showWorksheetsSavingNotifier() {
      if (!window.notifierExists('simulations-save')) {
        window.newNotifier({
          topic: 'simulations-save',
          message: 'Save your latest changes.<button type="button"  title="Press Ctrl+S to save" class="btn btn-default btn-xs btn-save-worksheets" data-loading-text="<i class=\'far fa-spinner fa-spin\'></i> Saving..."><i class="far fa-save fa-fw"></i> Save simulations </button>',
          type: 'info',
          hideClose: true,
        });
      }
    },
    hideWorksheetsSavingNotifier() {
      if (window.notifierExists('simulations-save')) {
        window.clearNotifierTopic('simulations-save');
      }
    },
    setRevenue(revenueId) {
      this.revenueId = revenueId;
      this.setCurrentRevenueId({ worksheetId: this.currentWorksheet.id, revenueId });
    },
    onAddRevenue() {
      this.setRevenue('DEFAULT');
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
      if (confirm('Are you sure?')) {
        this.removeRevenueFromWorksheet({ worksheetId: this.currentWorksheet.id, revenueId });
        if (this.revenueId === revenueId) {
          this.setRevenue('DEFAULT');
        }
      }
    },
    onSaveWorksheets($btn) {
      const vm = this;
      vm.saveWorksheets($btn).catch((errorObject) => {
        vm.$nextTick(() => vm.validate().then(() => {
          let field;
          if (errorObject.invalidConceptNames) {
            // eslint-disable-next-line prefer-destructuring
            field = document.getElementsByClassName('has-error-concept-name')[0];
          } else if (errorObject.invalidAttributes) {
            // eslint-disable-next-line prefer-destructuring
            field = document.getElementsByClassName('has-error-concept-attribute')[0];
          } else if (errorObject.invalidSourceOfBusinessScenario) {
            // eslint-disable-next-line prefer-destructuring
            field = document.getElementsByClassName('has-error-in-source-of-business')[0];
          }
          if (field) {
            field.focus();
            field.scrollIntoView();
          }
        }));
      });
    },
    onAdjustConceptNamesTo(payload) {
      this.adjustConceptNamesTo(payload).then(() => {
        window.clearNotifierTopic('set-scenario-lockToBrand');
      });
    },
    onAdjustScenariosSettings(payload) {
      this.adjustScenariosSettings(payload).then(window.clearNotifierTopic(`set-scenario-${payload.field}`));
    },
    onUpdateWorksheets($event) {
      this.updateWorksheets({ worksheets: $event });
    },
    onUpdateWorksheetName(name) {
      this.setWorksheetName({ worksheet: this.currentWorksheet, name });
    },
    onSelectWorksheet(worksheetIndex) {
      this.selectWorksheet(worksheetIndex);
    },
    onRevenueSettingsSave({
      isNew, revenue, title, xAxisTitle, formulas,
    }) {
      this.showRevenueSettingsModal = false;
      if (isNew) {
        this.addRevenueToWorksheet({
          worksheetId: this.currentWorksheet.id,
          revenue: { title, xAxisTitle, formulas },
        });
      } else {
        this.changeRevenue({
          worksheetId: this.currentWorksheet.id,
          revenueId: revenue.id,
          title,
          xAxisTitle,
          formulas,
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
      if (confirm(`Are you sure that you want to delete ${worksheet.name}?`)) {
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
          // todo refactor?
          vm.$refs.worksheet.$refs.simulatedPreferenceShareChart.getChartObject(),
          `${vm.currentWorksheet.name.trim() || 'export'}.png`,
        );
      });
    },
    exportMovementsPreferenceShareAsPicture() {
      const vm = this;
      vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
        exportService.exportGGraphAsPicture(
          // todo refactor?
          vm.$refs.worksheet.$refs.movementsPreferenceShareChart.getChartObject(),
          `${vm.currentWorksheet.name.trim() || 'export'}.png`,
        );
      });
    },
    exportRevenueChartAsPicture() {
      const vm = this;
      vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
        exportService.exportGGraphAsPicture(
          // todo rafactor?
          vm.$refs.worksheet.$refs.revenueChart.getChartObject(),
          `${vm.currentWorksheet.name.trim() || 'export'}.png`,
        );
      });
    },
    exportWorksheet() {
      const vm = this;
      vm.checkDirtyAndRunSimulation(vm.currentWorksheet.id).then(() => {
        const table = vm.currentWorksheet.type === WHAT_IF
          ? vm.getForExportToCsv(vm.currentWorksheet.id)
          : vm.getForExportSourceOfBusinessToCsv(vm.currentWorksheet.id);
        window.exportToCsv(`Experiment ${vm.experimentId} - ${vm.currentWorksheet.name}.csv`,
          table);
      });
    },
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
      if (typeof Event === 'function') {
        // modern browsers
        window.dispatchEvent(new Event('resize'));
      } else {
        // for IE and other old browsers
        // causes deprecation warning on modern browsers
        const evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
      }
    },
    hiddenConcepts() {
      if (!this.hiddenConcepts) {
        window.clearNotifierTopic('concept-hidden');
      }
    },
  },
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
                    color: red;
                }

                &:hover,
                &:focus {
                    color: red;
                    text-decoration: none;
                }
            }
        }
    }
</style>
