<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <title>FurulyatáR</title>
    <link rel="stylesheet" href="view/style.css">
</head>
<body>
<div class="container-fluid row justify-content-center">
    <?php include 'view/layouts/header.php'; ?>
    <div class="row justify-content-center">
      <div class="col-sm-4 col-md-7 bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">
        <h1>Üdv a weboldalon!</h1>
        <p>Ez az oldal azért jött létre hogy egy könnyen elérhető helyen gyűjtsük össze az összes furulya fogástábláját.</p>
        <p>Az oldal folyamatosan fejlődik a felhasználók által.</p>
        <p>Ha szeretnél hozzájárulni az oldalhoz csak regisztrálj és máris hozzáadhatsz új furulyákat, vagy bővítheted a már meglévő fogástáblákat.</p>
        <p>A regisztációhoz csak egy felhasználónév és egy jelszó szükséges.</p>
        <ul class="nav flex-column">
          <li><a href="view/loader.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Furulyák</a></li>
          <?php
            session_start();
            if($_SESSION['rang']==1)
            {
              echo('<li><a href="view/recorders.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Új furulya hozzáadása</a></li>');
              echo('<li><a href="view/fingerings.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Új fogás hozzáadása</a></li>');
            }
            else
            {
              echo('<li><a class="nav-link text-black text-opacity-25 bg-light bg-opacity-75 rounded shadow" title="Jelentkezz be, hogy hozzáadhass új furulyákat!">Új furulya hozzáadása</a></li>');
              echo('<li><a class="nav-link text-black text-opacity-25 bg-light bg-opacity-75 rounded shadow" title="Jelentkezz be, hogy hozzáadhass új fogásokat!">Új fogás hozzáadása</a></li>');
            }
          ?>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>