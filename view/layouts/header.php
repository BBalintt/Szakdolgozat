<div class="container-fluid row justify-content-center">
<header class="navbar navbar-expand-lg col-11 bg-light bg-opacity-25 rounded shadow">
    <div class="container-fluid" id="navbar">
        <div>
            <h1 class="navbar-brand position-absolute start-50 translate-middle-x" href="#">FurulyatáR</h1>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse justify-content-start navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                    
                    <?php
                    $base = '/szakdogaterv/';
                    $current = basename($_SERVER['PHP_SELF']);

                    function active($current, $file) {
                        return $current === $file ? 'active' : '';
                    }

                    function navLink($label, $href, $current, $file) {
                        return '<li class="nav-item"><a class="nav-link '.active($current, $file).'" href="'.$href.'">'.$label.'</a></li>';
                    }

                    echo navLink('Kezdőlap', $base.'index.php', $current, 'index.php');
                    echo navLink('Furulyák', $base.'view/loader.php', $current, 'loader.php');

                    session_start();
                    if (isset($_SESSION['rang']) && $_SESSION['rang'] == 1) {
                        echo navLink('Új furulya hozzáadása', $base.'view/recorders.php', $current, 'recorders.php');
                        echo navLink('Új fogás hozzáadása', $base.'view/fingerings.php', $current, 'fingerings.php');
                    } else {
                        echo navLink('Bejelentkezés', $base.'view/signin.php', $current, 'signin.php');
                    }
                    ?>
            </ul>
        </div>
    </div>
</header>
