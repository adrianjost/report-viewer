/* global importScripts workbox */

// import service worker script
importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js"
);

// Cache First for reports
workbox.routing.registerRoute(
	new RegExp(
		`https://europe-west1-ci-report-viewer\\.cloudfunctions\\.net/proxy/v1_0/.*`
	),
	new workbox.strategies.CacheFirst({ cacheName: "reports" })
);
