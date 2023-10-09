<?php
require_once("../config.php");
require_once("../firebaseRDB.php");

$db = new firebaseRDB($databaseURL);

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cardápio</title>
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
                <h1 class="titulo"></h1>
                <br>
                <p><a href="add-cardapio.php" class="btn btn-light">Adicionar Cardápio</a></p>

            </div>
            <br>
            <h2>Sistema de Cardápio</h2>




            <table class="table table-striped table-light">
                <thead>
                    <tr>
                        <th scope="col">Foto do Prato</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Preço</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $data = $db->retrieve("Cardápio");
                    $data = json_decode($data, 1);
                    print_r($data);
                    if (is_array($data)) {
                        foreach ($data as $cardapio) {
                            echo "   
                            <tr>
                                <td><img src='{$cardapio['Foto do Prato']}</td>
                                <td>{$cardapio['Nome']}</td>
                                <td>{$cardapio['Categoria']}</td>
                                <td>{$cardapio['Descrição']}</td>
                                <td> {$cardapio['Preço']}</td> 
                            </tr>";
                        }

                    }
                    ?>
                </tbody>
            </table>
        </div>
        </div>

    </body>
</body>

</html>