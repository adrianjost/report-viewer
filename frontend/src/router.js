import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/:org/:repo/branch/:branch/:commit",
			name: "branch_commit",
			component: () =>
				import("./pages/_org/_repo/branch/_branch/_commit/index.vue"),
		},
		{
			path: "/:org/:repo/branch/:branch",
			name: "branch",
			component: () => import("./pages/_org/_repo/branch/_branch/index.vue"),
		},
		{
			path: "/:org/:repo/pull/:pull/:commit",
			name: "pull_commit",
			component: () =>
				import("./pages/_org/_repo/pull/_pull/_commit/index.vue"),
		},
		{
			path: "/:org/:repo/pull/:pull",
			name: "pull",
			component: () => import("./pages/_org/_repo/pull/_pull/index.vue"),
		},
		{
			path: "/:org/:repo",
			name: "repo",
			component: () => import("./pages/_org/_repo/index.vue"),
		},
		{
			path: "/:org",
			name: "org",
			component: () => import("./pages/_org/index.vue"),
		},
		{ path: "/", name: "home", component: () => import("./pages/index.vue") },
		{ path: "*", component: () => import("./pages/404.vue") },
	],
});
