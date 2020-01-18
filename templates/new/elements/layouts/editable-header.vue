<template functional>
  <div class="editable-header">
    <div class="editable-header-prepend">
      <slot name="prepend" />
    </div>
    <div class="editable-header-prepend editable-header-prepend-last">
      <slot name="prepend-separate" />
    </div>
    <span class="editable-header-append">
      <slot name="append" />
    </span>
    <div class="editable-header-container">
      <slot />
    </div>
  </div>
</template>
