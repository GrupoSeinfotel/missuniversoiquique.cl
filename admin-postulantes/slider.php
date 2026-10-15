<?php
/**
 * MISS UNIVERSO 2027 · ARICA & IQUIQUE
 * Gestión de Hero Slider (Imágenes Diferenciadas para PC y Móvil con Calibrador de Recuadros)
 */
session_start();
if (!isset($_SESSION['admin_logged']) || !$_SESSION['admin_logged']) {
    header('Location: index.php');
    exit;
}

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

    $columns = $pdo->query("SHOW COLUMNS FROM slider_slides")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('sede', $columns)) {
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN sede VARCHAR(20) NOT NULL DEFAULT 'arica' AFTER id");
    }
    if (!in_array('mobile_pan_start', $columns)) {
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN mobile_pan_start VARCHAR(50) DEFAULT '15%'");
        $pdo->exec("ALTER TABLE slider_slides ADD COLUMN mobile_pan_end VARCHAR(50) DEFAULT '85%'");
    }
} catch (Exception $e) {}

// Mensajes Flash
$flash = $_SESSION['flash_msg'] ?? null;
unset($_SESSION['flash_msg']);

// 2. Manejador de Formularios (Crear, Editar, Activar/Pausar, Eliminar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Subida de imágenes a /uploads/slider/
    $handleUpload = function($fileKey, $prefix) {
        if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
        $file = $_FILES[$fileKey];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array($ext, $allowed)) {
            throw new Exception("Formato no permitido para {$fileKey}. Usa JPG, PNG o WEBP.");
        }
        if ($file['size'] > 12 * 1024 * 1024) {
            throw new Exception("El archivo excede el tamaño máximo permitido de 12 MB.");
        }

        $uploadDir = dirname(__DIR__) . '/uploads/slider/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = $prefix . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
        $dest = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            throw new Exception("Error al mover el archivo subido al servidor.");
        }
        return '/uploads/slider/' . $filename;
    };

    if ($action === 'create_slide') {
        try {
            $imgPc = $handleUpload('img_desktop_file', 'slide_pc');
            if (!$imgPc) {
                $imgPc = trim($_POST['img_desktop_url'] ?? '');
            }
            if (empty($imgPc)) {
                throw new Exception("Debes subir o indicar una imagen para PC / Escritorio.");
            }

            $imgMobile = $handleUpload('img_mobile_file', 'slide_mob');
            if (!$imgMobile) {
                $imgMobile = trim($_POST['img_mobile_url'] ?? '');
            }

            $stmt = $pdo->prepare("INSERT INTO slider_slides (sede, title, subtitle, campaign_tag, cursive_quote, img_desktop, img_mobile, pos_desktop, pos_mobile, mobile_pan_start, mobile_pan_end, btn_text, btn_link, order_num, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                trim($_POST['sede'] ?? 'arica'),
                trim($_POST['title'] ?? 'NUEVO SLIDE'),
                trim($_POST['subtitle'] ?? ''),
                trim($_POST['campaign_tag'] ?? ''),
                trim($_POST['cursive_quote'] ?? ''),
                $imgPc,
                $imgMobile,
                trim($_POST['pos_desktop'] ?? '50% 20%'),
                trim($_POST['pos_mobile'] ?? '50% top'),
                trim($_POST['mobile_pan_start'] ?? '15%'),
                trim($_POST['mobile_pan_end'] ?? '85%'),
                trim($_POST['btn_text'] ?? 'POSTULA AHORA'),
                trim($_POST['btn_link'] ?? '#casting'),
                (int)($_POST['order_num'] ?? 1),
                !empty($_POST['is_active']) ? 1 : 0
            ]);

            $_SESSION['flash_msg'] = ['type' => 'success', 'text' => '¡Nuevo slide creado y publicado exitosamente!'];
        } catch (Exception $e) {
            $_SESSION['flash_msg'] = ['type' => 'danger', 'text' => 'Error: ' . $e->getMessage()];
        }
        header('Location: slider.php?sede=' . urlencode($_POST['sede'] ?? 'arica'));
        exit;

    } elseif ($action === 'edit_slide') {
        $id = (int)$_POST['slide_id'];
        $stmt = $pdo->prepare("SELECT * FROM slider_slides WHERE id = ?");
        $stmt->execute([$id]);
        $slide = $stmt->fetch();
        if ($slide) {
            try {
                $imgPc = $handleUpload('img_desktop_file', 'slide_pc');
                if (!$imgPc) {
                    $manualPc = trim($_POST['img_desktop_url'] ?? '');
                    $imgPc = !empty($manualPc) ? $manualPc : $slide['img_desktop'];
                }

                $imgMobile = $handleUpload('img_mobile_file', 'slide_mob');
                if (!$imgMobile) {
                    $manualMob = trim($_POST['img_mobile_url'] ?? '');
                    $imgMobile = !empty($manualMob) ? $manualMob : $slide['img_mobile'];
                }

                $stmt = $pdo->prepare("UPDATE slider_slides SET sede = ?, title = ?, subtitle = ?, campaign_tag = ?, cursive_quote = ?, img_desktop = ?, img_mobile = ?, pos_desktop = ?, pos_mobile = ?, mobile_pan_start = ?, mobile_pan_end = ?, btn_text = ?, btn_link = ?, order_num = ?, is_active = ? WHERE id = ?");
                $stmt->execute([
                    trim($_POST['sede'] ?? $slide['sede']),
                    trim($_POST['title'] ?? $slide['title']),
                    trim($_POST['subtitle'] ?? ''),
                    trim($_POST['campaign_tag'] ?? ''),
                    trim($_POST['cursive_quote'] ?? ''),
                    $imgPc,
                    $imgMobile,
                    trim($_POST['pos_desktop'] ?? '50% 20%'),
                    trim($_POST['pos_mobile'] ?? '50% top'),
                    trim($_POST['mobile_pan_start'] ?? '15%'),
                    trim($_POST['mobile_pan_end'] ?? '85%'),
                    trim($_POST['btn_text'] ?? 'POSTULA AHORA'),
                    trim($_POST['btn_link'] ?? '#casting'),
                    (int)($_POST['order_num'] ?? $slide['order_num']),
                    !empty($_POST['is_active']) ? 1 : 0,
                    $id
                ]);

                $_SESSION['flash_msg'] = ['type' => 'success', 'text' => 'Slide actualizado correctamente con las nuevas imágenes y encuadres.'];
            } catch (Exception $e) {
                $_SESSION['flash_msg'] = ['type' => 'danger', 'text' => 'Error: ' . $e->getMessage()];
            }
        }
        header('Location: slider.php?sede=' . urlencode($_POST['sede'] ?? 'arica'));
        exit;

    } elseif ($action === 'toggle_active') {
        $id = (int)$_POST['slide_id'];
        $stmt = $pdo->prepare("SELECT is_active, sede FROM slider_slides WHERE id = ?");
        $stmt->execute([$id]);
        $slide = $stmt->fetch();
        if ($slide) {
            $newStatus = $slide['is_active'] ? 0 : 1;
            $stmt = $pdo->prepare("UPDATE slider_slides SET is_active = ? WHERE id = ?");
            $stmt->execute([$newStatus, $id]);
            $_SESSION['flash_msg'] = ['type' => 'info', 'text' => $newStatus ? 'Slide activado.' : 'Slide pausado.'];
        }
        header('Location: slider.php?sede=' . urlencode($slide['sede'] ?? 'arica'));
        exit;

    } elseif ($action === 'delete_slide') {
        $id = (int)$_POST['slide_id'];
        $stmt = $pdo->prepare("DELETE FROM slider_slides WHERE id = ?");
        $stmt->execute([$id]);
        $_SESSION['flash_msg'] = ['type' => 'warning', 'text' => 'Slide eliminado del carrusel.'];
        header('Location: slider.php');
        exit;
    }
}

// 3. Filtro por Sede
$filtroSede = $_GET['sede'] ?? 'todas';
if ($filtroSede === 'arica' || $filtroSede === 'iquique') {
    $stmt = $pdo->prepare("SELECT * FROM slider_slides WHERE sede = ? OR sede = 'todas' ORDER BY order_num ASC, id ASC");
    $stmt->execute([$filtroSede]);
} else {
    $stmt = $pdo->query("SELECT * FROM slider_slides ORDER BY sede ASC, order_num ASC, id ASC");
}
$slides = $stmt->fetchAll();

// Estadísticas
$countArica = (int)$pdo->query("SELECT COUNT(*) FROM slider_slides WHERE sede = 'arica'")->fetchColumn();
$countIquique = (int)$pdo->query("SELECT COUNT(*) FROM slider_slides WHERE sede = 'iquique'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hero Slider (PC & Móvil) · Miss Universo 2027</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Raleway:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-body: #07070d;
            --bg-card: rgba(18, 16, 26, 0.95);
            --pink: #f5245f;
            --gold: #d4af37;
            --cyan: #38bdf8;
            --green: #10b981;
            --border: rgba(255, 255, 255, 0.1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background: var(--bg-body);
            color: #fff;
            font-family: 'Raleway', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Top Bar */
        header {
            background: rgba(10, 8, 16, 0.95);
            border-bottom: 1px solid var(--border);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        .header-actions {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .btn-nav {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border);
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 700;
            transition: all 0.2s;
        }
        .btn-nav:hover {
            background: rgba(255, 255, 255, 0.18);
            border-color: var(--gold);
            color: var(--gold);
        }
        .btn-logout {
            background: rgba(245, 36, 95, 0.15);
            border: 1px solid var(--pink);
            color: #ff8fab;
            padding: 8px 14px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 700;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 30px 20px;
            flex: 1;
            width: 100%;
        }

        /* Alert Messages */
        .alert {
            padding: 14px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid var(--green); color: #6ee7b7; }
        .alert-danger { background: rgba(245, 36, 95, 0.15); border: 1px solid var(--pink); color: #ff8fab; }
        .alert-info { background: rgba(56, 189, 248, 0.15); border: 1px solid var(--cyan); color: #7dd3fc; }
        .alert-warning { background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold); color: #fde047; }

        /* Filter Tabs */
        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        .filter-tab {
            background: var(--bg-card);
            border: 1px solid var(--border);
            color: #ccc;
            padding: 8px 18px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s;
        }
        .filter-tab.active, .filter-tab:hover {
            background: var(--gold);
            color: #0d0513;
            border-color: var(--gold);
        }

        /* Cards & Buttons */
        .btn-add {
            background: linear-gradient(135deg, var(--gold), #b89020);
            color: #0d0513;
            border: none;
            padding: 10px 22px;
            border-radius: 10px;
            font-weight: 800;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            transition: transform 0.2s;
        }
        .btn-add:hover {
            transform: translateY(-2px);
        }

        .slide-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .slide-card.active-slide {
            border-color: rgba(212, 175, 55, 0.45);
        }
    </style>
</head>
<body>

    <header>
        <div class="header-title">
            <span>👑</span>
            <span>Miss Universe • Gestión de Hero Slider</span>
        </div>
        <div class="header-actions">
            <a href="index.php" class="btn-nav">📋 Postulantes Casting</a>
            <a href="slider.php" class="btn-nav" style="border-color:var(--gold); color:var(--gold);">🖼️ Hero Slider</a>
            <span style="color:#666">|</span>
            <span style="font-size: 0.85rem; color:#bbb"><?= htmlspecialchars($_SESSION['admin_name'] ?? 'Admin') ?></span>
            <a href="index.php?logout=1" class="btn-logout">Cerrar Sesión</a>
        </div>
    </header>

    <div class="container">

        <?php if ($flash): ?>
            <div class="alert alert-<?= htmlspecialchars($flash['type']) ?>">
                <?= htmlspecialchars($flash['text']) ?>
            </div>
        <?php endif; ?>

        <!-- ENCABEZADO Y ACCIONES -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
            <div>
                <span style="font-size:11px; font-weight:800; color:var(--gold); letter-spacing:1px; text-transform:uppercase;">PORTADA PRINCIPAL & EXPERIENCIA HERO</span>
                <h1 style="font-family:'Playfair Display',serif; font-size:26px; color:#fff; margin:4px 0 6px;">
                    Hero Slider · Imágenes PC & Móvil (Arica & Iquique)
                </h1>
                <p style="font-size:12.5px; color:#a1a1aa; margin:0;">
                    Configura las fotos de la portada principal. Puedes subir imágenes diferenciadas para pantallas anchas (PC) y para celulares (Móvil vertical), calibrando con recuadros el punto de inicio y fin del desplazamiento.
                </p>
            </div>

            <div>
                <button type="button" class="btn-add" onclick="openNewSlideModal();">
                    + Agregar Nuevo Slide
                </button>
            </div>
        </div>

        <!-- FILTROS POR SEDE -->
        <div class="filter-tabs">
            <a href="?sede=todas" class="filter-tab <?= $filtroSede === 'todas' ? 'active' : '' ?>">Todas las Sedes (<?= count($slides) ?>)</a>
            <a href="?sede=arica" class="filter-tab <?= $filtroSede === 'arica' ? 'active' : '' ?>">👑 Arica (<?= $countArica ?>)</a>
            <a href="?sede=iquique" class="filter-tab <?= $filtroSede === 'iquique' ? 'active' : '' ?>">👑 Iquique (<?= $countIquique ?>)</a>
        </div>

        <!-- GUÍA DE TAMAÑOS -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; margin-bottom:28px;">
            <div style="background:linear-gradient(145deg, #0e1222, #070912); border:1px solid rgba(56,189,248,0.35); border-radius:18px; padding:18px 20px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <span style="font-size:24px;">🖥️</span>
                    <b style="font-size:15px; color:#38bdf8;">Formato Recomendado para PC / Desktop</b>
                </div>
                <p style="font-size:12px; color:#cbd5e1; margin:0; line-height:1.5;">
                    • <strong>Resolución:</strong> 1920 × 1080 px (16:9 horizontal).<br>
                    • <strong>Composición:</strong> La modelo debe ubicarse preferentemente en el centro-derecha, permitiendo lucir textos en el lado izquierdo.
                </p>
            </div>

            <div style="background:linear-gradient(145deg, #1a101b, #0c080d); border:1px solid rgba(212,175,55,0.35); border-radius:18px; padding:18px 20px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <span style="font-size:24px;">📱</span>
                    <b style="font-size:15px; color:var(--gold);">Formato Recomendado para Móviles (Smartphones)</b>
                </div>
                <p style="font-size:12px; color:#cbd5e1; margin:0; line-height:1.5;">
                    • <strong>Resolución:</strong> 1080 × 1920 px (9:16 vertical) o 1080 × 1350 px.<br>
                    • <strong>Ventaja:</strong> Permite recorrido cinematográfico desde el recuadro verde de inicio hasta el recuadro magenta de término.
                </p>
            </div>
        </div>

        <!-- LISTADO DE SLIDES -->
        <div>
            <?php if (empty($slides)): ?>
                <div style="text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:20px; border:1px solid var(--border);">
                    <div style="font-size:40px; margin-bottom:12px;">🖼️</div>
                    <h3 style="font-size:18px; margin-bottom:8px;">No hay slides registrados</h3>
                    <p style="font-size:13px; color:#888; margin-bottom:20px;">Crea el primer slide para la portada principal de Miss Universo.</p>
                    <button type="button" class="btn-add" onclick="openNewSlideModal();">+ Crear Primer Slide</button>
                </div>
            <?php endif; ?>

            <?php foreach ($slides as $idx => $s): ?>
                <div class="slide-card <?= $s['is_active'] ? 'active-slide' : '' ?>">
                    <!-- Barra Superior -->
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:18px; border-bottom:1px solid var(--border); padding-bottom:14px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                                <span style="background:var(--gold); color:#0d0513; font-weight:900; font-size:11px; padding:2px 10px; border-radius:99px; text-transform:uppercase;">
                                    SEDE <?= htmlspecialchars($s['sede']) ?> · ESCENA #<?= $idx + 1 ?> (ORDEN <?= $s['order_num'] ?>)
                                </span>
                                <?php if ($s['is_active']): ?>
                                    <span style="background:rgba(16,185,129,0.15); border:1px solid var(--green); color:var(--green); font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px;">
                                        ● ACTIVO EN PORTADA
                                    </span>
                                <?php else: ?>
                                    <span style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#ef4444; font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px;">
                                        ○ PAUSADO
                                    </span>
                                <?php endif; ?>
                            </div>
                            <h2 style="font-family:'Playfair Display',serif; font-size:20px; color:#fff; margin:4px 0 2px;">
                                <?= htmlspecialchars($s['title']) ?>
                            </h2>
                            <div style="font-size:12px; color:var(--gold); font-weight:700;">
                                <?= htmlspecialchars($s['subtitle']) ?>
                            </div>
                            <?php if (!empty($s['cursive_quote'])): ?>
                                <div style="font-style:italic; font-size:11.5px; color:#caa8cb; margin-top:3px;">
                                    "<?= htmlspecialchars($s['cursive_quote']) ?>"
                                </div>
                            <?php endif; ?>
                        </div>

                        <!-- Botones de Acción -->
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="btn-nav" onclick='openEditSlideModal(<?= json_encode($s) ?>);' style="border-color:var(--gold); color:var(--gold);">
                                ✏️ Editar Encuadre & Fotos
                            </button>

                            <form method="POST" style="margin:0;">
                                <input type="hidden" name="action" value="toggle_active">
                                <input type="hidden" name="slide_id" value="<?= $s['id'] ?>">
                                <button type="submit" class="btn-nav">
                                    <?= $s['is_active'] ? '⏸️ Pausar' : '▶️ Activar' ?>
                                </button>
                            </form>

                            <form method="POST" style="margin:0;" onsubmit="return confirm('¿Seguro que deseas eliminar este slide?');">
                                <input type="hidden" name="action" value="delete_slide">
                                <input type="hidden" name="slide_id" value="<?= $s['id'] ?>">
                                <button type="submit" class="btn-nav" style="color:#ff8fab; border-color:rgba(245,36,95,0.4);" title="Eliminar">
                                    🗑️
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Comparativa Visual: Imagen PC vs Móvil -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
                        
                        <!-- PC -->
                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(56,189,248,0.25); border-radius:16px; padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span style="font-size:11px; font-weight:800; color:#38bdf8; text-transform:uppercase;">
                                    🖥️ Imagen PC (Desktop)
                                </span>
                                <span style="font-size:10px; color:#cbd5e1; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px;">
                                    Posición: <?= htmlspecialchars($s['pos_desktop']) ?>
                                </span>
                            </div>
                            <div style="position:relative; width:100%; height:160px; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#050208; margin-bottom:10px;">
                                <img src="<?= htmlspecialchars($s['img_desktop']) ?>" alt="PC" style="width:100%; height:100%; object-fit:cover; object-position:<?= htmlspecialchars($s['pos_desktop']) ?>;">
                            </div>
                            <a href="<?= htmlspecialchars($s['img_desktop']) ?>" target="_blank" rel="noopener" class="btn-nav" style="display:inline-block; font-size:11px;">
                                ↗ Ver Imagen Original
                            </a>
                        </div>

                        <!-- Móvil -->
                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(212,175,55,0.25); border-radius:16px; padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span style="font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase;">
                                    📱 Imagen Móvil (Smartphone)
                                </span>
                                <span style="font-size:10px; color:#cbd5e1; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px;">
                                    🟢 <?= htmlspecialchars($s['mobile_pan_start']) ?> ➔ 🟣 <?= htmlspecialchars($s['mobile_pan_end']) ?>
                                </span>
                            </div>

                            <div style="position:relative; width:100%; height:160px; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#050208; margin-bottom:10px; display:flex; justify-content:center;">
                                <img src="<?= htmlspecialchars(!empty($s['img_mobile']) ? $s['img_mobile'] : $s['img_desktop']) ?>" alt="Móvil" style="height:100%; width:auto; max-width:100%; object-fit:contain;">
                            </div>

                            <div style="display:flex; gap:8px;">
                                <a href="<?= htmlspecialchars(!empty($s['img_mobile']) ? $s['img_mobile'] : $s['img_desktop']) ?>" target="_blank" rel="noopener" class="btn-nav" style="flex:1; font-size:11px; text-align:center;">
                                    ↗ Ver Imagen HD
                                </a>
                                <button type="button" class="btn-nav" onclick='openEditSlideModal(<?= json_encode($s) ?>);' style="font-size:11px; color:var(--gold); border-color:var(--gold);">
                                    Calibrar Recuadro
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    </div>

    <!-- ==========================================
         MODAL CREAR / EDITAR SLIDE (CON CALIBRADOR)
         ========================================== -->
    <div id="slideModal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.88); backdrop-filter:blur(8px); align-items:center; justify-content:center; padding:20px; overflow-y:auto;">
        <div style="width:100%; max-width:700px; background:#100d18; border:1.5px solid rgba(212,175,55,0.5); border-radius:24px; padding:28px 24px; box-shadow:0 30px 90px rgba(0,0,0,0.9); margin:auto; max-height:92vh; overflow-y:auto;">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:12px;">
                <h3 id="modalTitle" style="font-family:'Playfair Display',serif; font-size:20px; color:#fff; margin:0;">
                    Configurar Escena del Slider
                </h3>
                <button type="button" onclick="closeSlideModal();" style="background:none; border:none; color:#cbd5e1; font-size:24px; cursor:pointer;">&times;</button>
            </div>

            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" id="modalAction" value="create_slide">
                <input type="hidden" name="slide_id" id="modalSlideId" value="">

                <!-- Sede -->
                <div style="margin-bottom:14px;">
                    <label style="display:block; font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; margin-bottom:4px;">
                        Sede de la Convocatoria *
                    </label>
                    <select name="sede" id="inpSede" required style="width:100%; height:42px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px; font-size:13px;">
                        <option value="arica">Miss Universo Arica 2027</option>
                        <option value="iquique">Miss Universo Iquique 2027</option>
                        <option value="todas">Ambas Sedes (Arica e Iquique)</option>
                    </select>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
                    <div>
                        <label style="display:block; font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; margin-bottom:4px;">
                            Título Principal *
                        </label>
                        <input type="text" name="title" id="inpTitle" required placeholder="Ej: MISS UNIVERSO ARICA 2027" style="width:100%; height:42px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px; font-size:13px;">
                    </div>

                    <div>
                        <label style="display:block; font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; margin-bottom:4px;">
                            Subtítulo / Bajada
                        </label>
                        <input type="text" name="subtitle" id="inpSubtitle" placeholder="Ej: UNA CIUDAD QUE INSPIRA" style="width:100%; height:42px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px; font-size:13px;">
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
                    <div>
                        <label style="display:block; font-size:11px; font-weight:800; color:#caa8cb; text-transform:uppercase; margin-bottom:4px;">
                            Etiqueta / Badge Superior
                        </label>
                        <input type="text" name="campaign_tag" id="inpTag" placeholder="Ej: EDICIÓN 2027" style="width:100%; height:42px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px; font-size:13px;">
                    </div>

                    <div>
                        <label style="display:block; font-size:11px; font-weight:800; color:#caa8cb; text-transform:uppercase; margin-bottom:4px;">
                            Frase / Eslogan Cursivo
                        </label>
                        <input type="text" name="cursive_quote" id="inpQuote" placeholder="Ej: El norte tiene su propia luz." style="width:100%; height:42px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px; font-size:13px;">
                    </div>
                </div>

                <!-- SECCIÓN FOTOS: PC Y MÓVIL -->
                <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:16px; margin-bottom:16px;">
                    
                    <!-- FOTO PC -->
                    <div style="margin-bottom:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <label style="font-size:11.5px; font-weight:800; color:#38bdf8; text-transform:uppercase;">
                                🖥️ Imagen para PC (Desktop Panorámica 16:9) *
                            </label>
                            <span style="font-size:10px; color:#94a3b8;">1920x1080 px recomendado</span>
                        </div>
                        <input type="file" name="img_desktop_file" id="fileDesktop" accept="image/*" onchange="previewSelectedImg(this, 'pc');" style="width:100%; background:#050208; border:1px solid rgba(56,189,248,0.4); padding:8px; border-radius:8px; color:#fff; font-size:12px;">
                        <div style="margin-top:6px; font-size:11px; color:#94a3b8;">
                            O ingresa ruta / URL existente:
                            <input type="text" name="img_desktop_url" id="inpImgPcUrl" oninput="updateCanvasBg();" placeholder="/arica2027/assets/neon/muse-v3.webp" style="width:100%; height:34px; background:#050208; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:0 10px; font-size:11.5px; margin-top:2px;">
                        </div>
                        <div style="margin-top:6px;">
                            <label style="font-size:10px; color:#94a3b8;">Encuadre PC (CSS object-position):</label>
                            <input type="text" name="pos_desktop" id="inpPosDesktop" value="50% 20%" placeholder="Ej: 50% 20%" style="width:100%; height:32px; background:#050208; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:0 10px; font-size:11px;">
                        </div>
                    </div>

                    <!-- FOTO MÓVIL -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <label style="font-size:11.5px; font-weight:800; color:var(--gold); text-transform:uppercase;">
                                📱 Imagen para Móvil / Celular (Vertical 9:16 o 4:5)
                            </label>
                            <span style="font-size:10px; color:#94a3b8;">1080x1920 px (Opcional)</span>
                        </div>
                        <input type="file" name="img_mobile_file" id="fileMobile" accept="image/*" onchange="previewSelectedImg(this, 'mob');" style="width:100%; background:#050208; border:1px solid rgba(212,175,55,0.4); padding:8px; border-radius:8px; color:#fff; font-size:12px;">
                        <div style="margin-top:6px; font-size:11px; color:#94a3b8;">
                            O ingresa ruta / URL existente para móvil:
                            <input type="text" name="img_mobile_url" id="inpImgMobUrl" oninput="updateCanvasBg();" placeholder="/arica2027/assets/neon/muse-v3.webp" style="width:100%; height:34px; background:#050208; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:0 10px; font-size:11.5px; margin-top:2px;">
                        </div>
                        <div style="margin-top:6px;">
                            <label style="font-size:10px; color:#94a3b8;">Encuadre Móvil Estático Fallback:</label>
                            <input type="text" name="pos_mobile" id="inpPosMobile" value="50% top" placeholder="Ej: 50% top" style="width:100%; height:32px; background:#050208; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:0 10px; font-size:11px;">
                        </div>
                    </div>
                </div>

                <!-- ==============================================================
                     CALIBRADOR DE ENCUADRE MÓVIL (RECUADRO INICIO Y RECUADRO FIN)
                     ============================================================== -->
                <div style="background:rgba(23,10,29,0.85); border:1.5px solid rgba(212,175,55,0.4); border-radius:16px; padding:18px; margin-bottom:18px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                        <div>
                            <h4 style="font-family:'Playfair Display',serif; font-size:15px; color:var(--gold); margin:0; display:flex; align-items:center; gap:8px;">
                                <span>🎬</span> Calibrador de Recuadros (Inicio & Fin)
                            </h4>
                            <p style="font-size:11px; color:#e2e8f0; margin:4px 0 0; max-width:440px; line-height:1.4;">
                                Arrastra los recuadros con el mouse o mueve los deslizadores para fijar <b>dónde inicia (Punto 1)</b> y <b>dónde termina (Punto 2)</b> el encuadre en el celular.
                            </p>
                        </div>
                        <button type="button" onclick="playPanSimulation();" style="background:linear-gradient(135deg, #f5245f, #9333ea); color:#fff; border:none; padding:8px 16px; font-size:11.5px; font-weight:800; border-radius:99px; box-shadow:0 0 15px rgba(245,36,95,0.4); cursor:pointer;">
                            ▶️ Simular en Celular
                        </button>
                    </div>

                    <!-- CANVAS CON RECUADROS INTERACTIVOS -->
                    <div id="panCanvasContainer" style="position:relative; width:100%; height:190px; background:#040206; border-radius:12px; overflow:hidden; border:1px solid rgba(212,175,55,0.3); box-shadow:inset 0 0 25px rgba(0,0,0,0.9); user-select:none;">
                        <!-- Imagen de Fondo -->
                        <img id="panPreviewImg" src="/arica2027/assets/neon/muse-v3.webp" alt="Preview" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.9; pointer-events:none;">
                        
                        <!-- Sombra guía -->
                        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.3); pointer-events:none;"></div>

                        <!-- Trayectoria Conectora -->
                        <div id="panTrajectory" style="position:absolute; top:50%; height:3px; background:linear-gradient(90deg, #10b981, #f5245f); pointer-events:none; z-index:5; box-shadow:0 0 10px rgba(245,36,95,0.8);"></div>

                        <!-- RECUADRO 1: INICIO (PUNTO A - VERDE ESMERALDA) -->
                        <div id="frameStart" style="position:absolute; top:6px; bottom:6px; width:98px; border:2.5px solid #10b981; background:rgba(16,185,129,0.22); border-radius:8px; box-shadow:0 0 20px rgba(16,185,129,0.7); cursor:grab; display:flex; flex-direction:column; justify-content:space-between; padding:5px; z-index:15; left:15%; backdrop-filter:blur(1px);">
                            <div style="background:#10b981; color:#022c22; font-size:8.5px; font-weight:900; padding:2px 4px; border-radius:4px; text-align:center; letter-spacing:0.5px; text-transform:uppercase;">
                                🟢 1. INICIO
                            </div>
                            <div id="frameStartLabel" style="font-size:9px; font-weight:800; color:#fff; background:rgba(0,0,0,0.85); text-align:center; padding:2px 4px; border-radius:4px; font-family:monospace;">
                                15%
                            </div>
                        </div>

                        <!-- RECUADRO 2: TÉRMINO (PUNTO B - FUCSIA NEÓN) -->
                        <div id="frameEnd" style="position:absolute; top:6px; bottom:6px; width:98px; border:2.5px solid #f5245f; background:rgba(245,36,95,0.22); border-radius:8px; box-shadow:0 0 20px rgba(245,36,95,0.7); cursor:grab; display:flex; flex-direction:column; justify-content:space-between; padding:5px; z-index:16; left:65%; backdrop-filter:blur(1px);">
                            <div style="background:#f5245f; color:#fff; font-size:8.5px; font-weight:900; padding:2px 4px; border-radius:4px; text-align:center; letter-spacing:0.5px; text-transform:uppercase;">
                                🟣 2. TÉRMINO
                            </div>
                            <div id="frameEndLabel" style="font-size:9px; font-weight:800; color:#fff; background:rgba(0,0,0,0.85); text-align:center; padding:2px 4px; border-radius:4px; font-family:monospace;">
                                85%
                            </div>
                        </div>
                    </div>

                    <!-- CONTROLES DESLIZADORES -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:14px;">
                        <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(16,185,129,0.35); padding:10px 14px; border-radius:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                                <label style="font-size:11px; font-weight:800; color:#10b981; text-transform:uppercase;">
                                    🟢 Recuadro 1: Dónde Inicia
                                </label>
                                <span id="txtPanStart" style="font-size:12px; font-weight:800; color:#fff; font-family:monospace;">15%</span>
                            </div>
                            <input type="range" id="sliderPanStart" min="0" max="100" value="15" style="width:100%; accent-color:#10b981; cursor:pointer;" oninput="syncFromSlider('start', this.value);">
                            <input type="hidden" name="mobile_pan_start" id="inpPanStart" value="15%">
                        </div>

                        <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(245,36,95,0.35); padding:10px 14px; border-radius:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                                <label style="font-size:11px; font-weight:800; color:#f5245f; text-transform:uppercase;">
                                    🟣 Recuadro 2: Dónde Termina
                                </label>
                                <span id="txtPanEnd" style="font-size:12px; font-weight:800; color:#fff; font-family:monospace;">85%</span>
                            </div>
                            <input type="range" id="sliderPanEnd" min="0" max="100" value="85" style="width:100%; accent-color:#f5245f; cursor:pointer;" oninput="syncFromSlider('end', this.value);">
                            <input type="hidden" name="mobile_pan_end" id="inpPanEnd" value="85%">
                        </div>
                    </div>

                    <!-- SIMULADOR INTERACTIVO DE CELULAR -->
                    <div id="simPhoneWrap" style="display:none; margin-top:14px; background:#08040b; border:1px solid rgba(212,175,55,0.3); border-radius:14px; padding:14px; text-align:center;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="font-size:11px; font-weight:700; color:var(--gold);">📱 Recorrido Real en Pantalla Móvil (5.5s):</span>
                            <button type="button" onclick="closeSimPhone();" style="background:none; border:none; color:#cbd5e1; font-size:13px; font-weight:700; cursor:pointer;">&times; Cerrar</button>
                        </div>
                        <div style="display:inline-block; width:150px; height:260px; border:3px solid var(--gold); border-radius:24px; overflow:hidden; position:relative; box-shadow:0 0 30px rgba(245,36,95,0.4); background:#000;">
                            <img id="simPhonePhoto" src="" style="width:100%; height:100%; object-fit:cover; transition:object-position 5.5s cubic-bezier(0.25, 0.9, 0.35, 1);">
                            <div style="position:absolute; inset:0; background:linear-gradient(0deg, rgba(3,2,5,0.85) 0%, transparent 50%); pointer-events:none;"></div>
                            <div style="position:absolute; bottom:10px; left:6px; right:6px; text-align:center; color:#fff; font-size:9px; font-weight:700; text-shadow:0 1px 3px #000; pointer-events:none;">
                                <span id="simPhoneText">SIMULANDO TOMA...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
                    <div>
                        <label style="display:block; font-size:11px; font-weight:800; color:#caa8cb; margin-bottom:4px;">
                            Orden de Aparición (1, 2, 3...)
                        </label>
                        <input type="number" name="order_num" id="inpOrder" value="1" min="1" max="99" style="width:100%; height:38px; background:#050208; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; padding:0 12px;">
                    </div>

                    <div style="display:flex; align-items:center; gap:8px; padding-top:20px;">
                        <input type="checkbox" name="is_active" id="inpActive" value="1" checked style="width:18px; height:18px; accent-color:var(--gold);">
                        <label for="inpActive" style="font-size:12px; color:#fff; font-weight:700; cursor:pointer;">
                            Slide Activo en Portada
                        </label>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid var(--border); padding-top:16px;">
                    <button type="button" class="btn-nav" onclick="closeSlideModal();">Cancelar</button>
                    <button type="submit" class="btn-add" id="btnSubmitModal">Guardar Slide</button>
                </div>
            </form>
        </div>
    </div>

    <script>
    let startPct = 15;
    let endPct = 85;

    function updateFramesUI() {
        const fStart = document.getElementById('frameStart');
        const fEnd = document.getElementById('frameEnd');
        const fStartLbl = document.getElementById('frameStartLabel');
        const fEndLbl = document.getElementById('frameEndLabel');
        const txtStart = document.getElementById('txtPanStart');
        const txtEnd = document.getElementById('txtPanEnd');
        const inpStart = document.getElementById('inpPanStart');
        const inpEnd = document.getElementById('inpPanEnd');
        const slStart = document.getElementById('sliderPanStart');
        const slEnd = document.getElementById('sliderPanEnd');
        const traj = document.getElementById('panTrajectory');
        const container = document.getElementById('panCanvasContainer');

        if (!container || !fStart || !fEnd) return;

        const contWidth = container.offsetWidth || 560;
        const fWidth = 98;
        const maxLeft = Math.max(0, contWidth - fWidth);

        const leftStartPx = (startPct / 100) * maxLeft;
        const leftEndPx = (endPct / 100) * maxLeft;

        fStart.style.left = leftStartPx + 'px';
        fEnd.style.left = leftEndPx + 'px';

        fStartLbl.textContent = Math.round(startPct) + '%';
        fEndLbl.textContent = Math.round(endPct) + '%';
        txtStart.textContent = Math.round(startPct) + '%';
        txtEnd.textContent = Math.round(endPct) + '%';
        inpStart.value = Math.round(startPct) + '%';
        inpEnd.value = Math.round(endPct) + '%';
        slStart.value = Math.round(startPct);
        slEnd.value = Math.round(endPct);

        // Update trajectory arrow line
        const p1 = leftStartPx + (fWidth / 2);
        const p2 = leftEndPx + (fWidth / 2);
        const minP = Math.min(p1, p2);
        const widthTraj = Math.abs(p2 - p1);
        traj.style.left = minP + 'px';
        traj.style.width = widthTraj + 'px';
    }

    function syncFromSlider(type, val) {
        if (type === 'start') {
            startPct = parseFloat(val);
        } else {
            endPct = parseFloat(val);
        }
        updateFramesUI();
    }

    function updateCanvasBg() {
        const mobUrl = document.getElementById('inpImgMobUrl').value.trim();
        const pcUrl = document.getElementById('inpImgPcUrl').value.trim();
        const finalUrl = mobUrl || pcUrl || '/arica2027/assets/neon/muse-v3.webp';
        document.getElementById('panPreviewImg').src = finalUrl;
    }

    function previewSelectedImg(input, type) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('panPreviewImg').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Drag & Drop for Frame Start and Frame End
    function setupFrameDrag() {
        const container = document.getElementById('panCanvasContainer');
        const fStart = document.getElementById('frameStart');
        const fEnd = document.getElementById('frameEnd');
        if (!container || !fStart || !fEnd) return;

        let activeDrag = null;

        function onPointerDown(type, e) {
            activeDrag = type;
            document.body.style.cursor = 'grabbing';
            e.preventDefault();
        }

        fStart.onpointerdown = (e) => onPointerDown('start', e);
        fEnd.onpointerdown = (e) => onPointerDown('end', e);

        window.addEventListener('pointermove', e => {
            if (!activeDrag) return;
            const rect = container.getBoundingClientRect();
            const fWidth = 98;
            const maxLeft = Math.max(1, rect.width - fWidth);
            const x = e.clientX - rect.left - (fWidth / 2);
            const clampedPct = Math.max(0, Math.min(100, (x / maxLeft) * 100));

            if (activeDrag === 'start') {
                startPct = clampedPct;
            } else {
                endPct = clampedPct;
            }
            updateFramesUI();
        });

        window.addEventListener('pointerup', () => {
            if (activeDrag) {
                activeDrag = null;
                document.body.style.cursor = '';
            }
        });
    }

    function playPanSimulation() {
        const simWrap = document.getElementById('simPhoneWrap');
        const simPhoto = document.getElementById('simPhonePhoto');
        const simText = document.getElementById('simPhoneText');
        const previewImg = document.getElementById('panPreviewImg');

        simPhoto.src = previewImg.src;
        simWrap.style.display = 'block';

        simPhoto.style.transition = 'none';
        simPhoto.style.objectPosition = startPct + '% center';
        simText.textContent = '🟢 INICIANDO EN ' + Math.round(startPct) + '%...';

        setTimeout(() => {
            simPhoto.style.transition = 'object-position 5.5s cubic-bezier(0.25, 0.9, 0.35, 1)';
            simPhoto.style.objectPosition = endPct + '% center';
            simText.textContent = 'VIAJANDO HACIA 🟣 ' + Math.round(endPct) + '%';
        }, 150);
    }

    function closeSimPhone() {
        document.getElementById('simPhoneWrap').style.display = 'none';
    }

    function openNewSlideModal() {
        document.getElementById('modalTitle').textContent = 'Crear Nuevo Slide para Portada';
        document.getElementById('modalAction').value = 'create_slide';
        document.getElementById('modalSlideId').value = '';
        document.getElementById('inpSede').value = '<?= $filtroSede !== "todas" ? $filtroSede : "arica" ?>';
        document.getElementById('inpTitle').value = '';
        document.getElementById('inpSubtitle').value = '';
        document.getElementById('inpTag').value = '';
        document.getElementById('inpQuote').value = '';
        document.getElementById('inpImgPcUrl').value = '';
        document.getElementById('inpImgMobUrl').value = '';
        document.getElementById('inpPosDesktop').value = '50% 20%';
        document.getElementById('inpPosMobile').value = '50% top';
        document.getElementById('inpOrder').value = <?= count($slides) + 1 ?>;
        document.getElementById('inpActive').checked = true;
        document.getElementById('btnSubmitModal').textContent = 'Crear Slide';
        
        startPct = 15;
        endPct = 85;
        updateCanvasBg();
        document.getElementById('slideModal').style.display = 'flex';
        setTimeout(() => {
            updateFramesUI();
            setupFrameDrag();
        }, 50);
    }

    function openEditSlideModal(s) {
        document.getElementById('modalTitle').textContent = 'Editar Slide: ' + s.title;
        document.getElementById('modalAction').value = 'edit_slide';
        document.getElementById('modalSlideId').value = s.id;
        document.getElementById('inpSede').value = s.sede || 'arica';
        document.getElementById('inpTitle').value = s.title || '';
        document.getElementById('inpSubtitle').value = s.subtitle || '';
        document.getElementById('inpTag').value = s.campaign_tag || '';
        document.getElementById('inpQuote').value = s.cursive_quote || '';
        document.getElementById('inpImgPcUrl').value = s.img_desktop || '';
        document.getElementById('inpImgMobUrl').value = s.img_mobile || '';
        document.getElementById('inpPosDesktop').value = s.pos_desktop || '50% 20%';
        document.getElementById('inpPosMobile').value = s.pos_mobile || '50% top';
        document.getElementById('inpOrder').value = s.order_num || 1;
        document.getElementById('inpActive').checked = (s.is_active == 1);
        document.getElementById('btnSubmitModal').textContent = 'Guardar Cambios';

        startPct = parseFloat(s.mobile_pan_start) || 15;
        endPct = parseFloat(s.mobile_pan_end) || 85;

        const currentImg = s.img_mobile || s.img_desktop || '/arica2027/assets/neon/muse-v3.webp';
        document.getElementById('panPreviewImg').src = currentImg;

        document.getElementById('slideModal').style.display = 'flex';
        setTimeout(() => {
            updateFramesUI();
            setupFrameDrag();
        }, 50);
    }

    function closeSlideModal() {
        document.getElementById('slideModal').style.display = 'none';
        closeSimPhone();
    }
    </script>
</body>
</html>
