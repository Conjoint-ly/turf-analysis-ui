import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import pageSize from './page-size';
import markdown from './page-size.md';

const methods = {
  setPageSize: action('setPageSize'),
};

storiesOf('Elements|Data Table', module).add(
  'Page Size (F)',
  () => ({
    components: { pageSize },
    template: '<div class="form-inline"><page-size @setPageSize="setPageSize"/></div>',
    methods,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);
