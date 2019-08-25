<template>
  <div>
    		<h1>
                   			<router-link :to="{name: 'home' }">home</router-link>
/
			<router-link :to="{name: 'org', params: { org }}">{{ org }}</router-link>
			/
			<span>{{ repo }}</span>
		</h1>
    <ol>
      <li v-for="branch in currentBranches" :key="branch.branch">
        <router-link :to="{
          name: 'branch',
          params: {
            org, repo, branch: branch.branch
          }
          }">
          {{branch.branch}}
        </router-link>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    created(){
			this.fetchBranches(this.$route.params);
		},
  computed: {
    ...mapGetters("reports", ["currentBranches"]),
    org(){
      return this.$route.params.org;
    },
    repo(){
      return this.$route.params.repo;
    },
  },
  methods: {
			...mapActions("reports", ["fetchBranches"]),
		}
}
</script>

<style lang="scss" scoped>

</style>