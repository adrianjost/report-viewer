const express = require("express");
const router = express.Router();

const { fileParser } = require("express-multipart-file-parser");

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const db = admin.firestore();

const patchOrCreate = async ({ collection, fields, doc }) => {
	const snapshot = await fields
		.reduce(
			(ref, field) => ref.where(field, "==", doc[field]),
			db.collection(collection)
		)
		.limit(1)
		.get();
	if (snapshot.empty) {
		return db.collection(collection).add(doc);
	} else {
		const docId = snapshot.docs[0].id;
		return db
			.collection(collection)
			.doc(docId)
			.set(doc, { merge: true });
	}
};

const updateOrgDb = async ({ org, repo }) => {
	return patchOrCreate({
		collection: "orgs",
		fields: ["org"],
		doc: {
			org,
			repo: admin.firestore.FieldValue.arrayUnion(repo),
			updated_at: Date.now(),
		},
	});
};
const updateRepoDb = async ({ org, repo, branch }) => {
	return patchOrCreate({
		collection: "repos",
		fields: ["org", "repo"],
		doc: {
			org,
			repo,
			branches: admin.firestore.FieldValue.arrayUnion(branch),
			updated_at: Date.now(),
		},
	});
};
const updateBranchDb = async ({ org, repo, branch, commit }) => {
	return patchOrCreate({
		collection: "branches",
		fields: ["org", "repo", "branch"],
		doc: {
			org,
			repo,
			branch,
			commits: admin.firestore.FieldValue.arrayUnion(commit),
			updated_at: Date.now(),
		},
	});
};
const updateCommitDb = async ({ org, repo, branch, commit, path }) => {
	return patchOrCreate({
		collection: "commits",
		fields: ["org", "repo", "branch", "commit"],
		doc: {
			org,
			repo,
			branch,
			commit,
			files: admin.firestore.FieldValue.arrayUnion(path),
			updated_at: Date.now(),
		},
	});
};
const addFileToDb = async (params) => {
	return Promise.all([
		updateOrgDb(params),
		updateRepoDb(params),
		updateBranchDb(params),
		updateCommitDb(params),
	]);
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
	const filePath = directory
		? `${org}/${repo}/${branch}/${commit}/${directory}/${filename}`
		: `${org}/${repo}/${branch}/${commit}/${filename}`;
	const fileReference = bucket.file(filePath);
	const res = await fileReference.save(new Buffer.from(file.buffer));
	await fileReference.setMetadata({
		contentType: file.mimetype,
	});
	await fileReference.makePublic();
	await addFileToDb({
		org,
		repo,
		branch,
		commit,
		path: filePath,
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
		.collection("authTokens")
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
		const directory = req.params[0].replace(/^(\/)+/, "").replace(/(\/)+$/, "");

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
