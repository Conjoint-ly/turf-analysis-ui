<template functional>
  <div class="panel panel-default">
    <div class="panel-heading">
      <slot name="panel-header" />
    </div>
    <div v-show="props.showBlock" class="panel-body">
      <slot name="panel-body" />
    </div>
  </div>
</template>
