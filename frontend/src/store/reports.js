import { db } from "../firebase";

const state = {
	currentFiles: [],
	currentCommits: [],
	currentBranches: [],
	currentRepos: [],
	currentOrgs: [],
};

const getters = {
	currentFiles(state) {
		return state.currentFiles;
	},
	currentCommits(state) {
		return state.currentCommits;
	},
	currentBranches(state) {
		return state.currentBranches;
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
	fetchFiles({ commit }, { org, repo, branch, commit: commitSha }) {
		return db
			.collection("commits")
			.doc(`${org}_${repo}_${branch}_${commitSha}`)
			.get()
			.then((snapshot) => {
				const files = snapshot.data().files;
				commit("set", ["currentFiles", files]);
				return files;
			});
	},
	fetchCommits({ commit }, { org, repo, branch }) {
		return db
			.collection("commits")
			.where("org", "==", org)
			.where("repo", "==", repo)
			.where("branch", "==", branch)
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
