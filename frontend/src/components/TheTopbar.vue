<template>
	<div class="topbar">
		<h1 class="title">
			{{ title }}
		</h1>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.topbar {
	width: 100%;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	padding: 0.5rem;
}
</style>
