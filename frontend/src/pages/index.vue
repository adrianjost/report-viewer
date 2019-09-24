<template>
	<ItemList :items="currentOrgs" :loading="!currentOrgs.length" />
</template>

<script>
import ItemList from "@/components/ItemList.vue";
import { formatDistance } from "date-fns";

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
				subtitle: `${this.getRelativeTime(org.updated_at)} ago updated`,
				id: org.org,
			}));
		},
	},
	methods: {
		...mapActions("reports", ["fetchOrgs"]),
		getRelativeTime(timestamp) {
			return formatDistance(new Date(timestamp), new Date());
		},
	},
};
</script>

<style lang="scss" scoped></style>
