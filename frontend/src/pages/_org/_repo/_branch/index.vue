<template>
	<div>
		<h2>
			<router-link :to="{ name: 'home' }">Home</router-link>
			/
			<router-link :to="{ name: 'org', params: { org } }">{{
				org
			}}</router-link>
			/
			<router-link :to="{ name: 'repo', params: { org, repo } }">{{
				repo
			}}</router-link>
			/
			<span>{{ branch }}</span>
		</h2>
		<h1>Branch</h1>
		<ol>
			<li v-for="commit in currentCommits" :key="commit.commit">
				<router-link
					:to="{
						name: 'commit',
						params: {
							org,
							repo,
							branch,
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
import { mapActions, mapGetters } from "vuex";

export default {
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
