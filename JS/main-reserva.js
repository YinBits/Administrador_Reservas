import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, remove, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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

// Referência para o nó "Reservas" no Realtime Database
const reservasRef = ref(db, "Reservas");

// Função para abrir o modal de edição
function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";
}

// Função para editar uma reserva
function editReserva(reservaKey) {
    const reservaItemRef = ref(db, "Reservas/" + reservaKey);

    get(reservaItemRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const itemData = snapshot.val();
             
                document.getElementById("editItemName").value = itemData.nomeCliente; // Nome do Cliente            
                document.getElementById("editItemDate").value = itemData.dataReserva;// Data da reserva
                document.getElementById("editItemTime").value = itemData.horarioReserva; // Horário da reserva
                document.getElementById("editItemMesaNumber").value = itemData.numeroMesa; // Número da Mesa
                document.getElementById("editItemPeopleNumber").value = itemData.numeroPessoas; // Número de pessoas
             
                // Abra o modal de edição
                openEditModal();

                // Adicione um evento ao botão de confirmação de edição
                document.getElementById("saveEditButton").addEventListener("click", () => {
                    const editedData = {
                    nomeCliente: document.getElementById("editItemName").value, // Nome do Cliente            
                    dataReserva: document.getElementById("editItemDate").value, // Data da reserva
                    horarioReserva: document.getElementById("editItemTime").value, // Horário da reserva
                    numeroMesa: document.getElementById("editItemMesaNumber").value, // Número da Mesa
                    numeroPessoas: document.getElementById("editItemPeopleNumber").value, // Número de pessoas
                    };

                    set(reservaItemRef, editedData)
                        .then(() => {
                            alert("Reserva editada com sucesso!");
                            closeEditModal();
                            loadReservasData();
                        })
                        .catch((error) => {
                            console.error("Erro ao editar a reserva: " + error);
                        });
                });
            } else {
                document.getElementById("cancelEditButton").addEventListener("click", () => {
                    closeEditModal();
                });
            }
            document.getElementById("cancelEditButton").addEventListener("click", () => {
                closeEditModal();
            });
        })
        .catch((error) => {
            console.error("Erro ao obter os dados para edição: " + error);
        });
}

// Função para excluir uma reserva
function deleteReserva(reservaKey) {
    const reservaRef = ref(db, "Reservas/" + reservaKey);
    remove(reservaRef)
        .then(() => {
            alert("Reserva deletada com sucesso!");
            loadReservasData();
        })
        .catch((error) => {
            console.error("Erro ao deletar a reserva: " + error);
        });
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

// Função para formatar a data no formato "dd/mm/aaaa"
function formatDate(date) {
    if (date) {
        const parts = date.split("-");
        if (parts.length === 3) {
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            return `${day}/${month}/${year}`;
        }
    }
    return "Data inválida"; // Ou outra mensagem de erro, se preferir
}

// Função para carregar os dados de reservas e preencher a tabela com filtro por data
function loadReservasData() {
    const today = new Date(); // Obtém a data de hoje

    get(reservasRef).then((snapshot) => {
        if (snapshot.exists()) {
            const reservasData = snapshot.val();
            const reservasArray = [];

            for (const key in reservasData) {
                if (reservasData.hasOwnProperty(key)) {
                    const reserva = reservasData[key];
                    const dataReserva = new Date(reserva.dataReserva);

                    // Verifique se a data da reserva está igual ou posterior à data de hoje
                    if (dataReserva >= today) {
                        reservasArray.push({ key, reserva, dataReserva });
                    }
                }
            }

            // Classifique o array de reservas pela data mais próxima à mais distante
            reservasArray.sort((a, b) => a.dataReserva - b.dataReserva);

            const reservasTableBody = document.getElementById("ReservasTableBody");
            reservasTableBody.innerHTML = "";

            reservasArray.forEach((reservaObj) => {
                const { key, reserva } = reservaObj;
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    <td>${reserva.nomeCliente}</td> <!-- Nome do Cliente -->
                    <td>${formatDate(reserva.dataReserva)}</td> <!-- Data da Reserva (formatada) -->
                    <td>${reserva.horarioReserva}</td> <!-- Horário da Reserva -->
                    <td>${reserva.numeroMesa}</td> <!-- Número da Mesa -->
                    <td>${reserva.numeroPessoas}</td> <!-- Número de Pessoas -->
                    <td>
                        <button class="edit-button" data-key="${key}">Editar</button>
                        <button class="delete-button" data-key="${key}">Excluir</button>
                    </td>
                `;
                reservasTableBody.appendChild(newRow);
            });

            // Adicione um ouvinte de evento aos botões de exclusão
            document.querySelectorAll(".delete-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const reservaKey = event.target.getAttribute("data-key");
                    if (reservaKey) {
                        deleteReserva(reservaKey);
                    }
                });
            });

            // Adicione um ouvinte de evento aos botões de edição
            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const reservaKey = event.target.getAttribute("data-key");
                    if (reservaKey) {
                        editReserva(reservaKey);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados: " + error);
    });
}

// Carregue os dados de reservas do Firebase e preencha a tabela
loadReservasData();