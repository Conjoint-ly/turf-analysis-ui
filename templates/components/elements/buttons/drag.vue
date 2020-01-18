<template functional>
  <button type="button" :title="props.title" :class="`btn btn-default btn-xs ${props.dragClass !== undefined ? props.dragClass : ''}`">
    <i class="far fa-arrows fa-fw" />
  </button>
</template>
