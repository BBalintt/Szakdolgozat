
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FurulyatáR</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <script type="module">
        import { saveRecorder, holeInput } from "../viewmodel/new_recorder.js";
        window.saveRecorder = saveRecorder;
        window.holeInput = holeInput;
    </script>
</head>
<body>
    <?php include 'layouts/header.php'; ?>
    <div class="row justify-content-center">
      <div class="d-flex justify-content-center flex-wrap gap-2 col-8">
        <form  method="POST" id="formContainer" class="mitgard col-12 p-3">
          <label>Mi a furulya típusa?</label>
            <input type="text" name="name" id="name"><br/>
            <label>Hány cső van a furulyán?</label>
            <input type="number" name="pipe_number" id="pipe_number" max="4" min="1" value="1" onchange="holeInput()"><br/>
            <label>Hány lyuk van egy csövön?</label><br/>
              <div id="holes-container">
                <input type="number" id="holes1" name="holes1" class="holecount-input" min="0" max="9" value="1">
              </div>
              <br/>
              <input type="button" value="Furulya mentése" onclick="saveRecorder()">
            </form>
        </div>
    </div>
</body>
</html>