// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyABfDBGL-M3oDLg6JGH79OksO45LdErczM",
    authDomain: "tinareactnativefirebase.firebaseapp.com",
    databaseURL: "https://tinareactnativefirebase-default-rtdb.firebaseio.com",
    projectId: "tinareactnativefirebase",
    storageBucket: "tinareactnativefirebase.appspot.com",
    messagingSenderId: "285805953156",
    appId: "1:285805953156:web:5451de5f8f99779571c2d1",
    measurementId: "G-1K94YJ5G55"
  };
  
  // Inicialize o Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Adicione um ouvinte de evento para o formulário de login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Verifique as credenciais no Firebase Realtime Database
    const usersRef = firebase.database().ref("users");
    usersRef.once("value", (snapshot) => {
      const users = snapshot.val();
      const foundUser = users.find((user) => user.email === email && user.password === password);
  
      if (foundUser) {
        // Autenticação bem-sucedida
        window.location.href = "./inicio.html"; // Redireciona para a página "Início"
      } else {
        alert("Credenciais incorretas. Tente novamente.");
      }
    });
  });
  