<template functional>
  <button
    :class="`btn btn-default ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`"
    :title="props.title"
    type="button"
    @click="listeners['click']"
  >
    <span v-if="props.showBlock"><i class="far fa-minus fa-fw" /> </span>
    <span v-else><i class="far fa-plus fa-fw" /> </span>
  </button>
</template>
