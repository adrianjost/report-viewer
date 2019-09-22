<template>
	<ItemList :items="currentOrgs" :loading="!currentOrgs.length" />
</template>

<script>
import ItemList from "@/components/ItemList.vue";

import { mapActions } from "vuex";

export default {
	components: {
		ItemList,
	},
	metaInfo() {
		return {
			title: `Home`,
		};
	},
	created() {
		this.fetchOrgs();
	},
	computed: {
		currentOrgs() {
			return this.$store.getters["reports/currentOrgs"].map((org) => ({
				to: {
					name: "org",
					params: {
						org: org.org,
					},
				},
				title: org.org,
				id: org.org,
			}));
		},
	},
	methods: {
		...mapActions("reports", ["fetchOrgs"]),
	},
};
</script>

<style lang="scss" scoped></style>
