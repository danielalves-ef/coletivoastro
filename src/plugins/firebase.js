import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "../../astro.config.js"

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export default {
  install(Vue) {
    Vue.prototype.$firebase = firebase;
    Vue.prototype.$auth = auth;
    Vue.prototype.$firestore = firestore;
  }
};