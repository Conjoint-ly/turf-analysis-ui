<template functional>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="pull-right">
        <div class="btn-group">
          <slot name="panel-header-buttons" />
        </div>
      </div>
      <slot name="panel-header-title">
        <i class="far fa-thermometer" />
        D<span class="sort-number">{{ props.number }}</span>:
        <span class="question-name">{{ props.name }}</span>
      </slot>
    </div>
    <div v-show="props.showBlock" class="panel-body">
      <slot name="panel-body" />
    </div>
  </div>
</template>
