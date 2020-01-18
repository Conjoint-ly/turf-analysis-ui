import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['experimentType', 'languagePhraseValues']),
  },
  methods: {
    getPhraseValue(field, code) {
      return this.languagePhraseValues[`diagnosticQuestion.${field}:${this.experimentType}_${code}`];
    },
  },
};
