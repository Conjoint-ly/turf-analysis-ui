import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import search from './search';
import markdown from './search.md';

const methods = {
  setSearch: action('setSearch'),
};

storiesOf('Elements|Data Table', module).add(
  'Search (F)',
  () => ({
    components: { search },
    template: '<div class="form-inline"><search @setSearch="setSearch"/></div>',
    methods,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);
