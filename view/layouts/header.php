<!-- Oldal fejléce és menüje -->

<script type="module">
    // Kijelentkezési logika importálása és globálissá tétele (onclick miatt)
    import { signout } from "/furulyatar/viewmodel/signin.js";
    window.signout = signout;
</script>

<div class="container-fluid justify-content-center row">
    <header class="row navbar navbar-expand-md bg-light bg-opacity-25 rounded shadow col-11" role="banner">
        <div class="d-flex">
            <h1 class="navbar-brand start-50 col-2">FurulyatáR</h1>
            <div class="col-5 d-block d-lg-none"></div>

            <nav class="col-lg-10 col-5 justify-content-end" aria-label="Fő navigáció">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false"
                    aria-label="Menü megnyitása">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                    <ul class="navbar-nav">
                        <?php
                        // Session indítása, ha még nem történt meg
                        if (session_status() == PHP_SESSION_NONE) {
                            session_start();
                        }

                        $base = '/furulyatar/';
                        $current = basename($_SERVER['PHP_SELF']);

                        // Aktív menüpont kijelölése
                        function active($current, $file)
                        {
                            return $current === $file ? 'active' : '';
                        }

                        // Navigációs link generálása
                        function navLink($label, $href, $current, $file)
                        {
                            return '<li class="nav-item"><a class="nav-link ' . active($current, $file) . '" href="' . $href . '">' . $label . '</a></li>';
                        }

                        // Bejelentkezett felhasználó kezelése
                        if (isset($_SESSION['username'])) {
                            echo '<li class="nav-item nav-link">Üdv, ' . $_SESSION['username'] . '</li>';
                            echo '<li class="nav-item"><button class="nav-button" onclick="signout()" aria-label="Kijelentkezés">Kijelentkezés</button></li>';
                        }

                        echo navLink('Kezdőlap', $base . 'index.php', $current, 'index.php');
                        echo navLink('Fogástáblázatok', $base . 'view/loader.php', $current, 'loader.php');

                        // Jogosultság alapú menü (rang == 1 → admin)
                        if (isset($_SESSION['rang']) && $_SESSION['rang'] == 1) {
                            echo navLink('Új furulya hozzáadása', $base . 'view/recorders.php', $current, 'recorders.php');
                            echo navLink('Új fogás hozzáadása', $base . 'view/fingerings.php', $current, 'fingerings.php');
                        } else {
                            echo navLink('Bejelentkezés', $base . 'view/signin.php', $current, 'signin.php');
                        }
                        ?>

                        <li class="nav-item">
                            <div id="navbar" aria-label="3D nézet kapcsoló helye"></div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
</div>