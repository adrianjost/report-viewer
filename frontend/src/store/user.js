import firebase, { auth } from "../firebase";
import { configureScope } from "@sentry/browser";

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
		configureScope((scope) => {
			scope.setUser({ uid: user.uid });
		});
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
			commit("reset", undefined, { root: true });
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
