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
			"imports": 
            {
			    "three": "https://cdn.jsdelivr.net/npm/three@0.131/build/three.module.js",
                "jsm/": "https://cdn.jsdelivr.net/npm/three@0.131/examples/jsm/"
            }
		}
	</script>
    <script type="module">
        import { load3DRec, cover, saveNote } from "../viewmodel/change_recorder.js";
        window.load3DRec = load3DRec;
        window.cover = cover;
        window.saveNote = saveNote;
    </script>
</head>
<body>
    <?php include 'layouts/header.php'; ?>
    <div class="row justify-content-center">
        <div class="d-flex justify-content-center flex-wrap gap-2 col-8">
            <form  method="POST" id="fo" class="mitgard col-12 p-3">
                <select name="chooserec" id="chooserec" onchange="load3DRec(1)">
                    <option value="">Válassz egy furulyát</option>
                </select>
            </form>
            <div id="noteContainer" class="d-flex align-items-center gap-2">
              <div id="noteSlider" class="d-flex overflow-auto note-slider">
                <div id="noteTrack" class="d-flex"></div>
              </div>
            </div>
        </div>
    </div>
<?php
    include '../model/database.php';
    ?>
</body>
</html>