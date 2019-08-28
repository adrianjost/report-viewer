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
		return baseQuery.get().then((snapshot) => {
			const files = snapshot.docs[0].data().files;
			commit("set", ["currentFiles", files]);
			return files;
		});
	},
	fetchCommits({ commit }, { org, repo, branch, pull }) {
		console.log("fetchCommits", branch, pull);
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
			.orderBy("updated_at")
			.get()
			.then((snapshot) => {
				const commits = [];
				snapshot.forEach((doc) => {
					commits.push(doc.data());
				});
				commit("set", ["currentCommits", commits]);
				return commits;
			});
	},
	fetchBranches({ commit }, { org, repo }) {
		return db
			.collection("branches")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at")
			.get()
			.then((snapshot) => {
				const branches = [];
				snapshot.forEach((doc) => {
					branches.push(doc.data());
				});
				commit("set", ["currentBranches", branches]);
				return branches;
			});
	},
	fetchPulls({ commit }, { org, repo }) {
		return db
			.collection("pulls")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.orderBy("updated_at")
			.get()
			.then((snapshot) => {
				const pulls = [];
				snapshot.forEach((doc) => {
					pulls.push(doc.data());
				});
				commit("set", ["currentPulls", pulls]);
				return pulls;
			});
	},
	fetchRepos({ commit }, { org }) {
		return db
			.collection("repos")
			.where("org", "==", org)
			.orderBy("updated_at")
			.get()
			.then((snapshot) => {
				const repos = [];
				snapshot.forEach((doc) => {
					repos.push(doc.data());
				});
				commit("set", ["currentRepos", repos]);
				return repos;
			});
	},
	fetchOrgs({ commit }) {
		return db
			.collection("orgs")
			.orderBy("updated_at")
			.get()
			.then((snapshot) => {
				const orgs = [];
				snapshot.forEach((doc) => {
					orgs.push(doc.data());
				});
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
