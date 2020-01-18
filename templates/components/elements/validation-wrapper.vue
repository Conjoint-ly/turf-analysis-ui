<template functional>
  <div :class="{'has-error dont-touch' : props.validation.hasError(props.field)}">
    <slot />
    <span v-if="props.validation.hasError(props.field)" class="text-danger dont-touch">{{ props.validation.firstError(props.field) }}</span>
  </div>
</template>
