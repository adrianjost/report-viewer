<template>
	<div id="app">
		<router-view v-if="isAuthenticated" />
		<div id="nav" v-else>
			<h1>Report Viewer</h1>
			<button class="login" type="button" @click="signIn">
				Sign in with GitHub
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	computed: {
		...mapGetters("user", ["isAuthenticated"]),
	},
	methods: {
		...mapActions("user", ["signIn"]),
	},
};
</script>

<style lang="scss">
body,
#app {
	min-height: 100vh;
	width: 100%;
	margin: 0;
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
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
