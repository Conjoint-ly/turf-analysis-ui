<template>
  <validation-wrapper :validation="validation" field="formula">
    <input :value="formula" class="form-control" @input="input">
  </validation-wrapper>
</template>

<script>
import ValidationWrapper from '@conjointly/turf-analysis-ui/templates/new/elements/validation/wrapper';
import validators from '@conjointly/turf-analysis-ui/templates/new/components/simulations/validators/formula';

export default {
  name: 'RevenueFormula',
  components: { ValidationWrapper },
  props: ['formula'],
  methods: {
    input(formula) {
      this.$emit('input', formula);
    },
  },
  validators,
};
</script>

<style scoped></style>
