<template>
  <li>
    <!-- Name -->
    <span>Q{{ question.AQseqNum }}.</span>
    <strong class="space-right">
      <question-symbol v-bind="{question, label}" :class="{'space-right': !!name, 'vertical-middle': true}" />
      <span v-if="name">{{ name }}</span>
    </strong>
    <span v-if="!name">{{ label }}</span>

    <!-- Content with settings -->
    <div v-if="question.type !== 'conjoint'" class="question-content">
      <component
        :is="contentComponent"
        v-bind="{question, parameters: questionParameters, items: questionItems, placeholders}"
      />
    </div>

    <!-- Items -->
    <ul v-if="questionItems.length" class="items-list">
      <component
        :is="itemComponent"
        v-for="(item, index) in questionItems"
        :key="index"
        v-bind="{question, placeholders, item}"
      />
    </ul>

    <!-- Logic -->
    <div v-if="question.logic">
      <p><strong>Show this question only if following conditions are met</strong></p>
      <div class="conditional-logic">
        <logic
          :node="question.logic"
          :questions="questionsAll"
          :items="items"
          :depth="1"
        />
      </div>
    </div>

    <!-- Nested questions -->
    <ol v-if="questions.length" class="list">
      <question
        v-for="(nestedQuestion, index) in questions"
        :key="index"
        v-bind="{question: nestedQuestion, namespace}"
      />
    </ol>
  </li>
</template>

<style scoped>
    .space-right {
        margin-right: 0.5rem;
    }

    .my-1 {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .mb-025 {
        margin-bottom: 0.25rem;
    }

    .mb-1 {
        margin-bottom: 1rem;
    }

    .conditional-logic {
        margin-left: 0.25rem;
        border-top: 1px solid lightgrey;
        border-bottom: 1px solid lightgrey;
        margin-bottom: 1rem;
        padding-top: 5px;
        padding-bottom: 5px;
    }
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import pick from 'lodash/pick';
import sorts from '@conjointly/turf-analysis-ui/templates/new/helpers/sorts.js';

import questionSymbol from '@conjointly/turf-analysis-ui/templates/new/elements/layouts/question-symbol';

// Items components
import multipleItem from './items/multiple';
import constantsumItem from './items/constantsum';
import ggItem from './items/gg';
import starratingItem from './items/starrating';

// Content components
import introContent from './content/intro';
import multipleContent from './content/multiple';
import randomisationblockContent from './content/randomisationblock';
import shortAnyContent from './content/short-any';
import shortEmailContent from './content/short-email';
import shortNumberContent from './content/short-number';
import shortRegexpContent from './content/short-regexp';
import captureParagraphContent from './content/capture-paragraph';
import captureCameraContent from './content/capture-camera';
import likertContent from './content/likert';
import starratingContent from './content/starrating';
import constantsumContent from './content/constantsum';
import ggContent from './content/gg';
import vwContent from './content/vw';

// Logic
import logic from './logic/logic';

export default {
  name: 'Question',
  components: {
    questionSymbol,
    multipleItem,
    constantsumItem,
    ggItem,
    starratingItem,
    introContent,
    multipleContent,
    randomisationblockContent,
    shortAnyContent,
    shortEmailContent,
    shortNumberContent,
    shortRegexpContent,
    captureParagraphContent,
    captureCameraContent,
    likertContent,
    starratingContent,
    constantsumContent,
    ggContent,
    vwContent,
    logic,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    namespace: {
      type: String,
      required: true,
    },
  },
  computed: {
    name() {
      if (
        this.question.name
                    && this.question.name.trim()
                    && !['&nbsp', '&nbsp;'].includes(this.question.name.trim())
      ) return this.question.name;

      if (['conjoint', 'randomisationblock'].includes(this.question.type)) {
        return this.label;
      }

      return null;
    },
    label() {
      if (this.labels[this.question.type]) return this.labels[this.question.type].label;

      let text = 'conjoint';

      switch (this.experiment.type) {
        case 'prediction-market':
          text = 'prediction market';
          break;

        case 'claims-test':
          text = 'claims';
          break;
      }

      return `Block of ${text} questions`;
    },
    questions() {
      switch (this.question.type) {
        case 'conjoint':
          return this.conjoints;
        case 'randomisationblock':
          return this.randomisations.filter((r) => r.parent == this.question.key);
      }

      return [];
    },
    questionParameters() {
      return this.parameters[this.question.parameters];
    },
    questionItems() {
      return Object.values(pick(this.items, this.question.items)).sort(sorts.byTypeDesc);
    },
    itemComponent() {
      return `${this.question.type}Item`;
    },
    contentComponent() {
      return `${this.question.type
                    + this.toUpperCaseFirst(this.question.answerType)
      }Content`;
    },

  },
  beforeCreate() {
    const { namespace } = this.$options.propsData;

    this.$options.computed = {
      ...this.$options.computed,
      ...mapState(namespace, ['experiment', 'labels', 'types', 'placeholders', 'items', 'parameters']),
      ...mapState(namespace, {
        questionsAll: 'questions',
      }),
      ...mapGetters(namespace, ['conjoints', 'randomisations']),
    };
  },
  methods: {
    toUpperCaseFirst(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      return '';
    },
  },
};
</script>
