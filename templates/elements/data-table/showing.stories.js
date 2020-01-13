import { storiesOf } from "@storybook/vue";

import showing from "./showing";
import markdown from "./showing.md";

storiesOf("Elements|Data Table/Showing (F)", module)
	.add(
		"With filter",
		() => ({
			components: { showing },
			template: `<showing
					:currentPage="currentPage"
					:pageSize="pageSize"
					:showingItems="showingItems"
					:totalItems="totalItems"
                />`,
			data() {
				return {
					currentPage: 1,
					pageSize: 10,
					showingItems: 20,
					totalItems: 30
				};
			}
		}),
		{
			info: {
				summary: markdown
			}
		}
	)
	.add(
		"Without filter",
		() => ({
			components: { showing },
			template: `<showing
					:currentPage="currentPage"
					:pageSize="pageSize"
					:showingItems="showingItems"
					:totalItems="totalItems"
                />`,
			data() {
				return {
					currentPage: 1,
					pageSize: 10,
					showingItems: 30,
					totalItems: 30
				};
			}
		}),
		{
			info: {
				summary: markdown
			}
		}
	);
