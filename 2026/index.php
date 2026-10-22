<?php
/**
 * MISS UNIVERSO · SALÓN OFICIAL DEL LEGADO 2026
 * Experiencia Visual de Alta Costura, Identidad Digital y Bio-Links Oficiales
 * Vistas:
 * 1. Salón General (/2026/) con filtro Arica / Iquique y buscador interactivo.
 * 2. Perfil Editorial de Alta Costura (/2026/usuario).
 * 3. VIP Bio-Link Linktree (/2026/#usuario o ?view=linktree).
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
if (in_array($requestedUser, ['index', 'index.php', 'api', 'api.php', 'editar', 'editar.php'])) {
    $requestedUser = '';
}

// Obtener candidata si hay usuario solicitado
$candidate = null;
if (!empty($requestedUser)) {
    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE sede = ? AND username = ? LIMIT 1");
    $stmt->execute([$sede, $requestedUser]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$candidate) {
        // Fallback entre sedes si compartieron el enlace cruzado
        $stmt2 = $pdo->prepare("SELECT * FROM legado_2026 WHERE username = ? LIMIT 1");
        $stmt2->execute([$requestedUser]);
        $candidate = $stmt2->fetch(PDO::FETCH_ASSOC);
    }
}

// Modo vista linktree si viene por GET o si la candidata solo activó linktree
$viewMode = $_GET['view'] ?? '';
$isLinktreeView = ($viewMode === 'linktree') || (!empty($candidate) && !$candidate['mode_editorial'] && $candidate['mode_linktree']);

// Obtener todas las candidatas de la sede y conteos
$stmtAll = $pdo->prepare("SELECT id, sede, username, full_name, title_badge, photo_main, photos_gallery, occupation, bio, inst_email, custom_links, mode_editorial, mode_linktree, is_minimal_record FROM legado_2026 WHERE sede = ? ORDER BY id ASC");
$stmtAll->execute([$sede]);
$allCandidates = $stmtAll->fetchAll(PDO::FETCH_ASSOC);

// Conteos
$countArica = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'arica'")->fetchColumn();
$countIquique = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'iquique'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title><?= $candidate ? htmlspecialchars($candidate['full_name']) . " · Salón del Legado 2026 · Miss Universo {$sedeTitle}" : "Salón del Legado 2026 · Miss Universo {$sedeTitle}" ?></title>
    
    <meta name="description" content="<?= $candidate ? htmlspecialchars($candidate['bio'] ?? "Perfil oficial de {$candidate['full_name']}, Embajadora de Miss Universo {$sedeTitle} 2026.") : "Descubre a las mujeres que forjaron la historia en Miss Universo {$sedeTitle} 2026. Portafolios editoriales y Bio-Links oficiales." ?>">
    <meta name="theme-color" content="#010820">
    
    <?php if ($candidate && !empty($candidate['photo_main'])): ?>
    <meta property="og:image" content="<?= htmlspecialchars($candidate['photo_main']) ?>">
    <meta property="og:title" content="<?= htmlspecialchars($candidate['full_name']) ?> · Miss Universo <?= $sedeTitle ?> 2026">
    <meta property="og:description" content="<?= htmlspecialchars($candidate['occupation'] ?? 'Embajadora Oficial 2026') ?>">
    <?php endif; ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Italianno&family=Manrope:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-deep: #010820;
            --bg-card: rgba(4, 16, 48, 0.78);
            --border-glass: rgba(138, 180, 248, 0.22);
            --border-gold: rgba(234, 179, 8, 0.55);
            --gold: #f7d070;
            --gold-glow: #eab308;
            --gold-metallic: linear-gradient(135deg, #ffffff 0%, #f7d070 30%, #eab308 70%, #d4af37 100%);
            --accent: <?= $sedeColor ?>;
            --accent-sub: <?= $sedeAccent ?>;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Manrope', -apple-system, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.6;
            position: relative;
        }

        /* Lienzo Cósmico con Partículas y Resplandores */
        #stardustCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
        }

        .cosmic-aurora {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background: 
                radial-gradient(circle at 15% 15%, rgba(245, 36, 95, 0.22) 0%, transparent 45%),
                radial-gradient(circle at 85% 25%, rgba(185, 48, 213, 0.24) 0%, transparent 50%),
                radial-gradient(circle at 50% 65%, rgba(234, 179, 8, 0.14) 0%, transparent 55%),
                radial-gradient(circle at 50% 10%, #061e54 0%, #010820 70%);
            background-attachment: fixed;
        }

        /* Glassmorphism Luxury */
        .glass {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            border-radius: 20px;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), inset 0 0 15px rgba(255, 255, 255, 0.03);
            position: relative;
            z-index: 1;
        }

        /* Barra de Navegación */
        header.legado-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 16px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(1, 8, 32, 0.88);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(234, 179, 8, 0.25);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }
        .brand-pill {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
        }
        .brand-crown {
            font-size: 26px;
            filter: drop-shadow(0 0 10px var(--gold-glow));
        }
        .brand-text {
            display: flex;
            flex-direction: column;
        }
        .brand-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            letter-spacing: 2.5px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.1;
        }
        .brand-sub {
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
            font-weight: 700;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn-header {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 8px 18px;
            border-radius: 99px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn-header:hover {
            border-color: var(--gold);
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.4);
            color: var(--gold);
        }
        .btn-header-active {
            background: linear-gradient(135deg, var(--accent), #eab308);
            border-color: transparent;
            box-shadow: 0 0 20px rgba(245, 36, 95, 0.5);
        }

        /* Hero Banner del Salón */
        .salon-hero {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 65px 20px 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        .hero-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--gold);
            padding: 6px 18px;
            border-radius: 30px;
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid var(--border-gold);
            margin-bottom: 16px;
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
        }
        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(2.6rem, 7vw, 5rem);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            line-height: 1.05;
            margin-bottom: 6px;
            background: var(--gold-metallic);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 35px rgba(234, 179, 8, 0.35));
        }
        .hero-calligraphy {
            font-family: 'Italianno', cursive;
            font-size: clamp(2.4rem, 5vw, 3.8rem);
            color: var(--gold);
            line-height: 1;
            margin-bottom: 18px;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.8));
        }
        .hero-desc {
            font-size: 1.05rem;
            color: #cbd5e1;
            max-width: 650px;
            margin: 0 auto 28px;
            font-weight: 400;
        }

        /* Selector de Sedes y Filtro Interactivo */
        .controls-bar {
            position: relative;
            z-index: 1;
            max-width: 1280px;
            margin: 0 auto 35px;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }
        .sede-switcher {
            display: flex;
            gap: 10px;
            background: rgba(255, 255, 255, 0.04);
            padding: 6px;
            border-radius: 50px;
            border: 1px solid var(--border-glass);
        }
        .sede-btn {
            padding: 8px 22px;
            border-radius: 40px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            text-decoration: none;
            color: #94a3b8;
            transition: all 0.3s ease;
        }
        .sede-btn.active {
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            box-shadow: 0 0 20px rgba(245, 36, 95, 0.5);
        }
        .sede-btn:hover:not(.active) {
            color: #fff;
            background: rgba(255, 255, 255, 0.08);
        }

        .search-box {
            position: relative;
            flex: 1;
            max-width: 380px;
        }
        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-glass);
            border-radius: 50px;
            padding: 11px 20px 11px 44px;
            color: #fff;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.3s ease;
        }
        .search-input:focus {
            border-color: var(--gold);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 25px rgba(234, 179, 8, 0.3);
        }
        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gold);
            font-size: 16px;
            pointer-events: none;
        }

        /* GRID DE CANDIDATAS (ALTA COSTURA - ASPECT RATIO 3:4) */
        .salon-grid-container {
            position: relative;
            z-index: 1;
            max-width: 1320px;
            margin: 0 auto 80px;
            padding: 0 20px;
        }
        .candidates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 28px;
        }

        /* Tarjeta de Alta Costura */
        .candidate-card {
            position: relative;
            aspect-ratio: 3/4.2;
            border-radius: 22px;
            overflow: hidden;
            border: 1.5px solid var(--border-gold);
            background: #020822;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), inset 0 0 25px rgba(255, 255, 255, 0.03);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            cursor: pointer;
        }
        .candidate-card:hover {
            transform: translateY(-10px) scale(1.02);
            border-color: #ffd700;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(234, 179, 8, 0.4);
        }

        .card-bg-photo {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
        }
        .candidate-card:hover .card-bg-photo {
            transform: scale(1.08);
            filter: brightness(1.06) contrast(1.05);
        }

        /* Velo de Iluminación Gradiente */
        .card-scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to top,
                rgba(1, 8, 32, 0.96) 0%,
                rgba(1, 8, 32, 0.72) 32%,
                rgba(1, 8, 32, 0.2) 60%,
                rgba(1, 8, 32, 0.4) 100%
            );
            pointer-events: none;
        }

        /* Badges Superiores Flotantes */
        .card-top-bar {
            position: absolute;
            top: 14px;
            left: 14px;
            right: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 2;
        }
        .chip-number {
            background: rgba(1, 8, 32, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-gold);
            color: var(--gold);
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 20px;
            letter-spacing: 1px;
        }
        .chip-crown {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, #eab308, #ca8a04);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        }

        /* Contenido Inferior de la Tarjeta */
        .card-body {
            position: relative;
            z-index: 2;
            padding: 22px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .cand-card-tag {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
        }
        .cand-card-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.7rem;
            font-weight: 700;
            color: #fff;
            line-height: 1.15;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }
        .cand-card-occ {
            font-size: 0.82rem;
            color: #cbd5e1;
            font-weight: 400;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* Botones de Acción Rápida en la Tarjeta */
        .card-actions-bar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
        }
        .btn-card-linktree {
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(245, 36, 95, 0.25));
            border: 1px solid var(--border-gold);
            color: #fff;
            padding: 9px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
        }
        .btn-card-linktree:hover {
            background: linear-gradient(135deg, #f5245f, #eab308);
            border-color: #ffd700;
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
            transform: translateY(-2px);
        }

        .btn-card-editorial {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border-glass);
            color: #fff;
            padding: 9px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
        }
        .btn-card-editorial:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #fff;
            color: var(--gold);
            transform: translateY(-2px);
        }

        /* ==============================================================
           2. VISTA EDITORIAL DE ALTA COSTURA (/2026/usuario)
           ============================================================== */
        .editorial-wrapper {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            margin: 40px auto 100px;
            padding: 0 20px;
        }
        .editorial-hero-grid {
            display: grid;
            grid-template-columns: 1fr 1.35fr;
            gap: 40px;
            margin-bottom: 50px;
            align-items: center;
        }
        @media (max-width: 860px) {
            .editorial-hero-grid { grid-template-columns: 1fr; }
        }

        .portrait-frame-box {
            position: relative;
            aspect-ratio: 3/4.2;
            border-radius: 24px;
            overflow: hidden;
            border: 2px solid var(--border-gold);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(234, 179, 8, 0.25);
        }
        .portrait-frame-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .portrait-sash {
            position: absolute;
            top: 25px;
            left: -35px;
            background: linear-gradient(135deg, #eab308, #ca8a04);
            color: #000;
            padding: 8px 45px;
            transform: rotate(-35deg);
            font-weight: 900;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 6px 15px rgba(0,0,0,0.6);
        }

        .editorial-info-box {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .editorial-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--gold);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .editorial-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(2.4rem, 5vw, 3.8rem);
            font-weight: 700;
            line-height: 1.1;
            color: #fff;
        }
        .editorial-script-subtitle {
            font-family: 'Italianno', cursive;
            font-size: 2.8rem;
            color: var(--gold);
            line-height: 1;
            margin-top: -6px;
        }
        .editorial-occ {
            font-size: 1.1rem;
            color: #cbd5e1;
            font-weight: 600;
        }
        .editorial-quote {
            position: relative;
            padding: 20px 24px;
            background: rgba(255, 255, 255, 0.03);
            border-left: 3px solid var(--gold);
            border-radius: 0 16px 16px 0;
            font-style: italic;
            color: #e2e8f0;
            font-size: 1.05rem;
            line-height: 1.7;
        }

        /* Banner de Correo Institucional en Editorial */
        .inst-email-banner {
            background: rgba(234, 179, 8, 0.08);
            border: 1px solid var(--border-gold);
            border-radius: 16px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }
        .inst-email-text small {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--gold);
            font-weight: 800;
            display: block;
        }
        .inst-email-text span {
            font-family: monospace;
            font-size: 0.95rem;
            color: #fff;
            word-break: break-all;
        }
        .btn-copy-gold {
            background: rgba(234, 179, 8, 0.2);
            border: 1px solid var(--border-gold);
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-copy-gold:hover {
            background: var(--gold);
            color: #000;
        }

        /* Galería Editorial */
        .editorial-gallery-section {
            margin-top: 50px;
        }
        .section-headline {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.2rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 24px;
            text-align: center;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .section-headline span { color: var(--gold); }

        .editorial-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
        }
        .gallery-photo-card {
            position: relative;
            aspect-ratio: 4/5;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border-glass);
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            transition: all 0.3s ease;
        }
        .gallery-photo-card:hover {
            transform: scale(1.04);
            border-color: var(--gold);
            box-shadow: 0 15px 40px rgba(234, 179, 8, 0.35);
        }
        .gallery-photo-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* ==============================================================
           3. MODAL Y VISTA VIP LINKTREE (/2026/#usuario)
           ============================================================== */
        #linktreeModal {
            position: fixed;
            inset: 0;
            background: rgba(1, 8, 32, 0.88);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
        }
        #linktreeModal.is-open {
            display: flex;
            animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
        }

        .modal-close-btn {
            position: fixed;
            top: 24px;
            right: 28px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1010;
            transition: all 0.2s;
        }
        .modal-close-btn:hover {
            background: var(--accent);
            transform: rotate(90deg);
        }

        /* Tarjeta VIP Linktree */
        .vip-linktree-card {
            width: 100%;
            max-width: 440px;
            background: rgba(4, 16, 48, 0.9);
            border: 1.5px solid var(--border-gold);
            border-radius: 28px;
            padding: 38px 24px 30px;
            box-shadow: 0 25px 65px rgba(0, 0, 0, 0.95), 0 0 40px rgba(234, 179, 8, 0.3);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        .avatar-glow-wrap {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 18px;
        }
        .avatar-ring-glow {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: conic-gradient(from 180deg at 50% 50%, #f5245f 0deg, #eab308 180deg, #f5245f 360deg);
            filter: blur(10px);
            opacity: 0.8;
            animation: ringRotate 8s linear infinite;
        }
        @keyframes ringRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .avatar-core-img {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #ffd700;
            box-shadow: 0 0 25px rgba(234, 179, 8, 0.5);
        }
        .avatar-crown-floating {
            position: absolute;
            top: -12px;
            right: -6px;
            background: linear-gradient(135deg, #eab308, #ca8a04);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            animation: crownBounce 3s ease-in-out infinite;
        }
        @keyframes crownBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }

        .vip-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.95rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .verified-star {
            color: #38bdf8;
            font-size: 16px;
        }
        .vip-tag {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 4px;
        }
        .vip-occ {
            font-size: 0.85rem;
            color: #cbd5e1;
            margin-bottom: 18px;
        }

        /* Lista de Enlaces en Linktree */
        .vip-links-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
        }
        .vip-link-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-glass);
            border-radius: 14px;
            padding: 14px 18px;
            color: #fff;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.25s ease;
        }
        .vip-link-btn:hover {
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(245, 36, 95, 0.25));
            border-color: var(--gold);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(234, 179, 8, 0.25);
        }

        .btn-open-editorial-switch {
            width: 100%;
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            text-decoration: none;
            padding: 13px 20px;
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 10px 25px rgba(245, 36, 95, 0.4);
            transition: transform 0.2s;
        }
        .btn-open-editorial-switch:hover {
            transform: scale(1.02);
        }

        /* Footer */
        footer.legado-footer {
            position: relative;
            z-index: 1;
            padding: 50px 20px 80px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(1, 8, 32, 0.95);
            font-size: 0.85rem;
            color: #64748b;
        }
        footer.legado-footer a {
            color: var(--gold);
            text-decoration: none;
            font-weight: 700;
        }
    </style>
</head>
<body>

    <!-- Fondo Cósmico y Lienzo de Partículas -->
    <div class="cosmic-aurora"></div>
    <canvas id="stardustCanvas"></canvas>

    <!-- Navegación Superior -->
    <header class="legado-header">
        <a href="/2026/?sede=<?= $sede ?>" class="brand-pill">
            <span class="brand-crown">👑</span>
            <div class="brand-text">
                <span class="brand-title">Miss Universe <b><?= $sedeTitle ?></b></span>
                <span class="brand-sub">✧ Salón del Legado 2026 ✧</span>
            </div>
        </a>

        <div class="header-actions">
            <?php if ($candidate): ?>
                <a href="/2026/?sede=<?= $sede ?>" class="btn-header">← Salón General</a>
            <?php else: ?>
                <a href="/2027/" class="btn-header">Edición 2027 ↗</a>
            <?php endif; ?>
            <a href="/2026/editar.php" class="btn-header btn-header-active">Acceso Embajadoras</a>
        </div>
    </header>

    <?php if ($candidate && !$isLinktreeView): ?>
    <!-- ==============================================================
         VISTA 1: PERFIL EDITORIAL DE ALTA COSTURA (/2026/usuario)
         ============================================================== -->
    <main class="editorial-wrapper">
        <div class="glass editorial-hero-grid" style="padding: 35px;">
            <div class="portrait-frame-box">
                <img src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>">
                <div class="portrait-sash">MISSU 2026</div>
            </div>

            <div class="editorial-info-box">
                <div class="editorial-badge">
                    <span>👑</span>
                    <span><?= htmlspecialchars($candidate['title_badge'] ?? 'Embajadora Oficial 2026') ?> · Miss Universo <?= $sedeTitle ?></span>
                </div>

                <h1 class="editorial-name"><?= htmlspecialchars($candidate['full_name']) ?></h1>
                <div class="editorial-script-subtitle">Elegancia, Belleza & Liderazgo</div>
                <div class="editorial-occ">✨ <?= htmlspecialchars($candidate['occupation'] ?? 'Modelo & Figura Pública') ?></div>

                <div class="editorial-quote">
                    "<?= htmlspecialchars($candidate['bio'] ?? 'Representar a nuestra región en Miss Universo es un honor imborrable que preservamos como parte viva de nuestra historia y cultura.') ?>"
                </div>

                <!-- Correo Institucional Oficial -->
                <?php if (!empty($candidate['inst_email'])): ?>
                <div class="inst-email-banner">
                    <div class="inst-email-text">
                        <small>📩 Correo Oficial Institucional</small>
                        <span><?= htmlspecialchars($candidate['inst_email']) ?></span>
                    </div>
                    <button type="button" class="btn-copy-gold" onclick="copyText('<?= htmlspecialchars($candidate['inst_email']) ?>', this);">Copiar Correo</button>
                </div>
                <?php endif; ?>

                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;">
                    <?php if ($candidate['mode_linktree']): ?>
                    <button type="button" class="btn-open-editorial-switch" style="max-width:280px;" onclick="openLinktreeModal('<?= htmlspecialchars($candidate['username']) ?>');">
                        <span>⚡</span>
                        <span>Abrir Bio-Link Linktree</span>
                    </button>
                    <?php endif; ?>
                    <button type="button" class="btn-header" onclick="shareProfile('<?= htmlspecialchars($candidate['full_name']) ?>', window.location.href);">
                        <span>🔗</span> Compartir Perfil
                    </button>
                </div>
            </div>
        </div>

        <!-- Galería de Sesión Editorial -->
        <?php
        $gallery = [];
        if (!empty($candidate['photos_gallery'])) {
            $gallery = json_decode($candidate['photos_gallery'], true) ?: [];
        }
        if (!empty($gallery)):
        ?>
        <div class="editorial-gallery-section">
            <h2 class="section-headline">Portafolio & <span>Sesión Oficial</span></h2>
            <div class="editorial-gallery-grid">
                <?php foreach ($gallery as $gImg): ?>
                <div class="gallery-photo-card" onclick="openLightbox('<?= htmlspecialchars($gImg) ?>');">
                    <img src="<?= htmlspecialchars($gImg) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" loading="lazy">
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </main>

    <?php elseif ($candidate && $isLinktreeView): ?>
    <!-- ==============================================================
         VISTA 2: VIP LINKTREE DIRECTO
         ============================================================== -->
    <main style="position:relative; z-index:1; padding: 40px 20px; display:flex; justify-content:center;">
        <div class="vip-linktree-card">
            <div class="avatar-glow-wrap">
                <div class="avatar-ring-glow"></div>
                <img src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" class="avatar-core-img">
                <div class="avatar-crown-floating">👑</div>
            </div>

            <h1 class="vip-name">
                <?= htmlspecialchars($candidate['full_name']) ?>
                <span class="verified-star">✓</span>
            </h1>
            <div class="vip-tag"><?= htmlspecialchars($candidate['title_badge'] ?? 'Embajadora Oficial 2026') ?></div>
            <p class="vip-occ"><?= htmlspecialchars($candidate['occupation'] ?? 'Modelo & Figura Pública') ?></p>

            <?php if (!empty($candidate['inst_email'])): ?>
            <div class="inst-email-banner" style="width:100%; margin-bottom:18px;">
                <div class="inst-email-text" style="text-align:left;">
                    <small>📩 Correo Oficial Miss Universo</small>
                    <span><?= htmlspecialchars($candidate['inst_email']) ?></span>
                </div>
                <button type="button" class="btn-copy-gold" onclick="copyText('<?= htmlspecialchars($candidate['inst_email']) ?>', this);">Copiar</button>
            </div>
            <?php endif; ?>

            <!-- Botones Personalizados -->
            <div class="vip-links-list">
                <?php
                $links = [];
                if (!empty($candidate['custom_links'])) {
                    $links = json_decode($candidate['custom_links'], true) ?: [];
                }
                foreach ($links as $l):
                    $iconEmoji = '🔗';
                    if (($l['icon'] ?? '') === 'instagram') $iconEmoji = '📷';
                    if (($l['icon'] ?? '') === 'tiktok') $iconEmoji = '🎵';
                    if (($l['icon'] ?? '') === 'whatsapp') $iconEmoji = '💬';
                    if (($l['icon'] ?? '') === 'shop') $iconEmoji = '🛍️';
                ?>
                <a href="<?= htmlspecialchars($l['url']) ?>" target="_blank" rel="noopener noreferrer" class="vip-link-btn">
                    <span><?= $iconEmoji ?> <?= htmlspecialchars($l['title']) ?></span>
                    <span>↗</span>
                </a>
                <?php endforeach; ?>
            </div>

            <?php if ($candidate['mode_editorial']): ?>
            <a href="/2026/<?= htmlspecialchars($candidate['username']) ?>" class="btn-open-editorial-switch">
                <span>📖</span>
                <span>Ver Portafolio Editorial Completo</span>
                <span>→</span>
            </a>
            <?php endif; ?>
        </div>
    </main>

    <?php else: ?>
    <!-- ==============================================================
         VISTA 3: SALÓN GENERAL DEL LEGADO 2026 (GRID DE TODAS)
         ============================================================== -->
    <section class="salon-hero">
        <div class="hero-eyebrow">✧ Archivo de la Corona Regional ✧</div>
        <h1 class="hero-title">Salón del Legado 2026</h1>
        <div class="hero-calligraphy">La historia que trasciende las coronas</div>
        <p class="hero-desc">
            Homenaje oficial a las embajadoras que forjaron el camino de Miss Universo en el norte de Chile. 
            Explora sus portafolios editoriales, proyectos actuales y sus Bio-Links verificados.
        </p>
    </section>

    <!-- Barra de Control: Sedes y Buscador -->
    <div class="controls-bar">
        <div class="sede-switcher">
            <a href="/2026/?sede=iquique" class="sede-btn <?= $sede === 'iquique' ? 'active' : '' ?>">Iquique (<?= $countIquique ?>)</a>
            <a href="/2026/?sede=arica" class="sede-btn <?= $sede === 'arica' ? 'active' : '' ?>">Arica (<?= $countArica ?>)</a>
        </div>

        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="candSearchInput" class="search-input" placeholder="Buscar por nombre u ocupación..." oninput="filterCandidates(this.value);">
        </div>
    </div>

    <!-- Grid de Alta Costura -->
    <main class="salon-grid-container">
        <div class="candidates-grid" id="gridCandidates">
            <?php foreach ($allCandidates as $idx => $c): 
                $cNum = str_pad($idx + 1, 2, '0', STR_PAD_LEFT);
            ?>
            <article class="candidate-card" data-name="<?= htmlspecialchars(strtolower($c['full_name'] . ' ' . $c['occupation'])) ?>">
                <img src="<?= htmlspecialchars($c['photo_main']) ?>" alt="<?= htmlspecialchars($c['full_name']) ?>" class="card-bg-photo" loading="lazy">
                <div class="card-scrim"></div>

                <div class="card-top-bar">
                    <span class="chip-number">✧ <?= $cNum ?> · <?= strtoupper($c['sede']) ?> ✧</span>
                    <div class="chip-crown">👑</div>
                </div>

                <div class="card-body">
                    <div class="cand-card-tag"><?= htmlspecialchars($c['title_badge'] ?? 'Embajadora Oficial') ?></div>
                    <h3 class="cand-card-name"><?= htmlspecialchars($c['full_name']) ?></h3>
                    <p class="cand-card-occ"><?= htmlspecialchars($c['occupation'] ?? 'Modelo & Embajadora') ?></p>

                    <div class="card-actions-bar">
                        <button type="button" class="btn-card-linktree" onclick="openLinktreeModal('<?= htmlspecialchars($c['username']) ?>');">
                            ⚡ Bio-Link
                        </button>
                        <a href="/2026/<?= htmlspecialchars($c['username']) ?>" class="btn-card-editorial">
                            📖 Editorial
                        </a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </main>
    <?php endif; ?>

    <!-- Modal Dinámico de Linktree (/2026/#usuario) -->
    <div id="linktreeModal" role="dialog" aria-modal="true">
        <button type="button" class="modal-close-btn" onclick="closeLinktreeModal();">&times;</button>
        <div id="linktreeModalBody"></div>
    </div>

    <!-- Pie de Página -->
    <footer class="legado-footer">
        <p>© 2026 - 2027 Miss Universo <?= $sedeTitle ?> · Franquicia Oficial de Belleza y Liderazgo Regional.</p>
        <p style="margin-top:8px;">
            ¿Eres parte de la Generación 2026? <a href="/2026/editar.php">Ingresa a tu panel de embajadora oficial</a>
        </p>
    </footer>

    <script>
        // Animación Stardust Cósmica
        const canvas = document.getElementById('stardustCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let w, h;
            function resize() {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resize);
            resize();

            const stars = Array.from({ length: 65 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.3,
                speed: Math.random() * 0.4 + 0.1,
                alpha: Math.random() * 0.8 + 0.2,
                dAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
            }));

            function animateStars() {
                ctx.clearRect(0, 0, w, h);
                stars.forEach(s => {
                    s.y -= s.speed;
                    if (s.y < 0) { s.y = h; s.x = Math.random() * w; }
                    s.alpha += s.dAlpha;
                    if (s.alpha > 0.9 || s.alpha < 0.2) s.dAlpha *= -1;

                    ctx.fillStyle = `rgba(247, 208, 112, ${s.alpha})`;
                    ctx.shadowColor = '#eab308';
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(animateStars);
            }
            animateStars();
        }

        // Filtro en Vivo de Candidatas
        function filterCandidates(query) {
            const clean = query.toLowerCase().trim();
            document.querySelectorAll('#gridCandidates .candidate-card').forEach(card => {
                const name = card.dataset.name || '';
                card.style.display = name.includes(clean) ? 'flex' : 'none';
            });
        }

        // Copiar Texto
        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = '¡Copiado! ✓';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                }, 2000);
            });
        }

        // Compartir
        function shareProfile(name, url) {
            if (navigator.share) {
                navigator.share({
                    title: name + ' · Salón del Legado Miss Universo',
                    url: url
                }).catch(() => {});
            } else {
                copyText(url, { textContent: 'Copiar', style: {} });
                alert('Enlace copiado al portapapeles: ' + url);
            }
        }

        // Detección Hash
        window.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.replace('#', '').trim();
            if (hash && hash !== '') {
                openLinktreeModal(hash);
            }
        });

        // Abrir Modal Linktree Dinámico
        async function openLinktreeModal(username) {
            const modal = document.getElementById('linktreeModal');
            const body = document.getElementById('linktreeModalBody');
            if (!modal || !body) return;

            body.innerHTML = '<div style="color:var(--gold); padding:50px; text-align:center;">Cargando Bio-Link Oficial...</div>';
            modal.classList.add('is-open');
            window.location.hash = username;

            try {
                const res = await fetch(`/2026/api.php?action=get_linktree&sede=<?= $sede ?>&user=${encodeURIComponent(username)}`);
                const data = await res.json();
                if (data.status === 'success' && data.candidate) {
                    renderLinktreeHtml(data.candidate);
                } else {
                    body.innerHTML = '<div class="glass" style="padding:30px; text-align:center;"><p>Perfil no encontrado.</p><br><button type="button" class="btn-header" onclick="closeLinktreeModal();">Cerrar</button></div>';
                }
            } catch (e) {
                body.innerHTML = '<div class="glass" style="padding:30px; text-align:center;"><p>Error de conexión.</p></div>';
            }
        }

        function closeLinktreeModal() {
            const modal = document.getElementById('linktreeModal');
            if (modal) modal.classList.remove('is-open');
            history.pushState("", document.title, window.location.pathname);
        }

        function renderLinktreeHtml(c) {
            const body = document.getElementById('linktreeModalBody');
            let links = [];
            try { links = typeof c.custom_links === 'string' ? JSON.parse(c.custom_links) : c.custom_links; } catch(e){}

            let linksHtml = '';
            if (links && Array.isArray(links)) {
                links.forEach(l => {
                    const iconMap = { 'instagram': '📷', 'tiktok': '🎵', 'whatsapp': '💬', 'shop': '🛍️', 'portfolio': '📄', 'web': '🌐' };
                    const icon = iconMap[l.icon] || '🔗';
                    linksHtml += `
                        <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="vip-link-btn">
                            <span>${icon} ${l.title}</span>
                            <span>↗</span>
                        </a>
                    `;
                });
            }

            body.innerHTML = `
                <div class="vip-linktree-card">
                    <div class="avatar-glow-wrap">
                        <div class="avatar-ring-glow"></div>
                        <img src="${c.photo_main}" alt="${c.full_name}" class="avatar-core-img">
                        <div class="avatar-crown-floating">👑</div>
                    </div>

                    <h2 class="vip-name">
                        ${c.full_name}
                        <span class="verified-star">✓</span>
                    </h2>
                    <div class="vip-tag">${c.title_badge || 'Embajadora Oficial 2026'}</div>
                    <p class="vip-occ">${c.occupation || 'Modelo & Figura Pública'}</p>

                    ${c.inst_email ? `
                    <div class="inst-email-banner" style="width:100%; margin-bottom:18px;">
                        <div class="inst-email-text" style="text-align:left;">
                            <small>📩 Correo Oficial Miss Universo</small>
                            <span>${c.inst_email}</span>
                        </div>
                        <button type="button" class="btn-copy-gold" onclick="copyText('${c.inst_email}', this);">Copiar</button>
                    </div>
                    ` : ''}

                    <div class="vip-links-list">
                        ${linksHtml}
                    </div>

                    ${c.mode_editorial ? `
                    <a href="/2026/${encodeURIComponent(c.username)}" class="btn-open-editorial-switch">
                        <span>📖</span>
                        <span>Ver Portafolio Editorial</span>
                        <span>→</span>
                    </a>
                    ` : ''}

                    <button type="button" onclick="shareProfile('${c.full_name}', window.location.origin + '/2026/#' + c.username);" style="margin-top:16px; background:none; border:none; color:var(--text-muted); font-size:12px; cursor:pointer; text-decoration:underline;">
                        🔗 Compartir mi Bio-Link Oficial
                    </button>
                </div>
            `;
        }
    </script>
</body>
</html>
