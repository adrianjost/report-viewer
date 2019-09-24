<template>
	<ol v-if="!loading" class="item-list">
		<li v-for="(item, index) in items" :key="item.id">
			<router-link :to="item.to" class="item-list--item">
				<span class="item-list--bullet">{{ index + 1 }}.</span>
				<span class="item-list--text">
					<span class="item-list--title">{{ item.title }}</span>
					<span class="item-list--subtitle" v-if="item.subtitle">{{
						item.subtitle
					}}</span>
				</span>
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
		items: {
			type: Array,
			required: true,
		},
		loading: {
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
.item-list {
	list-style: none;
	padding: 0 4px;
	margin: 0;
	&--item {
		display: flex;
		align-items: center;
		padding: 0.5rem 0;
	}
	&--bullet {
		display: inline-flex;
		height: 1.75rem;
		width: 1.75rem;
		padding: 0.25rem;
		align-items: center;
		justify-content: flex-end;
		white-space: nowrap;
		font-family: monospace;
		background: #eee;
		color: initial;
		margin-right: 1rem;
		border-radius: 100%;
	}
	&--text {
		flex: 1;
		& > span {
			display: block;
		}
	}
	&--title {
		font-weight: bold;
	}
	&--subtitle {
		color: var(--color-gray);
	}
}
</style>
