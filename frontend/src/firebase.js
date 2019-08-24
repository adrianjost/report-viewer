import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

const config = {
	apiKey: "AIzaSyAgK_JA45xH5Bn7j4r-qPIdWEI6bJHOjgI",
	authDomain: "ci-report-viewer.firebaseapp.com",
	databaseURL: "https://ci-report-viewer.firebaseio.com",
	projectId: "ci-report-viewer",
	storageBucket: "ci-report-viewer.appspot.com",
	messagingSenderId: "935656070794",
	appId: "1:935656070794:web:d59e6edbe3ef7daf",
};

try {
	firebase.initializeApp(config);
} catch (e) {
	console.error(e);
}

export const app = firebase.app();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();
export default firebase;
