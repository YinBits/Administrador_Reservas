<?php
require_once("../config.php");
require_once("../firebaseRDB.php")
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cardápio</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/tables.css">

</head>

<header>
    <nav>
        <div class="navbar">
            <div class="container nav-container">
                <input class="checkbox" type="checkbox" name="" id="" />
                <div class="hamburger-lines">
                    <span class="line line1"></span>
                    <span class="line line2"></span>
                    <span class="line line3"></span>
                </div>
                <div class="logo">
                    <img src="../IMG/Logo_Tina.png" class="logoimg">
                </div>
                <div class="menu-items">
                    <img src="../IMG/Logo_Tina.png" id="logoimg-menu" alt="">
                    <li><a href="index.php">Início</a></li>
                    <li><a href="Reserva.php">Reserva de Mesas</a></li>
                    <li><a href="cardapio.php">Cardápio</a></li>
                    <li><a href="eventos.php">Eventos</a></li>
                </div>
            </div>
        </div>
    </nav>
</header>

<body>
    <div class="boxed">
        <div class="container-fluid">
            <h1 class="titulo">Cardápio</h1>
            <br>
            <p><a href="form-add.php" class="btn btn-light">Adicionar Prato     </a></p>

        </div>
        <br>
        <h2>Sistema de Cardápio</h2>




        <table class="table table-striped table-light">
            <thead>
                <tr>
                    <th scope="col">Imagem do Prato</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Preço</th>


                </tr>
            </thead>
            <tbody>
                <?php while ($user = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
                <tr>

                    <td>
                        <?=$user['Imagem'] ?>
                    </td>
                    <td>
                        <?=$user['Nome'] ?>
                    </td>
                    <td>
                        <?=$user['Descrição'] ?>
                    </td>
                    <td>
                        <?=$user['Categoria'] ?>
                    </td>
                    <td>
                        <?=$user['Preço'] ?>
                    </td>

                    <td>
                        <a href="form-edit.php?id=<?=$user['id'] ?>" class="edit">Editar</a>
                        <a href="delete.php?id=<?=$user['id'] ?>" class="delete"
                            onclick="return confirm('Tem certeza de que deseja remover?');">
                            Remover
                        </a>
                    </td>
                </tr>
                <?php
                $data = $db->retrieve('cardapio');
                $data = json_decode($data, 1);
                print_r($data);
                ?>
            </tbody>
        </table>
    </div>
    </div>

</body>

</html>