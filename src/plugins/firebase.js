import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBeVIMBjNORsKignTlKL641H2vpmjrwrCA',
  authDomain: 'vue-bkkmmcx.firebaseapp.com',
  databaseURL: 'https://vue-bkkmmcx.firebaseio.com',
  projectId: 'vue-bkkmmcx',
  storageBucket: 'vue-bkkmmcx.appspot.com',
  messagingSenderId: '723919717345',
  appId: '1:723919717345:web:c2338bc7f7b0a3a5ac48a0'
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();

// Collection references
const daysOffCollection = firestore.collection('ab');
const leavesCollection = firestore.collection('leaves');
const publicsCollection = firestore.collection('publics');
const settingsCollection = firestore.collection('settings');
const usersCollection = firestore.collection('users');

export {
  auth,
  daysOffCollection,
  firestore,
  leavesCollection,
  publicsCollection,
  settingsCollection,
  usersCollection
};
