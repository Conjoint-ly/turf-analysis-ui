<template>
  <input
    :class="{ 'has-error dont-touch has-error-concept-name': validation.hasError() }"
    :name="name"
    :value="conceptName"
    class="form-control"
    type="text"
    v-bind="{ validation }"
    @input="onInput"
  >
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import validators from '@conjointly/turf-analysis-ui/templates/components/simulations/validators/concept-name';
import { debounce } from 'lodash';
import copy from '../mixins/copy';

export default {
  name: 'ConceptName',
  mixins: [copy],
  props: ['name', 'concept', 'conceptsNames', 'conceptIndex'],
  template: '#concept-name',
  computed: {
    ...mapGetters(['getConceptName']),
    conceptName: {
      get() {
        return this.getConceptName(this.concept);
      },
      set(value) {
        this.setConceptName({ concept: this.concept, name: value });
      },
    },
  },
  methods: {
    ...mapMutations({
      setConceptName: 'SET_CONCEPT_NAME',
    }),
    onInput: debounce(
      function (e) {
        this.conceptName = e.target.value;
      },
      500,
      { leading: true },
    ),
  },
  validators,
};
</script>

<style scoped></style>
