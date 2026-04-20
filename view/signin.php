<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <script type="module">
        import { authenticate } from "../viewmodel/signin.js";
        window.authenticate = authenticate;
        authenticate();
    </script>
</head>
<body>
  <?php include 'layouts/header.php'; ?>
    <div class="container-fluid">
    <div class="row justify-content-center ">
        <form action="" class="col-4" id="loginForm">
            <div class="bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">
                <h2 class="text-black">Bejelentkezés</h2>
                <div class="mb-3">
                    <label for="username" class="form-label text-black">Felhasználónév</label>
                    <input type="text" class="form-control" id="username" name="username" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-black">Jelszó</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Bejelentkezés</button>
            </div>
        </form>
        <form id="registerForm" class="col-4">
          <div class="bg-light bg-opacity-25 p-3 rounded shadow text-center mb-3 mt-3">
            <h2 class="text-black">Regisztráció</h2>
            <div class="mb-3">
              <label for="reg_username" class="form-label text-black">Felhasználónév</label>
              <input type="text" class="form-control" id="reg_username" name="username" required>
            </div>
            <div class="mb-3">
              <label for="reg_password" class="form-label text-black">Jelszó</label>
              <input type="password" class="form-control" id="reg_password" name="password" required>
            </div>
            <button type="submit" class="btn btn-success">Regisztráció</button>
          </div>
        </form>
    </div>
</div>
</body>
</html>