// Firebase Configuration for Nihilist Penguin
// Global Leaderboard System with App Check Security

const firebaseConfig = {
    apiKey: "AIzaSyBbVJyCf7jc757DnF27njfZPT4DsEL0pg4",
    authDomain: "nihilist-penguin.firebaseapp.com",
    databaseURL: "https://nihilist-penguin-default-rtdb.firebaseio.com",
    projectId: "nihilist-penguin",
    storageBucket: "nihilist-penguin.firebasestorage.app",
    messagingSenderId: "537917176937",
    appId: "1:537917176937:web:6d4c5c9aee9bd0500fb6f8",
    measurementId: "G-CNZFTS4EFX"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA v3
const appCheck = firebase.appCheck();
appCheck.activate('6LeqV2MsAAAAAB7Ts0KU_l7cq-Nw0qZRAGYSiAZF', true);

// Database reference
const database = firebase.database();
const leaderboardRef = database.ref('leaderboard');
