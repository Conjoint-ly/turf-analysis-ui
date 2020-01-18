<template>
  <div
    v-if="
      attribute.type !== 'brand' ||
        (experimentType !== 'brandSpecific' && experimentType !== 'brandPriceTradeOff')
    "
    class="input-group"
  >
    <select
      v-if="!isNumberPrice"
      v-model="attributeValue"
      :class="{ 'has-error dont-touch has-error-concept-attribute': validation.hasError() }"
      class="form-control"
      v-bind="{ validation }"
    >
      <option v-for="level in applicabilityLevels" :key="level.value" :value="level.value">
        {{ level.name }}
      </option>
    </select>
    <input
      v-else
      v-model="attributeValue"
      :class="{ 'has-error dont-touch has-error-concept-attribute': validation.hasError() }"
      :max="priceObject.max"
      :min="priceObject.min"
      :step="priceObject.step"
      :title="'Insert a price value between ' + priceObject.min + ' and ' + priceObject.max"
      class="form-control"
      type="number"
      v-bind="{ validation }"
    >
    <div class="input-group-btn">
      <button
        :disabled="applicabilityLevels.length < 2"
        class="btn btn-default"
        title="Perform analysis of sensitivity to changes in this value"
        type="button"
        @click="onCopyScenarioWithOtherLevels"
      >
        <i class="far fa-function" />
      </button>
    </div>
  </div>
  <div v-else class="input-group">
    <select
      v-model="attributeValue"
      :class="{ 'has-error dont-touch has-error-concept-attribute': validation.hasError() }"
      class="form-control"
      v-bind="{ validation }"
    >
      <option v-for="level in attribute.levels" :key="level.value" :value="level.value">
        {{ level.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import validators from '@conjointly/turf-analysis-ui/templates/components/simulations/validators/attribute';

export default {
  name: 'Attribute',
  props: ['attribute', 'concept', 'conceptIndex', 'brandAttribute'],
  computed: {
    ...mapState({
      experimentType: (state) => state.simulations.experimentType,
    }),
    ...mapGetters({
      getApplicabilityLevels: 'getApplicabilityLevels',
      getPriceObject: 'getPriceObject',
    }),
    priceObject() {
      return this.getPriceObject(this.concept.attributes[this.brandAttribute.value]);
    },
    isNumberPrice() {
      return this.attribute.type === 'price' && this.priceObject;
    },
    attributeValue: {
      get() {
        const attributeValue = this.concept.attributes[this.attribute.value];
        if (!this.isNumberPrice && !this.applicabilityLevels.map((l) => l.value).includes(attributeValue)) {
          return null;
        }
        return attributeValue;
      },
      set(value) {
        this.setConceptAttributeValue({
          attributes: this.concept.attributes,
          attribute: this.attribute.value,
          value: this.isNumberPrice ? parseFloat(value) : value,
        }).then(async () => {
          if (this.attribute.type === 'brand') await this.adjustConceptAttributes({ concept: this.concept, attribute: this.attribute });
        });
      },
    },
    applicabilityLevels() {
      return this.getApplicabilityLevels(this.concept, this.attribute);
    },
  },
  methods: {
    ...mapActions(['checkApplicability', 'setConceptAttributeValue', 'adjustConceptAttributes']),
    onCopyScenarioWithOtherLevels() {
      this.$emit('copy-scenario-with-other-levels', {
        conceptIndex: this.conceptIndex,
        attribute: this.attribute,
        levelValue: this.concept.attributes[this.attribute.value],
      });
    },
  },
  validators,
};
</script>

<style scoped></style>
