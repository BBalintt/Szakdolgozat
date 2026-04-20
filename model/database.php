<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'mysql.caesar.elte.hu';
$db   = 'hbalintt';
$user = 'hbalintt';
$pass = 'rHCIquNiAs1vURiI';
$dsn  = "mysql:host=$host;dbname=$db;charset=utf8";
try {
    $pdo = new PDO($dsn, $user, $pass);
// Hibakezelés beállítása
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) { 
    echo "Kapcsolat sikertelen: " . $e->getMessage();
}

function getRecorder()
{
    global $pdo;

    $sql = "SELECT pipes.holecount,pipes.RecorderID FROM `pipes`";
    $stmt = $pdo->query($sql);
    $rows = [];
    if ($stmt) {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo '<script type="module">';
        echo 'import { load2DRec } from "../viewmodel/change_recorder.js";';
        echo 'load2DRec(' . json_encode($rows) . ');';
        echo '</script>';
    } else {
        echo "Nincs adat a táblában.";
    }
}

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

    $_SESSION['rang'] = 1;

    echo json_encode(["success" => true]);
}

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

    // Beszúrás
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hashed]);

    echo json_encode(["success" => true]);
}

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
    if($input['modes']==0)
    {
        $sql = "SELECT 
                    pipes.ID,
                    pipes.holecount,
                    pipes.RecorderID,
                    fingering.note,
                    fingering.fingering 
                FROM pipes 
                JOIN fingering_table ON fingering_table.pipeID = pipes.ID 
                JOIN fingering ON fingering_table.fingeringID = fingering.ID 
                WHERE pipes.RecorderID = :name";
    }
    else if($input['modes']==1)
    {
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

function noteRepository()
{
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['RecorderID'], $input['fingering'], $input['note'], $input['pipe'])) {
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
        throw new Exception('Érvénytelen vagy hiányzó pipe index');
    }
    $pipeID = $rows[$input['pipe']]['ID'];

    $stmt = $pdo->prepare("SELECT ID FROM fingering WHERE fingering = ? AND note = ?");
    $stmt->execute([$input['fingering'], $input['note']]);
    $fingeringID = $stmt->fetchColumn();

    if (!$fingeringID) {
        throw new Exception('A fingering rekord nem található.');
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM fingering_table WHERE pipeID = ? AND fingeringID = ?");
    $stmt->execute([$pipeID, $fingeringID]);
    $exists = $stmt->fetchColumn();

    if ($exists == 0) {
        $stmt = $pdo->prepare("INSERT INTO fingering_table (pipeID, fingeringID) VALUES (?, ?)");
        $stmt->execute([$pipeID, $fingeringID]);
    }

    echo json_encode(["success" => true]);
}

function recorderRepository()
{
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['RecorderID'], $input['holecount'])) {
        throw new Exception("Missing required input fields");
    }

    $stmt = $pdo->prepare("INSERT INTO pipes (RecorderID, holecount) VALUES (?, ?)");
    $stmt->execute([$input['RecorderID'], $input['holecount']]);
    $pipeID = $pdo->lastInsertId();

    echo json_encode(["success" => true]);
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? null;

if ($action === null)
{
    getRecorder();
} 
else 
{
    switch ($action ?? '') {
        case 'getRecorder':
            getRecorder();
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
        default:
            echo json_encode(["error" => "Ismeretlen művelet"]);
            break;
    }
}
?>