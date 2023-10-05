<?php
include("config.php");
include("firebaseRDB.php");
$db = new firebaseRDB($databaseURL);

$insert = $db->insert("prato", [
    "image" => $_POST['image'],
    "nome" => $_POST['nome'],
    "descricao" => $_POST['descricao'],
    "categoria" => $_POST['categoria'],
    "preco" => $_POST['preco']
]);