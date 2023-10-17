import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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
const reservasRef = ref(db, "Reservas");

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";
}

function editReserva(nomeCliente) {
    const reservaItemRef = ref(db, "Reservas/" + nomeCliente);

    get(reservaItemRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const itemData = snapshot.val();

                document.getElementById("editItemName").value = itemData.nomeCliente;
                document.getElementById("editItemDate").value = itemData.dataReserva;
                document.getElementById("editItemTime").value = itemData.horarioReserva;
                document.getElementById("editItemMesa").value = itemData.numeroMesa;
                document.getElementById("editItemPessoas").value = itemData.numeroPessoas;

                openEditModal();

                document.getElementById("saveEditButton").addEventListener("click", () => {
                    const editedData = {
                        nomeCliente: document.getElementById("editItemName").value,
                        dataReserva: document.getElementById("editItemDate").value,
                        horarioReserva: document.getElementById("editItemTime").value,
                        numeroMesa: document.getElementById("editItemMesa").value,
                        numeroPessoas: document.getElementById("editItemPessoas").value,
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
                document.querySelector(".cancelEditButton").addEventListener("click", () => {
                    closeEditModal();
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao obter os dados para edição: " + error);
        });
}

function deleteReserva(nomeCliente) {
    const reservaRef = ref(db, "Reservas/" + nomeCliente);
    remove(reservaRef)
        .then(() => {
            alert("Reserva deletada com sucesso!");
            loadReservasData();
        })
        .catch((error) => {
            console.error("Erro ao deletar a reserva: " + error);
        });
}

function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function loadReservasData() {
    const today = new Date(); // Obtém a data de hoje
    get(reservasRef).then((snapshot) => {
        if (snapshot.exists()) {
            const reservasData = snapshot.val();
            const reservasTableBody = document.getElementById("ReservasTableBody");
            reservasTableBody.innerHTML = "";

            for (const key in reservasData) {
                if (reservasData.hasOwnProperty(key)) {
                    const reserva = reservasData[key];
                    const dataReserva = new Date(reserva.dataReserva);
                    
                    // Verifica se a reserva é para hoje ou dias futuros
                    if (dataReserva >= today) {
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                            <td>${formatDate(dataReserva)}</td>
                            <td>${reserva.nomeCliente}</td>
                            <td>${reserva.horarioReserva}</td>
                            <td>${reserva.numeroMesa}</td>
                            <td>${reserva.numeroPessoas}</td>
                            <td>
                                <button class="edit-button" data-key="${reserva.nomeCliente}">Editar</button>
                                <button class="delete-button" data-key="${reserva.nomeCliente}">Excluir</button>
                            </td>
                        `;
                        reservasTableBody.appendChild(newRow);
                    }
                }
            }

            document.querySelectorAll(".delete-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const nomeCliente = event.target.getAttribute("data-key");
                    if (nomeCliente) {
                        deleteReserva(nomeCliente);
                    }
                });
            });

            document.querySelectorAll(".edit-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const nomeCliente = event.target.getAttribute("data-key");
                    if (nomeCliente) {
                        editReserva(nomeCliente);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error("Erro ao obter os dados: " + error);
    });
}

loadReservasData();