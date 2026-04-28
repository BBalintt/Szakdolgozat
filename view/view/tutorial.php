<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fogástáblázat segédlet</title>

    <!-- Bootstrap és saját stílus -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <?php include 'layouts/header.php'; ?>

    <main class="container">
        <div class="container-fluid">
            <div class="row justify-content-center">

                <h1>Segédlet a fogástáblázatok olvasásához</h1>

                <!-- Rövid leírás a fogástáblázat felépítéséről -->
                <p>A fogástáblázatokban a hangok oszloponként vannak megjelenítve, minden oszlop egy-egy hangot reprezentál. Minden oszlopban minden kör egy-egy lyukat reprezentál ezeknek háromféle állapota van:</p>

                <h2>Lyukak állapotai</h2>
                <!-- A gombok a furulya lyuk állapotát szemléltetik -->
                <ul>
                    <li><input type="button" class="me-1 covering btn2" data-state="2" style="width: 25px; height:25px;" aria-label="Teljes" title="Teljes takarás"> - teljes takarás</li>
                    <li><input type="button" class="me-1 covering btn1" style="width: 25px; height:25px;" aria-label="Fél" title="Fél takarás"> - fél takarás</li>
                    <li><input type="button" class="me-1 covering btn0" style="width: 25px; height:25px;" aria-label="Szabad" title="Szabadon hagyás"> - szabadon hagyás</li>
                </ul>

                <h2>A fogásokat a következőképpen kell olvasni:</h2>
                <!-- A lyukak sorrendjének vizuális bemutatása -->
                <img class="col-12 col-sm-8 col-md-6 col-lg-4"
                     src="resources/furulyafogas.png"
                     alt="Furulya lyukainak sorrendje"
                     aria-describedby="fogasdiagram-leiras">

                <!-- Rövid magyarázat a képen látható sorrendről -->
                <p id="fogasdiagram-leiras">
                    Ha van a furulyán hátsó lyuk, akkor az mindig a legfelső karika. Ezután az elülső lyukak következnek fentről lefelé, a síptól a furulya vége felé haladva.
                </p>

            </div>
        </div>

        <?php include 'layouts/footer.php'; ?>
    </main>
</body>
</html>