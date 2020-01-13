<template>
  <ul class="nav sidebar">
    <li
      v-for="item in items"
      :key="item.create"
    >
      <router-link
        :to="item.route"
        active-class="active"
        exact-active-class=""
      >
        <i
          v-if="item.icon"
          class="fa fa-fw"
          :class="`fa-${item.icon}`"
        />
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
    .sidebar {
        li {
            border-top: 1px solid #e7e7e7;
            a {
                &.active {
                    background: #eee;
                }
            }
        }
    }
</style>
