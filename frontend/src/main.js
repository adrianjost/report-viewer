import Vue from "vue";
import VueMeta from "vue-meta";
import AsyncComputed from "vue-async-computed";

import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "./registerServiceWorker";

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

if (process.env.NODE_ENV === "production") {
	Sentry.init({
		release: `report-viewer-frontend@${process.env.PACKAGE_VERSION}`,
		dsn: "https://f3e27256b9bd4ce5adfd7a0b2f6aa8e2@sentry.io/1758562",
		integrations: [
			new Integrations.Vue({ Vue, attachProps: true }),
			new Integrations.CaptureConsole(),
		],
	});
}

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
