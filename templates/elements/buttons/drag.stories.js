import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import drag from './drag';
import markdown from './drag.md';

const methods = {
  click: action('click'),
};

storiesOf('Elements|Buttons', module).add(
  'Drag (F)',
  () => ({
    components: { drag },
    template: '<drag title="Button title"></drag>',
    methods,
  }),
  {
    info: {
      summary: markdown,
    },
  },
);

/**
 *
 *
<copy title="Copy this tab" @click.stop="copy(tab.name)"></copy>

<drag title="Drag and drop to re-order tabs"></drag>
 *
 *
 *
 */
