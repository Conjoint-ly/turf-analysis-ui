<template functional>
  <div class="flexible-header">
    <span class="flexible-header-prepend">
      <slot name="prepend" />
    </span>
    <span class="flexible-header-prepend flexible-header-prepend-last">
      <slot name="prepend-separate" />
    </span>
    <span class="flexible-header-title">
      <slot />
    </span>
    <span class="flexible-header-append">
      <slot name="append" />
    </span>
  </div>
</template>

<style scoped>
    .flexible-header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
    }

    .flexible-header-title {
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 22px;
        flex-grow: 1;
    }

    .flexible-header-prepend-last {
        margin-right: 0.5rem;
    }

    .flexible-header-append {
        margin-left: 0.25rem;
    }
</style>
