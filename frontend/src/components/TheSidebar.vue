<template>
	<div>
		<div v-for="repo in repos" :key="repo.id">
			<router-link
				:to="{
					params: {
						id: repo.full_name,
					},
				}"
				>{{ repo.full_name }}</router-link
			>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters("github", ["repos"]),
	},
};
</script>

<style lang="scss" scoped></style>
