<template>
	<div>
		<tabs class="tabs-component">
			<tab name="Branches">
				<ItemList :items="currentBranches" :loading="!currentBranches.length" />
			</tab>
			<tab name="Pulls">
				<ItemList :items="currentPulls" :loading="!currentPulls.length" />
			</tab>
			<tab name="Settings">
				<router-link
					:to="{
						name: 'repo_settings',
						params: {
							org,
							repo,
						},
					}"
				>
					<h2 v-if="isRepoAdmin">Open here</h2>
				</router-link>
			</tab>
		</tabs>
	</div>
</template>

<script>
import ItemList from "@/components/ItemList.vue";
import { Tabs, Tab } from "vue-tabs-component";

import { mapActions, mapGetters } from "vuex";
export default {
	components: { ItemList, Tabs, Tab },
	metaInfo() {
		return {
			title: `Branches & Pulls`,
		};
	},
	created() {
		this.fetchBranches(this.$route.params);
		this.fetchPulls(this.$route.params);
	},
	asyncComputed: {
		isRepoAdmin() {
			if (!this.$route.params.org || !this.$route.params.repo) {
				return false;
			}
			return this.$store
				.dispatch("github/fetchRepoRights", {
					slug: `${this.$route.params.org}/${this.$route.params.repo}`,
				})
				.then((permissions) => permissions.admin);
		},
	},
	computed: {
		...mapGetters("reports", ["currentBranches", "currentPulls"]),
		currentBranches() {
			return this.$store.getters["reports/currentBranches"].map((branch) => ({
				to: {
					name: "branch",
					params: {
						org: this.org,
						repo: this.repo,
						branch: branch.branch,
					},
				},
				title: branch.branch,
				id: branch.branch,
			}));
		},
		currentPulls() {
			return this.$store.getters["reports/currentPulls"].map((pull) => ({
				to: {
					name: "pull",
					params: {
						org: this.org,
						repo: this.repo,
						pull: pull.pull,
					},
				},
				title: `#${pull.pull}`,
				id: pull.pull,
			}));
		},
		org() {
			return this.$route.params.org;
		},
		repo() {
			return this.$route.params.repo;
		},
	},
	methods: {
		...mapActions("reports", ["fetchBranches", "fetchPulls"]),
	},
};
</script>

<style lang="scss" scoped>
@import "@/styles/tabs";
</style>
