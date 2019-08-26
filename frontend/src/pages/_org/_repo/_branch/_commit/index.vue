<template>
	<div class="wrapper">
		<h1>
			<router-link :to="{ name: 'home' }">Home</router-link>
			/
			<router-link :to="{ name: 'org', params: { org } }">{{
				org
			}}</router-link>
			/
			<router-link :to="{ name: 'repo', params: { org, repo } }">{{
				repo
			}}</router-link>
			/
			<router-link :to="{ name: 'branch', params: { org, repo, branch } }">{{
				branch
			}}</router-link>
			/
			<span>{{ commit }}</span>
		</h1>
		<ul v-if="availableEntrypoints.length > 1">
			<li v-for="file in availableEntrypoints" :key="file">
				<button @click="viewFile(file)">
					{{ file }}
				</button>
			</li>
		</ul>
		<p v-if="loaderVisible">loading report...</p>
		<iframe
			frameborder="0"
			sandbox
			:src="activeEntrypointUrl"
			@load="loaderVisible = false"
		></iframe>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	data() {
		return {
			loaderVisible: true,
			activeEntrypoint: undefined,
		};
	},
	created() {
		this.fetchFiles(this.$route.params);
	},
	computed: {
		...mapGetters("reports", ["currentFiles"]),
		org() {
			return this.$route.params.org;
		},
		repo() {
			return this.$route.params.repo;
		},
		branch() {
			return this.$route.params.branch;
		},
		commit() {
			return this.$route.params.commit;
		},
		availableEntrypoints() {
			return this.currentFiles.filter((file) => file.endsWith(".html"));
		},
		activeEntrypointUrl() {
			const file = this.activeEntrypoint || this.availableEntrypoints[0];
			return file ? `${process.env.VUE_APP_FILE_PROXY_URL}/${file}` : "";
		},
	},
	methods: {
		...mapActions("reports", ["fetchFiles"]),
		viewFile(file) {
			this.activeEntrypoint = file;
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
}
iframe {
	flex: 1;
	width: 100%;
}
</style>
