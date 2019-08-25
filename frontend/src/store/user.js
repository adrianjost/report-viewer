import firebase, { auth } from "../firebase";

const state = {
	info: undefined,
};

const getters = {
	isAuthenticated: (state) => {
		return !!state.info;
	},
	get: (state) => {
		return state.info;
	},
};

const mutations = {
	setInfo(state, user) {
		state.info = user;
	},
};

const actions = {
	async signIn({ commit }) {
		const provider = new firebase.auth.GithubAuthProvider();
		provider.addScope("repo:status");
		auth
			.signInWithPopup(provider)
			.then(function(result) {
				commit("github/setToken", result.credential.accessToken, {
					root: true,
				});
				result.user.credential = result.credential;
				commit("setInfo", result.user);
			})
			.catch(function(error) {
				console.error(`${error.code} - ${error.message}`);
			});
	},
	async signOut({ commit }) {
		auth.signOut().then(() => {
			commit("github/setToken", undefined, { root: true });
			commit("setInfo", undefined);
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
