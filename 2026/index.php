<?php
/**
 * MISS UNIVERSO · SALÓN DEL LEGADO 2026
 * Vistas:
 * 1. Salón General (/2026/)
 * 2. Perfil Editorial Oficial (/2026/usuario)
 * 3. Linktree Oficial Miss Universo (/2026/#usuario o /2026/usuario?view=linktree)
 */
require_once __DIR__ . '/../config/db.php';

// Detectar sede
$host = $_SERVER['HTTP_HOST'] ?? '';
$sede = (strpos($host, 'iquique') !== false) ? 'iquique' : 'arica';
if (isset($_GET['sede']) && in_array(strtolower($_GET['sede']), ['arica', 'iquique'])) {
    $sede = strtolower($_GET['sede']);
}

$sedeTitle = $sede === 'arica' ? 'Arica' : 'Iquique';
$sedeColor = $sede === 'arica' ? '#f5245f' : '#b930d5';
$sedeAccent = $sede === 'arica' ? '#e2a93b' : '#38bdf8';
$instDomain = "2026.missuniverso{$sede}.cl";
$baseUrl = "https://missuniverso{$sede}.cl";

// Usuario solicitado por URL limpia
$requestedUser = trim($_GET['user'] ?? '');
// Ignorar si piden nombres de archivos
if (in_array($requestedUser, ['index', 'index.php', 'api', 'api.php', 'editar', 'editar.php'])) {
    $requestedUser = '';
}

// Obtener candidata si hay usuario solicitado
$candidate = null;
if (!empty($requestedUser)) {
    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE sede = ? AND username = ? LIMIT 1");
    $stmt->execute([$sede, $requestedUser]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Forzar vista linktree si viene por GET o hash
$viewMode = $_GET['view'] ?? '';
$isLinktreeView = ($viewMode === 'linktree') || (!empty($candidate) && !$candidate['mode_editorial'] && $candidate['mode_linktree']);

// Obtener todas las candidatas para el Salón General o para el selector interactivo
$stmtAll = $pdo->prepare("SELECT id, username, full_name, title_badge, photo_main, occupation, inst_email, mode_editorial, mode_linktree, is_minimal_record FROM legado_2026 WHERE sede = ? ORDER BY id ASC");
$stmtAll->execute([$sede]);
$allCandidates = $stmtAll->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title><?= $candidate ? htmlspecialchars($candidate['full_name']) . " · Embajadora 2026 · Miss Universo {$sedeTitle}" : "Salón del Legado 2026 · Miss Universo {$sedeTitle}" ?></title>
    
    <meta name="description" content="<?= $candidate ? htmlspecialchars($candidate['bio'] ?? "Perfil oficial de {$candidate['full_name']}, Embajadora de Miss Universo {$sedeTitle} 2026.") : "Conoce a las mujeres que forjaron la historia en Miss Universo {$sedeTitle} 2026. Perfiles y bio-links oficiales." ?>">
    <meta name="theme-color" content="#020822">
    
    <?php if ($candidate && !empty($candidate['photo_main'])): ?>
    <meta property="og:image" content="<?= htmlspecialchars($candidate['photo_main']) ?>">
    <meta property="og:title" content="<?= htmlspecialchars($candidate['full_name']) ?> · Miss Universo <?= $sedeTitle ?> 2026">
    <meta property="og:description" content="<?= htmlspecialchars($candidate['occupation'] ?? 'Embajadora Oficial 2026') ?>">
    <?php endif; ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Italianno&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-deep: #010820;
            --bg-card: rgba(4, 16, 48, 0.75);
            --border-glass: rgba(138, 180, 248, 0.22);
            --border-gold: rgba(234, 179, 8, 0.45);
            --gold: #f7d070;
            --gold-glow: #eab308;
            --accent: <?= $sedeColor ?>;
            --accent-sub: <?= $sedeAccent ?>;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
        }

        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: var(--bg-deep) radial-gradient(circle at 50% 10%, #061e54 0%, #010820 60%);
            color: var(--text-main);
            font-family: 'Manrope', -apple-system, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* Glassmorphism utility */
        .glass {
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-glass);
            border-radius: 18px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.03);
        }

        /* Top Navigation Header */
        header.legado-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 14px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(1, 8, 32, 0.88);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: #fff;
        }
        .brand-pill img { height: 32px; width: auto; }
        .brand-pill span {
            font-family: 'Cormorant Garamond', serif;
            font-size: 19px;
            letter-spacing: 2px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .brand-pill span b { color: var(--gold); }
        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .btn-nav {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 99px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            transition: all 0.3s ease;
        }
        .btn-nav:hover {
            border-color: var(--gold);
            box-shadow: 0 0 15px rgba(234, 179, 8, 0.3);
            color: var(--gold);
        }
        .btn-nav.active-edition {
            background: linear-gradient(135deg, var(--accent), #1554ff);
            border-color: transparent;
            box-shadow: 0 0 15px rgba(245, 36, 95, 0.4);
        }

        /* ==============================================================
           1. VISTA: LINKTREE OFICIAL MISS UNIVERSO (BIO-LINK)
           ============================================================== */
        .linktree-container {
            max-width: 480px;
            margin: 30px auto 60px;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
        }
        .linktree-card {
            width: 100%;
            padding: 34px 22px 28px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1.5px solid var(--border-gold);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(234, 179, 8, 0.15);
        }
        .avatar-wrap {
            position: relative;
            width: 130px;
            height: 130px;
            margin-bottom: 16px;
        }
        .avatar-glow {
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold), var(--accent));
            opacity: 0.85;
            filter: blur(8px);
            animation: pulseGlow 4s ease-in-out infinite alternate;
        }
        @keyframes pulseGlow {
            0% { transform: scale(0.98); opacity: 0.6; }
            100% { transform: scale(1.05); opacity: 0.95; }
        }
        .avatar-img {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #fff;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
        }
        .verified-crown {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f7d070, #ca8a04);
            color: #000;
            display: grid;
            place-items: center;
            font-size: 17px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            border: 2px solid #020822;
        }

        .cand-name-linktree {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            line-height: 1.15;
            font-weight: 700;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .verified-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #38bdf8;
            color: #020822;
            font-size: 11px;
            font-weight: 900;
        }
        .cand-role-tag {
            font-size: 10.5px;
            font-weight: 800;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 8px;
        }
        .cand-occupation {
            font-size: 13px;
            color: #cbd5e1;
            margin-bottom: 20px;
            max-width: 90%;
        }

        /* Botón de Correo Institucional */
        .inst-email-box {
            width: 100%;
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 36, 95, 0.15));
            border: 1px solid rgba(234, 179, 8, 0.4);
            border-radius: 14px;
            padding: 12px 14px;
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            text-align: left;
        }
        .inst-email-info small {
            display: block;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--gold);
        }
        .inst-email-info span {
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            word-break: break-all;
        }
        .btn-copy-email {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 6px 11px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .btn-copy-email:hover {
            background: var(--gold);
            color: #000;
        }

        /* Lista de Botones del Linktree */
        .linktree-buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }
        .link-button {
            width: 100%;
            min-height: 52px;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            text-decoration: none;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.3px;
            transition: all 0.25s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .link-button:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.12);
            border-color: var(--gold);
            box-shadow: 0 8px 25px rgba(234, 179, 8, 0.25);
            color: var(--gold);
        }
        .link-button-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .link-icon {
            font-size: 20px;
            width: 24px;
            text-align: center;
        }
        .link-arrow {
            font-size: 14px;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        .link-button:hover .link-arrow { opacity: 1; transform: translateX(3px); }

        /* Botón Destacado: Ver Historia / Perfil Editorial */
        .btn-switch-editorial {
            width: 100%;
            margin-top: 8px;
            padding: 14px;
            border-radius: 14px;
            background: linear-gradient(135deg, var(--gold), #ca8a04);
            color: #020822;
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 8px 25px rgba(234, 179, 8, 0.4);
            transition: all 0.3s;
        }
        .btn-switch-editorial:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
            box-shadow: 0 12px 30px rgba(234, 179, 8, 0.6);
        }

        /* ==============================================================
           2. VISTA: PERFIL EDITORIAL OFICIAL (/2026/usuario)
           ============================================================== */
        .editorial-container {
            max-width: 1100px;
            margin: 40px auto 80px;
            padding: 0 5%;
        }
        .editorial-hero {
            position: relative;
            min-height: 520px;
            border-radius: 24px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1.1fr 1fr;
            align-items: center;
            gap: 30px;
            padding: 50px 45px;
            margin-bottom: 40px;
            background: linear-gradient(135deg, rgba(6, 30, 84, 0.8), rgba(2, 8, 34, 0.95));
            border: 1px solid var(--border-gold);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
        }
        .editorial-copy h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(38px, 5vw, 56px);
            font-weight: 300;
            line-height: 1.1;
            margin-bottom: 12px;
        }
        .editorial-copy h1 b {
            display: block;
            font-weight: 700;
            color: var(--gold);
        }
        .badge-edition {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 6px 14px;
            border-radius: 99px;
            background: rgba(234, 179, 8, 0.15);
            border: 1px solid var(--border-gold);
            color: var(--gold);
            margin-bottom: 18px;
        }
        .editorial-bio {
            font-size: 15px;
            color: #cbd5e1;
            line-height: 1.8;
            margin-bottom: 24px;
            max-width: 520px;
        }
        .editorial-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
        }
        .btn-gold {
            background: linear-gradient(135deg, var(--gold), #ca8a04);
            color: #020822;
            padding: 12px 26px;
            border-radius: 99px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 25px rgba(234, 179, 8, 0.35);
            transition: all 0.3s;
        }
        .btn-gold:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(234, 179, 8, 0.55);
        }
        .btn-outline-glass {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 12px 24px;
            border-radius: 99px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }
        .btn-outline-glass:hover {
            border-color: var(--gold);
            color: var(--gold);
            background: rgba(255, 255, 255, 0.12);
        }

        .editorial-portrait {
            position: relative;
            height: 100%;
            min-height: 440px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .editorial-img {
            max-height: 480px;
            width: 100%;
            object-fit: cover;
            border-radius: 18px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
        }

        /* Galería conmemorativa */
        .editorial-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .gallery-item {
            position: relative;
            aspect-ratio: 4/5;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: #020822;
            cursor: pointer;
        }
        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }
        .gallery-item:hover img {
            transform: scale(1.06);
        }

        /* ==============================================================
           3. VISTA: SALÓN GENERAL DEL LEGADO 2026 (/2026/)
           ============================================================== */
        .salon-container {
            max-width: 1280px;
            margin: 40px auto 80px;
            padding: 0 4%;
        }
        .salon-hero {
            text-align: center;
            padding: 50px 20px 40px;
            margin-bottom: 40px;
            position: relative;
        }
        .salon-hero h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(36px, 6vw, 68px);
            font-weight: 300;
            line-height: 1.1;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .salon-hero h1 b {
            font-weight: 700;
            color: var(--gold);
        }
        .salon-subtitle {
            font-size: 13px;
            letter-spacing: 4px;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 800;
            margin-bottom: 18px;
        }
        .salon-desc {
            max-width: 680px;
            margin: 0 auto;
            color: #cbd5e1;
            font-size: 15px;
            line-height: 1.8;
        }

        /* Grilla de Candidatas */
        .candidates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
            gap: 24px;
        }
        .cand-card {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.35s ease, box-shadow 0.35s ease;
            background: var(--bg-card);
            border: 1px solid var(--border-glass);
            display: flex;
            flex-direction: column;
        }
        .cand-card:hover {
            transform: translateY(-6px);
            border-color: var(--border-gold);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(234, 179, 8, 0.2);
        }
        .cand-card-photo-wrap {
            position: relative;
            width: 100%;
            aspect-ratio: 4/5;
            overflow: hidden;
            background: #020822;
        }
        .cand-card-photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .cand-card:hover .cand-card-photo {
            transform: scale(1.05);
        }
        .cand-card-badge {
            position: absolute;
            top: 14px;
            left: 14px;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            background: rgba(1, 8, 32, 0.85);
            backdrop-filter: blur(8px);
            color: var(--gold);
            border: 1px solid var(--border-gold);
        }
        .cand-card-body {
            padding: 20px 18px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .cand-card-body h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 4px;
        }
        .cand-card-body p {
            font-size: 12px;
            color: #94a3b8;
            margin-bottom: 16px;
            flex-grow: 1;
        }
        .cand-card-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: auto;
        }
        .btn-card-action {
            padding: 8px 10px;
            border-radius: 10px;
            font-size: 10.5px;
            font-weight: 800;
            text-align: center;
            text-decoration: none;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            transition: all 0.2s;
        }
        .btn-card-editorial {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
        }
        .btn-card-editorial:hover {
            background: var(--gold);
            color: #000;
            border-color: var(--gold);
        }
        .btn-card-linktree {
            background: linear-gradient(135deg, rgba(245, 36, 95, 0.2), rgba(185, 48, 213, 0.2));
            border: 1px solid var(--accent);
            color: #fff;
        }
        .btn-card-linktree:hover {
            background: var(--accent);
            color: #fff;
            box-shadow: 0 0 15px rgba(245, 36, 95, 0.5);
        }

        /* Modal Linktree Interactivo */
        #linktreeModal {
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        }
        #linktreeModal.is-open { display: flex; }
        .modal-close-btn {
            position: absolute;
            top: 20px;
            right: 25px;
            background: none;
            border: none;
            color: #fff;
            font-size: 32px;
            cursor: pointer;
            z-index: 1010;
        }

        /* Footer */
        footer.legado-footer {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding: 40px 5%;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        footer.legado-footer a {
            color: var(--gold);
            text-decoration: none;
        }

        @media (max-width: 768px) {
            .editorial-hero {
                grid-template-columns: 1fr;
                padding: 30px 20px;
                text-align: center;
            }
            .editorial-bio { margin-left: auto; margin-right: auto; }
            .editorial-actions { justify-content: center; }
            .candidates-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
            .cand-card-body h3 { font-size: 19px; }
            .cand-card-actions { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Cabecera Oficial -->
    <header class="legado-header">
        <a href="/2026/" class="brand-pill">
            <span style="font-size:26px;">👑</span>
            <span>Miss Universo <b><?= $sedeTitle ?></b></span>
        </a>
        <div class="header-actions">
            <a href="/2026/" class="btn-nav">Salón 2026</a>
            <a href="/#casting" class="btn-nav active-edition">Casting 2027 →</a>
        </div>
    </header>

    <?php if ($candidate && $isLinktreeView): ?>
    <!-- ==============================================================
         VISTA 1: LINKTREE OFICIAL MISS UNIVERSO (BIO-LINK)
         ============================================================== -->
    <main class="linktree-container">
        <div class="glass linktree-card">
            
            <!-- Avatar con Aura Neón -->
            <div class="avatar-wrap">
                <div class="avatar-glow"></div>
                <img src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" class="avatar-img">
                <div class="verified-crown" title="Embajadora Oficial Miss Universo">👑</div>
            </div>

            <!-- Nombre con Tilde de Verificación -->
            <h1 class="cand-name-linktree">
                <?= htmlspecialchars($candidate['full_name']) ?>
                <span class="verified-badge" title="Cuenta Oficial Verificada">✓</span>
            </h1>

            <!-- Insignia y Ocupación -->
            <div class="cand-role-tag"><?= htmlspecialchars($candidate['title_badge'] ?? 'Embajadora Oficial 2026') ?></div>
            <p class="cand-occupation"><?= htmlspecialchars($candidate['occupation'] ?? 'Modelo & Figura Pública') ?></p>

            <!-- Correo Institucional -->
            <?php if (!empty($candidate['inst_email'])): ?>
            <div class="inst-email-box">
                <div class="inst-email-info">
                    <small>📩 Correo Oficial Miss Universo</small>
                    <span><?= htmlspecialchars($candidate['inst_email']) ?></span>
                </div>
                <button type="button" class="btn-copy-email" onclick="copyText('<?= htmlspecialchars($candidate['inst_email']) ?>', this);">Copiar</button>
            </div>
            <?php endif; ?>

            <!-- Botones de Enlaces del Linktree -->
            <div class="linktree-buttons">
                <?php 
                $links = !empty($candidate['custom_links']) ? json_decode($candidate['custom_links'], true) : [];
                if (!empty($links) && is_array($links)):
                    foreach ($links as $lnk):
                        $title = htmlspecialchars($lnk['title'] ?? 'Enlace');
                        $url = htmlspecialchars($lnk['url'] ?? '#');
                        $icon = $lnk['icon'] ?? 'link';
                        $iconMap = [
                            'instagram' => '📷',
                            'tiktok' => '🎵',
                            'whatsapp' => '💬',
                            'shop' => '🛍️',
                            'portfolio' => '📄',
                            'web' => '🌐'
                        ];
                        $iconEmoji = $iconMap[$icon] ?? '🔗';
                ?>
                <a href="<?= $url ?>" target="_blank" rel="noopener noreferrer" class="link-button">
                    <div class="link-button-content">
                        <span class="link-icon"><?= $iconEmoji ?></span>
                        <span><?= $title ?></span>
                    </div>
                    <span class="link-arrow">↗</span>
                </a>
                <?php 
                    endforeach;
                endif; 
                ?>

                <!-- Botón Contacto WhatsApp si existe -->
                <?php if (!empty($candidate['whatsapp'])): ?>
                <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $candidate['whatsapp']) ?>?text=Hola%20<?= urlencode($candidate['full_name']) ?>%2C%20te%20contacto%20desde%20tu%20perfil%20oficial%20de%20Miss%20Universo" target="_blank" rel="noopener noreferrer" class="link-button" style="border-color:#10b981; background:rgba(16,185,129,0.1);">
                    <div class="link-button-content">
                        <span class="link-icon">💬</span>
                        <span>WhatsApp Directo (Bookings / Marcas)</span>
                    </div>
                    <span class="link-arrow">↗</span>
                </a>
                <?php endif; ?>
            </div>

            <!-- Botón Conmutador a Perfil Editorial -->
            <?php if (!empty($candidate['mode_editorial'])): ?>
            <a href="/2026/<?= urlencode($candidate['username']) ?>" class="btn-switch-editorial">
                <span>👑</span>
                <span>Ver Portafolio & Perfil Editorial</span>
                <span>→</span>
            </a>
            <?php endif; ?>

            <!-- Botón Compartir Bio -->
            <button type="button" onclick="shareProfile('<?= htmlspecialchars($candidate['full_name']) ?>', window.location.href);" style="margin-top:20px; background:none; border:none; color:#94a3b8; font-size:12px; cursor:pointer; text-decoration:underline;">
                🔗 Compartir mi Linktree Oficial
            </button>

        </div>
    </main>

    <?php elseif ($candidate): ?>
    <!-- ==============================================================
         VISTA 2: PERFIL EDITORIAL OFICIAL (/2026/usuario)
         ============================================================== -->
    <main class="editorial-container">
        <div class="editorial-hero">
            <div class="editorial-copy">
                <div class="badge-edition">
                    <span>👑</span>
                    <span><?= htmlspecialchars($candidate['title_badge'] ?? 'Candidata Oficial') ?> · 2026</span>
                </div>
                <h1>
                    <?= htmlspecialchars($candidate['full_name']) ?>
                    <b>Miss Universo <?= $sedeTitle ?></b>
                </h1>
                <p class="editorial-bio">
                    <?= nl2br(htmlspecialchars($candidate['bio'] ?? '')) ?>
                </p>

                <!-- Correo Institucional -->
                <?php if (!empty($candidate['inst_email'])): ?>
                <div class="inst-email-box" style="max-width:440px; margin-bottom:24px;">
                    <div class="inst-email-info">
                        <small>📩 Correo Oficial Institucional</small>
                        <span><?= htmlspecialchars($candidate['inst_email']) ?></span>
                    </div>
                    <button type="button" class="btn-copy-email" onclick="copyText('<?= htmlspecialchars($candidate['inst_email']) ?>', this);">Copiar</button>
                </div>
                <?php endif; ?>

                <div class="editorial-actions">
                    <!-- Enlace para abrir Linktree -->
                    <?php if (!empty($candidate['mode_linktree'])): ?>
                    <a href="/2026/#<?= urlencode($candidate['username']) ?>" class="btn-gold">
                        <span>📱</span>
                        <span>Ver Linktree Oficial (Bio-Link)</span>
                    </a>
                    <?php endif; ?>

                    <a href="/2026/" class="btn-outline-glass">
                        <span>← Volver al Salón 2026</span>
                    </a>
                </div>
            </div>

            <div class="editorial-portrait">
                <img src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" class="editorial-img">
            </div>
        </div>

        <!-- Galería Conmemorativa -->
        <?php 
        $gallery = !empty($candidate['photos_gallery']) ? json_decode($candidate['photos_gallery'], true) : [];
        if (!empty($gallery) && is_array($gallery)):
        ?>
        <div style="margin-top:50px;">
            <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px; color:var(--gold); margin-bottom:6px;">Portafolio & Galería</h2>
            <p style="color:#94a3b8; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin-bottom:24px;">Momentos oficiales y producciones conmemorativas</p>
            
            <div class="editorial-gallery-grid">
                <?php foreach ($gallery as $imgUrl): ?>
                <div class="gallery-item">
                    <img src="<?= htmlspecialchars($imgUrl) ?>" alt="Producción editorial" loading="lazy">
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </main>

    <?php else: ?>
    <!-- ==============================================================
         VISTA 3: SALÓN DEL LEGADO GENERAL 2026 (/2026/)
         ============================================================== -->
    <main class="salon-container">
        <section class="salon-hero">
            <div class="salon-subtitle">Generación Pionera · Certamen Oficial 2026</div>
            <h1>Salón del <b>Legado</b></h1>
            <p class="salon-desc">
                Honramos a las mujeres que llevaron la banda y la identidad de <b><?= $sedeTitle ?></b> con propósito, talento y distinción. Explora sus portafolios oficiales y accede a sus bio-links verificados.
            </p>
        </section>

        <!-- Grilla de Candidatas -->
        <div class="candidates-grid">
            <?php foreach ($allCandidates as $c): ?>
            <article class="cand-card" data-username="<?= htmlspecialchars($c['username']) ?>">
                <div class="cand-card-photo-wrap">
                    <img src="<?= htmlspecialchars($c['photo_main']) ?>" alt="<?= htmlspecialchars($c['full_name']) ?>" class="cand-card-photo" loading="lazy">
                    <span class="cand-card-badge"><?= htmlspecialchars($c['title_badge'] ?? '2026') ?></span>
                </div>
                <div class="cand-card-body">
                    <h3><?= htmlspecialchars($c['full_name']) ?></h3>
                    <p><?= htmlspecialchars($c['occupation'] ?? "Miss Universo {$sedeTitle} 2026") ?></p>
                    
                    <div class="cand-card-actions">
                        <a href="/2026/<?= urlencode($c['username']) ?>" class="btn-card-action btn-card-editorial">
                            👑 Portafolio
                        </a>
                        <button type="button" onclick="openLinktreeModal('<?= htmlspecialchars($c['username']) ?>');" class="btn-card-action btn-card-linktree">
                            📱 Bio-Link
                        </button>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </main>
    <?php endif; ?>

    <!-- Modal Dinámico de Linktree (para cuando abren /2026/#usuario desde el salón) -->
    <div id="linktreeModal" role="dialog" aria-modal="true">
        <button type="button" class="modal-close-btn" onclick="closeLinktreeModal();">&times;</button>
        <div id="linktreeModalBody" style="width:100%; max-width:460px;"></div>
    </div>

    <!-- Pie de Página -->
    <footer class="legado-footer">
        <p>© 2026 - 2027 Miss Universo <?= $sedeTitle ?> · Franquicia Oficial de Belleza y Liderazgo Regional.</p>
        <p style="margin-top:6px;">
            ¿Eres parte de la Generación 2026? <a href="/2026/editar.php">Ingresa a tu panel de embajadora</a>
        </p>
    </footer>

    <script>
        // Copiar texto al portapapeles
        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = '¡Copiado!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                }, 2000);
            });
        }

        // Compartir Perfil
        function shareProfile(name, url) {
            if (navigator.share) {
                navigator.share({
                    title: name + ' · Miss Universo <?= $sedeTitle ?> 2026',
                    text: 'Conoce el Linktree y perfil oficial de ' + name + ' en Miss Universo <?= $sedeTitle ?> 2026',
                    url: url
                }).catch(() => {});
            } else {
                copyText(url, { textContent: 'Copiar', style: {} });
                alert('Enlace copiado al portapapeles: ' + url);
            }
        }

        // Detección automática de Hash (ej: /2026/#camila)
        window.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.replace('#', '').trim();
            if (hash && hash !== '') {
                openLinktreeModal(hash);
            }
        });

        // Abrir Modal Linktree
        async function openLinktreeModal(username) {
            const modal = document.getElementById('linktreeModal');
            const body = document.getElementById('linktreeModalBody');
            if (!modal || !body) return;

            body.innerHTML = '<div style="text-align:center; padding:50px; color:#f7d070;">Cargando Linktree Oficial...</div>';
            modal.classList.add('is-open');
            window.location.hash = username;

            try {
                const res = await fetch(`/2026/api.php?action=get_linktree&sede=<?= $sede ?>&user=${encodeURIComponent(username)}`);
                const data = await res.json();
                if (data.status === 'success' && data.candidate) {
                    renderLinktreeHtml(data.candidate);
                } else {
                    body.innerHTML = '<div class="glass" style="padding:30px; text-align:center;"><p>Perfil no encontrado o en modo privado.</p><br><a href="/2026/" class="btn-nav">Volver al Salón</a></div>';
                }
            } catch (err) {
                body.innerHTML = '<div class="glass" style="padding:30px; text-align:center;"><p>Error de conexión al cargar perfil.</p></div>';
            }
        }

        function closeLinktreeModal() {
            const modal = document.getElementById('linktreeModal');
            if (modal) modal.classList.remove('is-open');
            history.pushState("", document.title, window.location.pathname);
        }

        function renderLinktreeHtml(c) {
            const body = document.getElementById('linktreeModalBody');
            let linksHtml = '';
            let links = [];
            try { links = typeof c.custom_links === 'string' ? JSON.parse(c.custom_links) : c.custom_links; } catch(e){}
            
            const iconMap = {
                'instagram': '📷',
                'tiktok': '🎵',
                'whatsapp': '💬',
                'shop': '🛍️',
                'portfolio': '📄',
                'web': '🌐'
            };

            if (links && Array.isArray(links)) {
                links.forEach(l => {
                    const iconEmoji = iconMap[l.icon] || '🔗';
                    linksHtml += `
                        <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="link-button">
                            <div class="link-button-content">
                                <span class="link-icon">${iconEmoji}</span>
                                <span>${l.title}</span>
                            </div>
                            <span class="link-arrow">↗</span>
                        </a>
                    `;
                });
            }

            body.innerHTML = `
                <div class="glass linktree-card">
                    <div class="avatar-wrap">
                        <div class="avatar-glow"></div>
                        <img src="${c.photo_main}" alt="${c.full_name}" class="avatar-img">
                        <div class="verified-crown">👑</div>
                    </div>

                    <h2 class="cand-name-linktree">
                        ${c.full_name}
                        <span class="verified-badge">✓</span>
                    </h2>

                    <div class="cand-role-tag">${c.title_badge || 'Embajadora Oficial 2026'}</div>
                    <p class="cand-occupation">${c.occupation || 'Modelo & Figura Pública'}</p>

                    ${c.inst_email ? `
                    <div class="inst-email-box">
                        <div class="inst-email-info">
                            <small>📩 Correo Oficial Miss Universo</small>
                            <span>${c.inst_email}</span>
                        </div>
                        <button type="button" class="btn-copy-email" onclick="copyText('${c.inst_email}', this);">Copiar</button>
                    </div>
                    ` : ''}

                    <div class="linktree-buttons">
                        ${linksHtml}
                    </div>

                    ${c.mode_editorial ? `
                    <a href="/2026/${encodeURIComponent(c.username)}" class="btn-switch-editorial">
                        <span>👑</span>
                        <span>Ver Portafolio & Perfil Editorial</span>
                        <span>→</span>
                    </a>
                    ` : ''}

                    <button type="button" onclick="shareProfile('${c.full_name}', window.location.origin + '/2026/#' + c.username);" style="margin-top:16px; background:none; border:none; color:#94a3b8; font-size:12px; cursor:pointer; text-decoration:underline;">
                        🔗 Compartir mi Linktree Oficial
                    </button>
                </div>
            `;
        }
    </script>
</body>
</html>
