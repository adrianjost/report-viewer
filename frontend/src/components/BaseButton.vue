<template>
	<button class="button" :type="type" v-on="$listeners" v-bind="$attrs">
		<slot></slot>
	</button>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: "button",
		},
	},
};
</script>

<style lang="scss" scoped>
.button {
	font-weight: bold;
	color: #2c3e50;

	background: transparent;
	border: 1px solid;
	border-radius: var(--radius-sm);
	font-size: 18px;
	padding: 8px 16px;
	transition: box-shadow 0.3s ease;

	&:hover,
	&:focus {
		box-shadow: 0 0 0 1px;
		outline: none;
		text-decoration: underline;
	}
	&.primary {
		color: var(--color-primary);
	}
}
</style>
