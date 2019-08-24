const state = {
	token: undefined,
	user: undefined,
	orgs: [],
	repos: [],
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
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
