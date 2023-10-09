<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Cadastro de Pratos</title>
</head>

<body>
    <h1>Sistema de Cardápio</h1>
    <h2>Cadastro de Prato</h2>
    <form action="add-action-cardapio.php" method="post">
        <label for="image">Foto do Prato</label> <br>
        <input type="file" src="" alt="" name="image" id="image"><br>

        <label for="nome">Nome</label><br>
        <input type="text" name="nome" id="nome"><br>

        <label for="categoria">Categoria</label><br>
        <input type="text" name="categoria" id="categoria"><br>

        <label for="descrição">Descrição</label><br>
        <input type="text" name="descrição" id="descrição"><br>

        <label for="descrição">Preço</label><br>
        <input type="text" name="preço" id="preço"><br>

        <input type="submit" value="Cadastrar">
    </form>
</body>

</html>