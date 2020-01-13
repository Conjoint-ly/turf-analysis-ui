import { storiesOf } from "@storybook/vue";

import { action } from "@storybook/addon-actions";

const methods = {
	setSearch: action("setSearch")
};

import search from "./search";
import markdown from "./search.md";

storiesOf("Elements|Data Table", module).add(
	"Search (F)",
	() => ({
		components: { search },
		template: `<div class="form-inline"><search @setSearch="setSearch"/></div>`,
		methods: methods
	}),
	{
		info: {
			summary: markdown
		}
	}
);
