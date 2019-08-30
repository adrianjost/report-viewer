<template>
	<div class="main">
		<h1>Report Viewer</h1>
		<BaseButton class="primary" @click="signIn">
			Sign in with GitHub
		</BaseButton>
		<p class="paragraph">
			With report-viewer you can upload and view the outputs your ci script
			produces.
		</p>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import BaseButton from "@/components/BaseButton.vue";

export default {
	components: {
		BaseButton,
	},
	methods: {
		...mapActions("user", ["signIn"]),
	},
};
</script>

<style lang="scss" scoped>
.main {
	text-align: center;
	padding: 30px;
}
</style>
