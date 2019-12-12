<template>
  <div class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <component
          :is="brandRoute ? 'router-link' : 'div'"
          class="navbar-brand"
          :to="brandRoute"
        >
          {{ brand }}
        </component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TurfHeader',
  props: {
    brand: String,
    brandRoute: [String, Object],
  },
};
</script>
