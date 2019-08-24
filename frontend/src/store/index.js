import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import user from "./user";
import github from "./github";

export default new Vuex.Store({
	modules: {
		user,
		github,
	},
});
