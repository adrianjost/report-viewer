<template>
	<div>
		<Breadcrumb :config="breadcrumbConfig" />
		<h1>Pull {{ this.pull }}</h1>
		<ol>
			<li v-for="commit in currentCommits" :key="commit.commit">
				<router-link
					:to="{
						name: 'pull_commit',
						params: {
							org,
							repo,
							pull,
							commit: commit.commit,
						},
					}"
				>
					{{ commit.commit }}
				</router-link>
			</li>
		</ol>
	</div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import { mapActions, mapGetters } from "vuex";
export default {
	components: { Breadcrumb },
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
		pull() {
			return this.$route.params.pull;
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
				{ text: this.pull },
			];
		},
	},
	methods: {
		...mapActions("reports", ["fetchCommits"]),
	},
};
</script>

<style lang="scss" scoped></style>
