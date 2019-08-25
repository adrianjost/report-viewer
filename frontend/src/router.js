import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/:org/:repo/:branch/:commit",
			name: "overview",
			component: () => import("./pages/_org/_repo/_branch/_commit/index.vue"),
		},
		{ path: "*", component: () => import("./pages/404.vue") },
	],
});
