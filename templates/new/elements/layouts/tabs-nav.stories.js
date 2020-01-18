import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import tabsNav from './tabs-nav';
import markdown from './tabs-nav.md';

const tabs = [
  {
    name: 'first',
    title: 'Predefined 1',
    predefined: true,
  },
  {
    name: 'second',
    title: 'Predefined 2',
    predefined: true,
  },
  {
    name: 'third',
    title: 'Custom',
  },
  {
    name: 'fourth',
    title: 'Custom 2',
  },
];

const methods = {
  tabSet(name) {
    this.current = name;
    this.actionTabSet(name);
  },
  tabAdd() {
    this.tabs.push({
      name: `tab-${Date.now()}`,
      title: 'Click to rename',
    });
    this.actionTabAdd();
  },
  tabCopy(name) {
    const copy = { ...this.tabs.find((item) => item.name == name) };
    copy.name = `tab-${Date.now()}`;
    this.tabs.push(copy);
    this.actionTabCopy(name);
  },
  tabRename(payload) {
    this.tabs.find((item) => item.name === payload.name).title = payload.title;
    this.actionTabRename(payload);
  },
  tabRemove(name) {
    const index = this.tabs.findIndex((item) => item.name == name);
    this.tabs.splice(index, 1);
    this.actionTabRemove(name);
  },
  tabMove(names) {
    this.tabs = [
      ...this.tabs.filter((tab) => tab.predefined),
      ...names.map((name) => this.tabs.find((tab) => tab.name == name)),
    ];
    this.actionTabMove(names);
  },
  actionTabSet: action('tabSet'),
  actionTabAdd: action('tabAdd'),
  actionTabCopy: action('tabCopy'),
  actionTabRename: action('tabRename'),
  actionTabRemove: action('tabRemove'),
  actionTabMove: action('tabMove'),
};

storiesOf('Elements|Tabs Nav', module)
  .add(
    'Can modify',
    () => ({
      components: { tabsNav },
      template: `<tabs-nav
				:tabs="tabs"
				:current="current"
				:canModify="true"
				@tabSet="actionTabSet"
				@tabAdd="actionTabAdd"
				@tabCopy="actionTabCopy"
				@tabRename="actionTabRename"
				@tabRemove="actionTabRemove"
				@tabMove="actionTabMove"
			/>`,
      data() {
        return {
          current: 'third',
          tabs,
        };
      },
      methods,
    }),
    {
      info: {
        summary: markdown,
      },
    },
  )
  .add(
    'Cannot modify',
    () => ({
      components: { tabsNav },
      template: `<tabs-nav
				:tabs="tabs"
				:current="current"
				:canModify="false"
				@tabSet="actionTabSet"
				@tabAdd="actionTabAdd"
				@tabCopy="actionTabCopy"
				@tabRename="actionTabRename"
				@tabRemove="actionTabRemove"
				@tabMove="actionTabMove"
			/>`,
      data() {
        return {
          current: 'third',
          tabs,
        };
      },
      methods,
    }),
    {
      info: {
        summary: markdown,
      },
    },
  )
  .add(
    'Live example',
    () => ({
      components: { tabsNav },
      template: `<tabs-nav
				:tabs="tabs"
				:current="current"
				:canModify="true"
				@tabSet="tabSet"
				@tabAdd="tabAdd"
				@tabCopy="tabCopy"
				@tabRename="tabRename"
				@tabRemove="tabRemove"
				@tabMove="tabMove"
			/>`,
      data() {
        return {
          current: 'third',
          tabs,
        };
      },
      methods,
    }),
    {
      info: {
        summary: markdown,
      },
    },
  );
