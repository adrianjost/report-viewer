<template>
	<ItemList :items="currentRepos" :loading="!currentRepos.length" />
</template>

<script>
import ItemList from "@/components/ItemList.vue";
import { formatDistance } from "date-fns";

import { mapActions } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Repos`,
		};
	},
	components: {
		ItemList,
	},
	created() {
		this.fetchRepos(this.$route.params);
	},
	computed: {
		org() {
			return this.$route.params.org;
		},
		currentRepos() {
			return this.$store.getters["reports/currentRepos"].map((repo) => ({
				to: {
					name: "repo",
					params: {
						org: this.org,
						repo: repo.repo,
					},
				},
				title: repo.repo,
				subtitle: `${this.getRelativeTime(repo.updated_at)} ago updated`,
				id: repo.repo,
			}));
		},
	},
	methods: {
		...mapActions("reports", ["fetchRepos"]),
		getRelativeTime(timestamp) {
			return formatDistance(new Date(timestamp), new Date());
		},
	},
};
</script>

<style lang="scss" scoped></style>
