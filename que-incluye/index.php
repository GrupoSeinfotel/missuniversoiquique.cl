<?php
/**
 * ¿QUÉ INCLUYE Y BASES OFICIALES · MISS UNIVERSE 2027
 * Franquicias Oficiales Arica e Iquique
 */

$host = $_SERVER['HTTP_HOST'] ?? '';
$isIquique = strpos($host, 'iquique') !== false;

if (isset($_GET['sede']) && in_array(strtolower($_GET['sede']), ['arica', 'iquique'])) {
    $isIquique = strtolower($_GET['sede']) === 'iquique';
}

$sede = $isIquique ? 'iquique' : 'arica';
$sedeNombre = $isIquique ? 'Iquique' : 'Arica';
$regionNombre = $isIquique ? 'Tarapacá' : 'Arica y Parinacota';
$colorAcento = '#f5245f';
$colorDorado = '#d4af37';
$whatsappNumber = '56956762116';
$emailDomain = $isIquique ? '2027.missuniversoiquique.cl' : '2027.missuniversoarica.cl';
$urlSite = $isIquique ? 'https://missuniversoiquique.cl' : 'https://missuniversoarica.cl';

$waMsg = urlencode("Hola Organización Miss Universo {$sedeNombre} 2027, estuve revisando lo que incluye el certamen y las bases, y me gustaría resolver una consulta.");
$waUrl = "https://wa.me/{$whatsappNumber}?text={$waMsg}";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>¿Qué Incluye y Bases Oficiales 2027 | Miss Universe <?= $sedeNombre ?></title>
    <meta name="description" content="Conoce la estructura oficial de entregables, formación, vestuarios, eventos y proyección durante todo el año 2027 para las Candidatas Oficiales de Miss Universe <?= $sedeNombre ?>.">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400;1,600&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #040816;
            --bg-card: rgba(8, 16, 42, 0.88);
            --border-glow: rgba(245, 36, 95, 0.35);
            --border-gold: rgba(212, 175, 55, 0.45);
            --accent-pink: #f5245f;
            --accent-gold: #d4af37;
            --gold-bright: #ffd700;
            --text-light: #f8fafc;
            --text-muted: #94a3b8;
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Manrope', -apple-system, sans-serif;
            --font-cinzel: 'Cinzel', serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(245, 36, 95, 0.14) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.95) 0%, #030712 100%);
            background-attachment: fixed;
            color: var(--text-light);
            font-family: var(--font-sans);
            line-height: 1.6;
            min-height: 100vh;
            padding-bottom: 90px;
        }

        header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(4, 8, 22, 0.88);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            padding: 14px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
        }

        .crown-icon {
            font-size: 1.8rem;
            filter: drop-shadow(0 0 10px rgba(245, 36, 95, 0.6));
        }

        .logo-text {
            display: flex;
            flex-direction: column;
        }

        .logo-title {
            font-family: var(--font-serif);
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .logo-title span {
            color: var(--accent-gold);
        }

        .logo-sub {
            font-size: 0.7rem;
            color: var(--text-muted);
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sede-switch {
            display: flex;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 30px;
            padding: 3px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sede-switch a {
            padding: 6px 14px;
            font-size: 0.75rem;
            font-weight: 700;
            color: #cbd5e1;
            text-decoration: none;
            border-radius: 20px;
            transition: all 0.2s;
        }

        .sede-switch a.active {
            background: linear-gradient(135deg, var(--accent-pink), #eab308);
            color: #fff;
            box-shadow: 0 2px 8px rgba(245, 36, 95, 0.4);
        }

        .btn-casting-top {
            background: linear-gradient(135deg, var(--accent-pink), var(--accent-gold));
            color: #fff;
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 800;
            text-decoration: none;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 4px 15px rgba(245, 36, 95, 0.35);
            transition: transform 0.2s, box-shadow 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-casting-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 36, 95, 0.55);
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 35px 20px 60px;
        }

        /* Hero */
        .hero {
            text-align: center;
            margin-bottom: 45px;
        }

        .badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            background: rgba(212, 175, 55, 0.12);
            border: 1px solid rgba(212, 175, 55, 0.35);
            border-radius: 30px;
            color: var(--gold-bright);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        .hero h1 {
            font-family: var(--font-serif);
            font-size: 2.6rem;
            font-weight: 900;
            line-height: 1.15;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #ffffff 40%, var(--gold-bright) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p.lead {
            font-size: 1.1rem;
            color: #cbd5e1;
            max-width: 780px;
            margin: 0 auto 25px;
            line-height: 1.6;
        }

        .hero-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn-hero-primary {
            background: linear-gradient(135deg, var(--accent-pink) 0%, #eab308 100%);
            color: #fff;
            padding: 14px 28px;
            border-radius: 14px;
            font-size: 1rem;
            font-weight: 900;
            text-decoration: none;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 8px 25px rgba(245, 36, 95, 0.4);
            transition: all 0.25s ease;
        }

        .btn-hero-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(245, 36, 95, 0.6);
        }

        .btn-hero-secondary {
            background: rgba(255, 255, 255, 0.07);
            color: #f1f5f9;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 14px 24px;
            border-radius: 14px;
            font-size: 0.95rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.25s ease;
        }

        .btn-hero-secondary:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: var(--accent-gold);
            color: var(--gold-bright);
        }

        /* Pillars Grid */
        .section-title {
            text-align: center;
            margin-bottom: 35px;
        }

        .section-title h2 {
            font-family: var(--font-serif);
            font-size: 2rem;
            color: #fff;
            margin-bottom: 10px;
        }

        .section-title p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }

        .pillars-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 22px;
            margin-bottom: 50px;
        }

        @media (min-width: 768px) {
            .pillars-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .pillar-card {
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 28px;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .pillar-card:hover {
            transform: translateY(-4px);
            border-color: rgba(212, 175, 55, 0.5);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 36, 95, 0.15);
        }

        .pillar-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-pink), var(--accent-gold));
            opacity: 0.85;
        }

        .pillar-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 18px;
        }

        .pillar-icon-box {
            width: 52px;
            height: 52px;
            background: rgba(245, 36, 95, 0.12);
            border: 1px solid rgba(245, 36, 95, 0.3);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            flex-shrink: 0;
        }

        .pillar-number {
            font-family: var(--font-cinzel);
            font-size: 0.8rem;
            color: var(--accent-gold);
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .pillar-title {
            font-family: var(--font-serif);
            font-size: 1.25rem;
            color: #ffffff;
            font-weight: 700;
            line-height: 1.25;
        }

        .pillar-card ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .pillar-card li {
            position: relative;
            padding-left: 24px;
            font-size: 0.92rem;
            color: #cbd5e1;
            line-height: 1.5;
        }

        .pillar-card li strong {
            color: #ffffff;
        }

        .pillar-card li::before {
            content: '✦';
            position: absolute;
            left: 0;
            top: 0;
            color: var(--accent-gold);
            font-size: 0.9rem;
        }

        .pillar-highlight-tag {
            margin-top: 18px;
            padding: 10px 14px;
            background: rgba(212, 175, 55, 0.08);
            border-left: 3px solid var(--accent-gold);
            border-radius: 8px;
            font-size: 0.82rem;
            color: #fde047;
            line-height: 1.4;
        }

        /* Valuation Box */
        .valuation-box {
            background: linear-gradient(135deg, rgba(8, 16, 42, 0.95), rgba(20, 10, 30, 0.95));
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 22px;
            padding: 30px;
            text-align: center;
            margin-bottom: 60px;
            position: relative;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }

        .valuation-badge {
            background: var(--accent-gold);
            color: #040816;
            font-weight: 900;
            font-size: 0.8rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 12px;
        }

        .valuation-title {
            font-family: var(--font-serif);
            font-size: 1.8rem;
            color: #ffffff;
            margin-bottom: 10px;
        }

        .valuation-text {
            color: #cbd5e1;
            max-width: 720px;
            margin: 0 auto 20px;
            font-size: 0.95rem;
        }

        .valuation-compare {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 25px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .compare-item {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 16px 24px;
            min-width: 220px;
        }

        .compare-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }

        .compare-val {
            font-size: 1.5rem;
            font-weight: 900;
            color: #ffffff;
        }

        .compare-val.crossed {
            text-decoration: line-through;
            color: #ef4444;
            opacity: 0.8;
        }

        .compare-val.highlight {
            color: var(--gold-bright);
            font-size: 1.8rem;
        }

        /* Bases Oficiales Section */
        .bases-section {
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 22px;
            padding: 35px 28px;
            margin-bottom: 50px;
        }

        .bases-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .bases-header h2 {
            font-family: var(--font-serif);
            font-size: 2rem;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .bases-header p {
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .articles-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .article-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 18px 22px;
            transition: border-color 0.2s;
        }

        .article-card:hover {
            border-color: rgba(212, 175, 55, 0.4);
        }

        .article-title {
            font-size: 1rem;
            font-weight: 800;
            color: var(--gold-bright);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .article-body {
            font-size: 0.9rem;
            color: #cbd5e1;
            line-height: 1.55;
        }

        .article-body strong {
            color: #ffffff;
        }

        /* Bottom Floating CTA Bar */
        .cta-footer-bar {
            text-align: center;
            background: linear-gradient(135deg, rgba(8, 16, 42, 0.95), rgba(4, 8, 22, 0.95));
            border: 1px solid rgba(245, 36, 95, 0.35);
            border-radius: 22px;
            padding: 35px 25px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
        }

        .cta-footer-bar h3 {
            font-family: var(--font-serif);
            font-size: 1.7rem;
            color: #ffffff;
            margin-bottom: 12px;
        }

        .cta-footer-bar p {
            color: var(--text-muted);
            font-size: 0.95rem;
            max-width: 600px;
            margin: 0 auto 25px;
        }

        .cta-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn-wa-footer {
            background: #25D366;
            color: #ffffff;
            padding: 14px 26px;
            border-radius: 14px;
            font-size: 0.95rem;
            font-weight: 800;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s;
        }

        .btn-wa-footer:hover {
            background: #20ba59;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        @media (max-width: 600px) {
            .hero h1 {
                font-size: 2rem;
            }
            .header-actions .btn-casting-top {
                display: none;
            }
            .valuation-compare {
                flex-direction: column;
                gap: 12px;
            }
            .compare-item {
                width: 100%;
            }
        }
    </style>
</head>
<body>

    <!-- Header Navigation -->
    <header>
        <a href="/" class="logo-wrap">
            <span class="crown-icon">👑</span>
            <div class="logo-text">
                <span class="logo-title">Miss Universe <span><?= $sedeNombre ?></span></span>
                <span class="logo-sub">Edición Oficial 2027</span>
            </div>
        </a>

        <div class="header-actions">
            <!-- Selector Arica / Iquique -->
            <div class="sede-switch">
                <a href="/que-incluye/?sede=iquique" class="<?= $isIquique ? 'active' : '' ?>">Iquique</a>
                <a href="/que-incluye/?sede=arica" class="<?= !$isIquique ? 'active' : '' ?>">Arica</a>
            </div>

            <a href="/casting/?sede=<?= $sede ?>" class="btn-casting-top">
                <span>👑 Postular</span>
            </a>
        </div>
    </header>

    <div class="container">

        <!-- Hero -->
        <section class="hero">
            <div class="badge-pill">
                <span>✦</span> Estructura Oficial de Entregables 2027 <span>✦</span>
            </div>
            <h1>¿Qué Incluye tu Participación Oficial?</h1>
            <p class="lead">
                Miss Universe <?= $sedeNombre ?> 2027 no es solo una noche de certamen; es una <strong>plataforma anual de formación ejecutiva, aceleración de marca personal y registro histórico</strong>. Cada candidata recibe un paquete de entregables reales e imborrables, independiente de quién resulte ganadora de la corona.
            </p>
            <div class="hero-actions">
                <a href="/casting/?sede=<?= $sede ?>" class="btn-hero-primary">
                    👑 Inscribirme en el Casting 2027
                </a>
                <a href="#bases" class="btn-hero-secondary">
                    📜 Ver Bases y Reglamentos
                </a>
            </div>
        </section>

        <!-- Los 7 Pilares de Valor Oficiales -->
        <div class="section-title">
            <h2>Los 7 Pilares de Entrega Garantizada</h2>
            <p>Todo lo que la Franquicia Oficial entrega e incluye a cada una de sus participantes:</p>
        </div>

        <div class="pillars-grid">

            <!-- 1. Formación y Preparación -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">🎓</div>
                    <div>
                        <div class="pillar-number">Pilar 01</div>
                        <div class="pillar-title">Talleres & Preparación de Alto Rendimiento</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Clases de Pasarela y Presencia Escénica:</strong> Postura, caminata de alta costura, giros y dominio de pasarela dictado por especialistas.</li>
                    <li><strong>Taller de Oratoria y Expresión:</strong> Manejo de la voz, comunicación asertiva, cómo hablar en público y responder con seguridad ante jurados y medios.</li>
                    <li><strong>Masterclass de Automaquillaje y Cuidado de Imagen:</strong> Técnicas profesionales de arreglo y estilismo para cámaras y galas.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    💡 <em>Habilidades aplicables para toda tu vida profesional, entrevistas laborales y marca personal.</em>
                </div>
            </div>

            <!-- 2. Vestuario y Producción de Escenario -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">👗</div>
                    <div>
                        <div class="pillar-number">Pilar 02</div>
                        <div class="pillar-title">Vestuario & Producción Oficial de Escenario</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Traje de Opening Oficial:</strong> Vestuario coordinado por la producción para la gran apertura del show.</li>
                    <li><strong>Traje de Baño Oficial Edición 2027:</strong> Línea oficial de pasarela del certamen incluida.</li>
                    <li><strong>Banda Oficial de Candidata Personalizada:</strong> Tu banda protocolar con tu nombre/sede entregada en la ceremonia oficial, la cual <strong>queda para siempre en tu poder</strong> como recuerdo histórico.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    ✨ <em>La producción provee el traje de opening, traje de baño y banda oficial sin costos de arriendo.</em>
                </div>
            </div>

            <!-- 3. Cobertura Fotográfica Oficial -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">📸</div>
                    <div>
                        <div class="pillar-number">Pilar 03</div>
                        <div class="pillar-title">Cobertura & Registro Fotográfico Oficial</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Fotografía Oficial de Candidata:</strong> Foto oficial de presentación con banda y estilismo para la web, pantallas gigantes y prensa.</li>
                    <li><strong>Cobertura Fotográfica en Eventos Clave:</strong> Registro profesional de tus pasos en la Imposición de Bandas, actividades del certamen y la Gran Gala Final (Opening, Traje de Baño y Gala).</li>
                    <li><strong>Acceso a la Galería Oficial en Alta Calidad:</strong> Todas las fotografías de escenario y eventos quedan disponibles para libre uso en tus redes y portafolio.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    🛡️ <em>Registro oficial transparente en todas las etapas públicas y protocolares del certamen.</em>
                </div>
            </div>

            <!-- 4. Plataforma Digital y Correo Corporativo -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">🌐</div>
                    <div>
                        <div class="pillar-number">Pilar 04</div>
                        <div class="pillar-title">Plataforma Digital & Correo Corporativo Propio</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Perfil Permanente en la Web Oficial:</strong> Tu biografía, fotografías y trayectoria quedan registradas de manera imborrable en el archivo histórico oficial del certamen (igual que la edición 2026).</li>
                    <li><strong>Correo Corporativo Institucional Propio:</strong> Tu cuenta oficial (<code>tunombre@<?= $emailDomain ?></code>) activa durante todo tu año para gestionar marcas y colaboraciones.</li>
                    <li><strong>Validación y Posicionamiento en Google:</strong> Huella digital verificada como participante de la franquicia Miss Universo Chile.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    💎 <em>Presencia digital profesional de por vida en el sitio web de mayor prestigio regional.</em>
                </div>
            </div>

            <!-- 5. Los Grandes Eventos Oficiales -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">👑</div>
                    <div>
                        <div class="pillar-number">Pilar 05</div>
                        <div class="pillar-title">Los Grandes Eventos Oficiales de la Franquicia</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Ceremonia de Imposición de Bandas:</strong> Evento protocolar exclusivo con asistencia de medios de comunicación, autoridades y auspiciadores.</li>
                    <li><strong>Gran Gala Final de Coronación:</strong> Producción de alta gama con escenario, iluminación y sonido con estándar televisivo, jurado calificador y cobertura de prensa.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    🌟 <em>Una experiencia escénica inolvidable que vivirás rodeada de tu familia y público regional.</em>
                </div>
            </div>

            <!-- 6. Trabajo y Proyección Todo el Año 2027 -->
            <div class="pillar-card">
                <div class="pillar-header">
                    <div class="pillar-icon-box">🌟</div>
                    <div>
                        <div class="pillar-number">Pilar 06</div>
                        <div class="pillar-title">Trabajo & Proyección Durante Todo el Año 2027</div>
                    </div>
                </div>
                <ul>
                    <li><strong>12 Meses de Acompañamiento y Vitrina:</strong> Independiente de quién resulte ganadora de la corona, la organización trabajará todo el año 2027 con todas las candidatas que deseen seguir mostrándose y activas.</li>
                    <li><strong>Convocatorias e Invitaciones a Eventos VIP:</strong> Desfiles de moda, inauguraciones comerciales, activaciones con auspiciadores, alfombras rojas y causas benéficas/sociales.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    🤝 <em>El certamen es el punto de partida: tu año como embajadora de imagen continúa durante todo el 2027.</em>
                </div>
            </div>

            <!-- 7. Título Oficial y Certificación -->
            <div class="pillar-card" style="grid-column: 1 / -1;">
                <div class="pillar-header">
                    <div class="pillar-icon-box">📜</div>
                    <div>
                        <div class="pillar-number">Pilar 07</div>
                        <div class="pillar-title">Título Oficial Histórico & Certificación Curricular</div>
                    </div>
                </div>
                <ul>
                    <li><strong>Título Oficial de Candidata Miss Universo 2027:</strong> Quedas oficialmente registrada en los archivos históricos de la franquicia más importante del planeta.</li>
                    <li><strong>Diploma Oficial de Participación y Honor:</strong> Documento formal con valor curricular emitido por la Dirección Oficial, que respalda tu paso por la academia y el certamen.</li>
                </ul>
                <div class="pillar-highlight-tag">
                    🏆 <em>Un mérito prestigioso y comprobable para tu currículum profesional y carrera artística o corporativa.</em>
                </div>
            </div>

        </div>

        <!-- Caja de Valorización Real -->
        <div class="valuation-box">
            <span class="valuation-badge">Inversión Inteligente en tu Futuro</span>
            <h3 class="valuation-title">Estructura de Valor y Ahorro Real</h3>
            <p class="valuation-text">
                Si una candidata contratara por separado clases de pasarela profesional, talleres de oratoria, vestuarios de escenario, fotografía de prensa, perfil web con servidor y gestiones de prensa, el costo individual supera los <strong>$1.200.000 CLP</strong>. En Miss Universo <?= $sedeNombre ?> todo está coordinado en un solo arancel accesible.
            </p>
            <div class="valuation-compare">
                <div class="compare-item">
                    <div class="compare-label">Valor de Mercado de los Entregables</div>
                    <div class="compare-val crossed">$1.200.000 CLP</div>
                </div>
                <div class="compare-item">
                    <div class="compare-label">Inversión Preventa (Diciembre)</div>
                    <div class="compare-val highlight">$250.000 CLP</div>
                    <small style="color:#94a3b8; display:block; margin-top:4px;">o en 3 cuotas mensuales</small>
                </div>
                <div class="compare-item">
                    <div class="compare-label">Plan Embajadora (5 Amigas)</div>
                    <div class="compare-val" style="color:#38bdf8;">100% GRATIS</div>
                    <small style="color:#38bdf8; display:block; margin-top:4px;">Se te reembolsa tu abono de $70.000</small>
                </div>
            </div>
        </div>

        <!-- ==============================================================
             BASES OFICIALES Y REGLAMENTO GENERAL 2027
             ============================================================== -->
        <section class="bases-section" id="bases">
            <div class="bases-header">
                <h2>📜 Bases Oficiales y Reglamento General 2027</h2>
                <p>Normas de postulación, elegibilidad y compromisos de la Franquicia Miss Universe <?= $sedeNombre ?></p>
            </div>

            <div class="articles-list">
                <div class="article-card">
                    <div class="article-title">✦ Artículo 1: Convocatoria y Objeto</div>
                    <div class="article-body">
                        La Organización Oficial convoca al proceso de selección, formación y coronación para <strong>Miss Universe <?= $sedeNombre ?> 2027</strong>, cuya ganadora representará oficialmente a la sede en la Final Nacional de Miss Universo Chile. El certamen se concibe como una plataforma integral de formación y desarrollo personal, artístico y social.
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 2: Requisitos de Elegibilidad</div>
                    <div class="article-body">
                        Podrán postular todas las mujeres que cumplan con los siguientes requisitos a la fecha del certamen:
                        <ul style="margin: 8px 0 0 18px; color: #cbd5e1;">
                            <li>Tener 18 años cumplidos al momento de la postulación.</li>
                            <li>Contar con nacionalidad chilena o residencia legal en el país.</li>
                            <li>Vínculo con la sede <?= $sedeNombre ?> / Región de <?= $regionNombre ?> (residencia, estudios, trabajo o vínculo familiar).</li>
                            <li>Disposición y compromiso para cumplir con el calendario de clases, ensayos e hitos del certamen.</li>
                        </ul>
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 3: Modalidad de Inscripción y Reserva de Cupo</div>
                    <div class="article-body">
                        Para asegurar el cupo oficial y activar los beneficios formativos y digitales, es <strong>obligatorio realizar el Abono Inicial de $70.000 CLP</strong> (o el pago de contado/preventa seleccionado). En caso de optar por el <strong>Plan Embajadora</strong>, dicho abono de $70.000 se reintegra íntegramente (100% de devolución) al momento de validar 5 candidatas referidas confirmadas.
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 4: Vestuarios a Cargo de la Organización y de la Candidata</div>
                    <div class="article-body">
                        La Organización proveerá el <strong>Traje de Opening Oficial</strong>, el <strong>Traje de Baño Oficial de Pasarela</strong> y la <strong>Banda Oficial Personalizada</strong>. Cada participante deberá proveer por sus propios medios su calzado reglamentario, traje de cóctel/entrevista y su vestido de noche para la Gran Gala Final.
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 5: Asistencia y Compromiso Formativo</div>
                    <div class="article-body">
                        La participación en las sesiones de pasarela, oratoria, ensayos generales, grabaciones oficiales e Imposición de Bandas reviste carácter obligatorio. La puntualidad y disciplina forman parte de la evaluación formativa de cada postulante.
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 6: Código de Ética y Convivencia</div>
                    <div class="article-body">
                        Las candidatas se comprometen a mantener un espíritu de camaradería, compañerismo y respeto mutuo entre participantes, equipo técnico, marcas auspiciadoras y miembros de la producción, tanto de manera presencial como en plataformas digitales y redes sociales.
                    </div>
                </div>

                <div class="article-card">
                    <div class="article-title">✦ Artículo 7: Elección, Jurado y Transparencia</div>
                    <div class="article-body">
                        La evaluación de las candidatas y la elección final estará a cargo de un <strong>Jurado Calificador Autónomo</strong> integrado por personalidades del ámbito de la moda, comunicación y cultura. El veredicto del jurado es inapelable y soberano en la noche de coronación.
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Final -->
        <div class="cta-footer-bar">
            <h3>¿Lista para dar el paso hacia tu Corona?</h3>
            <p>
                Asegura tu cupo hoy mismo en la Preventa Oficial 2027 y comienza a vivir una experiencia que transformará tu proyección personal.
            </p>
            <div class="cta-buttons">
                <a href="/casting/?sede=<?= $sede ?>" class="btn-hero-primary" style="padding: 16px 32px;">
                    👑 Postular al Casting 2027
                </a>
                <a href="<?= $waUrl ?>" target="_blank" class="btn-wa-footer">
                    <span>💬 Consultas por WhatsApp</span>
                </a>
            </div>
        </div>

    </div>

</body>
</html>
