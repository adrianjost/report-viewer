const webpack = require("webpack");
const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || "0.0.0";

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
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				"process.env": {
					PACKAGE_VERSION: `"${version}"`,
				},
			}),
		],
	},
};
