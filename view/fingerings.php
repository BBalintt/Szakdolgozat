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
        // A kotta és furulya kezeléséhez szükséges függvények importálása
        import { loadRec, cover, saveNote, inputCheck } from "../viewmodel/change_recorder.js";

        // Az importált függvények elérhetővé tétele HTML eseménykezelők számára
        window.loadRec = loadRec;
        window.cover = cover;
        window.saveNote = saveNote;
        window.inputCheck = inputCheck;
    </script>
</head>

<body>
    <?php include 'layouts/header.php'; ?>

    <main class="container">
        <div class="row justify-content-center">
            <div class="d-flex justify-content-center flex-wrap gap-2 col-8">

                <!-- Furulya kiválasztása -->
                <form method="POST" id="formContainer" class="mitgard col-12 p-3">
                    <select name="chooserec" id="chooserec" onchange="loadRec(1)">
                        <option value="">Válassz egy furulyát</option>
                    </select>
                </form>

                <!-- Hangok megjelenítésére szolgáló görgethető sáv -->
                <div id="noteContainer" class="d-flex align-items-center gap-2">
                    <div id="noteSlider" class="d-flex overflow-auto note-slider">
                        <div id="noteTrack" class="d-flex"></div>
                    </div>
                </div>

            </div>
        </div>

        <?php include 'layouts/footer.php'; ?>
    </main>

    <?php include '../model/database.php'; ?>
</body>
</html>