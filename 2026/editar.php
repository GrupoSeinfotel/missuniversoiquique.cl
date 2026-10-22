<?php
/**
 * MISS UNIVERSO · PANEL DE EMBABAJADORA 2026 (EDITAR PERFIL)
 * Acceso sin contraseñas mediante Magic Token: /2026/editar.php?token=...
 */
require_once __DIR__ . '/../config/db.php';

// Detectar sede
$host = $_SERVER['HTTP_HOST'] ?? '';
$defaultSede = (strpos($host, 'iquique') !== false) ? 'iquique' : 'arica';

$token = trim($_GET['token'] ?? '');
$candidate = null;
$errorMsg = '';

if (!empty($token)) {
    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE magic_token = ? LIMIT 1");
    $stmt->execute([$token]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$candidate) {
        $errorMsg = 'El enlace de acceso utilizado no es válido o ha expirado. Por favor solicita uno nuevo con tu correo.';
    }
}

$sede = $candidate ? $candidate['sede'] : $defaultSede;
$sedeTitle = ($sede === 'arica') ? 'Arica' : 'Iquique';
$sedeColor = ($sede === 'arica') ? '#f5245f' : '#b930d5';
$sedeAccent = ($sede === 'arica') ? '#e2a93b' : '#38bdf8';
$baseUrl = "https://missuniverso{$sede}.cl";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>Panel de Embajadora 2026 · Miss Universo <?= $sedeTitle ?></title>
    <meta name="theme-color" content="#010820">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-deep: #010820;
            --bg-card: rgba(4, 16, 48, 0.85);
            --border-glass: rgba(138, 180, 248, 0.22);
            --border-gold: rgba(234, 179, 8, 0.45);
            --gold: #f7d070;
            --gold-glow: #eab308;
            --accent: <?= $sedeColor ?>;
            --accent-sub: <?= $sedeAccent ?>;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --card-radius: 20px;
        }

        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: var(--bg-deep) radial-gradient(circle at 50% 10%, #061e54 0%, #010820 60%);
            color: var(--text-main);
            font-family: 'Manrope', -apple-system, sans-serif;
            min-height: 100vh;
            line-height: 1.6;
            padding-bottom: 90px;
        }

        /* Glass Utility */
        .glass {
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-glass);
            border-radius: var(--card-radius);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        }

        /* Header Bar */
        .top-nav {
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(1, 8, 32, 0.8);
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(10px);
        }
        .nav-logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.35rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--gold);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .nav-badge {
            font-size: 0.72rem;
            padding: 4px 10px;
            border-radius: 20px;
            background: rgba(234, 179, 8, 0.15);
            color: var(--gold);
            border: 1px solid var(--border-gold);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .main-container {
            max-width: 820px;
            margin: 30px auto;
            padding: 0 20px;
        }

        /* Hero Profile Card */
        .profile-hero {
            padding: 30px;
            text-align: center;
            margin-bottom: 25px;
            position: relative;
            overflow: hidden;
        }
        .profile-hero::before {
            content: '';
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(245, 36, 95, 0.25) 0%, transparent 70%);
            pointer-events: none;
        }

        .avatar-container {
            position: relative;
            width: 130px;
            height: 130px;
            margin: 0 auto 18px;
        }
        .avatar-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--gold);
            box-shadow: 0 0 25px rgba(234, 179, 8, 0.45);
        }
        .avatar-crown {
            position: absolute;
            top: -10px;
            right: -6px;
            background: linear-gradient(135deg, #eab308, #ca8a04);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 19px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .cand-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.1rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
        }
        .cand-title {
            color: var(--gold);
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 18px;
        }

        /* Vanity Links Display */
        .vanity-links-box {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 12px;
            margin-top: 20px;
            text-align: left;
        }
        .vanity-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 14px 16px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .vanity-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .vanity-card-title {
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
        }
        .vanity-url {
            font-family: monospace;
            font-size: 0.85rem;
            color: var(--gold);
            word-break: break-all;
            margin-bottom: 10px;
        }
        .btn-copy {
            background: rgba(234, 179, 8, 0.15);
            border: 1px solid var(--border-gold);
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            align-self: flex-start;
        }
        .btn-copy:hover {
            background: var(--gold);
            color: #000;
        }

        /* Big Highlight Button for Instagram */
        .btn-instagram-share {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            border: none;
            padding: 14px 26px;
            border-radius: 30px;
            font-size: 0.95rem;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(245, 36, 95, 0.4);
            transition: transform 0.2s;
            width: 100%;
            max-width: 440px;
        }
        .btn-instagram-share:hover {
            transform: translateY(-2px);
        }

        /* Institutional Email Banner */
        .inst-box {
            background: rgba(234, 179, 8, 0.08);
            border: 1px solid var(--border-gold);
            border-radius: 14px;
            padding: 16px 20px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            text-align: left;
        }
        .inst-box-info h4 {
            color: var(--gold);
            font-size: 0.88rem;
            margin-bottom: 2px;
        }
        .inst-box-info p {
            color: #cbd5e1;
            font-size: 0.8rem;
        }

        /* Form Sections */
        .section-card {
            padding: 26px;
            margin-bottom: 22px;
        }
        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 14px;
        }
        .section-header h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.55rem;
            color: #fff;
        }
        .section-header span {
            font-size: 1.5rem;
        }

        /* Form Elements */
        .form-group {
            margin-bottom: 18px;
        }
        .form-label {
            display: block;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #cbd5e1;
            margin-bottom: 6px;
        }
        .form-input, .form-textarea, .form-select {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-glass);
            border-radius: 10px;
            padding: 12px 14px;
            color: #fff;
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-input:focus, .form-textarea:focus {
            border-color: var(--gold);
            background: rgba(255, 255, 255, 0.08);
        }
        .form-help {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 5px;
        }

        /* Toggle Switches */
        .toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-info h4 {
            font-size: 0.92rem;
            color: #fff;
            margin-bottom: 2px;
        }
        .toggle-info p {
            font-size: 0.78rem;
            color: var(--text-muted);
            max-width: 480px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 26px;
            flex-shrink: 0;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: rgba(255, 255, 255, 0.15);
            transition: .3s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: var(--accent);
        }
        input:checked + .slider:before {
            transform: translateX(22px);
        }

        /* Minimal Record Special Callout */
        .minimal-callout {
            background: rgba(245, 36, 95, 0.08);
            border: 1px solid rgba(245, 36, 95, 0.35);
            border-radius: 14px;
            padding: 18px 20px;
            margin-top: 15px;
        }
        .minimal-callout h4 {
            color: #ff8fab;
            font-size: 0.92rem;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .minimal-callout p {
            color: #e2e8f0;
            font-size: 0.82rem;
            line-height: 1.5;
        }

        /* Photo Upload Grid */
        .photo-uploader-box {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        .photo-preview-wrap {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid var(--border-gold);
            flex-shrink: 0;
        }
        .photo-preview-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .file-upload-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px dashed var(--border-glass);
            border-radius: 10px;
            padding: 14px 20px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            flex: 1;
            min-width: 200px;
        }
        .file-upload-btn:hover {
            border-color: var(--gold);
            background: rgba(234, 179, 8, 0.08);
        }

        /* Gallery Grid */
        .gallery-admin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 12px;
            margin-top: 15px;
        }
        .gallery-item-wrap {
            position: relative;
            aspect-ratio: 4/5;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .gallery-item-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .btn-delete-photo {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #f5245f;
            color: #ff8fab;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
        }

        /* Custom Links List */
        .custom-link-item {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.03);
            padding: 10px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .custom-link-item select {
            width: 100px;
        }
        .custom-link-item input {
            flex: 1;
        }
        .btn-remove-link {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 18px;
            cursor: pointer;
            padding: 0 6px;
        }
        .btn-add-link {
            background: rgba(255, 255, 255, 0.05);
            border: 1px dashed var(--border-glass);
            color: var(--gold);
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
        }
        .btn-add-link:hover {
            background: rgba(234, 179, 8, 0.1);
            border-color: var(--gold);
        }

        /* Floating Save Bar */
        .bottom-save-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(1, 8, 32, 0.95);
            border-top: 1px solid var(--border-gold);
            padding: 14px 24px;
            display: flex;
            justify-content: center;
            gap: 14px;
            z-index: 100;
            backdrop-filter: blur(12px);
        }
        .btn-save-primary {
            background: linear-gradient(135deg, #10b981, #059669);
            color: #fff;
            border: none;
            padding: 12px 32px;
            border-radius: 30px;
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-preview-link {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border-glass);
            color: #fff;
            padding: 12px 20px;
            border-radius: 30px;
            font-size: 0.88rem;
            font-weight: 700;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Toast notification */
        #toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: #10b981;
            color: #fff;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 1000;
            transition: transform 0.3s ease;
        }
        #toast.show {
            transform: translateX(-50%) translateY(0);
        }
        #toast.error {
            background: #ef4444;
        }

        /* No Token Screen */
        .token-request-box {
            max-width: 480px;
            margin: 60px auto;
            padding: 36px 30px;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Navegación Superior -->
    <header class="top-nav">
        <a href="/2026/" class="nav-logo">
            <span>👑</span>
            <span>Miss Universo <?= $sedeTitle ?></span>
        </a>
        <span class="nav-badge">Legado 2026</span>
    </header>

    <!-- Notificaciones Toast -->
    <div id="toast">¡Cambios guardados con éxito!</div>

    <?php if (!$candidate): ?>
    <!-- PANTALLA: SOLICITAR ACCESO MÁGICO -->
    <div class="main-container">
        <div class="glass token-request-box">
            <div style="font-size: 3rem; margin-bottom: 12px;">👑</div>
            <h1 style="font-family:'Cormorant Garamond', serif; font-size:2rem; color:var(--gold); margin-bottom:8px;">Portal de Embajadoras 2026</h1>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:24px;">
                Ingresa con tu enlace seguro sin contraseñas. Si no lo tienes a mano, ingresa tu correo registrado y te lo enviaremos de inmediato.
            </p>

            <?php if (!empty($errorMsg)): ?>
            <div style="background:rgba(239, 68, 68, 0.15); border:1px solid #ef4444; color:#fca5a5; padding:12px; border-radius:10px; font-size:0.85rem; margin-bottom:20px;">
                <?= htmlspecialchars($errorMsg) ?>
            </div>
            <?php endif; ?>

            <form id="requestTokenForm" onsubmit="handleRequestToken(event);">
                <div class="form-group" style="text-align:left;">
                    <label class="form-label">Correo Personal Registrado</label>
                    <input type="email" id="reqEmail" class="form-input" required placeholder="ejemplo@gmail.com">
                </div>
                <button type="submit" id="btnReqSubmit" class="btn-instagram-share" style="width:100%; margin-top:10px;">
                    ✉️ Enviar mi Enlace de Acceso
                </button>
            </form>

            <div style="margin-top:28px; border-top:1px solid rgba(255,255,255,0.08); padding-top:20px; font-size:0.8rem; color:#64748b;">
                ¿Cambiaste de correo? Contáctanos a <br>
                <a href="mailto:contacto@missuniverso<?= $sede ?>.cl" style="color:var(--gold); text-decoration:none;">contacto@missuniverso<?= $sede ?>.cl</a>
            </div>
        </div>
    </div>

    <script>
        async function handleRequestToken(e) {
            e.preventDefault();
            const btn = document.getElementById('btnReqSubmit');
            const email = document.getElementById('reqEmail').value;
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            try {
                const fd = new FormData();
                fd.append('action', 'request_token');
                fd.append('sede', '<?= $sede ?>');
                fd.append('email', email);

                const res = await fetch('/2026/api.php', { method: 'POST', body: fd });
                const data = await res.json();

                if (data.status === 'success') {
                    showToast(data.message, false);
                    btn.textContent = '¡Enlace Enviado!';
                    btn.style.background = '#10b981';
                } else {
                    showToast(data.message, true);
                    btn.textContent = 'Reintentar';
                    btn.disabled = false;
                }
            } catch (err) {
                showToast('Error de conexión', true);
                btn.disabled = false;
            }
        }

        function showToast(msg, isError = false) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = isError ? 'show error' : 'show';
            setTimeout(() => { t.className = ''; }, 4000);
        }
    </script>

    <?php else: ?>
    <!-- PANTALLA: PANEL DE EDICIÓN DE LA CANDIDATA -->
    <main class="main-container">

        <!-- Hero Card de la Candidata -->
        <div class="glass profile-hero">
            <div class="avatar-container">
                <img id="mainAvatarImg" src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="<?= htmlspecialchars($candidate['full_name']) ?>" class="avatar-img">
                <div class="avatar-crown">👑</div>
            </div>

            <h1 class="cand-name"><?= htmlspecialchars($candidate['full_name']) ?></h1>
            <div class="cand-title"><?= htmlspecialchars($candidate['title_badge'] ?? 'Embajadora Oficial 2026') ?></div>

            <p style="color:#cbd5e1; font-size:0.9rem; max-width:540px; margin:0 auto 15px;">
                ¡Bienvenida a tu panel oficial! Desde aquí administras tu presencia en el <strong>Salón del Legado 2026</strong>, personalizas tus enlaces y activas tu Linktree oficial para tus redes sociales.
            </p>

            <!-- Botón Destacado para Instagram -->
            <button type="button" class="btn-instagram-share" onclick="copyInstagramLink();">
                <span>⚡</span>
                <span id="btnCopyInstaText">Copiar Linktree para mi Instagram</span>
            </button>

            <!-- Vanity Links -->
            <div class="vanity-links-box">
                <div class="vanity-card">
                    <div class="vanity-card-header">
                        <span class="vanity-card-title">1. Linktree / Bio-Link</span>
                        <span>🔗</span>
                    </div>
                    <div class="vanity-url" id="previewUrlLinktree"><?= $baseUrl ?>/2026/#<span class="dyn-user"><?= htmlspecialchars($candidate['username']) ?></span></div>
                    <button type="button" class="btn-copy" onclick="copyText('<?= $baseUrl ?>/2026/#' + currentUsername, this);">Copiar Enlace</button>
                </div>

                <div class="vanity-card">
                    <div class="vanity-card-header">
                        <span class="vanity-card-title">2. Portafolio Editorial</span>
                        <span>📖</span>
                    </div>
                    <div class="vanity-url" id="previewUrlEditorial"><?= $baseUrl ?>/2026/<span class="dyn-user"><?= htmlspecialchars($candidate['username']) ?></span></div>
                    <button type="button" class="btn-copy" onclick="copyText('<?= $baseUrl ?>/2026/' + currentUsername, this);">Copiar Enlace</button>
                </div>
            </div>

            <!-- Caja de Correo Institucional -->
            <div class="inst-box">
                <div class="inst-box-info">
                    <h4>📩 Correo Oficial Miss Universo: <span id="dynInstEmail"><?= htmlspecialchars($candidate['inst_email']) ?></span></h4>
                    <p>Alias institucional que puedes poner en tu perfil o contratos; redirige a tu correo personal (<?= htmlspecialchars($candidate['email_personal']) ?>).</p>
                </div>
                <button type="button" class="btn-copy" onclick="copyText(document.getElementById('dynInstEmail').textContent, this);">Copiar Correo</button>
            </div>
        </div>

        <form id="profileForm" onsubmit="saveProfile(event);">

            <!-- SECCIÓN 1: Visibilidad & Modos -->
            <div class="glass section-card">
                <div class="section-header">
                    <span>⚙️</span>
                    <h3>Visibilidad y Formato de Presentación</h3>
                </div>

                <div class="toggle-row">
                    <div class="toggle-info">
                        <h4>Activar Linktree / Bio-Link (/2026/#<?= htmlspecialchars($candidate['username']) ?>)</h4>
                        <p>Habilita la tarjeta compacta con botones a tus redes y contacto directo, ideal para poner en la bio de tu Instagram o TikTok.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="mode_linktree" <?= $candidate['mode_linktree'] ? 'checked' : '' ?>>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="toggle-row">
                    <div class="toggle-info">
                        <h4>Activar Perfil Editorial (/2026/<?= htmlspecialchars($candidate['username']) ?>)</h4>
                        <p>Habilita la página completa tipo revista de alta costura con tu biografía, sesión fotográfica y mensaje.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="mode_editorial" <?= $candidate['mode_editorial'] ? 'checked' : '' ?>>
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Modo Registro Histórico Mínimo -->
                <div class="minimal-callout">
                    <div class="toggle-row" style="padding:0; border:none;">
                        <div class="toggle-info">
                            <h4>🔒 Modo Registro Histórico Mínimo (Máxima Privacidad)</h4>
                            <p>
                                Si ya no deseas exponer tus redes sociales o prefieres un perfil reservado, activa esta opción. 
                                Se ocultarán tus enlaces, biografía y fotos secundarias. Tu nombre formal y fotografía histórica 
                                quedarán preservados como registro oficial de la edición 2026.
                            </p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="is_minimal_record" <?= $candidate['is_minimal_record'] ? 'checked' : '' ?> onchange="toggleMinimalModeNotice();">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <p style="font-size:0.75rem; color:#94a3b8; margin-top:10px;">
                        ℹ️ Para cualquier consulta o solicitud especial sobre el archivo histórico, puedes contactarnos respondiendo a <a href="mailto:contacto@missuniverso<?= $sede ?>.cl" style="color:var(--gold);">contacto@missuniverso<?= $sede ?>.cl</a>.
                    </p>
                </div>
            </div>

            <!-- SECCIÓN 2: Fotografía Oficial & Galería -->
            <div class="glass section-card">
                <div class="section-header">
                    <span>📸</span>
                    <h3>Fotografía Principal y Portafolio</h3>
                </div>

                <div class="form-group">
                    <label class="form-label">Foto de Perfil Principal (Retrato Oficial)</label>
                    <div class="photo-uploader-box">
                        <div class="photo-preview-wrap">
                            <img id="previewMainPhoto" src="<?= htmlspecialchars($candidate['photo_main']) ?>" alt="Foto Principal">
                        </div>
                        <div class="file-upload-btn" onclick="document.getElementById('fileMainPhoto').click();">
                            <div style="font-size: 1.5rem; margin-bottom: 4px;">📤</div>
                            <strong>Cambiar Foto Principal</strong>
                            <div class="form-help">JPG, PNG o WebP (máx. 12 MB)</div>
                        </div>
                        <input type="file" id="fileMainPhoto" accept="image/*" style="display:none;" onchange="uploadPhoto('main', this);">
                    </div>
                </div>

                <div class="form-group" style="margin-top: 25px;">
                    <label class="form-label">Galería de Portafolio / Pasarela (Fotos Secundarias)</label>
                    <div class="file-upload-btn" onclick="document.getElementById('fileGalleryPhoto').click();">
                        <div style="font-size: 1.5rem; margin-bottom: 4px;">➕</div>
                        <strong>Agregar Foto a mi Portafolio</strong>
                        <div class="form-help">Sube fotos de tus desfiles, sesiones o proyectos</div>
                    </div>
                    <input type="file" id="fileGalleryPhoto" accept="image/*" style="display:none;" onchange="uploadPhoto('gallery', this);">

                    <div class="gallery-admin-grid" id="galleryContainer">
                        <?php
                        $gallery = [];
                        if (!empty($candidate['photos_gallery'])) {
                            $gallery = json_decode($candidate['photos_gallery'], true) ?: [];
                        }
                        foreach ($gallery as $gPhoto):
                        ?>
                        <div class="gallery-item-wrap" data-url="<?= htmlspecialchars($gPhoto) ?>">
                            <img src="<?= htmlspecialchars($gPhoto) ?>" alt="Galería">
                            <button type="button" class="btn-delete-photo" onclick="deleteGalleryPhoto('<?= htmlspecialchars($gPhoto) ?>', this);">&times;</button>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN 3: Identidad y Contacto -->
            <div class="glass section-card">
                <div class="section-header">
                    <span>👑</span>
                    <h3>Identidad y Enlace Personalizado</h3>
                </div>

                <div class="form-group">
                    <label class="form-label">Usuario Corto (Slug de tus enlaces)</label>
                    <input type="text" id="username" class="form-input" value="<?= htmlspecialchars($candidate['username']) ?>" required oninput="updateUserPreview(this.value);">
                    <div class="form-help">Define tu dirección oficial: <strong>missuniverso<?= $sede ?>.cl/2026/<span class="dyn-user"><?= htmlspecialchars($candidate['username']) ?></span></strong></div>
                </div>

                <div class="form-group">
                    <label class="form-label">Correo Personal (Destino de Forwarding)</label>
                    <input type="email" id="email_personal" class="form-input" value="<?= htmlspecialchars($candidate['email_personal']) ?>" required>
                    <div class="form-help">Los correos enviados a <strong><span class="dyn-user"><?= htmlspecialchars($candidate['username']) ?></span>@2026.missuniverso<?= $sede ?>.cl</strong> se reenviarán a esta casilla.</div>
                </div>

                <div class="form-group">
                    <label class="form-label">Ocupación / Profesión Actual</label>
                    <input type="text" id="occupation" class="form-input" value="<?= htmlspecialchars($candidate['occupation'] ?? '') ?>" placeholder="Ej: Abogada & Modelo Profesional">
                </div>

                <div class="form-group">
                    <label class="form-label">Biografía o Mensaje Personal</label>
                    <textarea id="bio" class="form-textarea" rows="4" placeholder="Comparte tu experiencia, metas y lo que significó representar a tu ciudad en Miss Universo..."><?= htmlspecialchars($candidate['bio'] ?? '') ?></textarea>
                </div>
            </div>

            <!-- SECCIÓN 4: Redes Sociales y Links del Linktree -->
            <div class="glass section-card">
                <div class="section-header">
                    <span>🔗</span>
                    <h3>Redes Sociales y Enlaces del Bio-Link</h3>
                </div>

                <div class="form-group">
                    <label class="form-label">Instagram (@usuario)</label>
                    <input type="text" id="instagram" class="form-input" value="<?= htmlspecialchars($candidate['instagram'] ?? '') ?>" placeholder="ej: camila_valenzuela">
                </div>

                <div class="form-group">
                    <label class="form-label">TikTok (@usuario)</label>
                    <input type="text" id="tiktok" class="form-input" value="<?= htmlspecialchars($candidate['tiktok'] ?? '') ?>" placeholder="ej: camila.model">
                </div>

                <div class="form-group">
                    <label class="form-label">WhatsApp de Contacto o Booking (+56 9...)</label>
                    <input type="text" id="whatsapp" class="form-input" value="<?= htmlspecialchars($candidate['whatsapp'] ?? '') ?>" placeholder="+56 9 1234 5678">
                </div>

                <div class="form-group" style="margin-top: 25px;">
                    <label class="form-label">Enlaces Personalizados Adicionales (Tiendas, Portafolio, Prensa)</label>
                    <div id="customLinksList">
                        <!-- Renderizado dinámicamente con JS -->
                    </div>
                    <button type="button" class="btn-add-link" onclick="addCustomLinkRow();">➕ Agregar Otro Enlace al Linktree</button>
                </div>
            </div>

            <!-- Barra Flotante de Guardado -->
            <div class="bottom-save-bar">
                <a id="btnLiveEditorial" href="/2026/<?= htmlspecialchars($candidate['username']) ?>" target="_blank" class="btn-preview-link">
                    <span>📖</span> Ver Perfil
                </a>
                <a id="btnLiveLinktree" href="/2026/#<?= htmlspecialchars($candidate['username']) ?>" target="_blank" class="btn-preview-link">
                    <span>🔗</span> Ver Linktree
                </a>
                <button type="submit" id="btnSubmitForm" class="btn-save-primary">
                    <span>💾</span> Guardar Cambios
                </button>
            </div>
        </form>
    </main>

    <script>
        const MAGIC_TOKEN = "<?= htmlspecialchars($candidate['magic_token']) ?>";
        const CURRENT_SEDE = "<?= $sede ?>";
        let currentUsername = "<?= htmlspecialchars($candidate['username']) ?>";
        let customLinksData = [];

        try {
            customLinksData = <?= !empty($candidate['custom_links']) ? $candidate['custom_links'] : '[]' ?>;
            if (!Array.isArray(customLinksData)) customLinksData = [];
        } catch(e) { customLinksData = []; }

        // Inicializar filas de enlaces personalizados
        window.addEventListener('DOMContentLoaded', () => {
            renderCustomLinksRows();
        });

        function updateUserPreview(val) {
            const clean = val.toLowerCase().replace(/[^a-z0-9._-]/g, '');
            currentUsername = clean || 'usuario';
            document.querySelectorAll('.dyn-user').forEach(el => el.textContent = currentUsername);
            document.getElementById('dynInstEmail').textContent = `${currentUsername}@2026.missuniverso${CURRENT_SEDE}.cl`;
            document.getElementById('btnLiveEditorial').href = `/2026/${currentUsername}`;
            document.getElementById('btnLiveLinktree').href = `/2026/#${currentUsername}`;
        }

        function copyInstagramLink() {
            const link = `https://missuniverso${CURRENT_SEDE}.cl/2026/#${currentUsername}`;
            navigator.clipboard.writeText(link).then(() => {
                const btnText = document.getElementById('btnCopyInstaText');
                const orig = btnText.textContent;
                btnText.textContent = '¡Enlace Copiado al Portapapeles!';
                showToast('¡Link copiado! Pégalo en tu biografía de Instagram.');
                setTimeout(() => { btnText.textContent = orig; }, 3000);
            });
        }

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

        function showToast(msg, isError = false) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = isError ? 'show error' : 'show';
            setTimeout(() => { t.className = ''; }, 3500);
        }

        function toggleMinimalModeNotice() {
            const isMin = document.getElementById('is_minimal_record').checked;
            if (isMin) {
                showToast('Modo Privado activado: Se ocultarán tus links personales.');
            }
        }

        // Subir Foto (Principal o Galería)
        async function uploadPhoto(type, input) {
            if (!input.files || !input.files[0]) return;
            const file = input.files[0];
            const fd = new FormData();
            fd.append('action', 'upload_photo');
            fd.append('token', MAGIC_TOKEN);
            fd.append('type', type);
            fd.append('photo', file);

            showToast('Subiendo fotografía...', false);

            try {
                const res = await fetch('/2026/api.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'success') {
                    showToast('¡Foto actualizada con éxito!');
                    if (type === 'main') {
                        document.getElementById('previewMainPhoto').src = data.photo_url;
                        document.getElementById('mainAvatarImg').src = data.photo_url;
                    } else {
                        // Agregar a la galería
                        const container = document.getElementById('galleryContainer');
                        const div = document.createElement('div');
                        div.className = 'gallery-item-wrap';
                        div.setAttribute('data-url', data.photo_url);
                        div.innerHTML = `
                            <img src="${data.photo_url}" alt="Galería">
                            <button type="button" class="btn-delete-photo" onclick="deleteGalleryPhoto('${data.photo_url}', this);">&times;</button>
                        `;
                        container.appendChild(div);
                    }
                } else {
                    showToast(data.message, true);
                }
            } catch (err) {
                showToast('Error de conexión al subir la imagen', true);
            }
            input.value = '';
        }

        // Eliminar Foto de Galería
        async function deleteGalleryPhoto(photoUrl, btn) {
            if (!confirm('¿Deseas eliminar esta foto de tu portafolio?')) return;
            const fd = new FormData();
            fd.append('action', 'delete_gallery_photo');
            fd.append('token', MAGIC_TOKEN);
            fd.append('photo_url', photoUrl);

            try {
                const res = await fetch('/2026/api.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'success') {
                    btn.closest('.gallery-item-wrap').remove();
                    showToast('Foto eliminada');
                } else {
                    showToast(data.message, true);
                }
            } catch (e) {
                showToast('Error al eliminar', true);
            }
        }

        // Renderizado de Enlaces Personalizados
        function renderCustomLinksRows() {
            const list = document.getElementById('customLinksList');
            list.innerHTML = '';
            customLinksData.forEach((item, idx) => {
                const row = document.createElement('div');
                row.className = 'custom-link-item';
                row.innerHTML = `
                    <select class="form-select custom-icon" style="width:110px;" onchange="updateCustomLinkData(${idx}, 'icon', this.value);">
                        <option value="link" ${item.icon === 'link' ? 'selected' : ''}>🔗 Enlace</option>
                        <option value="instagram" ${item.icon === 'instagram' ? 'selected' : ''}>📷 Instagram</option>
                        <option value="tiktok" ${item.icon === 'tiktok' ? 'selected' : ''}>🎵 TikTok</option>
                        <option value="whatsapp" ${item.icon === 'whatsapp' ? 'selected' : ''}>💬 WhatsApp</option>
                        <option value="shop" ${item.icon === 'shop' ? 'selected' : ''}>🛍️ Tienda</option>
                        <option value="portfolio" ${item.icon === 'portfolio' ? 'selected' : ''}>📄 Portafolio</option>
                        <option value="web" ${item.icon === 'web' ? 'selected' : ''}>🌐 Web</option>
                    </select>
                    <input type="text" class="form-input custom-title" value="${item.title || ''}" placeholder="Título (ej: Mi Marca)" oninput="updateCustomLinkData(${idx}, 'title', this.value);">
                    <input type="url" class="form-input custom-url" value="${item.url || ''}" placeholder="https://..." oninput="updateCustomLinkData(${idx}, 'url', this.value);">
                    <button type="button" class="btn-remove-link" onclick="removeCustomLinkRow(${idx});" title="Eliminar">&times;</button>
                `;
                list.appendChild(row);
            });
        }

        function addCustomLinkRow() {
            customLinksData.push({ title: '', url: 'https://', icon: 'link' });
            renderCustomLinksRows();
        }

        function removeCustomLinkRow(idx) {
            customLinksData.splice(idx, 1);
            renderCustomLinksRows();
        }

        function updateCustomLinkData(idx, field, value) {
            if (customLinksData[idx]) {
                customLinksData[idx][field] = value;
            }
        }

        // Guardar Perfil Completo
        async function saveProfile(e) {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitForm');
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span> Guardando...';

            const fd = new FormData();
            fd.append('action', 'save_profile');
            fd.append('token', MAGIC_TOKEN);
            fd.append('username', document.getElementById('username').value.trim());
            fd.append('email_personal', document.getElementById('email_personal').value.trim());
            fd.append('occupation', document.getElementById('occupation').value.trim());
            fd.append('bio', document.getElementById('bio').value.trim());
            fd.append('instagram', document.getElementById('instagram').value.trim());
            fd.append('tiktok', document.getElementById('tiktok').value.trim());
            fd.append('whatsapp', document.getElementById('whatsapp').value.trim());
            fd.append('mode_linktree', document.getElementById('mode_linktree').checked ? '1' : '0');
            fd.append('mode_editorial', document.getElementById('mode_editorial').checked ? '1' : '0');
            fd.append('is_minimal_record', document.getElementById('is_minimal_record').checked ? '1' : '0');
            
            // Filtrar enlaces vacíos
            const validLinks = customLinksData.filter(l => l.title.trim() !== '' && l.url.trim() !== '');
            fd.append('custom_links', JSON.stringify(validLinks));

            try {
                const res = await fetch('/2026/api.php', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.status === 'success') {
                    showToast('¡Perfil y enlaces guardados exitosamente!');
                    updateUserPreview(data.candidate.username);
                } else {
                    showToast(data.message, true);
                }
            } catch (err) {
                showToast('Error de conexión al guardar cambios', true);
            }

            btn.disabled = false;
            btn.innerHTML = '<span>💾</span> Guardar Cambios';
        }
    </script>
    <?php endif; ?>

</body>
</html>
