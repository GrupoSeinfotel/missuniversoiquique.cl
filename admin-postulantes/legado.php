<?php
/**
 * MISS UNIVERSO · GESTIÓN DEL SALÓN DEL LEGADO 2026
 * Panel de Administración para invitar y gestionar a las ex candidatas 2026
 */
session_start();
require_once __DIR__ . '/../config/db.php';

// Si no está logueado, redirigir al login
if (!isset($_SESSION['admin_logged'])) {
    header('Location: index.php');
    exit;
}

// Función para enviar correo oficial de invitación
function enviarInvitacionLegado($candidata) {
    $sede = $candidata['sede'];
    $sedeTitle = ucfirst($sede);
    $fromEmail = "contacto@missuniverso{$sede}.cl";
    $magicUrl = "https://missuniverso{$sede}.cl/2026/editar.php?token=" . $candidata['magic_token'];
    $linktreeUrl = "https://missuniverso{$sede}.cl/2026/#" . $candidata['username'];
    $editorialUrl = "https://missuniverso{$sede}.cl/2026/" . $candidata['username'];
    $instEmail = "{$candidata['username']}@2026.missuniverso{$sede}.cl";

    $subject = "👑 Tu Nueva Identidad Digital y Salón del Legado · Miss Universo {$sedeTitle}";

    $html = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='utf-8'>
        <style>
            body { margin:0; padding:0; background:#010820; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#f1f5f9; }
            .container { max-width:600px; margin:30px auto; background:rgba(4,16,48,0.95); border:1px solid #eab308; border-radius:18px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.7); }
            .header { background:linear-gradient(135deg, #061e54, #010820); padding:35px 25px; text-align:center; border-bottom:1px solid rgba(234,179,8,0.3); }
            .content { padding:30px 25px; line-height:1.6; }
            .gold { color:#f7d070; font-weight:bold; }
            .badge-box { background:rgba(234,179,8,0.08); border:1px solid rgba(234,179,8,0.3); border-radius:12px; padding:18px; margin:20px 0; }
            .feature-list { list-style:none; padding:0; margin:15px 0; }
            .feature-list li { margin-bottom:12px; padding-left:24px; position:relative; }
            .feature-list li::before { content:'✦'; position:absolute; left:0; color:#eab308; }
            .btn { display:inline-block; background:linear-gradient(135deg, #f5245f, #eab308); color:#ffffff !important; text-decoration:none; font-weight:bold; font-size:16px; padding:15px 32px; border-radius:30px; box-shadow:0 10px 25px rgba(245,36,95,0.4); margin:20px 0; }
            .footer { padding:20px; text-align:center; font-size:12px; color:#64748b; border-top:1px solid rgba(255,255,255,0.08); }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <div style='font-size:38px;'>👑</div>
                <h1 style='color:#f7d070; margin:8px 0 0; font-size:24px; letter-spacing:2px; text-transform:uppercase;'>Miss Universo {$sedeTitle}</h1>
                <p style='color:#94a3b8; font-size:13px; margin:5px 0 0; text-transform:uppercase; letter-spacing:1px;'>Salón Oficial del Legado 2026</p>
            </div>
            <div class='content'>
                <p style='font-size:17px; margin-top:0;'>Estimada <strong>" . htmlspecialchars($candidata['full_name']) . "</strong>,</p>
                <p style='color:#cbd5e1;'>
                    Tu paso por <strong>Miss Universo {$sedeTitle} 2026</strong> forma parte imborrable de la historia oficial de nuestra organización regional. Tu dedicación, elegancia y liderazgo dejaron una huella que celebramos y preservamos con orgullo.
                </p>
                <p style='color:#cbd5e1;'>
                    Con el lanzamiento de nuestra nueva plataforma digital de alta tecnología, hemos creado para ti una <strong>identidad digital exclusiva y permanente</strong>:
                </p>

                <div class='badge-box'>
                    <ul class='feature-list' style='margin:0;'>
                        <li><strong>Tu Bio-Link Oficial (Linktree):</strong> <code>{$linktreeUrl}</code> <br><span style='font-size:12px; color:#94a3b8;'>Ideal para colocar en la biografía de tu Instagram o TikTok, con enlaces directos a tus redes y proyectos.</span></li>
                        <li><strong>Tu Portafolio Editorial:</strong> <code>{$editorialUrl}</code> <br><span style='font-size:12px; color:#94a3b8;'>Página completa tipo revista con tu biografía y sesión fotográfica oficial.</span></li>
                        <li><strong>Tu Correo Institucional:</strong> <code>{$instEmail}</code> <br><span style='font-size:12px; color:#94a3b8;'>Correo institucional oficial que redirige directo a tu casilla personal ({$candidata['email_personal']}).</span></li>
                    </ul>
                </div>

                <div style='text-align:center;'>
                    <p style='color:#cbd5e1; margin-bottom:5px;'>Hemos habilitado un panel privado donde podrás actualizar tus fotos, links y biografía sin contraseñas:</p>
                    <a href='{$magicUrl}' class='btn' target='_blank'>Ingresar a mi Panel de Embajadora</a>
                </div>

                <div style='margin-top:25px; padding:15px; background:rgba(255,255,255,0.03); border-radius:10px; font-size:13px; color:#94a3b8;'>
                    <strong style='color:#e2e8f0;'>🔒 Privacidad y Registro Histórico:</strong><br>
                    Si por motivos personales o profesionales prefieres no exponer redes sociales ni fotos secundarias, dentro de tu panel puedes activar el <em>Modo Registro Histórico Mínimo</em>. De esta forma tus enlaces quedarán reservados, preservando con honor únicamente tu nombre y fotografía histórica de la edición.
                    <br><br>
                    Si tienes cualquier solicitud especial, puedes contactarnos respondiendo directamente a este correo.
                </div>
            </div>
            <div class='footer'>
                Miss Universo {$sedeTitle} · Franquicia Regional Oficial de Belleza y Liderazgo<br>
                Contacto Oficial: {$fromEmail}
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Miss Universo {$sedeTitle} <{$fromEmail}>\r\n";
    $headers .= "Reply-To: {$fromEmail}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return @mail($candidata['email_personal'], $subject, $html, $headers);
}

// Acción: Enviar Correo Individual
if (isset($_POST['action']) && $_POST['action'] === 'send_email') {
    header('Content-Type: application/json');
    $id = intval($_POST['id'] ?? 0);
    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE id = ?");
    $stmt->execute([$id]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cand) {
        $sent = enviarInvitacionLegado($cand);
        $up = $pdo->prepare("UPDATE legado_2026 SET email_sent_at = NOW() WHERE id = ?");
        $up->execute([$id]);
        echo json_encode(['status' => 'ok', 'sent' => $sent, 'message' => "Correo enviado a {$cand['email_personal']}"]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Candidata no encontrada']);
    }
    exit;
}

// Acción: Campaña Masiva
if (isset($_POST['action']) && $_POST['action'] === 'send_bulk') {
    header('Content-Type: application/json');
    $sedeFiltro = $_POST['sede'] ?? 'todas';
    $sql = "SELECT * FROM legado_2026 WHERE 1=1";
    $params = [];
    if (in_array($sedeFiltro, ['arica', 'iquique'])) {
        $sql .= " AND sede = ?";
        $params[] = $sedeFiltro;
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $candidatas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalSent = 0;
    foreach ($candidatas as $c) {
        if (enviarInvitacionLegado($c)) {
            $totalSent++;
            $up = $pdo->prepare("UPDATE legado_2026 SET email_sent_at = NOW() WHERE id = ?");
            $up->execute([$c['id']]);
        }
    }

    echo json_encode(['status' => 'ok', 'total_sent' => $totalSent, 'total' => count($candidatas)]);
    exit;
}

// Filtros y Búsqueda
$filtroSede = $_GET['sede'] ?? 'todas';
$busqueda = trim($_GET['q'] ?? '');

$sql = "SELECT * FROM legado_2026 WHERE 1=1";
$params = [];

if (in_array($filtroSede, ['arica', 'iquique'])) {
    $sql .= " AND sede = ?";
    $params[] = $filtroSede;
}

if (!empty($busqueda)) {
    $sql .= " AND (full_name LIKE ? OR username LIKE ? OR email_personal LIKE ? OR occupation LIKE ?)";
    $like = "%$busqueda%";
    $params[] = $like; $params[] = $like; $params[] = $like; $params[] = $like;
}

$sql .= " ORDER BY sede ASC, id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$candidatas = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Métricas
$totalLegado = $pdo->query("SELECT COUNT(*) FROM legado_2026")->fetchColumn();
$totalArica = $pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'arica'")->fetchColumn();
$totalIquique = $pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'iquique'")->fetchColumn();
$totalEnviados = $pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE email_sent_at IS NOT NULL")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salón del Legado 2026 | Miss Universe Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Raleway:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-body: #08080c;
            --bg-card: rgba(20, 20, 28, 0.9);
            --pink: #f5245f;
            --gold: #d4af37;
            --green: #25d366;
            --border: rgba(255, 255, 255, 0.08);
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

        /* Header */
        header {
            background: rgba(14, 14, 20, 0.95);
            border-bottom: 1px solid var(--border);
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--gold);
        }
        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .btn-nav {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: #fff;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn-nav:hover {
            border-color: var(--gold);
            color: var(--gold);
        }
        .btn-nav.active {
            background: rgba(245, 36, 95, 0.15);
            border-color: var(--pink);
            color: #ff8fab;
        }
        .btn-logout {
            color: #aaa;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 700;
        }
        .btn-logout:hover { color: var(--pink); }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 30px 20px;
            flex: 1;
            width: 100%;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 20px;
            text-align: center;
        }
        .stat-num {
            font-size: 2.2rem;
            font-weight: 900;
            font-family: 'Playfair Display', serif;
            color: #fff;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #888;
        }

        /* Filters Bar */
        .filters-bar {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 18px 22px;
            margin-bottom: 25px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: space-between;
            align-items: center;
        }
        .filter-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .pill-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: #bbb;
            padding: 7px 14px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-decoration: none;
            text-transform: uppercase;
            transition: all 0.2s ease;
        }
        .pill-btn.active, .pill-btn:hover {
            background: var(--pink);
            border-color: var(--pink);
            color: #fff;
        }
        .search-form { display: flex; gap: 8px; }
        .search-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 8px 14px;
            border-radius: 8px;
            color: #fff;
            font-size: 0.85rem;
            outline: none;
        }
        .search-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
        }

        /* Action Buttons */
        .btn-bulk-email {
            background: linear-gradient(135deg, #f5245f, #d4af37);
            color: #fff;
            border: none;
            padding: 9px 18px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        /* Table */
        .table-responsive {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.9rem;
        }
        th {
            background: rgba(255, 255, 255, 0.03);
            color: #888;
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 14px 18px;
            border-bottom: 1px solid var(--border);
        }
        td {
            padding: 14px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            vertical-align: middle;
        }
        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
        .thumb-img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--gold);
        }
        .badge-sede {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .sede-arica { background: rgba(245, 36, 95, 0.2); color: #ff8fab; border: 1px solid rgba(245, 36, 95, 0.4); }
        .sede-iquique { background: rgba(212, 175, 55, 0.2); color: #ffd166; border: 1px solid rgba(212, 175, 55, 0.4); }

        .btn-table-action {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border);
            color: #fff;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
        }
        .btn-table-action:hover {
            border-color: var(--gold);
            color: var(--gold);
        }
        .btn-send-single {
            background: rgba(245, 36, 95, 0.15);
            border-color: rgba(245, 36, 95, 0.4);
            color: #ff8fab;
        }
        .btn-send-single:hover {
            background: var(--pink);
            color: #fff;
        }

        .sent-indicator {
            font-size: 0.72rem;
            color: #25d366;
            display: block;
            margin-top: 4px;
        }
        .unsent-indicator {
            font-size: 0.72rem;
            color: #888;
            display: block;
            margin-top: 4px;
        }
    </style>
</head>
<body>

    <header>
        <div class="header-title">
            <span>👑</span>
            <span>Miss Universe · Salón del Legado 2026</span>
        </div>
        <div class="header-actions">
            <a href="index.php" class="btn-nav">📋 Postulantes 2027</a>
            <a href="slider.php" class="btn-nav">🖼️ Hero Slider</a>
            <a href="legado.php" class="btn-nav active">👑 Legado 2026</a>
            <span style="color:#666">|</span>
            <span style="font-size: 0.85rem; color:#bbb"><?= htmlspecialchars($_SESSION['admin_name']) ?></span>
            <a href="index.php?logout=1" class="btn-logout">Cerrar Sesión</a>
        </div>
    </header>

    <div class="container">

        <!-- Métricas -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-num"><?= $totalLegado ?></div>
                <div class="stat-label">Total Embajadoras 2026</div>
            </div>
            <div class="stat-card">
                <div class="stat-num" style="color: #ff8fab"><?= $totalArica ?></div>
                <div class="stat-label">Sede Arica</div>
            </div>
            <div class="stat-card">
                <div class="stat-num" style="color: #ffd166"><?= $totalIquique ?></div>
                <div class="stat-label">Sede Iquique</div>
            </div>
            <div class="stat-card">
                <div class="stat-num" style="color: #25d366"><?= $totalEnviados ?></div>
                <div class="stat-label">Invitaciones Enviadas</div>
            </div>
        </div>

        <!-- Filtros y Acciones -->
        <div class="filters-bar">
            <div class="filter-group">
                <a href="?sede=todas" class="pill-btn <?= $filtroSede === 'todas' ? 'active' : '' ?>">Todas (<?= $totalLegado ?>)</a>
                <a href="?sede=arica" class="pill-btn <?= $filtroSede === 'arica' ? 'active' : '' ?>">Arica (<?= $totalArica ?>)</a>
                <a href="?sede=iquique" class="pill-btn <?= $filtroSede === 'iquique' ? 'active' : '' ?>">Iquique (<?= $totalIquique ?>)</a>
            </div>

            <form class="search-form" method="GET">
                <input type="hidden" name="sede" value="<?= htmlspecialchars($filtroSede) ?>">
                <input type="text" name="q" class="search-input" placeholder="Buscar embajadora..." value="<?= htmlspecialchars($busqueda) ?>">
                <button type="submit" class="search-btn">🔍</button>
            </form>

            <button type="button" class="btn-bulk-email" onclick="sendBulkCampaign('<?= $filtroSede ?>');">
                <span>✉️</span> Enviar Campaña Masiva por Correo
            </button>
        </div>

        <!-- Tabla de Embajadoras -->
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Embajadora</th>
                        <th>Sede</th>
                        <th>Identidad Digital / URLs</th>
                        <th>Correo Personal</th>
                        <th>Modos Activos</th>
                        <th>Estado Invitación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($candidatas)): ?>
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                            No se encontraron embajadoras con los criterios seleccionados.
                        </td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($candidatas as $c): 
                        $instDomain = "2026.missuniverso{$c['sede']}.cl";
                        $instEmail = "{$c['username']}@{$instDomain}";
                        $magicUrl = "https://missuniverso{$c['sede']}.cl/2026/editar.php?token={$c['magic_token']}";
                        $pubEditorial = "https://missuniverso{$c['sede']}.cl/2026/{$c['username']}";
                        $pubLinktree = "https://missuniverso{$c['sede']}.cl/2026/#{$c['username']}";
                    ?>
                    <tr>
                        <td>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="<?= htmlspecialchars($c['photo_main']) ?>" alt="<?= htmlspecialchars($c['full_name']) ?>" class="thumb-img">
                                <div>
                                    <strong style="color:#fff; font-size:0.95rem;"><?= htmlspecialchars($c['full_name']) ?></strong>
                                    <div style="font-size:0.75rem; color:#888;"><?= htmlspecialchars($c['occupation'] ?? 'Embajadora Oficial') ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="badge-sede sede-<?= $c['sede'] ?>"><?= strtoupper($c['sede']) ?></span>
                        </td>
                        <td>
                            <div style="font-size:0.82rem;">
                                <div><strong style="color:var(--gold);">@<?= htmlspecialchars($c['username']) ?></strong></div>
                                <div style="color:#cbd5e1; font-size:0.75rem; font-family:monospace;"><?= $instEmail ?></div>
                                <div style="margin-top:4px; display:flex; gap:6px;">
                                    <a href="<?= $pubLinktree ?>" target="_blank" style="color:#38bdf8; font-size:0.72rem; text-decoration:none;">🔗 Linktree</a>
                                    <span style="color:#555;">•</span>
                                    <a href="<?= $pubEditorial ?>" target="_blank" style="color:#f7d070; font-size:0.72rem; text-decoration:none;">📖 Editorial</a>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div style="font-size:0.85rem; color:#cbd5e1;"><?= htmlspecialchars($c['email_personal']) ?></div>
                        </td>
                        <td>
                            <div style="font-size:0.75rem; display:flex; flex-direction:column; gap:2px;">
                                <span><?= $c['mode_linktree'] ? '✅ Linktree' : '❌ Linktree' ?></span>
                                <span><?= $c['mode_editorial'] ? '✅ Editorial' : '❌ Editorial' ?></span>
                                <?php if ($c['is_minimal_record']): ?>
                                    <span style="color:#f5245f; font-weight:bold;">🔒 Modo Privado Mínimo</span>
                                <?php endif; ?>
                            </div>
                        </td>
                        <td id="status-col-<?= $c['id'] ?>">
                            <?php if ($c['email_sent_at']): ?>
                                <span class="sent-indicator">✓ Enviado: <?= date('d/m/Y H:i', strtotime($c['email_sent_at'])) ?></span>
                            <?php else: ?>
                                <span class="unsent-indicator">○ Sin enviar</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div style="display:flex; flex-wrap:wrap; gap:6px;">
                                <button type="button" class="btn-table-action" onclick="copyMagicLink('<?= $magicUrl ?>', this);" title="Copiar enlace para WhatsApp">
                                    📋 Copiar Acceso
                                </button>
                                <button type="button" class="btn-table-action btn-send-single" onclick="sendSingleEmail(<?= $c['id'] ?>, '<?= htmlspecialchars($c['full_name']) ?>', this);">
                                    ✉️ Enviar Correo
                                </button>
                                <a href="/2026/editar.php?token=<?= $c['magic_token'] ?>" target="_blank" class="btn-table-action" title="Abrir panel como embajadora">
                                    ✏️ Panel
                                </a>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function copyMagicLink(url, btn) {
            navigator.clipboard.writeText(url).then(() => {
                const orig = btn.innerHTML;
                btn.innerHTML = '¡Copiado! ✓';
                btn.style.borderColor = '#25d366';
                btn.style.color = '#25d366';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 2000);
            });
        }

        async function sendSingleEmail(id, name, btn) {
            if (!confirm(`¿Deseas enviar el correo oficial de invitación a ${name}?`)) return;
            const orig = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            const fd = new FormData();
            fd.append('action', 'send_email');
            fd.append('id', id);

            try {
                const res = await fetch('legado.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'ok') {
                    alert(`¡Correo enviado con éxito a ${name}!`);
                    const statusTd = document.getElementById(`status-col-${id}`);
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="sent-indicator">✓ Enviado recién</span>';
                    }
                } else {
                    alert(data.message || 'Error al enviar');
                }
            } catch (err) {
                alert('Error de conexión con el servidor');
            }

            btn.innerHTML = orig;
            btn.disabled = false;
        }

        async function sendBulkCampaign(sede) {
            const sedeName = sede === 'todas' ? 'todas las candidatas (Arica e Iquique)' : `las candidatas de sede ${sede.toUpperCase()}`;
            if (!confirm(`¿Estás seguro de enviar la campaña oficial de correos a ${sedeName}?`)) return;

            const fd = new FormData();
            fd.append('action', 'send_bulk');
            fd.append('sede', sede);

            const btn = document.querySelector('.btn-bulk-email');
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span> Enviando correos...';

            try {
                const res = await fetch('legado.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'ok') {
                    alert(`¡Campaña finalizada exitosamente! Se enviaron ${data.total_sent} correos.`);
                    window.location.reload();
                } else {
                    alert('Ocurrió un error en la campaña.');
                }
            } catch (err) {
                alert('Error de conexión');
            }

            btn.disabled = false;
            btn.innerHTML = '<span>✉️</span> Enviar Campaña Masiva por Correo';
        }
    </script>
</body>
</html>
