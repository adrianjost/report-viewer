<template>
	<div>
		<CommitList
			:commits="currentCommits"
			routeName="branch_commit"
			:routeParams="{ org, repo, branch }"
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
		branch() {
			return this.$route.params.branch;
		},
	},
	methods: {
		...mapActions("reports", ["fetchCommits"]),
	},
};
</script>

<style lang="scss" scoped></style>
