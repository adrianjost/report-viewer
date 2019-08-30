<template>
	<div>
		<h2>Branches</h2>
		<ol>
			<li v-for="branch in currentBranches" :key="branch.branch">
				<router-link
					:to="{
						name: 'branch',
						params: {
							org,
							repo,
							branch: branch.branch,
						},
					}"
				>
					{{ branch.branch }}
				</router-link>
			</li>
		</ol>
		<h2>Pulls</h2>
		<ol>
			<li v-for="pull in currentPulls" :key="pull.pull">
				<router-link
					:to="{
						name: 'pull',
						params: {
							org,
							repo,
							pull: pull.pull,
						},
					}"
				>
					{{ pull.pull }}
				</router-link>
			</li>
		</ol>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Branches & Pulls`,
		};
	},
	created() {
		this.fetchBranches(this.$route.params);
		this.fetchPulls(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentBranches", "currentPulls"]),
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

<style lang="scss" scoped></style>
