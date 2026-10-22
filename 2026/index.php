<?php
/**
 * MISS UNIVERSO · SALÓN OFICIAL DEL LEGADO 2026
 * Experiencia Visual de Alta Costura, Pasarela y Bio-Links Oficiales
 * Vistas:
 * 1. Salón General (/2026/) con filtro Arica / Iquique, Spotlight de Pasarela y Buscador en Vivo.
 * 2. Perfil Editorial de Alta Costura (/2026/usuario) con Teatro de Video de Pasarela y Portafolio.
 * 3. VIP Bio-Link Linktree (/2026/#usuario o ?view=linktree).
 */
require_once __DIR__ . '/../config/db.php';

// Detectar sede
$host = $_SERVER['HTTP_HOST'] ?? '';
$sede = (strpos($host, 'iquique') !== false) ? 'iquique' : 'arica';
if (isset($_GET['sede']) && in_array(strtolower($_GET['sede']), ['arica', 'iquique'])) {
    $sede = strtolower($_GET['sede']);
}

$sedeTitle = ($sede === 'arica') ? 'Arica' : 'Iquique';
$sedeColor = ($sede === 'arica') ? '#f5245f' : '#b930d5';
$sedeAccent = ($sede === 'arica') ? '#e2a93b' : '#38bdf8';
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

// Obtener todas las candidatas para el salón interactivo
$stmtAll = $pdo->query("SELECT id, sede, username, full_name, title_badge, photo_main, photos_gallery, videos_gallery, occupation, bio, inst_email, custom_links, mode_editorial, mode_linktree, is_minimal_record FROM legado_2026 ORDER BY sede DESC, id ASC");
$allCandidates = $stmtAll->fetchAll(PDO::FETCH_ASSOC);

// Conteos y Candidatas con Video
$countTotal = count($allCandidates);
$countArica = 0;
$countIquique = 0;
$candidatesWithVideos = [];

foreach ($allCandidates as $candItem) {
    if ($candItem['sede'] === 'arica') $countArica++;
    if ($candItem['sede'] === 'iquique') $countIquique++;
    $vids = [];
    if (!empty($candItem['videos_gallery'])) {
        $vids = json_decode($candItem['videos_gallery'], true) ?: [];
    }
    if (!empty($vids)) {
        $candidatesWithVideos[] = $candItem;
    }
}
$countWithVideos = count($candidatesWithVideos);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title><?= $candidate ? htmlspecialchars($candidate['full_name']) . " · Salón del Legado 2026 · Miss Universo {$sedeTitle}" : "Salón del Legado 2026 · Miss Universo {$sedeTitle} & Arica" ?></title>
    
    <meta name="description" content="<?= $candidate ? htmlspecialchars($candidate['bio'] ?? "Perfil oficial de {$candidate['full_name']}, Embajadora de Miss Universo {$sedeTitle} 2026.") : "Homenaje oficial a las embajadoras de Miss Universo 2026. Portafolios de alta costura, reels de pasarela y Bio-Links oficiales verificados." ?>">
    <meta name="theme-color" content="#010619">
    
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
            --bg-deep: #010619;
            --bg-card: rgba(3, 14, 44, 0.82);
            --border-glass: rgba(147, 197, 253, 0.18);
            --border-gold: rgba(234, 179, 8, 0.5);
            --gold: #f7d070;
            --gold-glow: #eab308;
            --gold-metallic: linear-gradient(135deg, #ffffff 0%, #fce793 25%, #eab308 70%, #b48608 100%);
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

        /* Canvas de Polvo Estelar Dorado */
        #stardustCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
        }

        /* Resplandores Cósmicos de Fondo */
        .cosmic-aurora {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background: 
                radial-gradient(circle at 12% 18%, rgba(245, 36, 95, 0.2) 0%, transparent 48%),
                radial-gradient(circle at 88% 22%, rgba(185, 48, 213, 0.22) 0%, transparent 52%),
                radial-gradient(circle at 50% 60%, rgba(234, 179, 8, 0.12) 0%, transparent 55%),
                radial-gradient(circle at 50% 5%, #051648 0%, #010619 75%);
            background-attachment: fixed;
        }

        /* Glassmorphism de Alta Costura */
        .glass {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.03);
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
            background: rgba(1, 6, 25, 0.9);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(234, 179, 8, 0.25);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        }
        .brand-pill {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
        }
        .brand-crown {
            font-size: 28px;
            filter: drop-shadow(0 0 12px var(--gold-glow));
            animation: crownPulse 3s ease-in-out infinite;
        }
        @keyframes crownPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px var(--gold-glow)); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 20px #ffd700); }
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

        /* ==============================================================
           HERO MONUMENTAL DEL SALÓN
           ============================================================== */
        .salon-hero {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 70px 20px 35px;
            max-width: 1040px;
            margin: 0 auto;
        }
        .hero-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 3.5px;
            text-transform: uppercase;
            color: var(--gold);
            padding: 7px 20px;
            border-radius: 30px;
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid var(--border-gold);
            margin-bottom: 18px;
            box-shadow: 0 0 25px rgba(234, 179, 8, 0.25);
        }
        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(2.8rem, 7.5vw, 5.5rem);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px;
            line-height: 1.05;
            margin-bottom: 6px;
            background: var(--gold-metallic);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 40px rgba(234, 179, 8, 0.4));
        }
        .hero-calligraphy {
            font-family: 'Italianno', cursive;
            font-size: clamp(2.6rem, 5.5vw, 4rem);
            color: var(--gold);
            line-height: 1;
            margin-bottom: 20px;
            filter: drop-shadow(0 2px 10px rgba(0,0,0,0.9));
        }
        .hero-desc {
            font-size: 1.1rem;
            color: #cbd5e1;
            max-width: 720px;
            margin: 0 auto 30px;
            font-weight: 400;
            line-height: 1.7;
        }

        /* Barra de Métricas de Lujo */
        .metrics-banner {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 16px;
            margin: 0 auto 40px;
            max-width: 900px;
        }
        .metric-pill {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-glass);
            border-radius: 50px;
            padding: 8px 20px;
            font-size: 13px;
            font-weight: 700;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        .metric-pill:hover {
            border-color: var(--gold);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(234, 179, 8, 0.2);
        }
        .metric-pill strong {
            color: var(--gold);
            font-weight: 900;
        }

        /* ==============================================================
           SPOTLIGHT DE REELS DE PASARELA HD (CARRUSEL EXCLUSIVO)
           ============================================================== */
        .reels-spotlight-section {
            position: relative;
            z-index: 1;
            max-width: 1340px;
            margin: 0 auto 60px;
            padding: 0 20px;
        }
        .reels-header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
        }
        .reels-title-box {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .reels-badge-live {
            background: #ef4444;
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
            animation: pulseLive 2s infinite;
        }
        @keyframes pulseLive {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.65; }
        }
        .reels-headline {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #fff;
        }
        .reels-headline span { color: var(--gold); }

        .reels-track {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            padding-bottom: 16px;
            scroll-snap-type: x mandatory;
            scrollbar-width: thin;
            scrollbar-color: var(--gold) rgba(255, 255, 255, 0.05);
        }
        .reels-track::-webkit-scrollbar {
            height: 6px;
        }
        .reels-track::-webkit-scrollbar-thumb {
            background: var(--gold);
            border-radius: 4px;
        }

        .reel-item-card {
            flex: 0 0 220px;
            aspect-ratio: 9/16;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            border: 1.5px solid var(--border-gold);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
            scroll-snap-align: start;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            background: #020822;
        }
        .reel-item-card:hover {
            transform: translateY(-8px) scale(1.03);
            border-color: #ffd700;
            box-shadow: 0 20px 45px rgba(234, 179, 8, 0.4);
        }
        .reel-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .reel-item-card:hover .reel-card-img {
            transform: scale(1.08);
        }
        .reel-scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(1, 6, 25, 0.95) 0%, rgba(1, 6, 25, 0.4) 40%, rgba(0,0,0,0.1) 100%);
        }
        .reel-play-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f5245f, #eab308);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 20px;
            box-shadow: 0 0 25px rgba(245, 36, 95, 0.8);
            transition: all 0.3s;
        }
        .reel-item-card:hover .reel-play-btn {
            transform: translate(-50%, -50%) scale(1.15);
            box-shadow: 0 0 35px #ffd700;
        }
        .reel-meta {
            position: absolute;
            bottom: 14px;
            left: 14px;
            right: 14px;
            z-index: 2;
        }
        .reel-sede-tag {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 2px;
        }
        .reel-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: #fff;
            line-height: 1.15;
        }

        /* ==============================================================
           CONTROLES: FILTROS MULTI-SEDE Y BUSCADOR
           ============================================================== */
        .controls-bar {
            position: relative;
            z-index: 1;
            max-width: 1340px;
            margin: 0 auto 35px;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }
        .filter-pills-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            background: rgba(255, 255, 255, 0.03);
            padding: 6px;
            border-radius: 50px;
            border: 1px solid var(--border-glass);
        }
        .filter-pill-btn {
            padding: 9px 20px;
            border-radius: 40px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            color: #94a3b8;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .filter-pill-btn.active {
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            box-shadow: 0 0 20px rgba(245, 36, 95, 0.5);
        }
        .filter-pill-btn:hover:not(.active) {
            color: #fff;
            background: rgba(255, 255, 255, 0.08);
        }

        .search-box {
            position: relative;
            flex: 1;
            max-width: 360px;
            min-width: 240px;
        }
        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-glass);
            border-radius: 50px;
            padding: 12px 20px 12px 44px;
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

        /* Contador de Resultados */
        .results-count-bar {
            max-width: 1340px;
            margin: 0 auto 20px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 600;
        }
        .results-count-bar b {
            color: var(--gold);
        }

        /* ==============================================================
           GRID DE ALTA COSTURA: COMP-CARDS 3:4.5
           ============================================================== */
        .salon-grid-container {
            position: relative;
            z-index: 1;
            max-width: 1340px;
            margin: 0 auto 90px;
            padding: 0 20px;
        }
        .candidates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 32px;
        }

        /* Tarjeta de Alta Costura */
        .candidate-card {
            position: relative;
            aspect-ratio: 3/4.4;
            border-radius: 24px;
            overflow: hidden;
            border: 1.5px solid var(--border-gold);
            background: #02071f;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85), inset 0 0 25px rgba(255, 255, 255, 0.03);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            cursor: pointer;
        }
        .candidate-card:hover {
            transform: translateY(-10px) scale(1.02);
            border-color: #ffd700;
            box-shadow: 0 30px 65px rgba(0, 0, 0, 0.95), 0 0 40px rgba(234, 179, 8, 0.45);
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
            transform: scale(1.07);
            filter: brightness(1.08) contrast(1.06);
        }

        .card-scrim {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to top,
                rgba(1, 6, 25, 0.98) 0%,
                rgba(1, 6, 25, 0.78) 32%,
                rgba(1, 6, 25, 0.22) 60%,
                rgba(1, 6, 25, 0.4) 100%
            );
            pointer-events: none;
        }

        /* Badges Superiores Flotantes */
        .card-top-bar {
            position: absolute;
            top: 16px;
            left: 16px;
            right: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 2;
        }
        .chip-number {
            background: rgba(1, 6, 25, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-gold);
            color: var(--gold);
            font-size: 11px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 20px;
            letter-spacing: 1px;
        }
        .chip-reel-badge {
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            padding: 5px 11px;
            border-radius: 20px;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 0 15px rgba(245, 36, 95, 0.7);
            animation: reelBadgeGlow 2.5s infinite;
        }
        @keyframes reelBadgeGlow {
            0%, 100% { box-shadow: 0 0 12px rgba(245, 36, 95, 0.7); }
            50% { box-shadow: 0 0 22px #ffd700; }
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
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cand-card-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.65rem;
            font-weight: 700;
            line-height: 1.15;
            color: #fff;
            transition: color 0.3s ease;
        }
        .candidate-card:hover .cand-card-name {
            color: #ffd700;
        }
        .cand-card-occ {
            font-size: 0.85rem;
            color: #94a3b8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 8px;
        }

        .card-actions-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
            gap: 8px;
            margin-top: 4px;
        }
        .btn-card-action {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border-glass);
            color: #fff;
            padding: 10px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
        .btn-card-action:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #fff;
            color: var(--gold);
            transform: translateY(-2px);
        }
        .btn-card-action-video {
            background: linear-gradient(135deg, rgba(245, 36, 95, 0.35), rgba(234, 179, 8, 0.35));
            border-color: var(--border-gold);
            color: #fff;
        }
        .btn-card-action-video:hover {
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            box-shadow: 0 0 20px rgba(245, 36, 95, 0.6);
        }

        /* ==============================================================
           VISTA 1: PERFIL EDITORIAL DE ALTA COSTURA (/2026/usuario)
           ============================================================== */
        .editorial-wrapper {
            position: relative;
            z-index: 1;
            max-width: 1240px;
            margin: 40px auto 100px;
            padding: 0 20px;
        }
        .editorial-back-nav {
            margin-bottom: 24px;
        }
        .btn-back-salon {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--gold);
            text-decoration: none;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 8px 18px;
            border-radius: 30px;
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid var(--border-gold);
            transition: all 0.25s;
        }
        .btn-back-salon:hover {
            background: var(--gold);
            color: #000;
            transform: translateX(-4px);
        }

        .editorial-hero-grid {
            display: grid;
            grid-template-columns: 1fr 1.35fr;
            gap: 45px;
            margin-bottom: 50px;
            align-items: center;
            padding: 40px;
        }
        @media (max-width: 860px) {
            .editorial-hero-grid {
                grid-template-columns: 1fr;
                padding: 24px;
                gap: 30px;
            }
        }

        .portrait-frame-box {
            position: relative;
            aspect-ratio: 3/4.4;
            border-radius: 26px;
            overflow: hidden;
            border: 2px solid var(--border-gold);
            box-shadow: 0 25px 65px rgba(0, 0, 0, 0.95), 0 0 45px rgba(234, 179, 8, 0.3);
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
            padding: 22px 26px;
            background: rgba(255, 255, 255, 0.03);
            border-left: 3px solid var(--gold);
            border-radius: 0 16px 16px 0;
            font-style: italic;
            color: #e2e8f0;
            font-size: 1.05rem;
            line-height: 1.7;
        }

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

        /* Sección de Video de Pasarela Dedicada */
        .editorial-video-section {
            margin-top: 55px;
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

        .video-player-theater {
            position: relative;
            max-width: 820px;
            margin: 0 auto;
            border-radius: 24px;
            overflow: hidden;
            border: 2px solid var(--border-gold);
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(234, 179, 8, 0.3);
            background: #000;
        }
        .video-player-theater video {
            width: 100%;
            height: auto;
            max-height: 80vh;
            display: block;
            outline: none;
            background: #000;
        }
        .video-theater-caption {
            padding: 16px 24px;
            background: rgba(1, 6, 25, 0.95);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            flex-wrap: wrap;
            gap: 12px;
        }
        .video-theater-caption span {
            font-size: 13px;
            color: var(--gold);
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Galería Editorial Comp-Cards */
        .editorial-gallery-section {
            margin-top: 60px;
        }
        .editorial-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
        }
        .gallery-photo-card {
            position: relative;
            aspect-ratio: 3/4.2;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid var(--border-glass);
            cursor: pointer;
            box-shadow: 0 15px 35px rgba(0,0,0,0.7);
            transition: all 0.35s ease;
        }
        .gallery-photo-card:hover {
            transform: scale(1.04);
            border-color: var(--gold);
            box-shadow: 0 20px 45px rgba(234, 179, 8, 0.4);
        }
        .gallery-photo-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .gallery-photo-card:hover img {
            transform: scale(1.08);
        }
        .gallery-zoom-badge {
            position: absolute;
            bottom: 14px;
            right: 14px;
            background: rgba(1, 6, 25, 0.75);
            backdrop-filter: blur(8px);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gold);
            font-size: 16px;
            border: 1px solid var(--border-gold);
            opacity: 0;
            transition: opacity 0.25s;
        }
        .gallery-photo-card:hover .gallery-zoom-badge {
            opacity: 1;
        }

        /* ==============================================================
           THEATER MODAL: REPRODUCTOR DE VIDEO CINEMATOGRÁFICO
           ============================================================== */
        #videoTheaterModal {
            position: fixed;
            inset: 0;
            background: rgba(1, 6, 25, 0.94);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        #videoTheaterModal.is-open {
            display: flex;
            animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-modal-container {
            width: 100%;
            max-width: 780px;
            position: relative;
            background: #000;
            border-radius: 24px;
            overflow: hidden;
            border: 2px solid var(--border-gold);
            box-shadow: 0 35px 80px rgba(0, 0, 0, 0.98), 0 0 50px rgba(234, 179, 8, 0.4);
        }
        .video-modal-header {
            padding: 16px 24px;
            background: rgba(1, 6, 25, 0.95);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .video-modal-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            color: #fff;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .video-modal-title span { color: var(--gold); }
        .video-modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .video-modal-close:hover {
            background: var(--accent);
            transform: rotate(90deg);
        }
        .video-modal-player-box {
            position: relative;
            width: 100%;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            max-height: 75vh;
        }
        .video-modal-player-box video {
            width: 100%;
            max-height: 75vh;
            outline: none;
            display: block;
        }
        .video-modal-footer {
            padding: 14px 24px;
            background: rgba(1, 6, 25, 0.95);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            flex-wrap: wrap;
            gap: 10px;
        }

        /* ==============================================================
           LIGHTBOX MODAL DE FOTOS
           ============================================================== */
        #lightboxModal {
            position: fixed;
            inset: 0;
            background: rgba(1, 6, 25, 0.96);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            z-index: 2100;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        #lightboxModal.is-open {
            display: flex;
            animation: modalFadeIn 0.25s ease;
        }
        .lightbox-img-wrap {
            max-width: 90vw;
            max-height: 85vh;
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 30px 80px rgba(0,0,0,0.95);
            border: 2px solid var(--border-gold);
        }
        .lightbox-img-wrap img {
            max-width: 100%;
            max-height: 85vh;
            display: block;
            object-fit: contain;
        }
        .lightbox-close-btn {
            position: fixed;
            top: 25px;
            right: 25px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-size: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2110;
            transition: all 0.2s;
        }
        .lightbox-close-btn:hover {
            background: var(--accent);
            transform: rotate(90deg);
        }

        /* ==============================================================
           MODAL Y VISTA VIP LINKTREE (/2026/#usuario)
           ============================================================== */
        #linktreeModal {
            position: fixed;
            inset: 0;
            background: rgba(1, 6, 25, 0.9);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
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

        .vip-linktree-card {
            width: 100%;
            max-width: 450px;
            background: rgba(3, 14, 44, 0.92);
            border: 1.5px solid var(--border-gold);
            border-radius: 32px;
            padding: 40px 24px 32px;
            box-shadow: 0 30px 75px rgba(0, 0, 0, 0.98), 0 0 45px rgba(234, 179, 8, 0.35);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }
        .avatar-glow-wrap {
            position: relative;
            width: 125px;
            height: 125px;
            margin: 0 auto 18px;
        }
        .avatar-ring-glow {
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: conic-gradient(from 180deg at 50% 50%, #f5245f 0deg, #eab308 180deg, #f5245f 360deg);
            filter: blur(10px);
            opacity: 0.85;
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
            font-size: 2rem;
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
            font-size: 18px;
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
            font-size: 0.88rem;
            color: #cbd5e1;
            margin-bottom: 18px;
        }

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
            border-radius: 16px;
            padding: 14px 20px;
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
            padding: 14px 20px;
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
            padding: 55px 20px 85px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(1, 6, 25, 0.96);
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
                <span class="brand-title">Miss Universe <b>Chile</b></span>
                <span class="brand-sub">✧ Salón del Legado 2026 ✧</span>
            </div>
        </a>

        <div class="header-actions">
            <?php if ($candidate): ?>
                <a href="/2026/?sede=<?= $candidate['sede'] ?>" class="btn-header">← Salón General</a>
            <?php else: ?>
                <a href="/2027/" class="btn-header">Edición 2027 ↗</a>
            <?php endif; ?>
            <a href="/2026/editar.php" class="btn-header btn-header-active">Acceso Embajadoras</a>
        </div>
    </header>

    <?php if ($candidate && !$isLinktreeView): 
        // Obtener galería y videos
        $candGallery = [];
        if (!empty($candidate['photos_gallery'])) {
            $candGallery = json_decode($candidate['photos_gallery'], true) ?: [];
        }
        $candVideos = [];
        if (!empty($candidate['videos_gallery'])) {
            $candVideos = json_decode($candidate['videos_gallery'], true) ?: [];
        }
    ?>
    <!-- ==============================================================
         VISTA 1: PERFIL EDITORIAL DE ALTA COSTURA (/2026/usuario)
         ============================================================== -->
    <main class="editorial-wrapper">
        <div class="editorial-back-nav">
            <a href="/2026/?sede=<?= $candidate['sede'] ?>" class="btn-back-salon">← Volver al Salón del Legado (<?= strtoupper($candidate['sede']) ?>)</a>
        </div>

        <div class="glass editorial-hero-grid">
            <div class="portrait-frame-box">
                <img src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>">
                <div class="portrait-sash">MISSU 2026 · <?= strtoupper($candidate['sede']) ?></div>
            </div>

            <div class="editorial-info-box">
                <div class="editorial-badge">
                    <span>👑</span>
                    <span><?= htmlspecialchars($candidate['title_badge'] ?? 'Embajadora Oficial 2026') ?> · Miss Universo <?= ucfirst($candidate['sede']) ?></span>
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

                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px;">
                    <?php if ($candidate['mode_linktree']): ?>
                    <button type="button" class="btn-open-editorial-switch" style="max-width:280px;" onclick="openLinktreeModal('<?= htmlspecialchars($candidate['username']) ?>');">
                        <span>⚡</span>
                        <span>Abrir Bio-Link Linktree</span>
                    </button>
                    <?php endif; ?>

                    <?php if (!empty($candVideos)): ?>
                    <button type="button" class="btn-header" style="border-color:var(--gold); color:var(--gold);" onclick="document.getElementById('sectionVideoReel').scrollIntoView({behavior:'smooth'});">
                        <span>▶</span> Reel de Pasarela HD
                    </button>
                    <?php endif; ?>

                    <button type="button" class="btn-header" onclick="shareProfile('<?= htmlspecialchars($candidate['full_name']) ?>', window.location.href);">
                        <span>🔗</span> Compartir Perfil
                    </button>
                </div>
            </div>
        </div>

        <!-- Sección de Video de Pasarela Oficial (Si tiene) -->
        <?php if (!empty($candVideos)): 
            $mainVideo = $candVideos[0];
        ?>
        <section class="editorial-video-section" id="sectionVideoReel">
            <h2 class="section-headline">Reel de Pasarela & <span>Presentación HD</span></h2>
            <div class="video-player-theater">
                <video playsinline controls preload="metadata" poster="<?= htmlspecialchars($candidate['photo_main']) ?>">
                    <source src="<?= htmlspecialchars($mainVideo) ?>" type="video/mp4">
                    <source src="<?= htmlspecialchars($mainVideo) ?>" type="video/quicktime">
                    Tu navegador no soporta reproducción de video HTML5.
                </video>
                <div class="video-theater-caption">
                    <span>👑 Desfile & Video Oficial · Miss Universo <?= ucfirst($candidate['sede']) ?> 2026</span>
                    <button type="button" class="btn-header" onclick="shareProfile('<?= htmlspecialchars($candidate['full_name']) ?>', '<?= htmlspecialchars($mainVideo) ?>');">
                        <span>🔗</span> Compartir Video
                    </button>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Galería de Sesión Editorial -->
        <?php if (!empty($candGallery)): ?>
        <section class="editorial-gallery-section">
            <h2 class="section-headline">Portafolio & <span>Sesión de Alta Costura</span></h2>
            <div class="editorial-gallery-grid">
                <?php foreach ($candGallery as $gImg): ?>
                <div class="gallery-photo-card" onclick="openLightbox('<?= htmlspecialchars($gImg) ?>');">
                    <img src="<?= htmlspecialchars($gImg) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" loading="lazy">
                    <div class="gallery-zoom-badge">🔍</div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>
    </main>

    <?php elseif ($candidate && $isLinktreeView): ?>
    <!-- ==============================================================
         VISTA 2: VIP LINKTREE DIRECTO
         ============================================================== -->
    <main style="position:relative; z-index:1; padding: 50px 20px; display:flex; justify-content:center;">
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

            <!-- Botón de Video si tiene -->
            <?php
            $vidsLinktree = [];
            if (!empty($candidate['videos_gallery'])) {
                $vidsLinktree = json_decode($candidate['videos_gallery'], true) ?: [];
            }
            if (!empty($vidsLinktree)):
            ?>
            <button type="button" class="btn-card-action btn-card-action-video" style="width:100%; margin-bottom:14px; padding:13px;" onclick="openVideoTheater('<?= htmlspecialchars(addslashes($candidate['full_name'])) ?>', '<?= htmlspecialchars($vidsLinktree[0]) ?>', '<?= htmlspecialchars($candidate['username']) ?>', '<?= htmlspecialchars($candidate['sede']) ?>');">
                <span>▶</span>
                <span>Ver Reel de Pasarela HD</span>
            </button>
            <?php endif; ?>

            <!-- Lista de Enlaces en Linktree -->
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
         VISTA 3: SALÓN GENERAL DEL LEGADO 2026 (EXPERIENCIA MONUMENTAL)
         ============================================================== -->
    <section class="salon-hero">
        <div class="hero-eyebrow">✧ Archivo de la Corona Regional · Generación 2026 ✧</div>
        <h1 class="hero-title">Salón del Legado 2026</h1>
        <div class="hero-calligraphy">Donde la belleza, el liderazgo y la historia trascienden</div>
        <p class="hero-desc">
            Homenaje oficial a las 22 embajadoras que forjaron la historia de Miss Universo en el norte de Chile. 
            Explora sus portafolios de alta costura, reels de pasarela en vivo y sus identidades digitales verificadas.
        </p>

        <!-- Métricas Oficiales de Lujo -->
        <div class="metrics-banner">
            <div class="metric-pill">
                <span>👑</span>
                <span><strong><?= $countTotal ?></strong> Embajadoras Históricas</span>
            </div>
            <div class="metric-pill">
                <span>🎥</span>
                <span><strong><?= $countWithVideos ?></strong> Reels de Pasarela HD</span>
            </div>
            <div class="metric-pill">
                <span>🏛️</span>
                <span><strong>Iquique</strong> (<?= $countIquique ?>) & <strong>Arica</strong> (<?= $countArica ?>)</span>
            </div>
            <div class="metric-pill">
                <span>📩</span>
                <span>Bio-Links & Correos Verificados</span>
            </div>
        </div>
    </section>

    <!-- SPOTLIGHT: REELS DE PASARELA EN VIVO (CARRUSEL HORIZONTAL) -->
    <?php if (!empty($candidatesWithVideos)): ?>
    <section class="reels-spotlight-section">
        <div class="reels-header-bar">
            <div class="reels-title-box">
                <span class="reels-badge-live">● EN VIVO</span>
                <h2 class="reels-headline">Pasarela & <span>Reels Oficiales</span></h2>
            </div>
            <span style="font-size:12px; color:var(--text-muted);">Desliza para ver más reels →</span>
        </div>

        <div class="reels-track">
            <?php foreach ($candidatesWithVideos as $rc): 
                $rVids = json_decode($rc['videos_gallery'], true) ?: [];
                $firstVid = $rVids[0] ?? '';
                if (empty($firstVid)) continue;
            ?>
            <div class="reel-item-card" onclick="openVideoTheater('<?= htmlspecialchars(addslashes($rc['full_name'])) ?>', '<?= htmlspecialchars($firstVid) ?>', '<?= htmlspecialchars($rc['username']) ?>', '<?= htmlspecialchars($rc['sede']) ?>');">
                <img src="<?= htmlspecialchars($rc['photo_main']) ?>" alt="<?= htmlspecialchars($rc['full_name']) ?>" class="reel-card-img" loading="lazy">
                <div class="reel-scrim"></div>
                <div class="reel-play-btn">▶</div>
                <div class="reel-meta">
                    <div class="reel-sede-tag">👑 <?= strtoupper($rc['sede']) ?></div>
                    <div class="reel-name"><?= htmlspecialchars($rc['full_name']) ?></div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Barra de Control: Filtros Multi-Sede y Buscador -->
    <div class="controls-bar">
        <div class="filter-pills-wrap">
            <button type="button" class="filter-pill-btn <?= ($sede === 'arica' ? '' : ($sede === 'iquique' ? '' : 'active')) ?>" data-filter="all" onclick="setSalonFilter('all', this);">
                <span>✦</span> Todas (<?= $countTotal ?>)
            </button>
            <button type="button" class="filter-pill-btn <?= ($sede === 'iquique') ? 'active' : '' ?>" data-filter="iquique" onclick="setSalonFilter('iquique', this);">
                <span>👑</span> Iquique (<?= $countIquique ?>)
            </button>
            <button type="button" class="filter-pill-btn <?= ($sede === 'arica') ? 'active' : '' ?>" data-filter="arica" onclick="setSalonFilter('arica', this);">
                <span>👑</span> Arica (<?= $countArica ?>)
            </button>
            <button type="button" class="filter-pill-btn" data-filter="video" onclick="setSalonFilter('video', this);">
                <span>🎥</span> Con Pasarela / Video (<?= $countWithVideos ?>)
            </button>
        </div>

        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="candSearchInput" class="search-input" placeholder="Buscar por nombre, sede o profesión..." oninput="handleSearch(this.value);">
        </div>
    </div>

    <div class="results-count-bar">
        <span>Mostrando <b id="lblCountVisible"><?= $countTotal ?></b> embajadoras en el Salón Oficial</span>
        <span style="font-size:11px; letter-spacing:1px; text-transform:uppercase;">Colección de Alta Costura</span>
    </div>

    <!-- Grid de Alta Costura -->
    <main class="salon-grid-container">
        <div class="candidates-grid" id="gridCandidates">
            <?php foreach ($allCandidates as $idx => $c): 
                $cNum = str_pad($idx + 1, 2, '0', STR_PAD_LEFT);
                $cVideos = [];
                if (!empty($c['videos_gallery'])) {
                    $cVideos = json_decode($c['videos_gallery'], true) ?: [];
                }
                $hasVideo = !empty($cVideos);
                $firstVideoUrl = $hasVideo ? $cVideos[0] : '';
            ?>
            <article class="candidate-card" 
                     data-sede="<?= htmlspecialchars($c['sede']) ?>" 
                     data-has-video="<?= $hasVideo ? '1' : '0' ?>"
                     data-name="<?= htmlspecialchars(strtolower($c['full_name'] . ' ' . $c['occupation'] . ' ' . $c['sede'])) ?>">
                
                <img src="<?= htmlspecialchars($c['photo_main']) ?>" alt="<?= htmlspecialchars($c['full_name']) ?>" class="card-bg-photo" loading="lazy">
                <div class="card-scrim"></div>

                <div class="card-top-bar">
                    <span class="chip-number">✧ <?= $cNum ?> · <?= strtoupper($c['sede']) ?> ✧</span>
                    <?php if ($hasVideo): ?>
                    <span class="chip-reel-badge">🎥 REEL HD</span>
                    <?php endif; ?>
                </div>

                <div class="card-body">
                    <div class="cand-card-tag">👑 <?= htmlspecialchars($c['title_badge'] ?? 'Embajadora Oficial') ?></div>
                    <h3 class="cand-card-name"><?= htmlspecialchars($c['full_name']) ?></h3>
                    <p class="cand-card-occ"><?= htmlspecialchars($c['occupation'] ?? 'Modelo & Embajadora') ?></p>

                    <div class="card-actions-bar">
                        <?php if ($hasVideo): ?>
                        <button type="button" class="btn-card-action btn-card-action-video" onclick="openVideoTheater('<?= htmlspecialchars(addslashes($c['full_name'])) ?>', '<?= htmlspecialchars($firstVideoUrl) ?>', '<?= htmlspecialchars($c['username']) ?>', '<?= htmlspecialchars($c['sede']) ?>');">
                            <span>▶ Pasarela</span>
                        </button>
                        <?php endif; ?>

                        <button type="button" class="btn-card-action" onclick="openLinktreeModal('<?= htmlspecialchars($c['username']) ?>');">
                            <span>⚡ Bio-Link</span>
                        </button>

                        <a href="/2026/<?= htmlspecialchars($c['username']) ?>" class="btn-card-action">
                            <span>📖 Perfil</span>
                        </a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </main>
    <?php endif; ?>

    <!-- ==============================================================
         TEATRO DE VIDEO MODAL CINEMATOGRÁFICO (#videoTheaterModal)
         ============================================================== -->
    <div id="videoTheaterModal" role="dialog" aria-modal="true">
        <div class="video-modal-container">
            <div class="video-modal-header">
                <div class="video-modal-title">
                    <span>👑</span>
                    <span id="videoModalTitle">Reel de Pasarela</span>
                </div>
                <button type="button" class="video-modal-close" onclick="closeVideoTheater();">&times;</button>
            </div>

            <div class="video-modal-player-box">
                <video id="theaterHtmlVideo" playsinline controls autoplay>
                    <source id="theaterVideoSource" src="" type="video/mp4">
                    Tu dispositivo no soporta reproducción de video HTML5.
                </video>
            </div>

            <div class="video-modal-footer">
                <div style="font-size:12px; color:var(--text-muted);" id="videoModalSede">
                    Miss Universo Chile 2026
                </div>
                <div style="display:flex; gap:8px;">
                    <a id="videoModalProfileBtn" href="#" class="btn-header" style="padding:6px 14px;">
                        <span>📖</span> Ver Portafolio
                    </a>
                    <button type="button" id="videoModalShareBtn" class="btn-header" style="padding:6px 14px;" onclick="shareCurrentVideo();">
                        <span>🔗</span> Compartir
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ==============================================================
         LIGHTBOX MODAL DE FOTOS (#lightboxModal)
         ============================================================== -->
    <div id="lightboxModal" role="dialog" aria-modal="true" onclick="closeLightbox();">
        <button type="button" class="lightbox-close-btn" onclick="closeLightbox();">&times;</button>
        <div class="lightbox-img-wrap" onclick="event.stopPropagation();">
            <img id="lightboxImage" src="" alt="Sesión de Fotos">
        </div>
    </div>

    <!-- ==============================================================
         MODAL DINÁMICO DE LINKTREE (/2026/#usuario)
         ============================================================== -->
    <div id="linktreeModal" role="dialog" aria-modal="true">
        <button type="button" class="modal-close-btn" onclick="closeLinktreeModal();">&times;</button>
        <div id="linktreeModalBody"></div>
    </div>

    <!-- Pie de Página -->
    <footer class="legado-footer">
        <p>© 2026 - 2027 Miss Universo Chile · Salón Oficial del Legado Arica & Iquique.</p>
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

            const stars = Array.from({ length: 70 }, () => ({
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
                    if (s.alpha > 0.95 || s.alpha < 0.2) s.dAlpha *= -1;

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

        // ==========================================
        // FILTROS Y BÚSQUEDA REACTIVA EN VIVO
        // ==========================================
        let currentFilterType = '<?= ($sede === "iquique") ? "iquique" : (($sede === "arica") ? "arica" : "all") ?>';
        let currentSearchQuery = '';

        function setSalonFilter(type, btn) {
            currentFilterType = type;
            document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            applySalonFilters();
        }

        function handleSearch(q) {
            currentSearchQuery = q.toLowerCase().trim();
            applySalonFilters();
        }

        function applySalonFilters() {
            const cards = document.querySelectorAll('#gridCandidates .candidate-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const sede = card.getAttribute('data-sede') || '';
                const hasVideo = card.getAttribute('data-has-video') === '1';
                const name = card.getAttribute('data-name') || '';

                // Filtro por tipo
                let matchType = true;
                if (currentFilterType === 'iquique') matchType = (sede === 'iquique');
                else if (currentFilterType === 'arica') matchType = (sede === 'arica');
                else if (currentFilterType === 'video') matchType = hasVideo;

                // Filtro por búsqueda
                let matchSearch = true;
                if (currentSearchQuery !== '') {
                    matchSearch = name.includes(currentSearchQuery);
                }

                if (matchType && matchSearch) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const lbl = document.getElementById('lblCountVisible');
            if (lbl) lbl.textContent = visibleCount;
        }

        // Ejecutar filtro inicial
        window.addEventListener('DOMContentLoaded', () => {
            const initBtn = document.querySelector(`.filter-pill-btn[data-filter="${currentFilterType}"]`);
            if (initBtn) setSalonFilter(currentFilterType, initBtn);
        });

        // ==========================================
        // TEATRO DE VIDEO CINEMATOGRÁFICO
        // ==========================================
        let activeVideoUrl = '';

        function openVideoTheater(name, videoUrl, username, sede) {
            const modal = document.getElementById('videoTheaterModal');
            const videoElem = document.getElementById('theaterHtmlVideo');
            const sourceElem = document.getElementById('theaterVideoSource');
            const titleElem = document.getElementById('videoModalTitle');
            const sedeElem = document.getElementById('videoModalSede');
            const profileBtn = document.getElementById('videoModalProfileBtn');

            if (!modal || !videoElem) return;

            activeVideoUrl = videoUrl;
            titleElem.textContent = name;
            sedeElem.innerHTML = `👑 Pasarela Oficial · Miss Universo ${sede.toUpperCase()} 2026`;
            if (profileBtn) profileBtn.href = `/2026/${username}`;

            sourceElem.src = videoUrl;
            videoElem.load();
            modal.classList.add('is-open');

            const playPromise = videoElem.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Autoplay prevenido por navegador, requiere interacción manual
                });
            }
        }

        function closeVideoTheater() {
            const modal = document.getElementById('videoTheaterModal');
            const videoElem = document.getElementById('theaterHtmlVideo');
            if (videoElem) {
                videoElem.pause();
                videoElem.currentTime = 0;
            }
            if (modal) modal.classList.remove('is-open');
        }

        function shareCurrentVideo() {
            if (activeVideoUrl) {
                shareProfile(document.getElementById('videoModalTitle').textContent, window.location.origin + activeVideoUrl);
            }
        }

        // ==========================================
        // LIGHTBOX DE FOTOS
        // ==========================================
        function openLightbox(imgSrc) {
            const modal = document.getElementById('lightboxModal');
            const img = document.getElementById('lightboxImage');
            if (modal && img) {
                img.src = imgSrc;
                modal.classList.add('is-open');
            }
        }

        function closeLightbox() {
            const modal = document.getElementById('lightboxModal');
            if (modal) modal.classList.remove('is-open');
        }

        // Tecla ESC para cerrar cualquier modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeVideoTheater();
                closeLightbox();
                closeLinktreeModal();
            }
        });

        // ==========================================
        // COMPARTIR Y COPIAR
        // ==========================================
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

        function shareProfile(name, url) {
            if (navigator.share) {
                navigator.share({
                    title: name + ' · Salón del Legado Miss Universo',
                    url: url
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    alert('Enlace copiado al portapapeles: ' + url);
                });
            }
        }

        // Detección Hash para Linktree (#usuario)
        window.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.replace('#', '').trim();
            if (hash && hash !== '') {
                openLinktreeModal(hash);
            }
        });

        // ==========================================
        // MODAL DINÁMICO LINKTREE VIP
        // ==========================================
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

            let videoBtnHtml = '';
            let vids = [];
            try { vids = typeof c.videos_gallery === 'string' ? JSON.parse(c.videos_gallery) : c.videos_gallery; } catch(e){}
            if (vids && Array.isArray(vids) && vids.length > 0) {
                videoBtnHtml = `
                    <button type="button" class="btn-card-action btn-card-action-video" style="width:100%; margin-bottom:14px; padding:13px; font-size:12px;" onclick="closeLinktreeModal(); openVideoTheater('${c.full_name.replace(/'/g, "\\'")}', '${vids[0]}', '${c.username}', '${c.sede}');">
                        <span>▶</span>
                        <span>Ver Reel de Pasarela HD</span>
                    </button>
                `;
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
                    <div class="inst-email-banner" style="width:100%; margin-bottom:16px;">
                        <div class="inst-email-text" style="text-align:left;">
                            <small>📩 Correo Oficial Miss Universo</small>
                            <span>${c.inst_email}</span>
                        </div>
                        <button type="button" class="btn-copy-gold" onclick="copyText('${c.inst_email}', this);">Copiar</button>
                    </div>
                    ` : ''}

                    ${videoBtnHtml}

                    <div class="vip-links-list">
                        ${linksHtml}
                    </div>

                    ${c.mode_editorial ? `
                    <a href="/2026/${encodeURIComponent(c.username)}" class="btn-open-editorial-switch">
                        <span>📖</span>
                        <span>Ver Portafolio Editorial Completo</span>
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
