import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  linkWithCredential,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

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

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

// ==== Универсальная функция входа с обработкой конфликта email ====
async function signInWith(provider, providerName) {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(`${providerName} вход:`, result.user.displayName, result.user.email);
  } catch (error) {
    console.error(`${providerName} ошибка:`, error.code, error.message);

    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      const pendingCred = error.customData?.credential;

      if (!email || !pendingCred) {
        alert("Не удалось получить данные для объединения аккаунтов.");
        return;
      }

      // Узнаём, каким провайдером изначально зарегистрирован email
      let methods = [];
      try {
        methods = await fetchSignInMethodsForEmail(auth, email);
      } catch (e) {
        console.warn("fetchSignInMethodsForEmail не удался:", e);
      }

      let originalName = "другой способ";
      let originalProvider = null;
      if (methods.includes("google.com")) {
        originalName = "Google";
        originalProvider = googleProvider;
      } else if (methods.includes("github.com")) {
        originalName = "GitHub";
        originalProvider = githubProvider;
      }

      if (!originalProvider) {
        alert(
          `Адрес ${email} уже используется другим способом входа (${methods.join(", ") || "неизвестно"}).\n` +
          `Автоматически объединить не удалось — войдите тем способом, которым регистрировались.`
        );
        return;
      }

      const ok = confirm(
        `Адрес ${email} уже зарегистрирован через ${originalName}.\n\n` +
        `Чтобы объединить аккаунты, сначала войдите через ${originalName}. Продолжить?`
      );
      if (!ok) return;

      try {
        // 1. Входим исходным провайдером
        const originalResult = await signInWithPopup(auth, originalProvider);

        // 2. Привязываем ожидающие учётные данные
        await linkWithCredential(originalResult.user, pendingCred);

        alert(`Готово! Аккаунты объединены. Теперь можно входить и через ${providerName}.`);
        console.log("Объединение успешно:", originalResult.user.email);
      } catch (mergeError) {
        console.error("Ошибка объединения:", mergeError.code, mergeError.message);
        alert(`Не удалось объединить аккаунты: ${mergeError.code || mergeError.message}`);
      }
    } else {
      alert(`Ошибка входа через ${providerName}: ${error.code || error.message}`);
    }
  }
}

// GitHub вход
document.getElementById('LOGINgit').addEventListener('click', () => {
  signInWith(githubProvider, "GitHub");
});

// Google вход
document.getElementById('LOGINgoogle').addEventListener('click', () => {
  signInWith(googleProvider, "Google");
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