<template>
  <div class="query-builder">
    <query-builder-group
      :key="query._key()"
      :query="query"
      :rules="rules"
      :max-depth="maxDepth"
      :depth="depth"
      :groups="groups"
      :index="0"
      :disabled="disabled"
      :advanced-mode="advancedMode"
      type="group"
    />
  </div>
</template>

<script>
import uuid from 'uuid';
import debounce from 'lodash/debounce';
import QueryBuilderGroup from './QueryBuilderGroup';

export default {
  name: 'QueryBuilder',

  components: {
    QueryBuilderGroup,
  },

  provide() {
    return {
      emitUpdateEvent: this.update,
    };
  },

  props: {
    // Available rules for this query builder
    rules: {
      type: Array,
      default: () => [],
    },

    // Available groups for this query builder
    groups: {
      type: Array,
      default: () => [{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }],
    },

    // Max depth for grouping
    maxDepth: {
      type: Number,
      default: 20,
      validator: (value) => value > 1,
    },

    // v-model initial query
    value: {
      type: Object,
      required: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    advancedMode: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      // Current grouping depth
      depth: 1,

      query: this.value ? JSON.parse(JSON.stringify(this.value)) : {
        type: 'group',
        operator: 'AND',
        children: [],
      },
    };
  },

  watch: {
    value: {
      deep: true,
      handler(val) {
        const query = JSON.stringify(this.query);
        const value = JSON.stringify(val);
        if (query !== value) {
          this.query = val ? JSON.parse(value) : {
            type: 'group',
            operator: 'AND',
            children: [],
          };
          setKey(this.query);
        }
      },
    },
  },

  methods: {
    update: debounce(function () {
      const query = JSON.stringify(this.query);
      const value = JSON.stringify(this.value);
      if (query !== value) {
        this.$emit('input', JSON.parse(query));
      }
    }, 250),

    /**
             * Validate query builder
             * @returns Boolean
             */
    async validate(validators = {}) {
      // Validate all inputs for query builder
      const response = await Promise.all(getValidators(this, validators));

      return !response.includes(false);
    },

    /**
             * Rebuild inputs recursively
             */
    async rebuild() {
      return await Promise.all(rebuild(this));
    },
  },

  created() {
    setKey(this.query);
  },
};

/**
     * Get all rules validators
     * @param vm
     */
function getValidators(vm, validators) {
  if (vm.$options.name === 'query-builder-rule') {
    return vm.validate(validators);
  }

  return vm.$children.flatMap((child) => getValidators(child, validators));
}

/**
     * Rebuild all inputs
     * @param vm
     */
function rebuild(vm) {
  if (vm.$options.name === 'query-builder-rule') {
    return vm.rebuildInputs();
  }

  return vm.$children.flatMap((child) => rebuild(child));
}

/**
     * Set key for each query (as function because it should be deleted in JSON.parse)
     * @param query
     */
function setKey(query) {
  const key = uuid();
  query._key = function () {
    return key;
  };
  if (query.children) query.children.forEach((child) => setKey(child));
}
</script>

<style>
    /*!
     * jQuery QueryBuilder 2.5.2
     * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
     * Licensed under MIT (https://opensource.org/licenses/MIT)
     */
    .query-builder .rules-group-container, .query-builder .rule-container, .query-builder .rule-placeholder {
        position: relative;
        margin: 4px 0;
        border-radius: 5px;
        padding: 5px;
        border: 1px solid #EEE;
        background: rgba(255, 255, 255, 0.9);
        text-align: left;
    }

    .query-builder .rule-container .rule-filter-container,
    .query-builder .rule-container .rule-operator-container,
    .query-builder .rule-container .rule-value-container, .query-builder .error-container, .query-builder .drag-handle {
        display: inline-block;
        margin: 0 5px 0 0;
        vertical-align: top;
    }

    .query-builder .rules-group-container {
        padding: 10px;
        padding-bottom: 6px;
        /*border: 1px solid #DCC896; */
        /*background: rgba(250, 240, 210, 0.5); */
    }

    .query-builder .rules-group-header {
        margin-bottom: 10px;
    }

    .query-builder .rules-group-header .group-conditions .btn.readonly:not(.active),
    .query-builder .rules-group-header .group-conditions input[name$='_cond'] {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        white-space: nowrap;
    }

    .query-builder .rules-group-header .group-conditions .btn.readonly {
        border-radius: 3px;
    }

    .query-builder .rules-group-header .group-conditions input[type="radio"] {
        display: none;
    }

    .rules-group-header {
        position: relative;
        padding-bottom: 5px;
        display: flex;
        justify-content: space-between;
    }

    .rules-group-header.not-empty.advanced-mode:before {
        content: '';
        position: absolute;
        border-left: 2px solid #CCC;
        bottom: -24px;
        width: 10px;
        height: 34px;
        left: 21px;
    }

    .rules-group-body {
        padding-top: 5px;
    }

    .query-builder .group-actions .input-group-xs {
        display: inline-table;
        margin: 0 10px 0 10px;
        /*width: 200px;*/
    }

    .query-builder .group-actions .input-group-xs > .form-control,
    .query-builder .group-actions .input-group-xs > .input-group-addon,
    .query-builder .group-actions .input-group-xs > .input-group-btn > .btn {
        height: 22px;
        padding: 1px 5px;
        font-size: 12px;
        line-height: 1.5;
    }

    .query-builder .group-actions > .btn {
        margin: -15px 10px 0 10px;
    }

    .query-builder .rules-list {
        list-style: none;
        padding: 0 0 0 15px;
        margin: 0;
    }

    .query-builder .rule-value-container {
        border-left: 1px solid #DDD;
        padding-left: 5px;
    }

    .query-builder .rule-value-container label {
        margin-bottom: 0;
        font-weight: normal;
    }

    .query-builder .rule-value-container label.block {
        display: block;
    }

    .query-builder .rule-value-container select,
    .query-builder .rule-value-container input[type='text'],
    .query-builder .rule-value-container input[type='number'] {
        padding: 1px;
    }

    .query-builder .error-container {
        display: none;
        cursor: help;
        color: #F00;
    }

    .query-builder .has-error {
        background-color: #FDD;
        border-color: #F99;
    }

    .query-builder .has-error .error-container {
        display: inline-block !important;
    }

    .query-builder .rules-list.advanced-mode > *::before, .query-builder .rules-list.advanced-mode > *::after {
        content: '';
        position: absolute;
        left: -10px;
        width: 10px;
        height: calc(50% + 4px);
        border-color: #CCC;
        border-style: solid;
    }

    .query-builder .rules-list > *::before {
        top: -4px;
        border-width: 0 0 2px 2px;
    }

    .query-builder .rules-list > *::after {
        top: 50%;
        border-width: 0 0 0 2px;
    }

    .query-builder .rules-list > *:first-child::before {
        top: -12px;
        height: calc(50% + 14px);
    }

    .query-builder .rules-list > *:last-child::before {
        border-radius: 0 0 0 4px;
    }

    .query-builder .rules-list > *:last-child::after {
        display: none;
    }

    .query-builder.bt-checkbox-glyphicons .checkbox input[type='checkbox']:checked + label::after {
        font-family: 'Glyphicons Halflings';
        content: '\e013';
    }

    .query-builder.bt-checkbox-glyphicons .checkbox label::after {
        padding-left: 4px;
        padding-top: 2px;
        font-size: 9px;
    }

    .query-builder .error-container + .tooltip .tooltip-inner {
        color: #F99 !important;
    }

    .query-builder p.filter-description {
        margin: 5px 0 0 0;
        background: #D9EDF7;
        border: 1px solid #BCE8F1;
        color: #31708F;
        border-radius: 5px;
        padding: 2.5px 5px;
        font-size: .8em;
    }

    .query-builder .rules-group-header [data-invert] {
        margin-left: 5px;
    }

    .query-builder .drag-handle {
        cursor: move;
        vertical-align: middle;
        margin-left: 5px;
    }

    .query-builder .dragging {
        position: fixed;
        opacity: .5;
        z-index: 100;
    }

    .query-builder .dragging::before, .query-builder .dragging::after {
        display: none;
    }

    .query-builder .rule-placeholder {
        border: 1px dashed #BBB;
        opacity: .7;
    }

    .query-builder .btn-xs {
        height: 22px;
        padding: 1px 5px;
        font-size: 12px;
        line-height: 1.5;
    }

    .rule-filter-container .text-danger {
        font-size: 12px;
    }

    .rule-header {
        margin: 5px 0 20px 10px;
    }

    .rule-actions {
        margin-right: 10px;
    }
</style>
