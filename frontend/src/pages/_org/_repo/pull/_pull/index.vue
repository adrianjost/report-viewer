<template>
	<div>
		<CommitList
			:commits="currentCommits"
			routeName="pull_commit"
			:routeParams="{ org, repo, pull }"
		/>
	</div>
</template>

<script>
import CommitList from "@/components/CommitList.vue";

import { mapActions, mapGetters } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Commits`,
		};
	},
	components: { CommitList },
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
	},
	methods: {
		...mapActions("reports", ["fetchCommits"]),
	},
};
</script>

<style lang="scss" scoped></style>
