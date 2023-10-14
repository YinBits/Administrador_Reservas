// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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

// Função para abrir o modal de edição
function openEditModal(cardapioKey) {
    const editModal = document.getElementById("editModal");
    const editCardapioKey = document.getElementById("editCardapioKey");
    const editNome = document.getElementById("editNome");
    const editCategoria = document.getElementById("editCategoria");
    const editDescricao = document.getElementById("editDescricao");
    const editPreco = document.getElementById("editPreco");

    // Carregue os dados do Firebase com base na chave 'cardapioKey'
    const itemRef = ref(db, `Cardapio/${cardapioKey}`);
    get(itemRef).then((snapshot) => {
        if (snapshot.exists()) {
            const item = snapshot.val();
            editCardapioKey.value = cardapioKey;
            editNome.value = item.nome;
            editCategoria.value = item.categoria;
            editDescricao.value = item.descricao;
            editPreco.value = item.preco;

            // Abra o modal de edição
            editModal.style.display = "block";
        } else {
            console.error("Item não encontrado no banco de dados.");
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados do item: " + error);
    });
}

// Função para salvar as alterações
function saveChanges() {
    const cardapioKey = document.getElementById("editCardapioKey").value;
    const nome = document.getElementById("editNome").value;
    const categoria = document.getElementById("editCategoria").value;
    const descricao = document.getElementById("editDescricao").value;
    const preco = document.getElementById("editPreco").value;

    // Verifique se todos os campos foram preenchidos
    if (!nome || !categoria || !descricao || !preco) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Atualize os dados no Realtime Database
    const cardapioRefKey = ref(db, `Cardapio/${cardapioKey}`);
    update(cardapioRefKey, {
        nome: nome,
        categoria: categoria,
        descricao: descricao,
        preco: preco
    }).then(() => {
        alert("Dados atualizados com sucesso.");
        closeEditModal();
    }).catch((error) => {
        console.error("Erro ao atualizar dados: " + error);
    });
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

// Função para deletar um item
function deleteItem(cardapioKey) {
    const cardapioRefKey = ref(db, `Cardapio/${cardapioKey}`);
    remove(cardapioRefKey).then(() => {
        alert("Item deletado com sucesso!");
        // Recarregue os dados após a exclusão
        loadCardapioData();
    }).catch((error) => {
        console.error("Erro ao deletar o item: " + error);
    });
}

// Adicione um ouvinte de evento aos botões de edição
document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        const cardapioKey = event.target.getAttribute("data-key");
        if (cardapioKey) {
            openEditModal(cardapioKey);
        }
    });
});

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
                        <td>${item.nome}</td>
                        <td>${item.categoria}</td>
                        <td>${item.descricao}</td>
                        <td>${item.preco}</td>
                        <td>
                            <button class="edit-button" data-key="${key}">Editar</button>
                            <button class="delete-button" data-key="${key}">Excluir</button>
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
