// Copyright (C) 2019 Adrian Jost
// This code is licensed under MIT license (see https://tldrlegal.com/license/mit-license for details)

// Polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

// Dependencies
import commandLineArgs from "command-line-args";
import glob from "glob";

const optionDefinitions = [
	{ name: "files", alias: "F", type: String, multiple: true },
	{ name: "ignore", alias: "I", type: String, multiple: true },
	{ name: "no-predefined-ignore", type: Boolean },
];

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

const listFiles = (globPattern) => {
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

const upload = (file) => {
	return file;
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
			(acc, filePattern) => acc.concat(listFiles(filePattern)),
			[]
		)
	)).flat();

	console.log(`Uploading ${files.length} file(s)...`);
	const uploads = await Promise.allSettled(files.map((file) => upload(file)));
	uploads.forEach((fileUpload, index) => {
		console.log(
			fileUpload.status === "fulfilled" ? "+" : "-",
			`"${fileUpload.value}"`,
			fileUpload.status === "fulfilled" ? "uploaded" : "failed"
		);
	});
};

return main();
