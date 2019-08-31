<template>
	<div class="topbar">
		<div class="main">
			<slot name="left">
				<div class="left">
					<h1 class="title">
						<slot name="title">{{ title }}</slot>
					</h1>
					<div class="subtitle"></div>
				</div>
			</slot>
			<slot name="right"></slot>
		</div>
		<slot name="subtitle">{{ subtitle }}</slot>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.topbar {
	width: 100%;
	box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
	padding: 0.5rem 2rem;
	@media screen and (max-width: 600px) {
		padding: 0.5rem;
	}
	.main {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.title {
		margin: 0;
	}
}
</style>
