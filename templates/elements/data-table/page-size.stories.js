import { storiesOf } from "@storybook/vue";

import { action } from "@storybook/addon-actions";

const methods = {
	setPageSize: action("setPageSize")
};

import pageSize from "./page-size";
import markdown from "./page-size.md";

storiesOf("Elements|Data Table", module).add(
	"Page Size (F)",
	() => ({
		components: { pageSize },
		template: `<div class="form-inline"><page-size @setPageSize="setPageSize"/></div>`,
		methods: methods
	}),
	{
		info: {
			summary: markdown
		}
	}
);
