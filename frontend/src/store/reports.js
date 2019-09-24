import { db } from "../firebase";
import sha1 from "sha1";

const cache = {};

const getDataFromQuerySnapshot = (snapshot) => {
	const data = [];
	snapshot.forEach((docSnap) => {
		const doc = docSnap.data();
		doc.id = docSnap.id;
		data.push(doc);
	});
	return data;
};

const dbCachePathGenerator = (query) => ({
	get: function(obj, prop) {
		// use cache on get
		if (prop === "get") {
			const hash = sha1(JSON.stringify(query, Object.keys(query).sort()));
			const cacheResult = cache[hash] || [];
			return () => {
				if (cacheResult.length) {
					return Promise.resolve(cacheResult);
					/*
					const lastCachedElement = cacheResult.docs[cacheResult - 1];
					return obj
						.startAt(lastCachedElement)
						.get()
						.then((snapshot) => {
							const newDocs = getDataFromQuerySnapshot(snapshot);
							newDocs.forEach((doc) => {
								if (cache[hash].every((d) => d.id !== doc.id)) {
									cache[hash].push(doc);
								}
							});
							return cache[hash];
						});
					*/
				} else {
					return obj.get().then((snapshot) => {
						cache[hash] = getDataFromQuerySnapshot(snapshot);
						return cache[hash];
					});
				}
			};
		}
		// only log relevant params
		if (!["collection", "where", "orderBy", "limit"].includes(prop)) {
			return obj[prop];
		}
		// log query params
		return (...args) => {
			if (!Array.isArray(query[prop])) {
				query[prop] = [];
			}
			query[prop].push(args);
			return new Proxy(obj[prop](...args), dbCachePathGenerator(query));
		};
	},
});

const getCacheDB = () => new Proxy(db(), dbCachePathGenerator({}));

const state = {
	currentFiles: [],
	currentCommits: [],
	currentBranches: [],
	currentPulls: [],
	currentRepos: [],
	currentOrgs: [],
};

const getters = {
	currentFiles(state) {
		return state.currentFiles;
	},
	currentEntrypoints(state) {
		const entrypoints = (state.currentFiles || []).filter((filepath) => {
			const ext = filepath.split(".").pop();
			return ["txt", "html", "htm", "json"].includes(ext);
		});
		return entrypoints.length ? entrypoints : state.currentFiles;
	},
	currentCommits(state) {
		return state.currentCommits || [];
	},
	currentBranches(state) {
		return state.currentBranches || [];
	},
	currentPulls(state) {
		return state.currentPulls || [];
	},
	currentRepos(state) {
		return state.currentRepos || [];
	},
	currentOrgs(state) {
		return state.currentOrgs || [];
	},
};

const mutations = {
	set(state, [key, value]) {
		state[key] = value;
	},
};

// TODO implement pagination
// The response will contain a Link Header with all links to more related pages that should also be fetched
const actions = {
	fetchFiles({ commit }, { org, repo, branch, pull, commit: commitSha }) {
		commit("set", ["currentFiles", []]);
		let baseQuery = getCacheDB()
			.collection("commits")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.where("commit", "==", commitSha);
		if (pull) {
			baseQuery = baseQuery.where("pull", "==", pull);
		} else {
			baseQuery = baseQuery.where("branch", "==", branch);
		}
		return baseQuery
			.limit(1)
			.get()
			.then((commits) => {
				const files = commits[0].files;
				commit("set", ["currentFiles", files]);
				return files;
			});
	},
	fetchCommits({ commit }, { org, repo, branch, pull }) {
		commit("set", ["currentCommits", []]);
		let baseQuery = getCacheDB()
			.collection("commits")
			.where("org", "==", org)
			.where("repo", "==", repo);
		if (pull) {
			baseQuery = baseQuery.where("pull", "==", pull);
		} else {
			baseQuery = baseQuery.where("branch", "==", branch);
		}
		return baseQuery
			.orderBy("updated_at", "desc")
			.get()
			.then((commits) => {
				commit("set", ["currentCommits", commits]);
				return commits;
			});
	},
	fetchBranches({ commit }, { org, repo }) {
		commit("set", ["currentBranches", []]);
		return getCacheDB()
			.collection("branches")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at", "desc")
			.get()
			.then((branches) => {
				commit("set", ["currentBranches", branches]);
				return branches;
			});
	},
	fetchPulls({ commit }, { org, repo }) {
		commit("set", ["currentPulls", []]);
		return getCacheDB()
			.collection("pulls")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at", "desc")
			.get()
			.then((pulls) => {
				commit("set", ["currentPulls", pulls]);
				return pulls;
			});
	},
	fetchRepos({ commit }, { org }) {
		commit("set", ["currentRepos", []]);
		return getCacheDB()
			.collection("repos")
			.where("org", "==", org)
			.orderBy("updated_at", "desc")
			.get()
			.then((repos) => {
				commit("set", ["currentRepos", repos]);
				return repos;
			});
	},
	fetchOrgs({ commit }) {
		commit("set", ["currentOrgs", []]);
		return getCacheDB()
			.collection("orgs")
			.orderBy("updated_at", "desc")
			.get()
			.then((orgs) => {
				commit("set", ["currentOrgs", orgs]);
				return orgs;
			});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
