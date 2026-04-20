<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FurulyatáR</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <script type="importmap">
			{
				"imports": {
					"three": "https://cdn.jsdelivr.net/npm/three@0.131/build/three.module.js",
          "jsm/": "https://cdn.jsdelivr.net/npm/three@0.131/examples/jsm/"
        }
			}
		</script>
    <script type="module">
        import { load3DRec, changeView } from "../viewmodel/change_recorder.js";
        window.load3DRec = load3DRec;
        window.changeView = changeView;
    </script>
</head>
<body>
    <?php include 'layouts/header.php'; ?>
    <div class="row justify-content-center text-black-50">
        <div class="d-flex justify-content-center flex-wrap gap-2 col-12 col-md-7 bg-light bg-opacity-25 rounded">
            <div class="row">
            <form  method="POST" id="fo" class="mitgard col-12 p-3">
                <select name="chooserec" id="chooserec" onchange="load3DRec(0)">
                    <option value="">Válassz egy furulyát</option>
                </select>
            </form>
            </div>
            
            <div id="noteContainer" class="d-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary" type="button" id="prevBtn">‹</button>

              <div id="noteSlider" class="d-flex overflow-auto note-slider">
                <div id="noteTrack" class="d-flex"></div>
              </div>

              <button class="btn btn-outline-secondary" type="button" id="nextBtn">›</button>
            </div>
            <div id="threed"></div>
        </div>
    </div>
  </div>
<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    include '../model/database.php';
    ?>
</body>
</html>