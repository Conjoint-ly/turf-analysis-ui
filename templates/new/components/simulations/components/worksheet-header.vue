<template>
  <li :class="{ 'worksheet-tab': true, active: isActive }" @mouseleave="hover = false" @mouseover="hover = true">
    <a href="#" @click.stop.prevent="onSelectWorksheet">
      <flexible-header>
        <template #prepend>
          <i v-show="processing" class="far fa-spinner fa-spin fa-fw" />
        </template>
        <template #default>
          <span>{{ worksheet.name || worksheetNamePlaceholder }}</span>
        </template>
        <template #append>
          <div v-show="hover" class="btn-group btn-group-xs header-btn-group">
            <copy-button title="Copy worksheet" @click.stop.prevent.capture="onCopyWorksheet" />
            <remove-button
              v-if="canBeDeleted"
              class="btn-xs"
              title="Delete worksheet"
              type="trash"
              @click.stop.prevent.capture="onDeleteWorksheet"
            />
            <button
              v-if="worksheetsCount > 1"
              class="worksheet-drag-handle btn btn-default btn-xs"
              title="Drag and drop to re-order worksheets"
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
import FlexibleHeader from '@conjointly/turf-analysis-ui/templates/new/elements/layouts/flexible-header';
import { SOURCE_OF_BUSINESS, WHAT_IF } from '@conjointly/turf-analysis-ui/templates/new/components/simulations/worksheet-types';
import CopyButton from '@conjointly/turf-analysis-ui/templates/new/elements/buttons/copy';
import RemoveButton from '@conjointly/turf-analysis-ui/templates/new/elements/buttons/remove';

export default {
  name: 'WorksheetHeader',
  components: { FlexibleHeader, CopyButton, RemoveButton },
  props: {
    worksheet: { type: Object, required: true },
    worksheetIndex: { type: Number, required: true },
    isActive: { type: Boolean },
    worksheetsCount: { type: Number, required: true },
    whatIfWorksheetsCount: { type: Number, required: true },
    processing: { type: Boolean },
    worksheetNamePlaceholder: { type: String, required: true },
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    canBeDeleted() {
      return (
        (this.worksheet.type === WHAT_IF && this.whatIfWorksheetsCount > 1)
                    || this.worksheet.type === SOURCE_OF_BUSINESS
      );
    },
  },
  methods: {
    onSelectWorksheet() {
      this.$emit('select-worksheet', this.worksheetIndex);
    },
    onCopyWorksheet() {
      this.$emit('copy-worksheet', this.worksheetIndex);
    },
    onDeleteWorksheet() {
      this.$emit('delete-worksheet', this.worksheetIndex);
    },
  },
};
</script>

<style scoped>
    .header-btn-group {
        display: flex;
    }
</style>
