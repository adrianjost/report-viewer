const state = {
	token: undefined,
	user: undefined,
	orgs: [],
	repos: [],
	repoRights: {},
};

const getters = {
	repos(state) {
		return state.repos;
	},
};

const mutations = {
	setToken(state, token) {
		state.token = token;
	},
	setOrgs(state, orgs) {
		state.orgs = orgs;
	},
	setUser(state, user) {
		state.user = user;
	},
	setRepos(state, repos) {
		state.repos = repos;
	},
	setRepoRights(state, { slug, data }) {
		state.repoRights[slug] = data;
	},
};

// TODO implement pagination
// The response will contain a Link Header with all links to more related pages that should also be fetched
const actions = {
	fetchUsername({ commit, state }) {
		return fetch("https://api.github.com/user", {
			headers: { Authorization: `token ${state.token}` },
		})
			.then((res) => res.json())
			.then((user) => {
				commit("setUser", user);
				return user;
			});
	},
	fetchOrgs({ dispatch, commit, state }) {
		return dispatch("fetchUsername")
			.then(({ login }) =>
				fetch(`https://api.github.com/users/${login}/orgs`, {
					headers: { Authorization: `token ${state.token}` },
				})
			)
			.then((res) => res.json())
			.then((orgs) => {
				commit("setOrgs", orgs);
				return orgs;
			});
	},
	fetchOrgRepos({ state, dispatch }) {
		const headers = { Authorization: `token ${state.token}` };
		return dispatch("fetchOrgs")
			.then((orgs) =>
				Promise.all(
					orgs.map((org) =>
						fetch(`${org.repos_url}?sort=updated`, { headers }).then((res) =>
							res.json()
						)
					)
				)
			)
			.then((repos) => repos.flat());
	},
	fetchUserRepos({ state }) {
		return fetch("https://api.github.com/user/repos?sort=updated", {
			headers: {
				Authorization: `token ${state.token}`,
			},
		}).then((res) => res.json());
	},
	async fetchRepos({ state, commit, dispatch }) {
		if (!state.token) {
			console.error("unauthorized");
			return [];
		}
		const repos = await Promise.all([
			dispatch("fetchUserRepos"),
			dispatch("fetchOrgRepos"),
		]).then((repos) =>
			repos.flat().sort((a, b) => b.updated_at.localeCompare(a.updated_at))
		);
		commit("setRepos", repos);
		return repos;
	},
	async fetchRepoRights({ state, commit }, { slug, forceFetch }) {
		if (!slug) {
			console.error("fetchRepoRights - slug is missing");
			return {};
		}
		if (forceFetch !== true && state.repoRights[slug] !== undefined) {
			return state.repoRights[slug];
		}
		const data = await fetch(`https://api.github.com/repos/${slug}`, {
			headers: { Authorization: `token ${state.token}` },
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Request failed", await res.json());
				}
				return res.json();
			})
			.catch(() => {
				return { permissions: {} };
			});
		const permissions = data.permissions;
		commit("setRepoRights", { slug, data: permissions });
		return permissions;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
