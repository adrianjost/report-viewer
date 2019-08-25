const express = require("express");
const proxy = require("http-proxy-middleware");
const functions = require("firebase-functions");

const app = express();

const FIREBASE_HOST = "https://firebasestorage.googleapis.com";
const FIREBASE_PREFIX = `/v0/b/${process.env.FIREBASE_CONFIG.storageBucket ||
	"ci-report-viewer.appspot.com"}/o/`;

const storageProxy = proxy({
	target: FIREBASE_HOST,
	changeOrigin: true,
	pathRewrite: (path, req) => {
		const resourcePath =
			FIREBASE_PREFIX + encodeURIComponent(req.params[0]) + "?alt=media";
		console.log(FIREBASE_HOST + resourcePath);
		return resourcePath;
	},
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use("/v1_0/*", storageProxy);

exports = module.exports = functions
	.region("europe-west1")
	.https.onRequest(app);
