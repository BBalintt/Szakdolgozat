  <!DOCTYPE html>
  <html lang="hu">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FurulyatáR</title>

      <!-- Stílusok és Bootstrap betöltése -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      <link rel="stylesheet" href="style.css">

      <script type="module">
          // Új furulya létrehozásához szükséges függvények importálása
          import { saveRecorder, holeInput } from "../viewmodel/new_recorder.js";

          // Függvények globálissá tétele HTML eseménykezeléshez
          window.saveRecorder = saveRecorder;
          window.holeInput = holeInput;
      </script>
  </head>

  <body class="d-flex flex-column min-vh-100">
    <?php include 'layouts/header.php'; ?>

    <main class="container" id="main-content">
        <div class="row justify-content-center">
            <div class="d-flex justify-content-center flex-wrap gap-2 col-12 col-md-8">

                <!-- Új furulya adatainak megadása -->
                <form method="POST" id="formContainer" action="" onsubmit="saveRecorder()" class="mitgard col-12 p-3">
                    
                    <!-- Furulya neve -->
                    <label for="name" class="form-label fw-bold">Mi a furulya típusa?</label>
                    <input type="text" name="name" id="name" class="form-control" required aria-required="true"><br/>

                    <!-- Csövek száma -->
                    <label for="pipe_number" class="form-label fw-bold">Hány cső van a furulyán?</label>
                    <input type="number" name="pipe_number" id="pipe_number" class="form-control" max="4" min="1" value="1" onchange="holeInput()" aria-describedby="pipeHelp"><br/>
                    <small id="pipeHelp" class="form-text text-dark">1 és 4 közötti érték adható meg.</small>

                    <!-- Lyukak száma csövönként -->
                    <label class="form-label fw-bold">Hány lyuk van egy csövön?</label><br/>
                    <div id="holes-container" aria-label="Lyukak száma csövönként">
                        <input type="number" id="holes1" name="holes1" class="holecount-input form-control" min="0" max="9" value="1">
                    </div>

                    <!-- Leírás -->
                    <label for="description" class="form-label fw-bold">Leírás</label>
                    <input type="text" name="description" id="description" class="form-control" placeholder="Leírás" maxlength="500"><br/>

                    <br/>

                    <!-- Mentés gomb -->
                    <input type="button" onclick="saveRecorder()" value="Furulya mentése" class="btn btn-primary" aria-label="Furulya mentése">
                </form>

            </div>
        </div>

        <?php include 'layouts/footer.php'; ?>
    </main>
  </body>
  </html>