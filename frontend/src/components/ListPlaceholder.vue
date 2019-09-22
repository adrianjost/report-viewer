<template>
	<BulletListLoader :width="250" :speed="2" class="bullet-loader" />
</template>

<script>
import { BulletListLoader } from "vue-content-loader";

export default {
	components: {
		BulletListLoader,
	},
};
</script>

<style lang="scss" scoped>
.bullet-loader {
	max-width: 400px;
}
</style>
