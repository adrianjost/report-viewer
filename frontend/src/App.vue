<template>
	<div id="app">
		<router-view v-if="signedIn" />
		<div id="nav" v-else>
			<h1>Report Viewer</h1>
			<button class="login" type="button" @click="signIn">
				Sign in with GitHub
			</button>
		</div>
	</div>
</template>

<script>
import { mapActions } from "vuex";
export default {
	computed: {
		signedIn() {
			return false;
		},
	},
	mounted() {
		/*
		fetch("https://api.github.com/user/repos", {
			headers: {
				Authorization: "token 65b9e442819fee54b6c06c3d7844f69ad946eaf8"
			}
		}).then(res => res.json()).then(repos => console.log(repos.map(r => r.full_name)))
		fetch("https://api.github.com/users/adrianjost/orgs", {
			headers: {
				Authorization: "token 65b9e442819fee54b6c06c3d7844f69ad946eaf8"
			}
		}).then(res => res.json()).then(
			res => {
				console.log(res)
				res.map(org => {
					fetch(org.repos_url, {
						headers: {
							Authorization: "token 65b9e442819fee54b6c06c3d7844f69ad946eaf8"
						}
					}).then(res => res.json()).then(console.log)
				})
			}
		)
		*/
	},
	methods: {
		...mapActions("user", ["signIn"]),
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
