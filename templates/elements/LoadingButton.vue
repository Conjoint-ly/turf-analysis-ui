<template functional>
  <button
    :class="[data.class, data.staticClass]"
    :loading="props.loading"
    :disabled="props.disabled || props.loading"
    v-on="listeners"
  >
    <template v-if="!props.loading">
      <slot />
    </template>
    <template v-else>
      <slot name="loading">
        <i key="loading" class="far fa-spinner fa-spin" /> Loading...
      </slot>
    </template>
  </button>
</template>

<script>
export default {

};
</script>
