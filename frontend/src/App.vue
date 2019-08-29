<template>
	<div id="app">
		<div v-if="isAuthenticated">
			<TheTopbar :title="pageTitle" />
			<main>
				<router-view />
			</main>
		</div>
		<TheLogin v-else />
	</div>
</template>

<script>
import TheTopbar from "@/components/TheTopbar.vue";
import TheLogin from "@/components/TheLogin.vue";
import { mapGetters } from "vuex";

export default {
	metaInfo: {
		titleTemplate: "%s | Report Viewer",
	},
	data() {
		return {
			pageTitle: "",
		};
	},
	components: { TheLogin, TheTopbar },
	computed: {
		...mapGetters("user", ["isAuthenticated"]),
	},
	mounted() {
		this.pageTitle = this.$meta().refresh().metaInfo.titleChunk;
	},
	updated() {
		this.pageTitle = this.$meta().refresh().metaInfo.titleChunk;
	},
};
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
<style lang="scss" scoped>
main {
	padding: 1rem;
}
</style>
