import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import copy from './copy';
import markdown from './copy.md';

const methods = {
  click: action('click'),
};

storiesOf('Elements|Buttons', module).add(
  'Copy (F)',
  () => ({
    components: { copy },
    template: '<copy title="Button title" @click="click"></copy>',
    methods,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);
