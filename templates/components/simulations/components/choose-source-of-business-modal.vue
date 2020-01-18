<template>
  <div
    ref="modal"
    aria-hidden="true"
    class="modal modal-lg-important fade"
    role="dialog"
    tabindex="-1"
    data-keyboard="false"
    data-backdrop="static"
  >
    <div class="modal-content">
      <div class="modal-header">
        <button
          aria-hidden="true"
          class="close"
          data-dismiss="modal"
          type="button"
        >
          &times;
        </button>
        <h4 class="modal-title">
          Choose source of business scenarios
        </h4>
      </div>
      <div class="modal-body">
        <choose-source-of-business
          v-if="showModal"
          ref="choose"
          :scenario="scenario"
          :worksheets="worksheets"
          @choose="onChooseSourceOfBusiness"
        />
      </div>
      <div class="modal-footer">
        <div class="pull-left">
          <button
            class="btn btn-default"
            data-dismiss="modal"
            type="button"
            @click="onClose"
          >
            Close
          </button>
        </div>
        <button class="btn btn-success" type="button" @click="onChoose">
          <i class="far fa-check" /> Choose
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import modal from '@conjointly/turf-analysis-ui/templates/components/simulations/mixins/modal';
import ChooseSourceOfBusiness from '@conjointly/turf-analysis-ui/templates/components/simulations/components/choose-source-of-business';
import { mapActions } from 'vuex';

export default {
  name: 'ChooseSourceOfBusinessModal',
  components: { ChooseSourceOfBusiness },
  mixins: [modal],
  props: ['worksheets', 'scenario'],
  data() {
    return {
      isMounted: false,
    };
  },
  computed: {},
  mounted() {
    this.isMounted = true;
  },
  methods: {
    ...mapActions(['addSourceOfBusinessWorksheet']),
    onChoose(e) {
      if (this.isMounted) {
        this.$refs.choose && this.$refs.choose.onChoose(e);
      }
    },
    onChooseSourceOfBusiness({
      newWorksheetId, newScenario, baselineWorksheetId, baselineScenario,
    }) {
      this.$emit('choose', {
        newWorksheetId, newScenario, baselineWorksheetId, baselineScenario,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
