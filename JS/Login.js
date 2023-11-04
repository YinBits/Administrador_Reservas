// Importe os módulos do Firebase a partir de URLs corretas
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABfDBGL-M3oDLg6JGH79OksO45LdErczM",
  authDomain: "tinareactnativefirebase.firebaseapp.com",
  projectId: "tinareactnativefirebase",
  storageBucket: "tinareactnativefirebase.appspot.com",
  messagingSenderId: "285805953156",
  appId: "1:285805953156:web:5451de5f8f99779571c2d1",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Adicione um ouvinte de evento para o formulário de login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Autenticação com Firebase
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Autenticação bem-sucedida
      window.location.href = "./Pages/index.html"; // Redireciona para a página "Início"
    })
    .catch((error) => {
      alert("Credenciais incorretas. Tente novamente.");
    });
});