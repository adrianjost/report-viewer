<template>
	<iframe
		frameborder="0"
		sandbox="allow-scripts"
		:class="{ loading }"
		:src="frameSrc"
		@load="loading = false"
	></iframe>
</template>

<script>
export default {
	props: {
		path: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			loading: true,
		};
	},
	computed: {
		frameSrc() {
			return `${process.env.VUE_APP_FILE_PROXY_URL}/${this.path}`;
		},
	},
};
</script>

<style lang="scss" scoped>
iframe {
	flex: 1;
	width: calc(100% - 6rem);
	background: #eee;
	margin: 2rem;
	padding: 1rem;
	border: 2px dashed #555;
	border-radius: 1rem;
	position: relative;
	&.loading:before {
		content: "loading report...";
		position: absolute;
	}
}
</style>
