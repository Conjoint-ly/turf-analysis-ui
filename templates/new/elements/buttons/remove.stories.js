import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import remove from './remove';
import markdown from './remove.md';

const methods = {
  click: action('click'),
};

storiesOf('Elements|Buttons', module).add(
  'Remove (F)',
  () => ({
    components: { remove },
    template: '<remove title="Button title" @click="click"></remove>',
    methods,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);
