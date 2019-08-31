<template>
	<nav aria-label="Breadcrumb" class="wrapper">
		<ul class="breadcrumbs">
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
.wrapper {
	position: relative;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		width: 4em;
		height: 2rem;
		background: linear-gradient(-90deg, var(--color-white), transparent);
	}
}
.breadcrumbs {
	display: flex;
	overflow-x: auto;
	margin: 0;
	padding: 0.5rem 0;
	list-style: none;
	.part {
		white-space: nowrap;
		.router-link-exact-active {
			color: inherit;
		}
		&:last-of-type {
			padding-right: 4em;
		}
	}
	/* Add a slash symbol (/) before/behind each list item */
	.part + .part::before {
		padding: 0.5rem;
		content: "/";
	}
}
</style>
