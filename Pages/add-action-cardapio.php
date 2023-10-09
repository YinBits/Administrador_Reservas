<?php
require_once("../config.php");
require_once("../firebaseRDB.php");

$db = new firebaseRDB($databaseURL);

$insert = $db->insert("Cardápio",[
    "Foto do Prato" => $_POST['image'],
    "Nome" => $_POST['nome'],
    "Categoria" => $_POST['categoria'],
    "Descrição" => $_POST['descrição'],
    "Preço" => $_POST['preço']
]);

echo "Prato adicionado com sucesso";

?>