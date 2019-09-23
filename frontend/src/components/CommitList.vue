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
					{{ getRelativeTime(commit.updated_at) }} ago
					<span class="timestamp">
						{{ new Date(commit.updated_at).toLocaleString() }}
					</span>
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
import { formatDistance } from "date-fns";

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
		getRelativeTime(timestamp) {
			return formatDistance(new Date(timestamp), new Date());
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
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.timestamp {
			color: var(--color-gray-dark);
			font-weight: var(--font-light);
		}
		> * {
			white-space: nowrap;
		}
	}
	.sub-title {
		color: var(--color-gray);
		font-size: var(--font-sm);
	}
	&:nth-of-type(2n) {
		background-color: #eee;
	}
}
</style>
