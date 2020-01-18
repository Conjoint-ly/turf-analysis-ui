<template functional>
  <button
    :class="data.staticClass"
    class="btn btn-default"
    type="button"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i class="far fa-copy fa-fw" />
    <slot />
  </button>
</template>
