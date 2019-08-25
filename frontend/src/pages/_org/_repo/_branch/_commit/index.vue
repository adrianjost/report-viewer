<template>
	<div class="wrapper">
		<h1>{{path}}</h1>
		<iframe frameborder="0" sandbox :src="`http://localhost:5000/ci-report-viewer/us-central1/proxy/v1_0/${path}/test.html`"></iframe>
	</div>
</template>

<script>
	export default {
		computed: {
			path(){
				return Object.values(this.$route.params).join("/")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper{
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
	}
	iframe{
		flex: 1;
		width: 100%;
	}
</style>