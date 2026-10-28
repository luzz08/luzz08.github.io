import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

// Ждём загрузки DOM, чтобы кнопка точно существовала
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('LOGINgit');
  if (btn) {
    btn.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log("Успешный вход:", user.displayName, user.email);
          alert("Привет, " + (user.displayName || user.email));
        })
        .catch((error) => {
          console.error("Ошибка входа:", error.code, error.message);
          alert("Ошибка: " + error.code);
        });
    });
  } else {
    console.warn("Кнопка LOGINgit не найдена на странице");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) console.log("Пользователь вошёл:", user.displayName);
  else console.log("Пользователь не вошёл");
});