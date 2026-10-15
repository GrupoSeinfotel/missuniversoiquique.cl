<?php
/**
 * API REST: Hero Slider Slides (Miss Universo Arica & Iquique 2027)
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$is_api = true;
require_once __DIR__ . '/../config/db.php';

// 1. Asegurar tabla en la base de datos
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS slider_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sede VARCHAR(20) NOT NULL DEFAULT 'arica',
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NULL,
        campaign_tag VARCHAR(100) NULL,
        cursive_quote VARCHAR(255) NULL,
        img_desktop VARCHAR(255) NOT NULL,
        img_mobile VARCHAR(255) NULL,
        pos_desktop VARCHAR(50) DEFAULT '50% 24%',
        pos_mobile VARCHAR(50) DEFAULT '65% top',
        mobile_pan_start VARCHAR(50) DEFAULT '15%',
        mobile_pan_end VARCHAR(50) DEFAULT '85%',
        btn_text VARCHAR(100) DEFAULT 'POSTULA AHORA',
        btn_link VARCHAR(255) DEFAULT '#casting',
        order_num INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Auto-migración si las columnas no existen
    $columns = $pdo->query("SHOW COLUMNS FROM slider_slides")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('sede', $columns)) {
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN sede VARCHAR(20) NOT NULL DEFAULT 'arica' AFTER id");
    }
    if (!in_array('mobile_pan_start', $columns)) {
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN mobile_pan_start VARCHAR(50) DEFAULT '15%'");
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN mobile_pan_end VARCHAR(50) DEFAULT '85%'");
    }
} catch (Throwable $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar tabla: ' . $e->getMessage()]);
    exit;
}

// 2. Auto-poblar slides si está vacía
$countTotal = (int)$pdo->query("SELECT COUNT(*) FROM slider_slides")->fetchColumn();
if ($countTotal === 0) {
    // Slides para Arica
    $stmt = $pdo->prepare("INSERT INTO slider_slides (sede, title, subtitle, campaign_tag, cursive_quote, img_desktop, img_mobile, pos_desktop, pos_mobile, mobile_pan_start, mobile_pan_end, btn_text, btn_link, order_num, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Arica Slide 1
    $stmt->execute([
        'arica',
        'MISS UNIVERSO ARICA 2027',
        'UNA CIUDAD QUE INSPIRA · UN UNIVERSO DE TALENTOS',
        'EDICIÓN 2027',
        'El norte tiene su propia luz.',
        '/arica2027/assets/neon/muse-v3.webp',
        '/arica2027/assets/neon/muse-v3.webp',
        '50% 20%',
        '50% top',
        '15%',
        '85%',
        'POSTULA AHORA',
        '#casting',
        1,
        1
    ]);
    
    // Arica Slide 2
    $stmt->execute([
        'arica',
        'PASARELA & ALTA COSTURA',
        'BELLEZA, CULTURA Y TALENTO REGIONAL',
        'CAMPAÑA OFICIAL',
        'La belleza de nuestra tierra en el escenario del mundo.',
        '/arica2027/assets/neon/gala-v3.webp',
        '/arica2027/assets/neon/gala-v3.webp',
        '50% 15%',
        '60% top',
        '20%',
        '80%',
        'VIVE LA EXPERIENCIA',
        '#certamen',
        2,
        1
    ]);

    // Iquique Slide 1
    $stmt->execute([
        'iquique',
        'MISS UNIVERSO IQUIQUE 2027',
        'TALENTO QUE ILUMINA EL NORTE',
        'EDICIÓN 2027',
        'Donde los sueños tocan el mar.',
        '/iquique2027/assets/neon/iquique-muse.webp',
        '/iquique2027/assets/neon/iquique-muse.webp',
        '50% 20%',
        '50% top',
        '15%',
        '85%',
        'POSTULA AHORA',
        '#casting',
        1,
        1
    ]);

    // Iquique Slide 2
    $stmt->execute([
        'iquique',
        'NOCHE DE CORONACIÓN & GALA',
        'PROPÓSITO, ELEGANCIA Y TRASCENDENCIA',
        'ALFOMBRA ESTELAR',
        'El mar, la historia y la pasión de nuestra gente.',
        '/iquique2027/assets/neon/iquique-gala.webp',
        '/iquique2027/assets/neon/iquique-gala.webp',
        '50% 15%',
        '60% top',
        '20%',
        '80%',
        'CONOCE EL EVENTO',
        '#certamen',
        2,
        1
    ]);
}

// 3. Obtener slides
$sede = strtolower(trim($_GET['sede'] ?? ''));
if ($sede !== 'arica' && $sede !== 'iquique') {
    // Detectar sede por Host si no se especificó
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (strpos($host, 'iquique') !== false) {
        $sede = 'iquique';
    } else {
        $sede = 'arica';
    }
}

$stmt = $pdo->prepare("SELECT * FROM slider_slides WHERE is_active = 1 AND (sede = ? OR sede = 'todas') ORDER BY order_num ASC, id ASC");
$stmt->execute([$sede]);
$slides = $stmt->fetchAll();

echo json_encode([
    'status' => 'success',
    'sede' => $sede,
    'total' => count($slides),
    'slides' => $slides
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
