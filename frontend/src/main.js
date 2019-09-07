import Vue from "vue";
import VueMeta from "vue-meta";
import AsyncComputed from "vue-async-computed";

import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "./registerServiceWorker";

Vue.use(AsyncComputed);

Vue.use(VueMeta, {
	// optional pluginOptions
	refreshOnceOnNavigation: true,
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
