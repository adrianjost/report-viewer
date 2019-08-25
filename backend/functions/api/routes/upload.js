const express = require("express");
const router = express.Router();

const { fileParser } = require("express-multipart-file-parser");

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const db = admin.firestore();

const addFileToDb = async ({ org, repo, branch, commit, filePath }) => {
	const existingFileId = await db
		.collection("files")
		.where("org", "==", org)
		.where("repo", "==", repo)
		.where("branch", "==", branch)
		.where("commit", "==", commit)
		.where("filePath", "==", filePath)
		.get()
		.then((querySnapshot) => {
			return querySnapshot.docs.length ? querySnapshot.docs[0].id : undefined;
		});
	return existingFileId
		? db
				.collection("files")
				.doc(existingFileId)
				.set({ timestamp: Date.now() }, { merge: true })
		: db
				.collection("files")
				.add({ org, repo, branch, commit, filePath, timestamp: Date.now() });
};

const uploadFile = async ({
	org,
	repo,
	branch,
	commit,
	directory,
	filename,
	file,
}) => {
	const filePath = !!directory
		? `${org}/${repo}/${branch}/${commit}/${directory}/${filename}`
		: `${org}/${repo}/${branch}/${commit}/${filename}`;
	const fileReference = bucket.file(filePath);
	const res = await fileReference.save(new Buffer.from(file.buffer));
	await fileReference.makePublic();
	await fileReference.setMetadata({
		contentType: file.mimetype,
	});
	await addFileToDb({
		org,
		repo,
		branch,
		commit,
		filePath: filePath,
	});
	return res;
};

const userIsAuthorized = async (req) => {
	if (!req.headers.authorization) {
		return {
			code: 401,
			message: "missing authorization header",
		};
	}
	const isTokenValid = await db
		.collection("auth-tokens")
		.where("token", "==", req.headers.authorization.slice(7))
		.where("org", "==", req.params.org)
		.where("repo", "==", req.params.repo)
		.get()
		.then((querySnapshot) => {
			return Boolean(querySnapshot.docs.length);
		})
		.catch(() => {
			return false;
		});
	if (!isTokenValid) {
		throw {
			code: 401,
			message: "authorization failed",
		};
	}
	return true;
};

router.post(
	"/:org/:repo/:branch/:commit*",
	fileParser({
		rawBodyOptions: {
			limit: "1mb",
		},
		busboyOptions: {
			limits: {
				fields: 0,
				files: 1, // only parse first file
			},
		},
	}),
	async (req, res) => {
		// EXTRACT METADATA
		const org = req.params.org;
		const repo = req.params.repo;
		const branch = req.params.branch;
		const commit = req.params.commit;
		const directory = req.params[0].replace(/(\/)+$/, "");

		// AUTHORIZATION
		try {
			await userIsAuthorized(req);
		} catch ({ code, message }) {
			res.status(code);
			return res.json(message);
		}

		// BLOCK HUGE REQUESTS
		if (req.files.length > 1) {
			res.status(413);
			return res.json("too many files");
		}

		// EXTRACT DATA
		const file = req.files.find((f) => f.fieldname === "file");
		if (!file) {
			res.status(404);
			return res.json("file not found");
		}

		if (file.buffer.byteLength > 1 * 1024 * 1024) {
			// 1024 = 1kb => 1MB allowed
			res.status(413);
			return res.json("file to large");
		}

		// UPLOAD FILE
		return uploadFile({
			org,
			repo,
			branch,
			commit,
			directory,
			filename: file.originalname,
			file: file,
		})
			.then(() => {
				res.status(200);
				return res.json("file uploaded successfully");
			})
			.catch((error) => {
				res.status(500);
				console.error(error);
				return res.json({ error: error });
			});
	}
);

module.exports = router;
