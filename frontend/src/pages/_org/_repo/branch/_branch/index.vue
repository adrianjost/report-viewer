<template>
	<div>
		<Breadcrumb :config="breadcrumbConfig" />
		<CommitList
			:commits="currentCommits"
			routeName="branch_commit"
			:routeParams="{ org, repo, branch }"
		/>
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import CommitList from "@/components/CommitList.vue";
import { mapActions, mapGetters } from "vuex";

export default {
	metaInfo() {
		return {
			title: `Commits - ${this.branch}`,
		};
	},
	components: { Breadcrumb, CommitList },
	created() {
		this.fetchCommits(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentCommits"]),
		org() {
			return this.$route.params.org;
		},
		repo() {
			return this.$route.params.repo;
		},
		branch() {
			return this.$route.params.branch;
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
				},
			];
		},
	},
	methods: {
		...mapActions("reports", ["fetchCommits"]),
	},
};
</script>

<style lang="scss" scoped></style>
