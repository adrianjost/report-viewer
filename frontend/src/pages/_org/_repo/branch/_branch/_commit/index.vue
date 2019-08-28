<template>
	<div class="wrapper">
		<Breadcrumb :config="breadcrumbConfig" />
		<h1>Commit</h1>
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
	components: { Breadcrumb, UserIFrame },
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
		breadcrumbConfig() {
			return [
				{ text: "Home", to: { name: "home" } },
				{ text: this.org, to: { name: "org", params: { org: this.org } } },
				{
					text: this.repo,
					to: { name: "repo", params: { org: this.org, repo: this.repo } },
				},
				{ text: "branch" },
				{
					text: this.branch,
					to: {
						name: "branch",
						params: { org: this.org, repo: this.repo, branch: this.branch },
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
