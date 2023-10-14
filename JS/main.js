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
  // ...

// Função para abrir o modal de edição
function openEditModal(cardapioKey) {
    const item = cardapioData[cardapioKey]; // Obtenha os dados do item com base na chave
    document.getElementById("editNome").value = item.nome;
    document.getElementById("editCategoria").value = item.categoria;
    document.getElementById("editDescricao").value = item.descricao;
    document.getElementById("editPreco").value = item.preco;
    document.getElementById("editModal").style.display = "block";
    document.getElementById("editCardapioKey").value = cardapioKey; // Salve a chave do item

    // Preencha a imagem atual do item
    const currentImage = document.getElementById("currentImage");
    currentImage.src = item.imagem;

    // Limpe o campo de upload de imagem
    document.getElementById("editImagem").value = "";
}

// Função para salvar as alterações
function saveChanges() {
    const cardapioKey = document.getElementById("editCardapioKey").value;
    const novoNome = document.getElementById("editNome").value;
    const novaCategoria = document.getElementById("editCategoria").value;
    const novaDescricao = document.getElementById("editDescricao").value;
    const novoPreco = document.getElementById("editPreco").value;

    // Obtenha o arquivo de imagem selecionado pelo usuário
    const novaImagem = document.getElementById("editImagem").files[0];

    if (novaImagem) {
        // Realize o upload da nova imagem para o Firebase Storage e obtenha a URL
        const storage = getStorage(app);
        const storageRef = ref(storage, 'imagens/' + novaImagem.name);
        uploadBytes(storageRef, novaImagem).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                // Atualize os dados no Firebase, incluindo a nova URL da imagem
                const cardapioRef = ref(db, "Cardapio/" + cardapioKey);
                const updates = {
                    nome: novoNome,
                    categoria: novaCategoria,
                    descricao: novaDescricao,
                    preco: novoPreco,
                    imagem: downloadURL, // URL da nova imagem
                };

                // Atualize os dados no Firebase com as novas informações
                update(cardapioRef, updates).then(() => {
                    alert("Alterações salvas com sucesso!");
                    closeEditModal(); // Feche o modal após salvar as alterações
                    loadCardapioData(); // Recarregue os dados na tabela
                }).catch((error) => {
                    console.error("Erro ao salvar as alterações: " + error);
                });
            });
        }).catch((error) => {
            console.error("Erro ao fazer upload da imagem: " + error);
        });
    } else {
        // Se o usuário não selecionou uma nova imagem, atualize os dados sem a imagem
        const cardapioRef = ref(db, "Cardapio/" + cardapioKey);
        const updates = {
            nome: novoNome,
            categoria: novaCategoria,
            descricao: novaDescricao,
            preco: novoPreco,
        };

        // Atualize os dados no Firebase com as novas informações
        update(cardapioRef, updates).then(() => {
            alert("Alterações salvas com sucesso!");
            closeEditModal(); // Feche o modal após salvar as alterações
            loadCardapioData(); // Recarregue os dados na tabela
        }).catch((error) => {
            console.error("Erro ao salvar as alterações: " + error);
        });
    }
}

// ...

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
                    
                            button class="editar-button" data-key="${key}">Excluir</button>
                            <button class="delete-button" data-key="${key}">Excluir</button>
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
