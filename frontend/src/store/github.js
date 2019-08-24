const state = {
	token: undefined,
};

const getters = {};

const mutations = {
	setToken(state, token) {
		state.token = token;
	},
};

const actions = {};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
