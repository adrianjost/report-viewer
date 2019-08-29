import { db } from "../firebase";

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
		const entrypoints = state.currentFiles.filter((filepath) => {
			const ext = filepath.split(".").pop();
			return ["txt", "html", "htm", "json"].includes(ext);
		});
		return entrypoints.length ? entrypoints : state.currentFiles;
	},
	currentCommits(state) {
		return state.currentCommits;
	},
	currentBranches(state) {
		return state.currentBranches;
	},
	currentPulls(state) {
		return state.currentPulls;
	},
	currentRepos(state) {
		return state.currentRepos;
	},
	currentOrgs(state) {
		return state.currentOrgs;
	},
};

const mutations = {
	set(state, [key, value]) {
		state[key] = value;
	},
};

const readData = (snapshot) => {
	const data = [];
	snapshot.forEach((docSnap) => {
		const doc = docSnap.data();
		doc.id = docSnap.id;
		data.push(doc);
	});
	return data;
};

// TODO implement pagination
// The response will contain a Link Header with all links to more related pages that should also be fetched
const actions = {
	fetchFiles({ commit }, { org, repo, branch, pull, commit: commitSha }) {
		let baseQuery = db
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
			.then(readData)
			.then((commits) => {
				const files = commits[0].files;
				commit("set", ["currentFiles", files]);
				return files;
			});
	},
	fetchCommits({ commit }, { org, repo, branch, pull }) {
		let baseQuery = db
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
			.then(readData)
			.then((commits) => {
				commit("set", ["currentCommits", commits]);
				return commits;
			});
	},
	fetchBranches({ commit }, { org, repo }) {
		return db
			.collection("branches")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at", "desc")
			.get()
			.then(readData)
			.then((branches) => {
				commit("set", ["currentBranches", branches]);
				return branches;
			});
	},
	fetchPulls({ commit }, { org, repo }) {
		return db
			.collection("pulls")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at", "desc")
			.get()
			.then(readData)
			.then((pulls) => {
				commit("set", ["currentPulls", pulls]);
				return pulls;
			});
	},
	fetchRepos({ commit }, { org }) {
		return db
			.collection("repos")
			.where("org", "==", org)
			.orderBy("updated_at", "desc")
			.get()
			.then(readData)
			.then((repos) => {
				commit("set", ["currentRepos", repos]);
				return repos;
			});
	},
	fetchOrgs({ commit }) {
		return db
			.collection("orgs")
			.orderBy("updated_at", "desc")
			.get()
			.then(readData)
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
