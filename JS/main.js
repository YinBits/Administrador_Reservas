import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, remove, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getDownloadURL, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referência para o nó "Cardapio" no Realtime Database
const cardapioRef = ref(db, "Cardapio");

// Função para abrir o modal de edição
function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";
}

// Função para editar um item
function editItem(cardapioKey) {
    const cardapioItemRef = ref(db, "Cardapio/" + cardapioKey);
    const editItemImageFileInput = document.getElementById("editItemImageFile");

    get(cardapioItemRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const itemData = snapshot.val();

                // Preencha o modal de edição com os dados atuais do item
                document.getElementById("editItemName").value = itemData.nome;
                document.getElementById("editItemCategory").value = itemData.categoria;
                document.getElementById("editItemDescription").value = itemData.descricao;
                document.getElementById("editItemPrice").value = itemData.preco;
                editItemImageFileInput.value = ''; // Limpa o input de arquivo

                // Abra o modal de edição
                openEditModal();

                // Adicione um evento ao botão de confirmação de edição
                document.getElementById("saveEditButton").addEventListener("click", () => {
                    const editedData = {
                        nome: document.getElementById("editItemName").value,
                        categoria: document.getElementById("editItemCategory").value,
                        descricao: document.getElementById("editItemDescription").value,
                        preco: parseFloat(document.getElementById("editItemPrice").value)
                    };

                    // Verifica se um novo arquivo de imagem foi selecionado
                    if (editItemImageFileInput.files.length > 0) {
                        const imageFile = editItemImageFileInput.files[0];
                        const storageRef = storageRef(storage, "ImagensCardapio/" + cardapioKey + "/" + imageFile.name); // Correção aqui
                        const uploadTask = uploadBytes(storageRef, imageFile);

                        uploadTask.then((snapshot) => {
                            // Imagem foi carregada com sucesso
                            getDownloadURL(storageRef).then((downloadURL) => {
                                editedData.imagem = downloadURL;

                                // Atualize os dados no banco de dados
                                set(cardapioItemRef, editedData)
                                    .then(() => {
                                        alert("Item editado com sucesso!");
                                        // Feche o modal de edição
                                        closeEditModal();
                                        // Recarregue os dados após a edição
                                        loadCardapioData();
                                    })
                                    .catch((error) => {
                                        console.error("Erro ao editar o item: " + error);
                                    });
                            });
                        }).catch((error) => {
                            console.error("Erro ao fazer upload da imagem: " + error);
                        });
                    } else {
                        // Caso não haja uma nova imagem, atualize os outros dados diretamente
                        editedData.imagem = itemData.imagem;

                        // Atualize os dados no banco de dados
                        set(cardapioItemRef, editedData)
                            .then(() => {
                                alert("Item editado com sucesso!");
                                // Feche o modal de edição
                                closeEditModal();
                                // Recarregue os dados após a edição
                                loadCardapioData();
                            })
                            .catch((error) => {
                                console.error("Erro ao editar o item: " + error);
                            });
                    }
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

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
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
                            <button class="edit-button" data-key="${key}">Editar</button>
                            <button class="delete-button" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    cardapioTableBody.appendChild(newRow);
                }
            }

            // Adicione um ouvinte de evento aos botões de edição
            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const cardapioKey = event.target.getAttribute("data-key");
                    if (cardapioKey) {
                        editItem(cardapioKey);
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
