<template>
  <div class="turf-layout">
    <div class="container">
      <slot name="header" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TurfMainLayout',
};
</script>

<style lang="scss">
  .turf-layout {
    padding-top: 20px;
  }
</style>
