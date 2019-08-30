<template>
	<div id="app">
		<a
			tabindex="1"
			class="show-on-focus skip-to-content"
			@keypress.enter="skipToContent"
		>
			Skip to content
		</a>
		<div v-if="isAuthenticated">
			<TheTopbar :title="pageTitle" class="topbar">
				<template v-slot:subtitle v-if="breadcrumbs.length > 1">
					<TheBreadcrumb :config="breadcrumbs" />
				</template>
				<template v-slot:right>
					<BaseButton @click="signOut">Logout</BaseButton>
				</template>
			</TheTopbar>
			<main id="start-of-content">
				<router-view />
			</main>
		</div>
		<TheLogin v-else />
	</div>
</template>

<script>
import TheTopbar from "@/components/TheTopbar.vue";
import TheBreadcrumb from "@/components/TheBreadcrumb.vue";
import BaseButton from "@/components/BaseButton.vue";
import TheLogin from "@/components/TheLogin.vue";
import { mapGetters, mapActions } from "vuex";

export default {
	metaInfo: {
		titleTemplate: "%s | Report Viewer",
	},
	data() {
		return {
			pageTitle: "",
		};
	},
	components: { TheLogin, TheTopbar, TheBreadcrumb, BaseButton },
	computed: {
		...mapGetters("user", ["isAuthenticated"]),
		breadcrumbs() {
			const routeParts =
				this.$route.path === "/" ? [] : this.$route.path.split("/");
			return routeParts.map((part, index) => {
				const url = routeParts.slice(0, index + 1).join("/");
				const match = this.$router.matcher.match(url);
				const breadcrumb = { text: part || "Home" };
				if (match.name) {
					breadcrumb.to = {
						name: match.name,
						params: match.params,
					};
				}
				if (match.path === this.$route.path) {
					breadcrumb["aria-current"] = "page";
				}
				return breadcrumb;
			});
		},
	},
	methods: {
		...mapActions("user", ["signOut"]),
		skipToContent() {
			document
				.querySelector("main")
				.querySelector("a,button:not([disabled])")
				.focus();
		},
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
.show-on-focus {
	clip: rect(1px, 1px, 1px, 1px);
	margin: 0;
	height: 1px;
	overflow: hidden;
	position: absolute;
	width: 1px;
	&:focus {
		clip: auto;
		height: auto;
		width: auto;
		z-index: 20;
	}
}
.skip-to-content {
	display: block;
	padding: 16px 8px;
	position: fixed;
	top: 0;
	left: 0;
	background-color: var(--color-accent);
	color: var(--color-white);
}
</style>
