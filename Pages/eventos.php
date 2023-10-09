<?php
require_once("../config.php");
require_once("../firebaseRDB.php");

$db= new firebaseRDB($databaseURL);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva de Mesas</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <link rel="stylesheet" href="../CSS/tables.css">
    
</head>
<body>
   
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
            <h1 class="titulo">Eventos</h1>
            <br>
            <p><a href="form-add.php" class="btn btn-light">Adicionar Evento</a></p>

        </div>
        <br>
        <h2>Sistema de Eventos</h2>




        <table class="table table-striped table-light">
            <thead>
                <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($user = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
                <tr>

                    <td>
                        <?=$user['Data'] ?>
                    </td>
                    <td>
                        <?=$user['Nome'] ?>
                    </td>
                    <td>
                        <?=$user['Descrição'] ?>
                    </td>
                        
                    <td>
                        <a href="form-edit.php?id=<?=$user['id'] ?>" class="edit">Editar</a>
                        <a href="delete.php?id=<?=$user['id'] ?>" class="delete"
                            onclick="return confirm('Tem certeza de que deseja remover?');">
                            Remover
                        </a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    </div>

</body>
</body>
</html>
