<template>
  <div id="layout" class="wrapper">
    <div class="sidebar-wrapper">
      <div class="navbar navbar-default">
        <router-link
          class="navbar-logo"
          :to="{name: 'index'}"
        >
          <img :src="logoUrl" alt="logo">
        </router-link>
        <slot name="sidebar" />
      </div>
    </div>
    <div class="content-wrapper">
      <h1 v-if="title" class="page-title">
        {{ title }}
      </h1>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    logoUrl: String,
    title: String,
  },
};
</script>

<style lang="scss">
  #layout {
    display: flex;
    align-items: flex-start;
    height: 100vh;

    > * {
      height: 100%;
      overflow-y: auto;
    }

    > .sidebar-wrapper {
      width: 250px;
      flex-shrink: 0;
      background: #f8f8f8;

      > .navbar {
        height: 100%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-bottom: 0;
      }

      .navbar-logo {
        display: flex;
        justify-content: center;
        padding: 10px 0;
      }
    }

    > .content-wrapper {
      padding: 0 30px 30px 30px;

      flex-grow: 1;

      .page-title {
        padding-bottom: 9px;
        margin: 40px 0 20px;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
