// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

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
    editModal.style.display = "block";

    const editImage = document.getElementById("editImagePreview");
    const editImagemInput = document.getElementById("editImagem");

    // Carregue os dados do Firebase com base na chave 'cardapioKey'
    // e preencha o formulário de edição com os dados do item
    const itemRef = ref(db, `Cardapio/${cardapioKey}`);
    get(itemRef).then((snapshot) => {
        if (snapshot.exists()) {
            const item = snapshot.val();
            document.getElementById("editCardapioKey").value = cardapioKey;
            document.getElementById("editNome").value = item.nome;
            document.getElementById("editCategoria").value = item.categoria;
            document.getElementById("editDescricao").value = item.descricao;
            document.getElementById("editPreco").value = item.preco;
            // Preencha outros campos conforme necessário

            // Exiba a imagem atual
            editImage.src = item.imagem;
        } else {
            console.error("Item não encontrado no banco de dados.");
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados do item: " + error);
    });

    // Ouvinte de evento para o campo de imagem para exibir uma visualização da nova imagem
    editImagemInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Ouvinte de evento para o botão "Salvar Alterações"
    const saveButton = document.getElementById("editSaveButton");
    saveButton.addEventListener("click", () => {
        saveChanges(cardapioKey, file);
    });
}

// Função para salvar as alterações
function saveChanges(cardapioKey, novaImagemFile) {
    const nome = document.getElementById("editNome").value;
    const categoria = document.getElementById("editCategoria").value;
    const descricao = document.getElementById("editDescricao").value;
    const preco = document.getElementById("editPreco").value;

    // Verifique se todos os campos foram preenchidos
    if (!nome || !categoria || !descricao || !preco) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Faça o upload da nova imagem, se disponível
    if (novaImagemFile) {
        // Configure o armazenamento do Firebase
        const storage = getStorage(app);
        const storageRef = ref(storage, `imagens/${novaImagemFile.name}`);

        // Realize o upload da nova imagem
        const uploadTask = uploadBytes(storageRef, novaImagemFile);

        uploadTask.then(async (snapshot) => {
            // A imagem foi enviada com sucesso
            const downloadURL = await getDownloadURL(storageRef);

            // Atualize os dados no Realtime Database
            const cardapioRefKey = ref(db, "Cardapio/" + cardapioKey);
            update(cardapioRefKey, {
                nome: nome,
                categoria: categoria,
                descricao: descricao,
                preco: preco,
                imagem: downloadURL,
            }).then(() => {
                alert("Dados atualizados com sucesso.");
                closeEditModal();
            }).catch((error) => {
                console.error("Erro ao atualizar dados: " + error);
            });
        }).catch((error) => {
            console.error("Erro ao fazer o upload da nova imagem: " + error);
        });
    } else {
        // Não há nova imagem, apenas atualize os outros campos
        const cardapioRefKey = ref(db, "Cardapio/" + cardapioKey);
        update(cardapioRefKey, {
            nome: nome,
            categoria: categoria,
            descricao: descricao,
            preco: preco,
        }).then(() => {
            alert("Dados atualizados com sucesso.");
            closeEditModal();
        }).catch((error) => {
            console.error("Erro ao atualizar dados: " + error);
        });
    }
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
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
                            <button class="delete-button" data-key="${key}">Excluir</button>
                            <button class="edit-button" data-key="${key}">Editar</button>
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

            // Adicione um ouvinte de evento aos botões de edição
            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const cardapioKey = event.target.getAttribute("data-key");
                    if (cardapioKey) {
                        openEditModal(cardapioKey);
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
