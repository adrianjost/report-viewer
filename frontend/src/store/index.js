import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import user from "./user";
import github from "./github";
import reports from "./reports";

export default new Vuex.Store({
	plugins: [createPersistedState()],
	modules: {
		user,
		github,
		reports,
	},
});
