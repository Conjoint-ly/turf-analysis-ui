<template>
  <button
    v-if="hiddenWorksheetList"
    class="btn btn-primary btn-xs"
    type="button"
    @click="onShowWorksheetList"
  >
    <i class="far fa-eye" /> Show other worksheets
  </button>
</template>

<script>
export default {
  name: 'ShowWorksheetListButton',
  model: {
    prop: 'hiddenWorksheetList',
    event: 'show-worksheet-list',
  },
  props: ['hiddenWorksheetList'],

  methods: {
    onShowWorksheetList() {
      this.$emit('show-worksheet-list', false);
    },
  },
};
</script>

<style scoped></style>
