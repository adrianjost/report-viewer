const express = require("express");
const router = express.Router();

const { fileParser } = require("express-multipart-file-parser");

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const db = admin.firestore();

const patchOrCreate = async ({ collection, fields, doc }) => {
	console.log(
		"patchOrCreate",
		collection,
		fields.join(","),
		JSON.stringify(Object.entries(doc))
	);
	const snapshot = await fields
		.reduce(
			(ref, field) => ref.where(field, "==", doc[field]),
			db.collection(collection)
		)
		.limit(1)
		.get();
	if (snapshot.empty || snapshot.size === 0) {
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
const updateRepoDb = async ({ org, repo, branch, pull }) => {
	let doc = {
		org,
		repo,
		updated_at: Date.now(),
	};
	if (pull) {
		doc.pulls = admin.firestore.FieldValue.arrayUnion(pull);
	} else {
		doc.branches = admin.firestore.FieldValue.arrayUnion(branch);
	}
	return patchOrCreate({
		collection: "repos",
		fields: ["org", "repo"],
		doc,
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
const updatePullDb = async ({ org, repo, pull, commit }) => {
	return patchOrCreate({
		collection: "pulls",
		fields: ["org", "repo", "pull"],
		doc: {
			org,
			repo,
			pull,
			commits: admin.firestore.FieldValue.arrayUnion(commit),
			updated_at: Date.now(),
		},
	});
};
const updateCommitDb = async ({ org, repo, branch, pull, commit, path }) => {
	const doc = {
		org,
		repo,
		commit,
		files: admin.firestore.FieldValue.arrayUnion(path),
		updated_at: Date.now(),
	};
	const uniqueFields = ["org", "repo", "commit"];
	if (pull) {
		doc.pull = pull;
		doc.isPull = true;
		uniqueFields.push("pull");
	} else {
		doc.branch = branch;
		doc.isPull = false;
		uniqueFields.push("branch");
	}
	return patchOrCreate({
		collection: "commits",
		fields: uniqueFields,
		doc,
	});
};
const addFileToDb = async (params) => {
	const updatePromises = [updateOrgDb(params), updateRepoDb(params)];
	if (params.pull) {
		updatePromises.push(updatePullDb(params), updateCommitDb(params));
	} else {
		updatePromises.push(updateBranchDb(params), updateCommitDb(params));
	}
	return Promise.all(updatePromises);
};

const uploadFile = async ({
	org,
	repo,
	branch,
	pull,
	commit,
	directory,
	filename,
	file,
}) => {
	const userFilePath = directory ? `${directory}/${filename}` : `${filename}`;
	const filePath = pull
		? `${org}/${repo}/pull/${pull}/${commit}/${userFilePath}`
		: `${org}/${repo}/branch/${branch}/${commit}/${userFilePath}`;
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
		pull,
		commit,
		path: filePath,
	});
	return res;
};

const userIsAuthorized = async ({ req, org, repo }) => {
	if (!req.headers.authorization) {
		return {
			code: 401,
			message: "missing authorization header",
		};
	}
	const isTokenValid = await db
		.collection("authTokens")
		.where("token", "==", req.headers.authorization.slice(7))
		.where("org", "==", org)
		.where("repo", "==", repo)
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
	"/*",
	fileParser({
		rawBodyOptions: {
			limit: "1mb",
		},
		busboyOptions: {
			limits: {
				fields: 10,
				files: 1, // only parse first file
			},
		},
	}),
	async (req, res) => {
		// EXTRACT METADATA
		const org = req.body.org;
		const repo = req.body.repo;
		const branch = req.body.branch;
		const pull = req.body.pull;
		const commit = req.body.commit;
		const directory = req.params[0].replace(/^(\/)+/, "").replace(/(\/)+$/, "");

		// AUTHORIZATION
		try {
			await userIsAuthorized({ req, org, repo });
		} catch (error) {
			const { code, message } = error;
			res.status(code || 500);
			return res.json(message || error);
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
			pull,
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
