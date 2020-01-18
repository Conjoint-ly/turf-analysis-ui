<template functional>
  <button
    type="button"
    :title="props.title"
    :class="`btn btn-default ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`"
    @click="listeners['click']"
  >
    <span v-if="props.showBlock"><i class="far fa-minus fa-fw" /> </span>
    <span v-else><i class="far fa-plus fa-fw" /> </span>
  </button>
</template>
