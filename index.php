<body>
  <div class="container-fluid row justify-content-center">
    <?php include 'view/layouts/header.php'; ?>

    <main class="row justify-content-center" id="main-content">
      <div class="col-12 col-sm-8 col-md-7 bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">
        <h1>Üdv a weboldalon!</h1>

        <p>Ez az oldal azért jött létre hogy egy könnyen elérhető helyen gyűjtsük össze az összes furulya fogástábláját.
        </p>
        <p>Az oldal folyamatosan fejlődik a felhasználók által.</p>
        <p>Ha szeretnél hozzájárulni az oldalhoz csak regisztrálj és máris hozzáadhatsz új furulyákat, vagy bővítheted a
          már meglévő fogástáblákat.</p>
        <p>A regisztációhoz csak egy felhasználónév és egy jelszó szükséges.</p>

        <nav aria-label="Főoldali navigáció">
          <ul class="nav flex-column">
            <li><a href="view/tutorial.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Segédlet a
                fogástáblázatok olvasásához</a></li>
            <li><a href="view/loader.php"
                class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Fogástáblázatok</a></li>
            <?php
            session_start();
            if ($_SESSION['rang'] == 1) {
              echo ('<li><a href="view/recorders.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Új furulya hozzáadása</a></li>');
              echo ('<li><a href="view/fingerings.php" class="nav-link text-black bg-light bg-opacity-50 rounded shadow">Új fogás hozzáadása</a></li>');
            } else {
              echo ('<li><a class="nav-link text-black text-opacity-25 bg-light bg-opacity-75 rounded shadow" aria-disabled="true" tabindex="-1" title="Jelentkezz be, hogy hozzáadhass új furulyákat!">Új furulya hozzáadása</a></li>');
              echo ('<li><a class="nav-link text-black text-opacity-25 bg-light bg-opacity-75 rounded shadow" aria-disabled="true" tabindex="-1" title="Jelentkezz be, hogy hozzáadhass új fogásokat!">Új fogás hozzáadása</a></li>');
            }
            ?>
          </ul>
        </nav>
      </div>
    </main>
  </div>

  <?php include 'view/layouts/footer.php'; ?>
</body>