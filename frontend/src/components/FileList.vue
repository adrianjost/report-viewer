<template>
	<ul class="file-list">
		<li v-for="file in cleanedFiles" :key="file.org">
			<button
				@click="fileSelected(file.org)"
				:class="{ 'file-entry': true, selected: file.org === selectedFile }"
			>
				{{ file.clean }}
			</button>
		</li>
	</ul>
</template>

<script>
export default {
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
		fileSelected(file) {
			this.selectedFile = file;
			this.$emit("fileSelected", file);
		},
	},
};
</script>

<style lang="scss" scoped>
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
