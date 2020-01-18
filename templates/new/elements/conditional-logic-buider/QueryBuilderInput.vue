<template>
  <div class="rule-filter-container">
    <!-- Component Input Type -->
    <component
      :is="input.tag"
      v-if="input.type === 'component'"
      :value="value"
      v-bind="{ ...input.bind }"
      @input="$emit('input', emitAs($event))"
    />

    <!-- Text, Number, Date, Email Input Types -->
    <input
      v-else-if="['text', 'number', 'date', 'email'].indexOf(input.type) !== -1"
      class="form-control"
      :type="input.type"
      :value="value"
      :disabled="input.disabled"
      :min="input.min"
      :max="input.max"
      :placeholder="input.placeholder || ''"
      @input="$emit('input', emitAs($event.target.value))"
    >

    <!-- Textarea Input Type -->
    <textarea
      v-else-if="input.type === 'textarea'"
      class="form-control"
      :value="value"
      :disabled="input.disabled"
      :rows="input.rows || 1"
      :placeholder="input.placeholder"
      @input="$emit('input', $event.target.value)"
    />

    <!-- Radio Button Input Type -->
    <div v-else-if="input.type === 'radio'" class="radio">
      <label v-for="choice in input.options">
        <input
          type="radio"
          :value="choice.value"
          :disabled="input.disabled"
          @input="$emit('input', $event.target.value)"
        > {{ choice.label }}
      </label>
    </div>

    <!-- Select Input Type -->
    <select
      v-else-if="input.type === 'select'"
      class="form-control"
      :disabled="input.disabled"
      :multiple="input.multiple"
      :value="value"
      @change="$emit('input', emitAs($event.target.value))"
    >
      <template v-for="(option) in input.options">
        <template v-if="typeof option === 'object'">
          <option :value="option.value" :disabled="option.disabled" @click.prevent>
            {{ option.label }}
          </option>
        </template>
        <template v-else>
          <option :value="option" @click.prevent>
            {{ option }}
          </option>
        </template>
      </template>
    </select>

    <span v-if="error" class="text-danger dont-touch">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'QueryBuilderInput',

  props: {
    // Input settings
    input: {
      type: Object,
      required: true,
    },

    // Value for input
    value: {
      required: true,
    },

    // Error message
    error: {
      type: [Boolean, String],
      required: false,
    },
  },

  beforeMount() {
    // If input is custom component we need to add it here
    if (this.input.type === 'component') {
      this.$options.components[this.input.tag] = this.input.component;
    }
  },

  methods: {
    emitAs(value) {
      if (!this.input.as) {
        return value;
      }

      if (this.input.type === 'number' || this.input.as === 'number') {
        return Number(value);
      }

      if (this.input.as === 'boolean') {
        return Boolean(value);
      }

      if (typeof this.input.as === 'function') {
        return this.input.as(value);
      }
    },
  },
};
</script>
