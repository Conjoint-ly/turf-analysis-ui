<template functional>
  <button
    type="button"
    class="btn btn-default"
    :class="data.staticClass || ''"
    v-on="listeners"
  >
    <template v-if="props.visible">
      <i class="far fa-minus fa-fw" /> Hide detail
    </template>
    <template v-else>
      <i class="far fa-plus fa-fw" /> Show detail
    </template>
  </button>
</template>
