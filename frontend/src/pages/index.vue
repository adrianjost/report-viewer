<template>
	<div>
		<ol>
			<li v-for="org in currentOrgs" :key="org.org">
				<router-link
					:to="{
						name: 'org',
						params: {
							org: org.org,
						},
					}"
				>
					{{ org.org }}
				</router-link>
			</li>
		</ol>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
	metaInfo() {
		return {
			title: `Home`,
		};
	},
	created() {
		this.fetchOrgs();
	},
	computed: {
		...mapGetters("reports", ["currentOrgs"]),
	},
	methods: {
		...mapActions("reports", ["fetchOrgs"]),
	},
};
</script>

<style lang="scss" scoped></style>
