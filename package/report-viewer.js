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

const optionDefinitions = [
	{ name: "token", alias: "T", type: String }, // Auth Token
	{ name: "files", alias: "F", type: String, multiple: true }, // Glob to Upload
	{ name: "ignore", alias: "I", type: String, multiple: true }, // Glob to ignore
	{ name: "no-predefined-ignore", type: Boolean }, // no default ignore globs
];

const GET_COMMIT_INFO = () => {
	const VALIDATE = (info) =>
		info.ORG && info.REPO && (info.BRANCH || info.PULL) && info.COMMIT;

	const CIRCLE_CI = () => {
		const vars = {
			ORG: process.env.CIRCLE_USERNAME,
			REPO: process.env.CIRCLE_PR_REPONAME,
			// BRANCH: process.env.CIRCLE_BRANCH,
			COMMIT: process.env.CIRCLE_SHA1,
		};
		// TODO what happens if there are multiple URLs?
		// https://circleci.com/docs/2.0/env-vars/
		const PULL_URL =
			process.env.CIRCLE_PULL_REQUEST || process.env.CI_PULL_REQUEST;
		if (PULL_URL) {
			vars.PULL = PULL_URL.split("/").pop();
		} else {
			vars.BRANCH = process.env.CIRCLE_BRANCH;
		}
		return vars;
	};

	const GITHUB = () => {
		// TODO Pull request builds are not supported.
		// Are they even possible with github actions?
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
		const vars = {
			ORG,
			REPO,
			// BRANCH: process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH,
			COMMIT: process.env.TRAVIS_COMMIT,
		};
		if (process.env.TRAVIS_PULL_REQUEST !== "false") {
			vars.PULL = process.env.TRAVIS_PULL_REQUEST;
		} else {
			vars.BRANCH = process.env.TRAVIS_BRANCH;
		}
		return vars;
	};

	const DEFAULT = {
		ORG: process.env.REPORT_VIEWER_ORG,
		REPO: process.env.REPORT_VIEWER_REPO,
		BRANCH: process.env.REPORT_VIEWER_BRANCH,
		PULL: process.env.REPORT_VIEWER_PULL,
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
	const { ORG, REPO, BRANCH, PULL, COMMIT } = GET_COMMIT_INFO();
	const FILE_PATH = file.replace(path.basename(file), "");
	const UPLOAD_URL = `${UPLOAD_URL_BASE}/${FILE_PATH}`;
	const AUTH_TOKEN = userOptions.token || process.env.REPORT_VIEWER_TOKEN;
	if (!AUTH_TOKEN) {
		console.error("Auth token is missing!");
		process.exit(1);
	}

	const formData = {
		org: ORG,
		repo: REPO,
		commit: COMMIT,
		file: fs.createReadStream(file),
	};
	if (BRANCH) {
		formData.branch = BRANCH;
	}
	if (PULL) {
		formData.pull = PULL;
	}

	const options = {
		method: "POST",
		url: UPLOAD_URL,
		headers: {
			Authorization: `Bearer ${AUTH_TOKEN}`,
			"Content-Type": "multipart/form-data",
		},
		formData,
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
	const successfullUploads = uploads.filter(
		(fileUpload) => fileUpload.status === "fulfilled"
	);

	const { ORG, REPO, BRANCH, PULL, COMMIT } = GET_COMMIT_INFO();
	const commitUrl = `https://ci-report-viewer.web.app/${ORG}/${REPO}/${
		PULL ? `pull/${PULL}` : `branch/${BRANCH}`
	}/${COMMIT}`;
	console.log(
		`View ${successfullUploads.length} uploaded file(s) at: ${commitUrl}`
	);
};

main();
