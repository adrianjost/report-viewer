import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
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
		component: () => import("./pages/_org/_repo/pull/_pull/_commit/index.vue"),
	},
	{
		path: "/:org/:repo/pull/:pull",
		name: "pull",
		component: () => import("./pages/_org/_repo/pull/_pull/index.vue"),
	},
	{
		path: "/:org/:repo/settings",
		name: "repo_settings",
		component: () => import("./pages/_org/_repo/settings.vue"),
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
	{
		path: "/",
		name: "home",
		component: () => import("./pages/index.vue"),
	},
	// { path: "/*", name: "default", component: () => import("./pages/404.vue") },
];

// all routes must have a name
if (routes.some((route) => !route.name)) {
	throw new Error("some routes are missing a name");
}

const router = new Router({
	mode: "history",
	routes,
});

export default router;
