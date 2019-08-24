const express = require("express");
// const bodyParser = require("body-parser");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// INIT

try {
	admin.initializeApp({
		credential: admin.credential.applicationDefault(),
		databaseURL: "https://ci-report-viewer.firebaseio.com",
		storageBucket: "gs://ci-report-viewer.appspot.com/",
	});
} catch (e) {
	console.error(e);
}

const routes = require("./routes");

const app = express();

/*
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
*/

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use((req, res, next) => {
	console.info(`${req.method} ${req.originalUrl}`) 

	res.on('finish', () => {
		if(res.statusCode >= 300){
			console.warn(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
		}
	})

	next()
})

app.use("/v1_0", routes);

exports = module.exports = functions.https.onRequest(app);