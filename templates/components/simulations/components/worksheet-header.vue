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
            <button
              class="btn btn-default btn-xs"
              title="Copy worksheet"
              type="button"
              @click.stop.prevent.capture="onCopyWorksheet"
            >
              <i class="far fa-clone fa-fw" />
            </button>
            <button
              v-if="canBeDeleted"
              class="btn btn-default btn-xs"
              title="Delete worksheet"
              type="button"
              @click.stop.prevent.capture="onDeleteWorksheet"
            >
              <i class="far fa-trash fa-fw" />
            </button>
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
import FlexibleHeader from '@conjointly/turf-analysis-ui/templates/elements/flexible-header';
import { SOURCE_OF_BUSINESS, WHAT_IF } from '@conjointly/turf-analysis-ui/templates/components/simulations/worksheet-types';

export default {
  name: 'WorksheetHeader',
  components: { FlexibleHeader },
  props: [
    'worksheet',
    'worksheetIndex',
    'isActive',
    'worksheetsCount',
    'whatIfWorksheetsCount',
    'processing',
    'worksheetNamePlaceholder',
  ],
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
