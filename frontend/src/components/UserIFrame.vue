<template>
	<div :class="{ loading, letter: true }">
		<iframe v-show="!loading"
			frameborder="0"
			sandbox="allow-scripts"
			:src="frameSrc"
			@load="loading = false"
		></iframe>
	</div>
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
	watch: {
		path(){
			this.loading = true
		}
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
	width: 100%;
}
.letter {
	flex: 1;
	display: flex;
	width: calc(100% - 2rem);
	background: #eee;
	margin: 2rem 1rem;
	position: relative;
	background: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	&.loading {
		content: "";
		background-image: url("../assets/loading.svg");
		background-size: contain;
    background-repeat: repeat-y;
    background-position: top center;
	}
}
.letter:before,
.letter:after {
	content: "";
	height: 98%;
	position: absolute;
	width: 100%;
	z-index: -1;
	transition: transform 0.3s ease;
}
.letter:before {
	background: #fafafa;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
	left: -5px;
	top: 4px;
	transform: rotate(-2.5deg);
	@media screen and (min-width: 600px) {
		transform: rotate(-1.2deg);
	}
}
.letter:after {
	background: #f6f6f6;
	box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
	right: -3px;
	top: 1px;
	transform: rotate(1.4deg);
	@media screen and (min-width: 600px) {
		transform: rotate(0.8deg);
	}
}
</style>
