<template>
	<div class="wrapper">
		<Breadcrumb :config="breadcrumbConfig" />
		<ul v-if="currentEntrypoints.length > 1">
			<li v-for="file in currentEntrypoints" :key="file">
				<button @click="viewFile(file)">
					{{ file }}
				</button>
			</li>
		</ul>
		<UserIFrame :path="activeEntrypointUrl" />
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import UserIFrame from "@/components/UserIFrame.vue";

import { mapActions, mapGetters } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Commit: ${this.commit}`,
		};
	},
	components: { Breadcrumb, UserIFrame },
	data() {
		return {
			loaderVisible: true,
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
		pull() {
			return this.$route.params.pull;
		},
		commit() {
			return this.$route.params.commit;
		},
		activeEntrypointUrl() {
			return this.activeEntrypoint || this.currentEntrypoints[0] || "";
		},
		breadcrumbConfig() {
			return [
				{ text: "Home", to: { name: "home" } },
				{ text: this.org, to: { name: "org", params: { org: this.org } } },
				{
					text: this.repo,
					to: { name: "repo", params: { org: this.org, repo: this.repo } },
				},
				{ text: "pull" },
				{
					text: this.pull,
					to: {
						name: "pull",
						params: { org: this.org, repo: this.repo, pull: this.pull },
					},
				},
				{ text: this.commit },
			];
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
</style>
