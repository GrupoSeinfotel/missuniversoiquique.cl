<?php
// API de Postulación & Programa de Embajadoras / Referidos - Miss Universo 2027
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
$email = strtolower(trim($_POST['email'] ?? ''));
$instagram = trim($_POST['instagram'] ?? '');
$tiktok = trim($_POST['tiktok'] ?? '');
$estatura_cm = intval($_POST['estatura_cm'] ?? 0);
$ocupacion = trim($_POST['ocupacion'] ?? '');
$comuna = trim($_POST['comuna'] ?? '');
$experiencia_modelaje = trim($_POST['experiencia_modelaje'] ?? '');
$motivacion = trim($_POST['motivacion'] ?? '');
$referida_por = trim($_POST['referida_por'] ?? '');
$modalidad_pago = trim($_POST['modalidad_pago'] ?? 'abono_70');
$ip_registro = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';

// 2. Validaciones básicas obligatorias
$errores = [];

if (empty($nombres)) {
    $errores[] = 'Por favor ingresa tus nombres.';
}
if (empty($apellidos)) {
    $errores[] = 'Por favor ingresa tus apellidos.';
}
if ($edad < 18) {
    $errores[] = 'Debes tener al menos 18 años cumplidos para postular.';
}
if (empty($telefono_whatsapp)) {
    $errores[] = 'El teléfono / WhatsApp es fundamental para coordinar tu entrevista y bienvenida.';
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
    ], JSON_UNESCAPED_UNICODE);
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

function procesarFotoPostulante($fileKey, $prefix, $targetDir, $allowedExtensions) {
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

    $cleanPrefix = preg_replace('/[^a-z0-9_-]/i', '', $prefix);
    $fileName = $cleanPrefix . '_' . time() . '_' . substr(bin2hex(random_bytes(6)), 0, 8) . '.' . $ext;
    $targetPath = $targetDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return 'uploads/postulantes/' . basename($targetDir) . '/' . $fileName;
    }

    return null;
}

if (isset($_FILES['foto_rostro'])) {
    $foto_rostro_path = procesarFotoPostulante('foto_rostro', 'rostro', $uploadBaseDir, $allowedExtensions);
}

if (isset($_FILES['foto_cuerpo'])) {
    $foto_cuerpo_path = procesarFotoPostulante('foto_cuerpo', 'cuerpo', $uploadBaseDir, $allowedExtensions);
}

// 4. Validar fecha límite de reclutamiento (25 de Enero 2027)
// Directriz Oficial Nacional Miss Universe Chile: Elección y confirmación impostergable de candidatas el 1 de Marzo de 2027.
$fechaActual = new DateTime();
$fechaCierreReclutamiento = new DateTime('2027-01-25 23:59:59');

if ($fechaActual > $fechaCierreReclutamiento) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'El período oficial de inscripciones para Miss Universe 2027 finalizó el 25 de Enero de 2027, en estricto cumplimiento con la fecha límite nacional impostergable para la elección de candidatas comunales (1 de Marzo).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Tramos Oficiales:
// 1. Preventa Exclusiva (Noviembre hasta 31 de Diciembre 2026): $250.000
// 2. Tarifa Regular y Cierre Definitivo (1 de Enero 2027 a 25 de Enero 2027): $350.000
$anioActual = (int)$fechaActual->format('Y');

$tramoTarifa = 'diciembre_250';
$tarifaBase = 250000;

if ($anioActual >= 2027) {
    $tramoTarifa = 'enero_350';
    $tarifaBase = 350000;
}

// 5. Generar Código Único de Embajadora para referir a otras chicas
// Ej: MU-AR-SOFIA92
$primerNombre = preg_replace('/[^a-zA-Z]/', '', explode(' ', $nombres)[0] ?? 'CANDIDATA');
$primerNombre = strtoupper(substr($primerNombre, 0, 8));
$sedeCode = ($sede === 'arica') ? 'AR' : 'IQ';
$randNum = rand(10, 99);
$codigoEmbajadora = "MU-{$sedeCode}-{$primerNombre}{$randNum}";

// Verificar que no se duplique
try {
    $chkStmt = $pdo->prepare("SELECT id FROM postulantes_2027 WHERE codigo_embajadora = ? LIMIT 1");
    $chkStmt->execute([$codigoEmbajadora]);
    if ($chkStmt->fetch()) {
        $codigoEmbajadora = "MU-{$sedeCode}-{$primerNombre}" . rand(100, 999);
    }
} catch (Throwable $e) {}

// 6. Si vino referida por otra candidata, bonificar a la referente
if (!empty($referida_por)) {
    try {
        // Intentar buscar a la embajadora por código o instagram o nombre
        $refStmt = $pdo->prepare("
            SELECT id, nombres, apellidos, descuento_referidas, monto_final 
            FROM postulantes_2027 
            WHERE codigo_embajadora = ? OR instagram = ? OR CONCAT(nombres, ' ', apellidos) LIKE ? 
            LIMIT 1
        ");
        $refStmt->execute([$referida_por, ltrim($referida_por, '@'), "%{$referida_por}%"]);
        $referente = $refStmt->fetch(PDO::FETCH_ASSOC);

        if ($referente) {
            $nuevoDescuento = ($referente['descuento_referidas'] ?? 0) + 50000;
            $nuevoMonto = max(0, ($referente['monto_final'] ?? $tarifaBase) - 50000);

            $updRef = $pdo->prepare("UPDATE postulantes_2027 SET descuento_referidas = ?, monto_final = ? WHERE id = ?");
            $updRef->execute([$nuevoDescuento, $nuevoMonto, $referente['id']]);
        }
    } catch (Throwable $e) {
        // Continuar sin interrumpir el registro
    }
}

// 7. Guardar en Base de Datos
try {
    $sql = "INSERT INTO postulantes_2027 
            (sede, nombres, apellidos, rut, edad, fecha_nacimiento, telefono_whatsapp, email, 
             instagram, tiktok, estatura_cm, ocupacion, comuna, experiencia_modelaje, motivacion, 
             foto_rostro, foto_cuerpo, codigo_embajadora, referida_por, modalidad_pago, tramo_tarifa,
             descuento_referidas, monto_final, estado, ip_registro)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'pendiente', ?)";

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
        $codigoEmbajadora,
        $referida_por ?: null,
        $modalidad_pago,
        $tramoTarifa,
        $tarifaBase,
        $ip_registro
    ]);

    $postulanteId = $pdo->lastInsertId();

    $sedeTitle = ($sede === 'arica') ? 'Arica' : 'Iquique';
    $baseUrl = "https://missuniverso{$sede}.cl";
    $referralLink = "{$baseUrl}/casting/?ref={$codigoEmbajadora}";

    echo json_encode([
        'status' => 'success',
        'id' => $postulanteId,
        'sede' => $sede,
        'codigo_embajadora' => $codigoEmbajadora,
        'link_referida' => $referralLink,
        'tarifa_base' => $tarifaBase,
        'message' => "¡Felicitaciones {$nombres}! Tu postulación para Miss Universe {$sedeTitle} 2027 ha sido ingresada con éxito. Ya eres parte del proceso oficial.",
        'embajadora_info' => [
            'codigo' => $codigoEmbajadora,
            'link' => $referralLink,
            'premio_por_amiga' => 50000,
            'meta_gratis' => 5,
            'texto_whatsapp' => "¡Hola! Estoy postulando a Miss Universe {$sedeTitle} 2027 👑 Te invito a sumarte conmigo usando mi código de invitación {$codigoEmbajadora} en {$referralLink}"
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Ocurrió un error al registrar tu postulación en la base de datos.',
        'debug' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
