<template functional>
  <div
    :class="[
      'form-group',
      props.validation && $options.hasError(props.validation, props.field) ? 'has-error dont-touch' : '',
      props.validation && props.success && $options.isPassed(props.validation, props.field) ? 'has-success': '',
      data.staticClass
    ]"
  >
    <label
      v-if="props.label"
      :class="['control-label', props.labelClass ? props.labelClass : 'col-xs-4 col-sm-3 col-lg-2']"
    >{{
      props.label }}</label>
    <div :class="props.label ? [props.contentClass ? props.contentClass : 'col-xs-8 col-sm-9 col-lg-10'] : []">
      <slot />
      <span
        v-for="(error, index) in $options.errors(props.validation, props.field)"
        :key="index"
        class="text-danger dont-touch"
      >{{ error }}</span>
      <slot name="rest" />
    </div>
  </div>
</template>

<script>
export default {
  errors(validation, field) {
    if (!validation) return [''];

    if (Array.isArray(field)) {
      return field
        .map((item) => validation.firstError(item))
        .filter(Boolean);
    }

    return [validation.firstError(field)];
  },
  hasError(validation, field) {
    if (Array.isArray(field)) {
      return field.reduce(
        (result, item) => (result = result || validation.hasError(item)),
        false,
      );
    }

    return validation.hasError(field);
  },
  isPassed(validation, field) {
    if (Array.isArray(field)) {
      return field.reduce(
        (result, item) => (result = result && validation.isPassed(item)),
        true,
      );
    }

    return validation.isPassed(field);
  },
};
</script>
