<template>
	<div class="main">
		<h1>Report Viewer</h1>
		<button class="login" type="button" @click="signIn">
			Sign in with GitHub
		</button>
		<p class="paragraph">
			With report-viewer you can upload and view the outputs your ci script
			produces.
		</p>
	</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
	methods: {
		...mapActions("user", ["signIn"]),
	},
};
</script>

<style lang="scss" scoped>
.main {
	text-align: center;
	padding: 30px;

	.login {
		background: transparent;
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-sm);
		font-size: 20px;
		padding: 8px 16px;
		transition: box-shadow 0.3s ease;
		&:hover,
		&:focus {
			box-shadow: 0 0 0 1px;
			outline: none;
			text-decoration: underline;
		}
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
