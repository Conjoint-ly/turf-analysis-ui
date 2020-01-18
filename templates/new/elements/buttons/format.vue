<template functional>
  <button
    :class="
      `btn ${props.btnClass !== undefined ? props.btnClass : 'btn-default'}
                ${props.sizeClass !== undefined ? props.sizeClass : 'btn-xs'}`
    "
    :title="props.title"
    type="button"
    @click="listeners['click']"
  >
    <span><i class="far fa-image fa-fw" /> </span>
  </button>
</template>
