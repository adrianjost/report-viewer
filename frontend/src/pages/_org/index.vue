<template>
	<div>
		<Breadcrumb :config="breadcrumbConfig" />
		<h1>Repos</h1>
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import { mapActions, mapGetters } from "vuex";
export default {
	components: { Breadcrumb },
	created() {
		this.fetchRepos(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentRepos"]),
		org() {
			return this.$route.params.org;
		},
		breadcrumbConfig() {
			return [{ text: "Home", to: { name: "home" } }, { text: this.org }];
		},
	},
	methods: {
		...mapActions("reports", ["fetchRepos"]),
	},
};
</script>

<style lang="scss" scoped></style>
