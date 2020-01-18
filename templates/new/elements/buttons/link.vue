<template functional>
  <a
    :href="props.href"
    class="btn btn-default"
    :class="[props.sizeClass !== undefined ? props.sizeClass : 'btn-xs', props.additionalClass]"
    v-bind="data.attrs"
    :listeners="listeners"
  >
    <i :class="props.iconClass" /> {{ props.label }}
  </a>
</template>
