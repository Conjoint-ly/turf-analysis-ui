<template>
  <div class="row is-full-height list-view">
    <div class="col-md-12">
      <ol class="list">
        <question
          v-for="(question, index) in questions"
          :key="index"
          v-bind="{question, namespace}"
        />
      </ol>
    </div>
  </div>
</template>

<style scoped>
    .list-view::v-deep img,
    .list-view::v-deep iframe,
    .list-view::v-deep video {
        max-width: 100%;
        max-height: 200px;
    }

    ol.list,
    ul.list {
        list-style-type: none;
        padding-left: 0;
    }

    ol.list > li,
    ul.list > li {
        display: table;
        margin-bottom: 0.25em;
    }

    ol.list > li > span:first-child {
        display: table-cell;
        padding-right: 0.5rem;
    }

    ul.list > li:before {
        content: "◦ ";
        display: table-cell;
        padding-right: 0.5rem;
    }

    li ul.list {
        padding-left: 2rem;
    }

    li ol.list {
        padding-left: 2rem;
    }
</style>

<script>
import { mapGetters } from 'vuex';
import question from './question';

export default {
  name: 'QuestionList',
  components: { question },
  props: {
    namespace: {
      type: String,
      required: true,
    },
  },
  computed: {
    questions() {
      return this.singles;
    },
  },
  beforeCreate() {
    const { namespace } = this.$options.propsData;

    this.$options.computed = {
      ...this.$options.computed,
      ...mapGetters(namespace, ['singles']),
    };
  },
};
</script>
