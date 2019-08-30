<template>
	<div>
		<ol>
			<li v-for="repo in currentRepos" :key="repo.repo">
				<router-link
					:to="{
						name: 'repo',
						params: {
							org,
							repo: repo.repo,
						},
					}"
				>
					{{ repo.repo }}
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
			title: `Repos`,
		};
	},
	created() {
		this.fetchRepos(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentRepos"]),
		org() {
			return this.$route.params.org;
		},
	},
	methods: {
		...mapActions("reports", ["fetchRepos"]),
	},
};
</script>

<style lang="scss" scoped></style>
