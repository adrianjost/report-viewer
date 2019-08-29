<template>
	<nav>
		<ul class="breadcrumb">
			<li
				v-for="(part, index) in config"
				:key="`${index}-${part.text}`"
				class="part"
			>
				<component :is="getComponent(part)" v-bind="removeText(part)">{{
					part.text
				}}</component>
			</li>
		</ul>
	</nav>
</template>
<script>
export default {
	props: {
		config: {
			type: Array,
			required: true,
		},
	},
	methods: {
		// eslint-disable-next-line no-unused-vars
		removeText({ text, ...part }) {
			return part;
		},
		getComponent(part) {
			return part.to ? "router-link" : "span";
		},
	},
};
</script>

<style lang="scss" scoped>
.breadcrumb {
	display: inline-flex;
	flex-wrap: wrap;
	padding: 0.5rem;
	list-style: none;
	.part {
		white-space: nowrap;
	}
	/* Add a slash symbol (/) before/behind each list item */
	.part + .part::before {
		padding: 0.5rem;
		content: "/";
	}
}
</style>
