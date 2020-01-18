<template functional>
  <div>
    <div
      :class="[
        $options.hasError(props.validation, props.field)
          ? 'has-error dont-touch'
          : '',
        data.staticClass
      ]"
    >
      <slot />
    </div>

    <span
      v-for="(error, index) in $options.errors(props.validation, props.field)"
      :key="index"
      class="text-danger dont-touch"
    >{{ error }}</span>
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
};
</script>
