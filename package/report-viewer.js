// Copyright (C) 2019 Adrian Jost
// This code is licensed under MIT license (see https://tldrlegal.com/license/mit-license for details)

// Polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

// Dependencies
import fs from "fs";
import path from "path";
import commandLineArgs from "command-line-args";
import glob from "glob";
import request from "request";
import { DEFAULT_ECDH_CURVE } from "tls";

const optionDefinitions = [
	{ name: "token", alias: "T", type: String }, // Auth Token
	{ name: "files", alias: "F", type: String, multiple: true }, // Glob to Upload
	{ name: "ignore", alias: "I", type: String, multiple: true }, // Glob to ignore
	{ name: "no-predefined-ignore", type: Boolean }, // no default ignore globs
];

const GET_COMMIT_INFO = () => {
	const VALIDATE = (info) =>
		info.ORG && info.REPO && info.BRANCH && info.COMMIT;

	const CIRCLE_CI = () => ({
		ORG: process.env.CIRCLE_USERNAME,
		REPO: process.env.CIRCLE_PR_REPONAME,
		BRANCH: process.env.CIRCLE_BRANCH,
		COMMIT: process.env.CIRCLE_SHA1,
	});

	const GITHUB = () => {
		const [ORG, REPO] = (process.env.GITHUB_REPOSITORY || "/").split("/");
		return {
			ORG,
			REPO,
			BRANCH: process.env.GITHUB_REF,
			COMMIT: process.env.GITHUB_SHA,
		};
	};

	const TRAVIS = () => {
		const [ORG, REPO] = (process.env.TRAVIS_REPO_SLUG || "/").split("/");
		return {
			ORG,
			REPO,
			BRANCH:
				process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH,
			COMMIT: process.env.TRAVIS_COMMIT,
		};
	};

	const DEFAULT = {
		ORG: process.env.REPORT_VIEWER_ORG,
		REPO: process.env.REPORT_VIEWER_REPO,
		BRANCH: process.env.REPORT_VIEWER_BRANCH,
		COMMIT: process.env.REPORT_VIEWER_COMMIT,
	};

	let info;
	if (process.env.TRAVIS === "true") {
		info = TRAVIS();
	} else if (process.env.CIRCLECI === "true") {
		info = CIRCLE_CI();
	} else if (process.env.GITHUB_ACTION) {
		info = GITHUB();
	} else {
		info = DEFAULT;
	}
	Object.entries(info).forEach(([key, value]) => {
		if (!value) {
			info[key] = DEFAULT[key];
		}
	});

	if (!VALIDATE(info)) {
		console.error("some enviroment variables are missing.");
		process.exit(1);
	} else {
		return info;
	}
};

const UPLOAD_URL_BASE = true
	? "https://europe-west1-ci-report-viewer.cloudfunctions.net/api/v1_0/upload"
	: "http://localhost:5000/ci-report-viewer/europe-west1/api/v1_0/upload";

const printUsageGuide = () => {
	console.log("Usage Guide");
};

const validateOptions = (options) => {
	if (!options.files || options.files.length === 0) {
		console.error("--files parameter is missing");
		printUsageGuide();
		return false;
	}
	return true;
};

const globIgnorePatterns = ["**/node_modules/**"];

const listFiles = (globPattern, options) => {
	const ignore = options["no-predefined-ignore"]
		? options.ignore || []
		: globIgnorePatterns.concat(options.ignore || []);
	return new Promise((resolve, reject) => {
		glob(globPattern, { ignore }, (err, files) => {
			if (err) {
				return reject(err);
			}
			resolve(files);
		});
	});
};

const upload = (file, userOptions = {}) => {
	const { ORG, REPO, BRANCH, COMMIT } = GET_COMMIT_INFO();
	const FILE_PATH = file.replace(path.basename(file), "");
	const UPLOAD_URL = `${UPLOAD_URL_BASE}/${ORG}/${REPO}/${BRANCH}/${COMMIT}/${FILE_PATH}`;
	const AUTH_TOKEN = userOptions.token || process.env.REPORT_VIEWER_TOKEN;
	if (!AUTH_TOKEN) {
		console.error("Auth token is missing!");
		process.exit(1);
	}

	// console.log(UPLOAD_URL);
	// return Promise.resolve({ file, message: "uploaded" });

	const options = {
		method: "POST",
		url: UPLOAD_URL,
		headers: {
			Authorization: `Bearer ${AUTH_TOKEN}`,
			"Content-Type": "multipart/form-data",
		},
		formData: {
			file: fs.createReadStream(file),
		},
	};

	return new Promise((resolve, reject) =>
		request(options, (err, res, body) => {
			if (err || res.statusCode < 200 || res.statusCode >= 300) {
				return reject({ file, message: err || body });
			}
			return resolve({ file, message: "uploaded" });
		})
	);
};

const main = async () => {
	// Read config
	const options = commandLineArgs(optionDefinitions, { partial: true });
	if (!validateOptions(options)) {
		process.exit(1);
	}

	console.log("Reading files...");
	const files = (await Promise.all(
		options.files.reduce(
			(acc, filePattern) => acc.concat(listFiles(filePattern, options)),
			[]
		)
	)).flat();

	console.log(`Uploading ${files.length} file(s)...`);
	const uploads = await Promise.allSettled(
		files.map((file) => upload(file, options))
	);
	uploads.forEach((fileUpload) => {
		if (fileUpload.status === "fulfilled") {
			console.log("+", fileUpload.value.file, fileUpload.value.message);
		} else {
			console.log("-", fileUpload.reason.file, fileUpload.reason.message);
		}
	});
};

main();
