import { storiesOf } from "@storybook/vue";

import { action } from "@storybook/addon-actions";

const methods = {
	click: action("click")
};

import remove from "./remove";
import markdown from "./remove.md";

storiesOf("Elements|Buttons", module).add(
	"Remove (F)",
	() => ({
		components: { remove },
		template: `<remove title="Button title" @click="click"></remove>`,
		methods: methods
	}),
	{
		info: {
			summary: markdown
		}
	}
);
