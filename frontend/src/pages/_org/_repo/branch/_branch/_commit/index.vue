<template>
	<div class="wrapper">
		<FileList
			:files="currentEntrypoints"
			v-if="currentEntrypoints.length > 1"
			@fileSelected="viewFile"
		/>
		<UserIFrame :path="activeEntrypointUrl" />
	</div>
</template>

<script>
import UserIFrame from "@/components/UserIFrame.vue";
import FileList from "@/components/FileList.vue";
import { mapActions, mapGetters } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Report`,
		};
	},
	components: { FileList, UserIFrame },
	data() {
		return {
			activeEntrypoint: undefined,
		};
	},
	created() {
		this.fetchFiles(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentFiles", "currentEntrypoints"]),
		org() {
			return this.$route.params.org;
		},
		repo() {
			return this.$route.params.repo;
		},
		branch() {
			return this.$route.params.branch;
		},
		commit() {
			return this.$route.params.commit;
		},
		activeEntrypointUrl() {
			return this.activeEntrypoint || this.currentEntrypoints[0] || "";
		},
	},
	methods: {
		...mapActions("reports", ["fetchFiles"]),
		viewFile(file) {
			this.activeEntrypoint = file;
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
}
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
button {
	width: 100%;
	word-break: break-word;
}
</style>
