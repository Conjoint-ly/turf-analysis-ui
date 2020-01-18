<template functional>
  <button
    type="button"
    :title="props.title"
    :class="`btn btn-default ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`"
    @click="listeners['click']"
  >
    <i class="far fa-copy fa-fw" />
  </button>
</template>
