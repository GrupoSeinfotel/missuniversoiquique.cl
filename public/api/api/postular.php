<?php
// API de Postulación - Miss Universo 2027
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

$is_api = true;
require_once __DIR__ . '/../config/db.php';

// 1. Obtener y sanitizar campos de texto
$sede = strtolower(trim($_POST['sede'] ?? 'arica'));
if (!in_array($sede, ['arica', 'iquique'])) {
    $sede = 'arica';
}

$nombres = trim($_POST['nombres'] ?? '');
$apellidos = trim($_POST['apellidos'] ?? '');
$rut = trim($_POST['rut'] ?? '');
$edad = intval($_POST['edad'] ?? 0);
$fecha_nacimiento = !empty($_POST['fecha_nacimiento']) ? trim($_POST['fecha_nacimiento']) : null;
$telefono_whatsapp = trim($_POST['telefono_whatsapp'] ?? '');
$email = trim($_POST['email'] ?? '');
$instagram = trim($_POST['instagram'] ?? '');
$tiktok = trim($_POST['tiktok'] ?? '');
$estatura_cm = intval($_POST['estatura_cm'] ?? 0);
$ocupacion = trim($_POST['ocupacion'] ?? '');
$comuna = trim($_POST['comuna'] ?? '');
$experiencia_modelaje = trim($_POST['experiencia_modelaje'] ?? '');
$motivacion = trim($_POST['motivacion'] ?? '');
$ip_registro = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';

// 2. Validaciones básicas obligatorias
$errores = [];

if (empty($nombres)) {
    $errores[] = 'El nombre es obligatorio.';
}
if (empty($apellidos)) {
    $errores[] = 'Los apellidos son obligatorios.';
}
if ($edad < 18) {
    $errores[] = 'Debes tener al menos 18 años para postular.';
}
if (empty($telefono_whatsapp)) {
    $errores[] = 'El teléfono / WhatsApp es obligatorio para poder contactarte.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'Debes ingresar un correo electrónico válido.';
}

if (!empty($errores)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => implode(' ', $errores),
        'errors' => $errores
    ]);
    exit;
}

// 3. Procesar subida de imágenes (Foto Rostro y Foto Cuerpo)
$uploadBaseDir = __DIR__ . '/../uploads/postulantes/' . $sede . '/';
if (!is_dir($uploadBaseDir)) {
    @mkdir($uploadBaseDir, 0755, true);
}

$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
$foto_rostro_path = null;
$foto_cuerpo_path = null;

function procesarFoto($fileKey, $prefix, $targetDir, $allowedExtensions) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $file = $_FILES[$fileKey];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedExtensions)) {
        return null;
    }

    // Tamaño máximo: 15MB
    if ($file['size'] > 15 * 1024 * 1024) {
        return null;
    }

    $fileName = $prefix . '_' . time() . '_' . substr(bin2hex(random_bytes(6)), 0, 8) . '.' . $ext;
    $targetPath = $targetDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return 'uploads/postulantes/' . basename($targetDir) . '/' . $fileName;
    }

    return null;
}

if (isset($_FILES['foto_rostro'])) {
    $foto_rostro_path = procesarFoto('foto_rostro', 'rostro', $uploadBaseDir, $allowedExtensions);
}

if (isset($_FILES['foto_cuerpo'])) {
    $foto_cuerpo_path = procesarFoto('foto_cuerpo', 'cuerpo', $uploadBaseDir, $allowedExtensions);
}

// 4. Guardar en Base de Datos
try {
    $sql = "INSERT INTO postulantes_2027 
            (sede, nombres, apellidos, rut, edad, fecha_nacimiento, telefono_whatsapp, email, 
             instagram, tiktok, estatura_cm, ocupacion, comuna, experiencia_modelaje, motivacion, 
             foto_rostro, foto_cuerpo, estado, ip_registro)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $sede,
        $nombres,
        $apellidos,
        $rut ?: null,
        $edad,
        $fecha_nacimiento ?: null,
        $telefono_whatsapp,
        $email,
        $instagram ?: null,
        $tiktok ?: null,
        $estatura_cm ?: null,
        $ocupacion ?: null,
        $comuna ?: null,
        $experiencia_modelaje ?: null,
        $motivacion ?: null,
        $foto_rostro_path,
        $foto_cuerpo_path,
        $ip_registro
    ]);

    $postulanteId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'id' => $postulanteId,
        'sede' => $sede,
        'message' => '¡Tu postulación para Miss Universe ' . ucfirst($sede) . ' 2027 ha sido enviada con éxito! Nuestro equipo revisará tus datos y se pondrá en contacto contigo vía WhatsApp.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Ocurrió un error al registrar tu postulación en la base de datos.',
        'debug' => $e->getMessage()
    ]);
}
