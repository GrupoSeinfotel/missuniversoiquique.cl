<?php
// Configuración de Base de Datos - Miss Universo Arica e Iquique 2027
$db_host = 'localhost';
$db_user = 'andrekis_user_missuniv';
$db_pass = 'NEym89Fpq6Z3h';
$db_name = 'andrekis_db_missuniverso';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    if (isset($is_api) && $is_api) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
        exit;
    } else {
        die("Error de conexión a la base de datos.");
    }
}
