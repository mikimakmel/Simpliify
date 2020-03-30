import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDnHAr9OfNMuxGYeTyLJdi349aQoG_pBUU",
    appName: "Simpliify",
    authDomain: "simpliify-auth.firebaseapp.com",
    databaseURL: "https://simpliify-auth.firebaseio.com",
    projectId: "simpliify-auth",
    storageBucket: "simpliify-auth.appspot.com",
    messagingSenderId: "686593291045",
    appId: "1:686593291045:web:9210580f2cc4966453e0cc",
    measurementId: "G-HCJY3QGBLQ"
};

export default firebase.initializeApp(firebaseConfig);