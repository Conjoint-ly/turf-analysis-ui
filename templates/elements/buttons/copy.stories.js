import { storiesOf } from "@storybook/vue";

import { action } from "@storybook/addon-actions";

const methods = {
	click: action("click")
};

import copy from "./copy";
import markdown from "./copy.md";

storiesOf("Elements|Buttons", module).add(
	"Copy (F)",
	() => ({
		components: { copy },
		template: `<copy title="Button title" @click="click"></copy>`,
		methods: methods
	}),
	{
		info: {
			summary: markdown
		}
	}
);
