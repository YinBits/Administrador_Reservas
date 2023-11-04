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


// Verifique se o usuário já está autenticado (sessão)
const userLoggedIn = localStorage.getItem("userLoggedIn");
if (userLoggedIn) {
  // Se o usuário já estiver autenticado, redirecione para a página "Início"
  window.location.href = "./Pages/index.html";
}

// Email e senha fixos para login
const emailFixo = "brunomarcaldossantos9a@gmail.com";
const senhaFixa = "123456";

// Adicione um ouvinte de evento para o formulário de login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const emailDigitado = document.getElementById("email").value;
  const senhaDigitada = document.getElementById("password").value;

  // Verifique se o email e a senha correspondem aos valores fixos
  if (emailDigitado === emailFixo && senhaDigitada === senhaFixa) {
    // Autenticação bem-sucedida
    // Crie a sessão de usuário
    localStorage.setItem("userLoggedIn", "true");
    window.location.href = "./Pages/index.html"; // Redirecione para a página "Início"
  } else {
    alert("Credenciais incorretas. Tente novamente.");
  }
});