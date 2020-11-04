import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeVIMBjNORsKignTlKL641H2vpmjrwrCA",
  authDomain: "vue-bkkmmcx.firebaseapp.com",
  databaseURL: "https://vue-bkkmmcx.firebaseio.com",
  projectId: "vue-bkkmmcx",
  storageBucket: "vue-bkkmmcx.appspot.com",
  messagingSenderId: "723919717345",
  appId: "1:723919717345:web:c2338bc7f7b0a3a5ac48a0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export default firebaseApp;
