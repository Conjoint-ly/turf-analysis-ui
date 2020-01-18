<template functional>
  <button
    type="button"
    class="btn btn-default"
    :class="data.staticClass"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i v-if="props.type == 'trash'" class="far fa-trash-alt fa-fw" />
    <i v-else class="far fa-minus-circle fa-fw" />
    <slot />
  </button>
</template>
