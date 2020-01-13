import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";

const methods = {
	optionsSet: action("optionsSet")
};

const items = [
	{
		id: 5364,
		device: "desktop",
		location: "",
		respondBegin: "N/A",
		respondLength: 0,
		statusLabel: "Completed survey",
		statusInLabel: "Included in analysis",
		statusIncludeInAnalysis: 1,
		complete: true,
		exclude: false
	},
	{
		id: 5365,
		device: "desktop",
		location: "",
		respondBegin: "N/A",
		respondLength: 0,
		statusLabel: "Completed survey",
		statusInLabel: "Included in analysis",
		statusIncludeInAnalysis: 1,
		complete: true,
		exclude: false
	},
	{
		id: 5366,
		device: "desktop",
		location: "Roselands New South Wales 2196 Australia",
		respondBegin: "N/A",
		respondLength: 0,
		statusLabel: "Completed survey",
		statusInLabel: "Included in analysis",
		statusIncludeInAnalysis: 1,
		complete: true,
		exclude: false
	},
	{
		id: 5367,
		device: "desktop",
		location: "Roselands New South Wales 2196 Australia",
		respondBegin: "N/A",
		respondLength: 0,
		statusLabel: "Opened survey link, but did not complete survey",
		statusInLabel: "Excluded from analysis",
		statusIncludeInAnalysis: 0,
		complete: false,
		exclude: false
	},
	{
		id: 5368,
		device: "desktop",
		location: "Roselands New South Wales 2196 Australia",
		respondBegin: "N/A",
		respondLength: 0,
		statusLabel: "Opened survey link, but did not complete survey",
		statusInLabel: "Excluded from analysis",
		statusIncludeInAnalysis: 0,
		complete: false,
		exclude: false
	}
];

import pivotTable from "./pivot-table";
import markdown from "./pivot-table.md";

storiesOf("Elements|Pivot Table", module)
	.add(
		"Predefined",
		() => ({
			components: { pivotPredefined: pivotTable },
			template: `<pivot-predefined :items="items" :settings="settings" :predefined="true" @optionsSet="optionsSet"></pivot-predefined>`,
			data() {
				return {
					items: items,
					settings: {
						options: {
							cols: ["id"]
						}
					}
				};
			},
			methods: methods
		}),
		{
			info: {
				summary: markdown
			}
		}
	)
	.add(
		"Custom",
		() => ({
			components: { pivotCustom: pivotTable },
			template: `<pivot-custom :items="items" :settings="settings" :predefined="false" @optionsSet="optionsSet"></pivot-custom>`,
			data() {
				return {
					items: items,
					settings: {
						options: {}
					}
				};
			},
			methods: methods
		}),
		{
			info: {
				summary: markdown
			}
		}
	);
