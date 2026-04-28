<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FurulyatáR</title>

    <!-- Külső és saját stílusok betöltése -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">

    <!-- Three.js modulok elérési útvonalainak megadása -->
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js",
                "three/tsl": "https://cdn.jsdelivr.net/npm/three@0.181.2/src/nodes/TSL.js",
                "jsm/": "https://cdn.jsdelivr.net/npm/three@0.181.2/examples/jsm/"
            }
        }
    </script>

    <script type="module">
        // A felület működéséhez szükséges függvények importálása
        import {deleteFingering, loadRec, changeView, animateHere, useFilter, vote } from "../viewmodel/change_recorder.js";

        // Az importált függvények elérhetővé tétele a HTML eseménykezelők számára
        window.deleteFingering = deleteFingering;
        window.loadRec = loadRec;
        window.changeView = changeView;
        window.animateHere = animateHere;
        window.useFilter = useFilter;
        window.vote = vote;

        // Korábban kiválasztott furulya visszatöltése munkamenetből
        window.addEventListener("DOMContentLoaded", async () => {
            const saved = sessionStorage.getItem("recName");
            if (!saved) return;

            const state = JSON.parse(saved);
            document.getElementById("chooserec").value = state.recorderName;
            loadRec(0);

            sessionStorage.removeItem("recName");
        });
    </script>
</head>
<body class="d-flex flex-column min-vh-100">
    <?php include 'layouts/header.php'; ?>

    <main class="container">
        <div class="row justify-content-center text-black-50">
            <div class="d-flex justify-content-center flex-wrap gap-2 col-12 col-md-7 bg-light bg-opacity-25 rounded">
                <div class="row">
                    <!-- Furulya kiválasztása -->
                    <form method="POST" id="formContainer" class="mitgard col-12">
                        <select name="chooserec" id="chooserec" onchange="loadRec(0)">
                            <option value="">Válassz egy furulyát</option>
                        </select>
                    </form>

                    <!-- A kiválasztott furulya leírása -->
                    <p id="description" class="col-12 mt-3 text-dark"></p>
                </div>
                
                <!-- Szűrési lehetőségek helye -->
                <div id="filter" class="midgard col-12"></div>

                <!-- Hangok közötti navigáció -->
                <div id="noteContainer" class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-secondary" type="button" id="prevBtn">‹</button>
                    
                    <div id="noteSlider" class="d-flex overflow-auto note-slider">
                        <div id="noteTrack" class="d-flex"></div>
                    </div>

                    <button class="btn btn-outline-secondary" type="button" id="nextBtn">›</button>
                </div>
            </div>
        </div>

        <!-- A 3D furulyamodell megjelenítési területe -->
        <div id="threed"></div>

        <?php include 'layouts/footer.php'; ?>
    </main>

<?php
    // Fejlesztés közbeni hibamegjelenítés és adatbázis-kapcsolat
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    include '../model/database.php';
?>

</body>
</html>