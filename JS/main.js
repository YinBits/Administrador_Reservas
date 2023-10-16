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
    // Implemente a função de edição aqui
    // Você pode usar um modal semelhante ao código anterior

    // Recupere os dados atuais do item que você deseja editar
    const cardapioItemRef = ref(db, "Cardapio/" + cardapioKey);

    get(cardapioItemRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const itemData = snapshot.val();

                // Agora você pode abrir um modal ou um formulário para editar os dados, incluindo a imagem.

                // Exemplo de como atualizar os campos de edição após abrir o modal:
                document.getElementById("editItemName").value = itemData.nome;
                document.getElementById("editItemCategory").value = itemData.categoria;
                document.getElementById("editItemDescription").value = itemData.descricao;
                document.getElementById("editItemPrice").value = itemData.preco;

                // Adicione um evento ao botão de confirmação de edição
                document.querySelectorAll(".edit-button").addEventListener("click", () => {
                    const editedData = {
                        nome: document.getElementById("editItemName").value,
                        categoria: document.getElementById("editItemCategory").value,
                        descricao: document.getElementById("editItemDescription").value,
                        preco: parseFloat(document.getElementById("editItemPrice").value),
                        imagem: "Nova URL da imagem" // Atualize a URL da imagem aqui
                    };

                    // Atualize os dados no banco de dados
                    set(cardapioItemRef, editedData)
                        .then(() => {
                            alert("Item editado com sucesso!");
                            // Feche o modal ou formulário de edição aqui
                            // Recarregue os dados após a edição
                            loadCardapioData();
                        })
                        .catch((error) => {
                            console.error("Erro ao editar o item: " + error);
                        });
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao obter os dados para edição: " + error);
        });
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

// Adicione um ouvinte de evento aos botões de exclusão
document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        const cardapioKey = event.target.getAttribute("data-key");
        if (cardapioKey) {
            deleteItem(cardapioKey);
        }
    });
});

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
                            <button class="delete-button" data-key="${key}">Editar</button>
                            <button class="edit-button" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    cardapioTableBody.appendChild(newRow);
                }
            }

            // Adicione um ouvinte de evento aos botões de exclusão
            document.querySelectorAll(".delete-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const cardapioKey = event.target.getAttribute("data-key");
                    if (cardapioKey) {
                        deleteItem(cardapioKey);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados: " + error);
    });
}

// Carregue os dados do Firebase e exiba-os na tabela
loadCardapioData();
