<template>
  <div class="panel rules-group-container">
    <div class="panel-heading rules-group-header" :class="[query.children.length ? 'not-empty' : '', {'advanced-mode': advancedMode}]">
      <div v-if="advancedMode" class="btn-group group-conditions">
        <label
          v-for="(group, i) in groups"
          :key="i"
          class="btn btn-xs btn-default"
          :class="group.value === query.operator ? 'active' : ''"
        >
          <input
            :name="`group_operator_${index}`"
            type="radio"
            :value="group.value"
            :disabled="disabled"
            @input="changeGroup($event.target.value)"
          >
          {{ group.label }}
        </label>
      </div>
      <div class="group-actions">
        <div v-if="!disabled" class="input-group input-group-xs">
          <select v-if="rules.length > 1 && advancedMode" v-model="selectedRule" class="form-control">
            <option
              v-for="(rule, i) in rules"
              :key="i"
              :value="rule"
            >
              {{ rule.label }}
            </option>
          </select>
          <span class="input-group-btn">
            <button type="button" class="btn btn-xs btn-default" @click="addRule"><i class="fa fa-plus" /> Add Rule</button>
            <button
              v-if="advancedMode"
              type="button"
              class="btn btn-xs btn-default"
              @click="addGroup"
            ><i class="fa fa-plus" /> Add Group</button>
            <button
              v-if="depth > 1"
              type="button"
              class="btn btn-xs btn-default"
              @click="remove"
            ><i class="fa fa-trash" /> Remove Group</button>
          </span>
        </div>
      </div>
    </div>
    <div class="panel-body rules-group-body">
      <div class="rules-list" :class="{'advanced-mode': advancedMode}">
        <component
          :is="child.type === 'group' ? 'query-builder-group' : 'query-builder-rule'"
          v-for="(child, i) in query.children"
          :key="child._key()"
          :type="child.type"
          :query="child"
          :rules="rules"
          :rule="rulesById[child.rule]"
          :index="i"
          :disabled="disabled"
          :max-depth="maxDepth"
          :depth="depth + 1"
          :groups="groups"
          @child-deletion-requested="removeChild"
        />
      </div>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid';
import QueryBuilderRule from './QueryBuilderRule';

export default {
  name: 'QueryBuilderGroup',

  components: {
    QueryBuilderRule,
  },

  inject: ['emitUpdateEvent'],

  props: {
    // Type of component: either query-builder-group or query-builder-rule
    type: {
      type: String,
      required: true,
      validate: (value) => value === 'group' || value === 'rule',
    },

    // Built query of rules
    query: {
      type: Object,
      required: true,
    },

    // Available rules for builder
    rules: {
      type: Array,
      required: true,
    },

    // Index of the group
    index: {
      type: Number,
      required: true,
    },

    // Allowed max depth
    maxDepth: {
      type: Number,
      required: true,
    },

    // Current depth
    depth: {
      type: Number,
      require: true,
      default: 1,
    },

    // Logic groups
    groups: {
      type: Array,
      required: true,
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
      selectedRule: null,
    };
  },

  computed: {
    /**
             * Returns rules mapped by ID for easier access
             */
    rulesById() {
      return this.rules.reduce((carry, rule) => ({ ...carry, [rule.id]: rule }), {});
    },
  },

  mounted() {
    this.selectedRule = this.rules[0];
  },

  methods: {
    /**
             * Add rule to this element children array
             */
    addRule() {
      const inputs = {};
      if (typeof this.selectedRule.inputs !== 'function') {
        this.selectedRule.inputs.forEach((i) => inputs[i.name] = null);
      }
      const key = uuid();
      const child = {
        type: 'rule',
        rule: this.selectedRule.id,
        inputs,
        _key() {
          return key;
        },
      };
      this.query.children.push(child);
      this.emitUpdateEvent();
    },

    /**
             * Add group of rules to this element children array
             */
    addGroup() {
      if (this.depth < this.maxDepth) {
        const key = uuid();
        this.query.children.push({
          type: 'group',
          operator: 'AND',
          children: [],
          _key() {
            return key;
          },
        });
        this.emitUpdateEvent();
      }
    },

    /**
             * Change group operator
             */
    changeGroup(operator) {
      this.query.operator = operator;
      this.emitUpdateEvent();
    },

    /**
             * Remove this element from parent children array
             */
    remove() {
      this.$emit('child-deletion-requested', this.index);
    },

    /**
             * Remove child from this element children array
             */
    removeChild(index) {
      this.query.children.splice(index, 1);
      this.emitUpdateEvent();
    },
  },
};
</script>
