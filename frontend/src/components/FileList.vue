<template>
	<div>
		<tabs
			class="tabs-component"
			@changed="tabSelected"
			:options="{ useUrlFragment: false }"
		>
			<tab v-for="file in cleanedFiles" :key="file.org" :name="file.clean" />
		</tabs>
	</div>
</template>

<script>
import { Tabs, Tab } from "vue-tabs-component";

export default {
	components: {
		Tabs,
		Tab,
	},
	props: {
		files: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			selectedFile: "",
		};
	},
	computed: {
		cleanedFiles() {
			const splitFiles = this.files.map((f) => f.split("/"));
			let longestCommon = 0;
			if (splitFiles.length > 1) {
				longestCommon = splitFiles[0].findIndex((part, index) => {
					return !splitFiles.every((other) => other[index] === part);
				});
			}
			return this.files.map((org) => {
				return {
					org,
					clean: org
						.split("/")
						.slice(longestCommon)
						.join("/"),
				};
			});
		},
	},
	methods: {
		tabSelected(selectedTab) {
			const cleanedFile = this.cleanedFiles.find(
				(file) => file.clean === selectedTab.tab.name
			);
			const file = this.files.find((file) => file === cleanedFile.org);
			this.$emit("fileSelected", file);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@/styles/tabs";

.file-list {
	list-style: inside;
	padding-right: 0;
}
.file-entry {
	background: transparent;
	border: none;
	text-decoration: underline;
	padding: 0.5rem 0;
	&.selected {
		color: var(--color-primary);
	}
}
</style>
