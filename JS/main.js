// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Configuração do Firebase (substitua pelos seus próprios valores)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referência para o nó "Cardapio" no Realtime Database
const cardapioRef = ref(db, "Cardapio");

// Função para editar um item
function editItem(cardapioKey) {
   // Obtenha os dados do item com base na chave
   const item = cardapioData[cardapioKey];

   // Preencha os campos do formulário com os dados existentes
   document.getElementById("editCardapioKey").value = cardapioKey;
   document.getElementById("editNome").value = item.nome;
   document.getElementById("editCategoria").value = item.categoria;
   document.getElementById("editDescricao").value = item.descricao;
   document.getElementById("editPreco").value = item.preco;

   // Preencha a imagem atual do item
   const currentImage = document.getElementById("currentImage");
   currentImage.src = item.imagem;

   // Limpe o campo de upload de imagem
   document.getElementById("editImagem").value = "";

   // Abra o modal de edição
   document.getElementById("editModal").style.display = "block";
}

// Função para deletar um item
function deleteItem(cardapioKey) {
    const cardapioRef = ref(db, "Cardapio/" + cardapioKey);
    remove(cardapioRef).then(() => {
        alert("Item deletado com sucesso!");
        // Recarregue os dados após a exclusão (você pode criar uma função separada para isso)
        loadCardapioData();
    }).catch((error) => {
        console.error("Erro ao deletar o item: " + error);
    });
}


// Função para carregar os dados do Firebase e exibi-los na tabela
function loadCardapioData() {
    get(cardapioRef).then((snapshot) => {
        if (snapshot.exists()) {
            const cardapioData = snapshot.val();
            const cardapioTableBody = document.getElementById("cardapioTableBody");
            cardapioTableBody.innerHTML = ""; // Limpar o conteúdo atual da tabela

            for (const key in cardapioData) {
                if (cardapioData.hasOwnProperty(key)) {
                    const item = cardapioData[key];
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td><img src="${item.imagem}" class="thumbnail"></td>
                        <td>${item.nome}</td>
                        <td>${item.categoria}</td>
                        <td>${item.descricao}</td>
                        <td>${item.preco}</td>
                        <td>
                            <button onclick="editItem('${key}')">Editar</button>
                            <button onclick="deleteItem('${key}')">Excluir</button>
                        </td>
                    `;
                    cardapioTableBody.appendChild(newRow);
                }
            }
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados: " + error);
    });
}

// Carregue os dados do Firebase e exiba-os na tabela
loadCardapioData();
