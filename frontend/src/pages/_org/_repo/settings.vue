<template>
	<div v-if="isRepoAdmin">
		<h2>Tokens</h2>
		<ul>
			<li v-for="token in tokens" :key="token.id">
				{{ token.token }}
				<button type="button" @click="removeRepoToken(token.id)">Remove</button>
			</li>
		</ul>
		<button>Generate new Token</button>
	</div>
	<div v-else>
		Sorry, you don't have the rights to do this.
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	metaInfo() {
		return {
			title: `Repo Settings`,
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
		org() {
			return this.$route.params.org;
		},
		repo() {
			return this.$route.params.repo;
		},
		tokens() {
			return [{ id: "abc", token: "def" }];
		},
	},
	methods: {
		...mapActions("reports", ["fetchBranches", "fetchPulls"]),
		removeRepoToken(token) {
			console.log("remove token", token);
		},
	},
};
</script>

<style lang="scss" scoped></style>
