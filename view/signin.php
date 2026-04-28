<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Bootstrap és saját stíluslap betöltése -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">

    <title>Document</title>

    <script type="module">
        // Bejelentkezéshez és regisztrációhoz szükséges függvények importálása
        import { authenticate, changeAuth, authMode } from "../viewmodel/signin.js";

        // Függvények globálissá tétele HTML eseménykezeléshez
        window.authenticate = authenticate;
        window.changeAuth = changeAuth;
        window.authMode = authMode;

        // Hitelesítési logika inicializálása
        authenticate();
    </script>
</head>

<body class="d-flex flex-column min-vh-100">
    <?php include 'layouts/header.php'; ?>

    <main class="container">
        <div class="container-fluid">
            <div class="row justify-content-center">

                <!-- Bejelentkezési/regisztrációs űrlap -->
                <form action="" class="col-md-8 col-12" id="loginForm">
                    <div class="bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">
                        
                        <!-- Űrlap címe az aktuális mód alapján változik -->
                        <h2 class="text-black" id="authTitle">Bejelentkezés</h2>

                        <!-- Felhasználónév megadása -->
                        <div class="mb-3">
                            <label for="username" class="form-label text-black">Felhasználónév</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                        </div>

                        <!-- Jelszó megadása -->
                        <div class="mb-3">
                            <label for="password" class="form-label text-black">Jelszó</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>

                        <!-- Hitelesítés indítása -->
                        <button type="submit" id="authButton" class="btn btn-primary">Bejelentkezés</button>

                        <!-- Váltás bejelentkezés és regisztráció között -->
                        <button id="authToggle" type="button" class="btn btn-link" onclick="changeAuth()">Még nincs fiókom</button>
                    </div>
                </form>

            </div>
        </div>

        <?php include 'layouts/footer.php'; ?>
    </main>
</body>
</html>