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

    <main class="container" id="main-content">
        <div class="container-fluid">
            <div class="row justify-content-center">

                <!-- Bejelentkezési/regisztrációs űrlap -->
                <form action="" class="col-10 col-md-6 col-lg-4" id="loginForm" aria-labelledby="authTitle">
                    <div class="bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">

                        <!-- Űrlap címe -->
                        <h2 class="text-black" id="authTitle">Bejelentkezés</h2>

                        <!-- Felhasználónév -->
                        <div class="mb-3">
                            <label for="username" class="form-label text-black">Felhasználónév</label>
                            <input type="text" class="form-control" id="username" name="username" required
                                aria-required="true" autocomplete="username">
                        </div>

                        <!-- Jelszó -->
                        <div class="mb-3">
                            <label for="password" class="form-label text-black">Jelszó</label>
                            <input type="password" class="form-control" id="password" name="password" required
                                aria-required="true" autocomplete="current-password">
                        </div>

                        <!-- Hibák / visszajelzés -->
                        <div id="authFeedback" class="text-danger" aria-live="polite"></div>

                        <!-- Bejelentkezés -->
                        <button type="submit" id="authButton" class="btn btn-primary"
                            aria-label="Bejelentkezés vagy regisztráció végrehajtása">
                            Bejelentkezés
                        </button>

                        <!-- Mód váltás -->
                        <button id="authToggle" type="button" class="btn btn-link" onclick="changeAuth()"
                            aria-label="Váltás regisztrációra vagy bejelentkezésre">
                            Még nincs fiókom
                        </button>
                    </div>
                </form>

            </div>
        </div>

        <?php include 'layouts/footer.php'; ?>
    </main>
</body>

</html>