module.exports = {
	pwa: {
		name: "Report Viewer",
		themeColor: "#2bb477",
		msTileColor: "#2bb477",
		appleMobileWebAppCapable: "yes",
		appleMobileWebAppStatusBarStyle: "black",

		workboxPluginMode: "InjectManifest",
		workboxOptions: {
			swSrc: "src/service-worker.js",
		},
	},
};
