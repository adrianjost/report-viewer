<template>
	<div>
		<FetchDoc
			url="/api/123"
			:options="{
				method: 'POST',
				headers: {
					Authentication: 'String',
					CORS: 'String',
				},
			}"
		/>
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
import FetchDoc from "@/components/fetchDoc.vue";
import { mapActions, mapGetters } from "vuex";

export default {
	metaInfo() {
		return {
			title: `Home`,
		};
	},
	components: { FetchDoc },
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
