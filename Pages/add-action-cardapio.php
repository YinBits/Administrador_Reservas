<?php
require_once("../config.php");
require_once("../firebaseRDB.php");

$db = new firebaseRDB($databaseURL);

$imageUrl = $_POST['image'];
$nome = $_POST['nome'];
$categoria = $_POST['categoria'];
$descricao = $_POST['descrição'];
$preco = $_POST['preço'];

$insert = $db->insert("Cardápio", [
    "Foto do Prato" => $imageUrl,
    "Nome" => $nome,
    "Categoria" => $categoria,
    "Descrição" => $descricao,
    "Preço" => $preco
]);

echo "Prato adicionado com sucesso";
?>
