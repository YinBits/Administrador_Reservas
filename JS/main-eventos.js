import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, remove, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referência para o nó "Eventos" no Realtime Database
const eventosRef = ref(db, "Eventos");

// Função para abrir o modal de edição
function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";
}

// Função para editar um evento
function editEvento(eventoKey) {
    const eventosItemRef = ref(db, "Eventos/" + eventoKey);

    get(eventosItemRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const itemData = snapshot.val();

                // Preencha o modal de edição com os dados atuais do evento
                document.getElementById("editItemName").value = itemData.nome;
                document.getElementById("editItemDate").value = itemData.data; // Correção: use "data" em vez de "date"
                document.getElementById("editItemDescription").value = itemData.descricao;

                // Abra o modal de edição
                openEditModal();

                // Adicione um evento ao botão de confirmação de edição
                document.getElementById("saveEditButton").addEventListener("click", () => {
                    const editedData = {
                        nome: document.getElementById("editItemName").value,
                        data: document.getElementById("editItemDate").value, // Correção: use "data" em vez de "date"
                        descricao: document.getElementById("editItemDescription").value,
                    };

                    // Resto do código de edição
                    set(eventosItemRef, editedData)
                        .then(() => {
                            alert("Item editado com sucesso!");
                            closeEditModal();
                            loadEventosData(); // Correção: atualize os eventos em vez dos cardápios
                        })
                        .catch((error) => {
                            console.error("Erro ao editar o item: " + error);
                        });
                });
            } else {
                document.querySelector(".cancelEditButton").addEventListener("click", () => {
                    closeEditModal();
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao obter os dados para edição: " + error);
        });
}

// Função para excluir um evento
function deleteEvento(eventoKey) {
    const eventosRef = ref(db, "Eventos/" + eventoKey);
    remove(eventosRef)
        .then(() => {eventosRef
            alert("Item deletado com sucesso!");
            // Recarregue os dados após a exclusão
            loadEventosData();
        })
        .catch((error) => {
            console.error("Erro ao deletar o item: " + error);
        });
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para carregar os dados de eventos e preencher a tabela
function loadEventosData() {
    get(eventosRef).then((snapshot) => {
        if (snapshot.exists()) {
            const eventosData = snapshot.val();
            const eventosTableBody = document.getElementById("EventosTableBody");
            eventosTableBody.innerHTML = ""; // Limpar o conteúdo atual da tabela

            for (const key in eventosData) {
                if (eventosData.hasOwnProperty(key)) {
                    const evento = eventosData[key];
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${evento.nome}</td>
                        <td>${formatDate(evento.data)}</td>
                        <td>${evento.descricao}</td>
                        <td>
                            <button class="edit-button" data-key="${key}">Editar</button>
                            <button class="delete-button" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    eventosTableBody.appendChild(newRow);
                }
            }

            // Adicione um ouvinte de evento aos botões de exclusão
            document.querySelectorAll(".delete-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const eventoKey = event.target.getAttribute("data-key");
                    if (eventoKey) {
                        deleteEvento(eventoKey);
                    }
                });
            });

            // Adicione um ouvinte de evento aos botões de edição
            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const eventoKey = event.target.getAttribute("data-key");
                    if (eventoKey) {
                        editEvento(eventoKey);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados: " + error);
    });
}

// Carregue os dados de eventos do Firebase e preencha a tabela
loadEventosData();