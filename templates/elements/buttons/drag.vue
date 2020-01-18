<template functional>
  <span v-bind="data.attrs" :class="data.staticClass" class="btn btn-default drag">
    <i class="far fa-arrows fa-fw" />
  </span>
</template>

<style>
    .drag {
        cursor: move;
    }
</style>
