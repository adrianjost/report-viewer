<template>
	<ol class="commit-list" v-if="commits.length">
		<li v-for="commit in commits" :key="commit.id" class="list-item">
			<router-link
				:to="{
					name: routeName,
					params: getRouteParams(commit),
				}"
			>
				<div class="title">
					{{ new Date(commit.updated_at).toLocaleString() }}
				</div>
				<div class="sub-title">
					{{ commit.commit }}
				</div>
			</router-link>
		</li>
	</ol>
	<ListPlaceholder v-else />
</template>

<script>
import ListPlaceholder from "@/components/ListPlaceholder.vue";

export default {
	components: {
		ListPlaceholder,
	},
	props: {
		commits: {
			type: Array,
			required: true,
		},
		routeName: {
			type: String,
			required: true,
		},
		routeParams: {
			type: Object,
			default: () => ({}),
		},
	},
	methods: {
		getRouteParams(commit) {
			return { ...this.routeParams, commit: commit.commit };
		},
	},
};
</script>

<style lang="scss" scoped>
.commit-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.list-item {
	padding: 0.5rem;
	.title {
		font-weight: var(--font-bold);
	}
	.sub-title {
		color: var(--color-gray);
		font-size: var(--font-sm);
	}
}
</style>
