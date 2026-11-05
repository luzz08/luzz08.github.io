import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLobcX1w4HeIvIMzme37KpCKUVEPQ6ajE",
  authDomain: "sitemdk-7beab.firebaseapp.com",
  projectId: "sitemdk-7beab",
  storageBucket: "sitemdk-7beab.firebasestorage.app",
  messagingSenderId: "1087058702653",
  appId: "1:1087058702653:web:f6bd098955c7f30f1f1554",
  measurementId: "G-808LYD3455"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// GitHub вход
const githubProvider = new GithubAuthProvider();
document.getElementById('LOGINgit').addEventListener('click', () => {
    signInWithPopup(auth, githubProvider)
        .then((result) => console.log("GitHub вход:", result.user.displayName))
        .catch((error) => console.error("GitHub ошибка:", error.code, error.message));
});

// Google вход
const googleProvider = new GoogleAuthProvider();
document.getElementById('LOGINgoogle').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => console.log("Google вход:", result.user.displayName, result.user.email))
        .catch((error) => console.error("Google ошибка:", error.code, error.message));
});

// Выход
document.getElementById('LOGOUTbtn').addEventListener('click', () => {
    signOut(auth)
        .then(() => console.log("Вы вышли из аккаунта"))
        .catch((error) => console.error("Ошибка выхода:", error));
});

// Отслеживание состояния входа
onAuthStateChanged(auth, (user) => {
    const loginArea = document.getElementById('login-area');
    const mainContent = document.getElementById('main-content');
    const userName = document.getElementById('user-name');

    if (user) {
        loginArea.style.display = 'none';
        mainContent.style.display = 'block';
        userName.textContent = user.displayName || user.email || 'Пользователь';
    } else {
        loginArea.style.display = 'block';
        mainContent.style.display = 'none';
    }
});