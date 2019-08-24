<template>
	<div id="app">
		<router-view v-if="isAuthenticated" />
		<div id="nav" v-else>
			<h1>Report Viewer</h1>
			<button class="login" type="button" @click="signIn">
				Sign in with GitHub
			</button>
			<button class="login" type="button" @click="fetchRepos">
				Fetch Repos
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	computed: {
		...mapGetters("user", ["isAuthenticated"])
	},
	methods: {
		...mapActions("user", ["signIn"]),
		...mapActions("github", ["fetchRepos"]),
	},
};
</script>

<style lang="scss">
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
#nav {
	padding: 30px;

	.login {
		background: transparent;
		color: #333;
		border: 1px solid #333;
		border-radius: 2px;
		font-size: 20px;
		padding: 8px 16px;
	}

	a,
	button {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
