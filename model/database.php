<?php
// Munkamenet indítása, ha még nem aktív
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Adatbázis-kapcsolat adatai
$host = 'mysql.caesar.elte.hu';
$db = 'hbalintt';
$user = 'hbalintt';
$pass = 'Jelszó helye';
$dsn = "mysql:host=$host;dbname=$db;charset=utf8";
try {
    $pdo = new PDO($dsn, $user, $pass);
    // Hibakezelés beállítása
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Kapcsolat sikertelen: " . $e->getMessage();
}

// Furulyák adatainak lekérése a legördülő listához
function getRecorder()
{
    global $pdo;

    $sql = "SELECT pipes.holecount,pipes.RecorderID FROM `pipes`";
    $stmt = $pdo->query($sql);
    $rows = [];
    if ($stmt) {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo '<script type="module">';
        echo 'import { fillRecorderDropdown } from "../viewmodel/change_recorder.js";';
        echo 'fillRecorderDropdown(' . json_encode($rows) . ');';
        echo '</script>';
    } else {
        echo "Nincs adat a táblában.";
    }
}

// Felhasználó bejelentkeztetése
function authLogin()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;

    if (!$username || !$password) {
        echo json_encode(["error" => "Hiányzó adatok"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(["error" => "Hibás felhasználónév vagy jelszó"]);
        exit;
    }

    $_SESSION['username'] = $username;
    $_SESSION['rang'] = 1;

    echo json_encode(["success" => true]);
}

// Új felhasználó regisztrálása
function authRegister()
{
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;

    if (!$username || !$password) {
        echo json_encode(["error" => "Hiányzó felhasználónév vagy jelszó"]);
        exit;
    }

    // Megnézzük, létezik-e már a felhasználónév
    $stmt = $pdo->prepare("SELECT username FROM users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->fetch()) {
        echo json_encode(["error" => "A felhasználónév már foglalt"]);
        exit;
    }

    // Jelszó hash-elése
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // Szín generálásaa felhasználóhoz
    $r = mt_rand(200, 255);
    $g = mt_rand(200, 255);
    $b = mt_rand(200, 255);

    $color = sprintf('%02X%02X%02X', $r, $g, $b);

    // Beszúrás
    $stmt = $pdo->prepare("INSERT INTO users (username, password, color) VALUES (?, ?, ?)");
    $stmt->execute([$username, $hashed, $color]);

    $_SESSION['username'] = $username;
    $_SESSION['rang'] = 1;

    echo json_encode(["success" => true]);
}

// Furulyához tartozó adatok lekérése megjelenítéshez vagy szerkesztéshez
function noteModel()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? null;

    if ($name === null) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Hiányzó name paraméter.'
        ]);
        exit;
    }

    if ($input['modes'] == 0) {
        $sql = "SELECT 
                    pipes.ID,
                    pipes.holecount,
                    pipes.RecorderID,
                    fingering.note,
                    fingering.fingering,
                    fingering_table.reputation,
                    fingering_table.ID as fingering_tableID,
                    users.color,
                    users.username
                FROM pipes 
                JOIN fingering_table ON fingering_table.pipeID = pipes.ID 
                JOIN fingering ON fingering_table.fingeringID = fingering.ID
                JOIN users ON fingering_table.UserID = users.username
                WHERE pipes.RecorderID = :name";
    } else if ($input['modes'] == 1) {
        $sql = "SELECT 
                    pipes.ID,
                    pipes.holecount,
                    pipes.RecorderID
                FROM pipes 
                WHERE pipes.RecorderID = :name";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['name' => $name]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'message' => 'Data fetched successfully',
        'data' => $rows
    ]);
}

// Furulya leírásának lekérése
function getDescription()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? null;

    if ($name === null) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Hiányzó name paraméter.'
        ]);
        exit;
    }

    $sql = "SELECT description FROM recorders WHERE RecorderID = :name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['name' => $name]);
    $description = $stmt->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'message' => 'Description fetched successfully',
        'description' => $description
    ]);
}

// Új hang és fogás mentése
function noteRepository()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['RecorderID']) || !isset($input['fingering']) || !isset($input['note']) || !isset($input['pipe'])) {
        echo json_encode(["error" => "Missing required input fields RecorderID: " . ($input['RecorderID'] ?? 'not provided') . ", fingering: " . ($input['fingering'] ?? 'not provided') . ", note: " . ($input['note'] ?? 'not provided') . ", pipe: " . ($input['pipe'] ?? 'not provided')]);
        throw new Exception("Missing required input fields");
    }

    $stmt = $pdo->prepare("SELECT fingering, note FROM fingering WHERE fingering = ? AND note = ?");
    $stmt->execute([$input['fingering'], $input['note']]);

    if ($stmt->rowCount() == 0) {
        $stmt = $pdo->prepare("INSERT INTO fingering ( fingering, note) VALUES (?, ?)");
        $stmt->execute([$input['fingering'], $input['note']]);
    }

    $stmt = $pdo->prepare("SELECT ID FROM pipes WHERE RecorderID = ?");
    $stmt->execute([$input['RecorderID']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!isset($rows[$input['pipe']]['ID'])) {
        echo json_encode(["error" => "Érvénytelen vagy hiányzó pipe index"]);
        throw new Exception('Érvénytelen vagy hiányzó pipe index');
    }
    $pipeID = $rows[$input['pipe']]['ID'];

    $stmt = $pdo->prepare("SELECT ID FROM fingering WHERE fingering = ? AND note = ?");
    $stmt->execute([$input['fingering'], $input['note']]);
    $fingeringID = $stmt->fetchColumn();

    if (!$fingeringID) {
        echo json_encode(["error" => "A fingering rekord nem található."]);
        throw new Exception('A fingering rekord nem található.');
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM fingering_table WHERE pipeID = ? AND fingeringID = ?");
    $stmt->execute([$pipeID, $fingeringID]);
    $exists = $stmt->fetchColumn();

    if ($exists == 0) {
        $stmt = $pdo->prepare("INSERT INTO fingering_table (pipeID, fingeringID, UserID) VALUES (?, ?, ?)");
        $stmt->execute([$pipeID, $fingeringID, $_SESSION['username']]);
    }

    echo json_encode([
        "success" => true,
        "user" => $_SESSION['username']
    ]);
}

// Annak ellenőrzése, hogy létezik-e már az adott furulya
function recorderExists()
{
    global $pdo;

    header('Content-Type: application/json; charset=utf-8');

    $input = json_decode(file_get_contents('php://input'), true);
    $recorderID = $input['RecorderID'] ?? null;

    if ($recorderID === null) {
        http_response_code(400);
        echo json_encode(["error" => "Hiányzó RecorderID"]);
        return;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM recorders WHERE RecorderID = ?");
    $stmt->execute([$recorderID]);
    $exists = $stmt->fetchColumn();

    if ($exists == 0) {
        if (!isset($_SESSION['username'], $input['description'])) {
            http_response_code(401);
            echo json_encode(["error" => "Nincs bejelentkezve"]);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO recorders (RecorderID, description, UserID) VALUES (?, ?, ?)");
        $stmt->execute([$recorderID, $input['description'] ?? "", $_SESSION['username']]);
    }

    echo json_encode(["exists" => $exists > 0]);
}

// Új furulya csöveinek mentése
function recorderRepository()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['RecorderID'], $input['holecount'])) {
        echo json_encode(["error" => "Missing required input fields RecorderID: " . ($input['RecorderID'] ?? 'not provided') . ", holecount: " . ($input['holecount'] ?? 'not provided') . ", description: " . ($input['description'] ?? 'not provided') . ", username: " . ($_SESSION['username'] ?? 'not provided')]);
        throw new Exception("Missing required input fields");
    }

    $stmt = $pdo->prepare("INSERT INTO pipes (RecorderID, holecount) VALUES (?, ?)");
    $stmt->execute([$input['RecorderID'], $input['holecount']]);
    $pipeID = $pdo->lastInsertId();

    echo json_encode(["success" => true]);
}

// Egy fogás törlése
function deleteFingering()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);
    $fingeringID = $input['fingeringID'] ?? null;

    if ($fingeringID === null) {
        echo json_encode(["error" => "Hiányzó fingeringID"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM fingering_table WHERE ID = ?");
    $stmt->execute([$fingeringID]);

    echo json_encode(["success" => true]);
}

// Bejelentkezett felhasználó nevének lekérése
function getUser()
{
    $username = $_SESSION['username'] ?? null;

    if (!isset($_SESSION['username'])) {
        echo json_encode(["error" => "Nincs bejelentkezve"]);
        exit;
    }
    echo json_encode(["username" => $username]);
}

// Szavazat leadása egy fogásra
function vote()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);
    $fingeringID = $input['fingeringID'] ?? null;
    $value = $input['value'] ?? null;

    if ($fingeringID === null || $value === null) {
        echo json_encode(["error" => "Hiányzó fingeringID vagy value"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE fingering_table SET reputation = reputation + ? WHERE ID = ?");
    $stmt->execute([$value, $fingeringID]);

    echo json_encode(["success" => true]);
}

// Felhasználó kijelentkeztetése
function logout()
{
    session_start();
    session_unset();
    session_destroy();
    echo json_encode(["success" => true]);
}

// Beérkező kérés feldolgozása
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? null;

if ($action === null) {
    getRecorder();
} else {
    switch ($action ?? '') {
        case 'getRecorder':
            getRecorder();
            break;
        case 'logout':
            logout();
            break;
        case 'deleteFingering':
            deleteFingering();
            break;
        case 'getUser':
            getUser();
            break;
        case 'getDescription':
            getDescription();
            break;
        case 'recorderExists':
            recorderExists();
            break;
        case 'login':
            authLogin();
            break;
        case 'register':
            authRegister();
            break;
        case 'noteModel':
            noteModel();
            break;
        case 'noteRepository':
            noteRepository();
            break;
        case 'recorderRepository':
            recorderRepository();
            break;
        case 'vote':
            vote();
            break;
        default:
            echo json_encode(["error" => "Ismeretlen művelet"]);
            break;
    }
}
?>
