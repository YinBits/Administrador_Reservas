// session.js

// Verifique se o usuário já está autenticado (sessão)
const userLoggedIn = localStorage.getItem("userLoggedIn");
if (!userLoggedIn) {
  // Se o usuário não estiver autenticado, redirecione para a página de login
  window.location.href = "../index.html"; // Substitua "login.html" pelo caminho correto da página de login
}
