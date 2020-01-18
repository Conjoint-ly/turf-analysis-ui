<template functional>
  <div :class="{'form-group': true, 'has-error dont-touch': props.validation ? props.validation.hasError(props.field) : false }">
    <label class="col-xs-4 col-sm-3 col-lg-2 control-label">{{ props.label }}</label>
    <div class="col-xs-8 col-sm-9 col-lg-10">
      <slot />
      <span class="text-danger dont-touch">{{ props.validation ? props.validation.firstError(props.field) : '' }}</span>
    </div>
  </div>
</template>
