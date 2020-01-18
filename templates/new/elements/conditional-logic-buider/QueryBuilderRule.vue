<template>
  <div class="rule-container" :class="hasErrors ? 'has-error dont-touch' : ''">
    <div class="rule-header" :class="!inline ? 'inline' : ''">
      <label class="badge">{{ rule.label }}</label>
      <div v-if="!disabled" class="btn-group pull-right rule-actions">
        <button type="button" class="btn btn-xs btn-default" @click="remove">
          <i class="fa fa-trash" /> Remove
        </button>
      </div>
    </div>

    <!-- Dynamically build inputs based on rule settings -->
    <div v-if="inline" class="m-x-2">
      <query-builder-input
        v-for="input in inputs"
        :key="keys[input.name]"
        :style="input.style || ''"
        :class="input.class || ''"
        :value="query.inputs[input.name]"
        :input="input"
        :error="errors[input.name]"
        @input="updateInputValue($event, input.name)"
      />
    </div>
    <div v-else :class="horizontal ? 'form-horizontal' : ''">
      <div v-for="(input, i) in inputs" :key="i" class="form-group">
        <label v-if="input.hasOwnProperty('label')" class="control-label" :class="horizontal ? 'col-sm-2' : ''">{{ input.label }}</label>
        <div :class="horizontal ? (input.hasOwnProperty('label') ? 'col-sm-8' : 'col-sm-12') : 'm-x-3'">
          <query-builder-input
            :key="keys[input.name]"
            :style="input.style || 'width: 100%'"
            :class="input.class || ''"
            :value="query.inputs[input.name]"
            :input="input"
            :error="errors[input.name]"
            @input="updateInputValue($event, input.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import uuid from 'uuid';
import QueryBuilderInput from './QueryBuilderInput';

export default {
  name: 'QueryBuilderRule',

  components: {
    QueryBuilderInput,
  },

  inject: ['emitUpdateEvent'],

  props: {
    // This element index in parent children array
    index: {
      type: Number,
      required: true,
    },

    // Query with rule values
    query: {
      type: Object,
      required: true,
    },

    // Current rule
    rule: {
      type: Object,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputs: [],
      errors: {},
      keys: {},
    };
  },

  /**
         * Build initial inputs
         * @returns {Promise<[]>}
         */
  async created() {
    this.inputs = await this.getInputs();
  },

  methods: {
    /**
             * Remove this element from children array of parent
             */
    remove() {
      this.$emit('child-deletion-requested', this.index);
    },

    /**
             * Get default value for input based on input type
             */
    getDefaultValueForInput(input) {
      if (input.default) {
        return input.default;
      }

      if (input.type === 'checkbox') {
        return [];
      }

      if (input.type === 'select' && input.multiple) {
        return [];
      }

      return null;
    },

    /**
             * Updates query input value and invalidates all other inputs after updated one
             * It's needed because after we're changing type on one input
             * other input types can be changed and values won't be actual anymore.
             *
             * @param value Input value
             * @param input Input name
             */
    async updateInputValue(value, input) {
      this.query.inputs[input] = value;
      this.emitUpdateEvent();
      // Update inputs
      await this.rebuildInputs(input);
    },

    rebuildInputs: debounce(async function (input) {
      this.errors = {};
      this.inputs = await this.getInputs(input);
    }, 100),

    /**
             * Invalidates all other inputs after the specified one
             *
             * @param input Input type
             */
    invalidateInputs(input) {
      let after = false;
      this.inputs.forEach((i) => {
        if (after && i.invalidate) {
          // If input needs invalidation (invalidation is true or one of the previous inputs)
          if (i.invalidate === true || (Array.isArray(i.invalidate) && i.invalidate.includes(input))) {
            this.$delete(this.query.inputs, i.name);
            this.keys[i.name] = null;
          }
        }

        if (i.name === input) {
          after = true;
        }
      });
    },

    /**
             * Return resolved inputs for given rule
             * @param input - input that caused invalidation
             * @returns {Promise<[]>}
             */
    async getInputs(input = null) {
      // We need to invalidate old inputs values first
      if (input) {
        this.invalidateInputs(input);
      }

      // After invalidation we can build new inputs
      const inputs = typeof this.rule.inputs === 'function' ? await this.rule.inputs(this.query.inputs) : this.rule.inputs;
      inputs.forEach((i) => {
        if (this.query.inputs[i.name] === undefined) {
          // We need to set observer on newly created input value
          this.$set(this.query.inputs, i.name, this.getDefaultValueForInput(i));
          if (!this.keys[i.name]) {
            this.keys[i.name] = uuid();
          }
        }
      });

      return inputs;
    },

    /**
             * Validate inputs in the rule
             * @returns {Promise<boolean>}
             */
    async validate(validators = {}) {
      this.errors = {};
      const response = await Promise.all(this.inputs.map((input) => {
        const validator = validators[input.name] || input.validator;
        if (validator) {
          const validation = validator(this.query.inputs[input.name]);
          if (validation.hasImmediateError()) {
            this.$set(this.errors, input.name, validation._messages[0]);
            return false;
          }
        }
        return true;
      }));

      return !response.includes(false);
    },
  },

  computed: {
    /**
             * Indicates whether there are errors in the rule
             * @returns {boolean}
             */
    hasErrors() {
      return Boolean(Object.keys(this.errors).length);
    },

    /**
             * Is form inline?
             * @returns {boolean}
             */
    inline() {
      return this.rule.layout === 'inline';
    },

    /**
             * Is form vertical?
             * @returns {boolean}
             */
    vertical() {
      return this.rule.layout === 'vertical';
    },

    /**
             * Is form horizontal?
             * @returns {boolean}
             */
    horizontal() {
      return !this.rule.layout || this.rule.layout === 'horizontal';
    },
  },
};
</script>
