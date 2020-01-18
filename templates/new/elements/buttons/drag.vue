<template functional>
  <span :class="data.staticClass" class="btn btn-default drag" v-bind="data.attrs">
    <i class="far fa-arrows fa-fw" />
  </span>
</template>

<style>
    .drag {
        cursor: move;
    }
</style>
