<template functional>
  <button
    type="button"
    :title="props.title"
    :class="`btn btn-default ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`"
    @click="listeners['click']"
  >
    <i :class="props.iconClass" /> {{ props.label }}
  </button>
</template>
