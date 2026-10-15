<?php
session_start();
require_once __DIR__ . '/../config/db.php';

// Cerrar sesión
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Procesar Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['admin_logged'] = true;
        $_SESSION['admin_user'] = $user['username'];
        $_SESSION['admin_name'] = $user['nombre'];
        header('Location: index.php');
        exit;
    } else {
        $loginError = 'Usuario o contraseña incorrectos.';
    }
}

// Acción AJAX: Cambiar Estado
if (isset($_POST['action']) && $_POST['action'] === 'update_status' && isset($_SESSION['admin_logged'])) {
    header('Content-Type: application/json');
    $id = intval($_POST['id'] ?? 0);
    $estado = trim($_POST['estado'] ?? 'pendiente');
    if (in_array($estado, ['pendiente', 'contactada', 'seleccionada', 'descartada'])) {
        $stmt = $pdo->prepare("UPDATE postulantes_2027 SET estado = ? WHERE id = ?");
        $stmt->execute([$estado, $id]);
        echo json_encode(['status' => 'ok']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Estado inválido']);
    }
    exit;
}

// Acción AJAX: Eliminar
if (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_SESSION['admin_logged'])) {
    header('Content-Type: application/json');
    $id = intval($_POST['id'] ?? 0);
    $stmt = $pdo->prepare("DELETE FROM postulantes_2027 WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// Acción Exportar CSV
if (isset($_GET['export']) && isset($_SESSION['admin_logged'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=postulantes_miss_universo_2027_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM UTF-8
    fputcsv($output, ['ID', 'Sede', 'Nombres', 'Apellidos', 'Edad', 'WhatsApp', 'Email', 'Instagram', 'Estatura', 'Comuna', 'Ocupación', 'Estado', 'Fecha Registro']);

    $stmt = $pdo->query("SELECT id, sede, nombres, apellidos, edad, telefono_whatsapp, email, instagram, estatura_cm, comuna, ocupacion, estado, created_at FROM postulantes_2027 ORDER BY id DESC");
    while ($row = $stmt->fetch()) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}

// Si NO está logueado, mostrar pantalla de Login
if (!isset($_SESSION['admin_logged'])):
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Administrativo | Casting Miss Universe 2027</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Raleway:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            background: #08080c;
            color: #fff;
            font-family: 'Raleway', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
            background-image: radial-gradient(circle at 50% 50%, rgba(245, 36, 95, 0.1) 0%, transparent 60%);
        }
        .login-box {
            background: rgba(20, 20, 26, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
            text-align: center;
        }
        .login-box h1 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .login-box p {
            color: #888;
            font-size: 0.85rem;
            margin-bottom: 30px;
        }
        .input-group {
            margin-bottom: 20px;
            text-align: left;
        }
        label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #bbb;
            margin-bottom: 6px;
        }
        input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 14px 16px;
            border-radius: 10px;
            color: #fff;
            font-size: 0.95rem;
            box-sizing: border-box;
            outline: none;
        }
        input:focus {
            border-color: #f5245f;
            background: rgba(245, 36, 95, 0.05);
        }
        .btn-login {
            width: 100%;
            background: linear-gradient(135deg, #f5245f, #a6123c);
            color: #fff;
            border: none;
            padding: 15px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(245, 36, 95, 0.35);
        }
        .error {
            background: rgba(245, 36, 95, 0.15);
            border: 1px solid #f5245f;
            color: #ff8fab;
            padding: 10px;
            border-radius: 8px;
            font-size: 0.85rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <div style="font-size: 2.5rem; margin-bottom: 10px;">👑</div>
        <h1>Panel Casting 2027</h1>
        <p>Dirección Oficial Miss Universe</p>
        
        <?php if (!empty($loginError)): ?>
            <div class="error"><?= htmlspecialchars($loginError) ?></div>
        <?php endif; ?>

        <form method="POST">
            <input type="hidden" name="action" value="login">
            <div class="input-group">
                <label>Usuario</label>
                <input type="text" name="username" required autofocus placeholder="Usuario admin">
            </div>
            <div class="input-group">
                <label>Contraseña</label>
                <input type="password" name="password" required placeholder="Contraseña">
            </div>
            <button type="submit" class="btn-login">Ingresar al Panel</button>
        </form>
    </div>
</body>
</html>
<?php
exit;
endif;

// USUARIO LOGUEADO: Cargar Postulantes y Métricas
$filtroSede = $_GET['sede'] ?? 'todas';
$filtroEstado = $_GET['estado'] ?? 'todos';
$busqueda = trim($_GET['q'] ?? '');

$sql = "SELECT * FROM postulantes_2027 WHERE 1=1";
$params = [];

if ($filtroSede === 'arica' || $filtroSede === 'iquique') {
    $sql .= " AND sede = ?";
    $params[] = $filtroSede;
}

if (in_array($filtroEstado, ['pendiente', 'contactada', 'seleccionada', 'descartada'])) {
    $sql .= " AND estado = ?";
    $params[] = $filtroEstado;
}

if (!empty($busqueda)) {
    $sql .= " AND (nombres LIKE ? OR apellidos LIKE ? OR email LIKE ? OR telefono_whatsapp LIKE ? OR instagram LIKE ?)";
    $like = "%$busqueda%";
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}

$sql .= " ORDER BY id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$postulantes = $stmt->fetchAll();

// Métricas Globales
$totalPostulantes = $pdo->query("SELECT COUNT(*) FROM postulantes_2027")->fetchColumn();
$totalArica = $pdo->query("SELECT COUNT(*) FROM postulantes_2027 WHERE sede = 'arica'")->fetchColumn();
$totalIquique = $pdo->query("SELECT COUNT(*) FROM postulantes_2027 WHERE sede = 'iquique'")->fetchColumn();
$totalPendientes = $pdo->query("SELECT COUNT(*) FROM postulantes_2027 WHERE estado = 'pendiente'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Postulantes 2027 | Miss Universe</title>
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
        header {
            background: rgba(14, 14, 20, 0.95);
            border-bottom: 1px solid var(--border);
            padding: 16px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .header-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .btn-export {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid var(--gold);
            color: var(--gold);
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.2s ease;
        }
        .btn-export:hover {
            background: var(--gold);
            color: #000;
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
        .search-form {
            display: flex;
            gap: 8px;
        }
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
            width: 46px;
            height: 46px;
            border-radius: 8px;
            object-fit: cover;
            cursor: pointer;
            border: 1px solid var(--border);
            transition: transform 0.2s ease;
        }
        .thumb-img:hover {
            transform: scale(1.15);
            border-color: var(--gold);
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

        .btn-wa {
            background: var(--green);
            color: #fff;
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .status-select {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border);
            color: #fff;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            cursor: pointer;
        }

        /* Modal Preview */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: #14141e;
            border: 1px solid var(--border);
            border-radius: 16px;
            max-width: 700px;
            width: 100%;
            padding: 30px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            color: #aaa;
            font-size: 1.5rem;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <header>
        <div class="header-title">
            <span>👑</span>
            <span>Miss Universe • Gestión de Postulantes 2027</span>
        </div>
        <div class="header-actions">
            <a href="slider.php" class="btn-export" style="background:rgba(212,175,55,0.15); border-color:#d4af37; color:#ffd166;">🖼️ Gestión Hero Slider</a>
            <a href="?export=1" class="btn-export">📥 Exportar a Excel (CSV)</a>
            <span style="color:#666">|</span>
            <span style="font-size: 0.85rem; color:#bbb"><?= htmlspecialchars($_SESSION['admin_name']) ?></span>
            <a href="?logout=1" class="btn-logout">Cerrar Sesión</a>
        </div>
    </header>

    <div class="container">

        <!-- Métricas -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-num"><?= $totalPostulantes ?></div>
                <div class="stat-label">Total Postulantes</div>
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
                <div class="stat-num" style="color: #25d366"><?= $totalPendientes ?></div>
                <div class="stat-label">Por Evaluar</div>
            </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="filters-bar">
            <div class="filter-group">
                <span style="color:#888; font-size: 0.75rem; text-transform: uppercase; align-self: center; margin-right: 4px;">Sede:</span>
                <a href="?sede=todas&estado=<?= $filtroEstado ?>" class="pill-btn <?= $filtroSede === 'todas' ? 'active' : '' ?>">Todas</a>
                <a href="?sede=arica&estado=<?= $filtroEstado ?>" class="pill-btn <?= $filtroSede === 'arica' ? 'active' : '' ?>">Arica</a>
                <a href="?sede=iquique&estado=<?= $filtroEstado ?>" class="pill-btn <?= $filtroSede === 'iquique' ? 'active' : '' ?>">Iquique</a>
            </div>

            <div class="filter-group">
                <span style="color:#888; font-size: 0.75rem; text-transform: uppercase; align-self: center; margin-right: 4px;">Estado:</span>
                <a href="?sede=<?= $filtroSede ?>&estado=todos" class="pill-btn <?= $filtroEstado === 'todos' ? 'active' : '' ?>">Todos</a>
                <a href="?sede=<?= $filtroSede ?>&estado=pendiente" class="pill-btn <?= $filtroEstado === 'pendiente' ? 'active' : '' ?>">Pendientes</a>
                <a href="?sede=<?= $filtroSede ?>&estado=contactada" class="pill-btn <?= $filtroEstado === 'contactada' ? 'active' : '' ?>">Contactadas</a>
                <a href="?sede=<?= $filtroSede ?>&estado=seleccionada" class="pill-btn <?= $filtroEstado === 'seleccionada' ? 'active' : '' ?>">Seleccionadas</a>
            </div>

            <form class="search-form" method="GET">
                <input type="hidden" name="sede" value="<?= htmlspecialchars($filtroSede) ?>">
                <input type="hidden" name="estado" value="<?= htmlspecialchars($filtroEstado) ?>">
                <input type="text" name="q" class="search-input" placeholder="Buscar por nombre, email..." value="<?= htmlspecialchars($busqueda) ?>">
                <button type="submit" class="search-btn">🔍</button>
            </form>
        </div>

        <!-- Tabla de Postulantes -->
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fotos</th>
                        <th>Sede</th>
                        <th>Postulante</th>
                        <th>Edad / Altura</th>
                        <th>Ciudad</th>
                        <th>WhatsApp</th>
                        <th>Instagram</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($postulantes)): ?>
                        <tr>
                            <td colspan="9" style="text-align: center; padding: 40px; color: #888;">
                                No se encontraron postulaciones con los filtros seleccionados.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($postulantes as $p): 
                            $cleanPhone = preg_replace('/[^0-9]/', '', $p['telefono_whatsapp']);
                            if (strlen($cleanPhone) === 9 && strpos($cleanPhone, '9') === 0) {
                                $cleanPhone = '56' . $cleanPhone;
                            }
                            $msgWa = urlencode("¡Hola " . $p['nombres'] . "! Te saludamos desde la Dirección Oficial de Miss Universe " . ucfirst($p['sede']) . " 2027. Revisamos tu postulación al certamen y nos gustaría coordinar contigo los próximos pasos.");
                            $waUrl = "https://wa.me/{$cleanPhone}?text={$msgWa}";
                        ?>
                        <tr id="row-<?= $p['id'] ?>">
                            <td>
                                <div style="display: flex; gap: 6px;">
                                    <?php if ($p['foto_rostro']): ?>
                                        <img src="/<?= htmlspecialchars($p['foto_rostro']) ?>" class="thumb-img" title="Foto Rostro" onclick="showModalPhoto('/<?= htmlspecialchars($p['foto_rostro']) ?>', '<?= htmlspecialchars($p['nombres'] . ' ' . $p['apellidos']) ?> (Rostro)')">
                                    <?php endif; ?>
                                    <?php if ($p['foto_cuerpo']): ?>
                                        <img src="/<?= htmlspecialchars($p['foto_cuerpo']) ?>" class="thumb-img" title="Foto Cuerpo" onclick="showModalPhoto('/<?= htmlspecialchars($p['foto_cuerpo']) ?>', '<?= htmlspecialchars($p['nombres'] . ' ' . $p['apellidos']) ?> (Cuerpo Completo)')">
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <span class="badge-sede sede-<?= $p['sede'] ?>"><?= strtoupper($p['sede']) ?></span>
                            </td>
                            <td>
                                <div style="font-weight: 800; color: #fff; font-size: 0.95rem;"><?= htmlspecialchars($p['nombres'] . ' ' . $p['apellidos']) ?></div>
                                <div style="font-size: 0.75rem; color: #777; margin-top: 2px;"><?= htmlspecialchars($p['email']) ?></div>
                            </td>
                            <td>
                                <div><strong><?= $p['edad'] ?> años</strong></div>
                                <div style="font-size: 0.8rem; color: #aaa;"><?= $p['estatura_cm'] ? $p['estatura_cm'] . ' cm' : 'S/I' ?></div>
                            </td>
                            <td>
                                <div style="color: #bbb;"><?= htmlspecialchars($p['comuna'] ?: ucfirst($p['sede'])) ?></div>
                                <div style="font-size: 0.75rem; color: #777;"><?= htmlspecialchars($p['ocupacion'] ?: 'S/I') ?></div>
                            </td>
                            <td>
                                <a href="<?= $waUrl ?>" target="_blank" class="btn-wa">
                                    <span>💬</span> Contactar
                                </a>
                            </td>
                            <td>
                                <?php if (!empty($p['instagram'])): 
                                    $igHandle = ltrim($p['instagram'], '@');
                                ?>
                                    <a href="https://instagram.com/<?= htmlspecialchars($igHandle) ?>" target="_blank" style="color: #ff8fab; text-decoration: none; font-size: 0.85rem; font-weight: 700;">
                                        @<?= htmlspecialchars($igHandle) ?>
                                    </a>
                                <?php else: ?>
                                    <span style="color: #666; font-size: 0.8rem;">-</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <select class="status-select" onchange="updateStatus(<?= $p['id'] ?>, this.value)">
                                    <option value="pendiente" <?= $p['estado'] === 'pendiente' ? 'selected' : '' ?>>⏳ Pendiente</option>
                                    <option value="contactada" <?= $p['estado'] === 'contactada' ? 'selected' : '' ?>>💬 Contactada</option>
                                    <option value="seleccionada" <?= $p['estado'] === 'seleccionada' ? 'selected' : '' ?>>👑 Seleccionada</option>
                                    <option value="descartada" <?= $p['estado'] === 'descartada' ? 'selected' : '' ?>>❌ Descartada</option>
                                </select>
                            </td>
                            <td>
                                <button onclick="deletePostulante(<?= $p['id'] ?>)" style="background: none; border: none; color: #666; cursor: pointer; font-size: 1rem;" title="Eliminar">🗑️</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>

    <!-- Modal para Fotos Ampliadas -->
    <div class="modal" id="photoModal" onclick="this.style.display='none'">
        <div class="modal-content" onclick="event.stopPropagation()" style="text-align: center;">
            <span class="modal-close" onclick="document.getElementById('photoModal').style.display='none'">&times;</span>
            <h3 id="modalPhotoTitle" style="margin-bottom: 20px; font-size: 1.1rem; text-transform: uppercase;"></h3>
            <img id="modalPhotoImg" src="" style="max-width: 100%; max-height: 70vh; border-radius: 10px; border: 1px solid var(--border);">
        </div>
    </div>

    <script>
        function showModalPhoto(src, title) {
            document.getElementById('modalPhotoImg').src = src;
            document.getElementById('modalPhotoTitle').innerText = title;
            document.getElementById('photoModal').style.display = 'flex';
        }

        async function updateStatus(id, estado) {
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('id', id);
            formData.append('estado', estado);
            try {
                await fetch('index.php', { method: 'POST', body: formData });
            } catch (err) {
                alert('No se pudo actualizar el estado');
            }
        }

        async function deletePostulante(id) {
            if (!confirm('¿Seguro que deseas eliminar esta postulación?')) return;
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', id);
            try {
                const res = await fetch('index.php', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.status === 'ok') {
                    document.getElementById('row-' + id).remove();
                }
            } catch (err) {
                alert('Error al eliminar');
            }
        }
    </script>
</body>
</html>
