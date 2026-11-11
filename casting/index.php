<?php
/**
 * CASTING OFICIAL MISS UNIVERSE 2027 · ARICA & IQUIQUE
 * Formulario Accesible, Tramos de Preventa y Programa Viral de Embajadoras
 */

// Detección automática de sede por dominio o parámetro GET
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
$whatsappHelp = '+56956762116';

// Cálculo de estado de fechas y tarifas
$now = new DateTime();
$esPreventa = ($now < new DateTime('2027-01-01 00:00:00'));
$tarifaBaseActual = $esPreventa ? 250000 : 350000;
$periodoActualTxt = $esPreventa ? 'Preventa Diciembre' : 'Tarifa Enero';

// Código de referida si viene en la URL (?ref=CODIGO)
$refCode = trim($_GET['ref'] ?? '');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Postulaciones Abiertas 2027 | Miss Universe <?= $sedeNombre ?></title>
    <meta name="description" content="Inscripciones oficiales abiertas para Miss Universe <?= $sedeNombre ?> 2027. Preventa de lanzamiento, facilidades de pago en cuotas y Programa de Embajadoras con becas completas.">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Inscripciones Abiertas · Miss Universe <?= $sedeNombre ?> 2027">
    <meta property="og:description" content="Postula hoy con tarifa promocional de preventa, cuotas desde $70.000 o participa 100% gratis con el Programa de Embajadoras.">
    <meta property="og:image" content="<?= $isIquique ? '/og-image-iquique.png' : '/og-image-arica.png' ?>">
    <meta property="og:type" content="website">

    <!-- Fuentes Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,700&family=Italianno&family=Manrope:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #040816;
            --bg-card: rgba(8, 16, 42, 0.88);
            --border-glow: rgba(245, 36, 95, 0.35);
            --border-gold: rgba(212, 175, 55, 0.45);
            --accent-pink: #f5245f;
            --accent-gold: #d4af37;
            --gold-bright: #ffd700;
            --accent-purple: #9d4edd;
            --text-light: #f8fafc;
            --text-muted: #94a3b8;
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Manrope', -apple-system, sans-serif;
            --font-cursive: 'Italianno', cursive;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(circle at 10% 15%, rgba(245, 36, 95, 0.15) 0%, transparent 45%),
                radial-gradient(circle at 90% 25%, rgba(157, 78, 221, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 50% 70%, rgba(212, 175, 55, 0.12) 0%, transparent 55%),
                radial-gradient(circle at 50% 0%, #08173d 0%, #040816 80%);
            background-attachment: fixed;
            color: var(--text-light);
            font-family: var(--font-sans);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Header Navigation */
        header {
            padding: 16px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(4, 8, 22, 0.85);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
        }

        .crown-icon {
            font-size: 26px;
            filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.7));
            animation: pulseCrown 3s ease-in-out infinite;
        }

        @keyframes pulseCrown {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.7)); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 20px #ffd700); }
        }

        .logo-text {
            display: flex;
            flex-direction: column;
        }

        .logo-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.25rem;
            letter-spacing: 2px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.1;
        }

        .logo-title span {
            color: var(--accent-pink);
        }

        .logo-sub {
            font-size: 0.65rem;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: var(--accent-gold);
            font-weight: 800;
        }

        .sede-switch-nav {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.05);
            padding: 4px;
            border-radius: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-switch {
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 6px 14px;
            border-radius: 30px;
            color: var(--text-muted);
            transition: all 0.25s ease;
        }

        .btn-switch.active {
            background: linear-gradient(135deg, var(--accent-pink), #eab308);
            color: #fff;
            box-shadow: 0 0 15px rgba(245, 36, 95, 0.5);
        }

        /* Container & Hero */
        .container {
            max-width: 880px;
            margin: 0 auto;
            padding: 35px 20px 90px;
            flex: 1;
            width: 100%;
        }

        .hero-banner {
            text-align: center;
            margin-bottom: 35px;
        }

        .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(245, 36, 95, 0.15);
            border: 1px solid var(--accent-pink);
            color: #ff8fab;
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 15px;
            box-shadow: 0 0 20px rgba(245, 36, 95, 0.3);
            animation: pulseLive 2s infinite;
        }

        @keyframes pulseLive {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .hero-title {
            font-family: var(--font-serif);
            font-size: clamp(2.4rem, 6vw, 3.8rem);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: linear-gradient(135deg, #ffffff 20%, #fce793 60%, #eab308 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-calligraphy {
            font-family: var(--font-cursive);
            font-size: clamp(2.4rem, 5vw, 3.5rem);
            color: var(--accent-gold);
            line-height: 1;
            margin-bottom: 16px;
        }

        .hero-desc {
            color: #cbd5e1;
            font-size: 1.05rem;
            max-width: 680px;
            margin: 0 auto 25px;
            font-weight: 400;
        }

        /* ==============================================================
           AVISO OFICIAL PLAZO NACIONAL & TRAMOS DE PROMOCIÓN
           ============================================================== */
        .official-notice-box {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(212, 175, 55, 0.12));
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-left: 5px solid #ef4444;
            border-radius: 18px;
            padding: 20px 22px;
            margin-bottom: 26px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            backdrop-filter: blur(12px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        }

        .notice-icon {
            font-size: 2.2rem;
            line-height: 1;
            flex-shrink: 0;
        }

        .notice-badge {
            display: inline-block;
            background: rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.5);
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 1.5px;
            padding: 3px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }

        .notice-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 5px;
            font-family: var(--font-serif);
            letter-spacing: 0.5px;
        }

        .notice-desc {
            font-size: 0.88rem;
            color: #cbd5e1;
            line-height: 1.55;
            margin: 0;
        }

        .notice-desc strong {
            color: #fef08a;
        }

        .pricing-section {
            background: rgba(8, 16, 42, 0.75);
            border: 1.5px solid var(--border-gold);
            border-radius: 24px;
            padding: 26px 22px;
            margin-bottom: 30px;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(212, 175, 55, 0.05);
            backdrop-filter: blur(12px);
        }

        .pricing-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .pricing-header h2 {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .pricing-header h2 span {
            color: var(--accent-gold);
        }

        .pricing-header p {
            font-size: 0.88rem;
            color: var(--text-muted);
            margin-top: 4px;
        }

        .tiers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .tier-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 20px 16px;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
        }

        .tier-card.highlight {
            background: linear-gradient(135deg, rgba(245, 36, 95, 0.12), rgba(212, 175, 55, 0.15));
            border-color: var(--accent-gold);
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.3);
            transform: scale(1.02);
        }

        .tier-badge {
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f5245f, #eab308);
            color: #fff;
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 3px 12px;
            border-radius: 20px;
            white-space: nowrap;
        }

        .tier-period {
            font-size: 0.78rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-top: 4px;
            margin-bottom: 8px;
        }

        .tier-card.highlight .tier-period {
            color: var(--gold-bright);
        }

        .tier-price {
            font-family: var(--font-serif);
            font-size: 1.9rem;
            font-weight: 900;
            color: #fff;
            line-height: 1.1;
        }

        .tier-save {
            font-size: 0.75rem;
            color: #10b981;
            font-weight: 800;
            text-transform: uppercase;
            margin-top: 4px;
        }

        .tier-terms {
            font-size: 0.72rem;
            color: #94a3b8;
            margin-top: 8px;
            line-height: 1.4;
        }

        .payment-perks-box {
            background: rgba(16, 185, 129, 0.08);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 14px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }

        .perks-text {
            font-size: 0.85rem;
            color: #d1fae5;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .perks-text strong {
            color: #fff;
        }

        .perk-tag {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ==============================================================
           PROGRAMA VIRAL DE EMBAJADORAS & SIMULADOR DE BECA
           ============================================================== */
        .ambassador-section {
            background: linear-gradient(135deg, rgba(157, 78, 221, 0.2) 0%, rgba(245, 36, 95, 0.25) 50%, rgba(212, 175, 55, 0.2) 100%);
            border: 2px solid var(--accent-gold);
            border-radius: 24px;
            padding: 30px 24px;
            margin-bottom: 35px;
            position: relative;
            box-shadow: 0 25px 60px rgba(245, 36, 95, 0.35);
        }

        .ambassador-header {
            text-align: center;
            margin-bottom: 22px;
        }

        .ambassador-badge {
            background: #ffd700;
            color: #000;
            font-size: 0.72rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 5px 16px;
            border-radius: 30px;
            display: inline-block;
            margin-bottom: 10px;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
        }

        .ambassador-title {
            font-family: var(--font-serif);
            font-size: clamp(1.6rem, 4vw, 2.2rem);
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.15;
            color: #fff;
            margin-bottom: 8px;
        }

        .ambassador-title span {
            color: var(--gold-bright);
        }

        .ambassador-subtitle {
            font-size: 0.95rem;
            color: #f1f5f9;
            max-width: 640px;
            margin: 0 auto;
        }

        /* Simulador Interactivo */
        .simulator-box {
            background: rgba(4, 8, 22, 0.85);
            border: 1px solid var(--border-gold);
            border-radius: 20px;
            padding: 22px;
            margin: 20px 0;
            text-align: center;
        }

        .simulator-label {
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--gold-bright);
            margin-bottom: 14px;
        }

        .buttons-amigas-grid {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 18px;
        }

        .btn-amiga {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 0.82rem;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-amiga.active, .btn-amiga:hover {
            background: linear-gradient(135deg, #f5245f, #eab308);
            border-color: #ffd700;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 36, 95, 0.5);
        }

        .calc-result-wrap {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 520px) {
            .calc-result-wrap { grid-template-columns: 1fr; }
        }

        .calc-box-item {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 12px;
        }

        .calc-box-item small {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            display: block;
            margin-bottom: 4px;
        }

        .calc-val-discount {
            font-size: 1.45rem;
            font-weight: 900;
            color: #10b981;
        }

        .calc-val-final {
            font-size: 1.6rem;
            font-weight: 900;
            color: var(--gold-bright);
        }

        .calc-free-pill {
            background: #10b981;
            color: #000;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 900;
            font-size: 0.85rem;
            letter-spacing: 1px;
            display: inline-block;
            margin-top: 4px;
            animation: pulseFree 1.5s infinite;
        }

        @keyframes pulseFree {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* ==============================================================
           FORMULARIO PRINCIPAL
           ============================================================== */
        .form-card {
            background: var(--bg-card);
            border: 1px solid var(--border-gold);
            border-radius: 26px;
            padding: 38px 30px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(14px);
        }

        @media (max-width: 600px) {
            .form-card { padding: 25px 16px; }
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 32px 0 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-header:first-of-type { margin-top: 0; }

        .section-number {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-pink), #eab308);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            font-weight: 900;
            box-shadow: 0 0 10px rgba(245, 36, 95, 0.6);
        }

        .section-header h2 {
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #fff;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
        }

        @media (max-width: 600px) {
            .form-grid { grid-template-columns: 1fr; gap: 14px; }
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-group.full {
            grid-column: 1 / -1;
        }

        label {
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #cbd5e1;
        }

        label span.req { color: var(--accent-pink); }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        input[type="date"],
        select,
        textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #fff;
            padding: 14px 16px;
            border-radius: 12px;
            font-family: var(--font-sans);
            font-size: 0.95rem;
            transition: all 0.25s ease;
            outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
            border-color: var(--accent-pink);
            background: rgba(245, 36, 95, 0.06);
            box-shadow: 0 0 0 3px rgba(245, 36, 95, 0.25);
        }

        textarea {
            resize: vertical;
            min-height: 90px;
        }

        /* Radio Options para Modalidades de Pago */
        .payment-options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 6px;
        }

        @media (max-width: 600px) {
            .payment-options-grid { grid-template-columns: 1fr; }
        }

        .payment-radio-label {
            background: rgba(255, 255, 255, 0.03);
            border: 1.5px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .payment-radio-label:hover {
            border-color: var(--accent-gold);
            background: rgba(212, 175, 55, 0.05);
        }

        .payment-radio-label input[type="radio"] {
            margin-top: 3px;
            accent-color: var(--accent-pink);
            transform: scale(1.2);
        }

        .radio-info strong {
            display: block;
            color: #fff;
            font-size: 0.9rem;
            margin-bottom: 2px;
        }

        .radio-info small {
            display: block;
            font-size: 0.75rem;
            color: var(--text-muted);
            line-height: 1.35;
        }

        /* Foto Upload Cards */
        .photo-upload-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-top: 10px;
        }

        @media (max-width: 600px) {
            .photo-upload-grid { grid-template-columns: 1fr; }
        }

        .upload-box {
            border: 2px dashed rgba(212, 175, 55, 0.4);
            border-radius: 16px;
            padding: 24px 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.02);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        }

        .upload-box:hover {
            border-color: var(--accent-pink);
            background: rgba(245, 36, 95, 0.05);
            transform: translateY(-2px);
        }

        .upload-box input[type="file"] {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
            z-index: 5;
        }

        .upload-icon {
            font-size: 2.2rem;
            margin-bottom: 8px;
        }

        .upload-title {
            font-size: 0.9rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
            color: #fff;
        }

        .upload-desc {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .photo-preview {
            width: 100%;
            height: 100%;
            position: absolute;
            inset: 0;
            object-fit: cover;
            display: none;
            border-radius: 14px;
            z-index: 2;
        }

        /* Referida input con estilo */
        .referral-input-wrap {
            position: relative;
        }

        .referral-input-wrap span.icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.1rem;
        }

        .referral-input-wrap input {
            padding-left: 44px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        /* Checkbox Terms */
        .terms-group {
            margin: 28px 0 25px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .terms-group input[type="checkbox"] {
            margin-top: 4px;
            accent-color: var(--accent-pink);
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .terms-group label {
            font-size: 0.85rem;
            color: #cbd5e1;
            text-transform: none;
            cursor: pointer;
            line-height: 1.5;
        }

        /* Submit Button */
        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, #f5245f 0%, #eab308 100%);
            color: #fff;
            border: none;
            padding: 19px 30px;
            border-radius: 14px;
            font-size: 1.1rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 12px 35px rgba(245, 36, 95, 0.45);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-submit:hover:not(:disabled) {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 16px 45px rgba(245, 36, 95, 0.6);
        }

        .btn-submit:disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }

        /* ==============================================================
           MODAL DE ÉXITO & GENERADOR DE ENLACE DE EMBAJADORA
           ============================================================== */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(1, 4, 18, 0.92);
            backdrop-filter: blur(16px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 1000;
            overflow-y: auto;
        }

        .modal-card {
            background: rgba(8, 16, 42, 0.96);
            border: 2px solid var(--accent-gold);
            border-radius: 26px;
            padding: 38px 28px;
            max-width: 540px;
            width: 100%;
            text-align: center;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.4);
            animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalPop {
            from { opacity: 0; transform: scale(0.85); }
            to { opacity: 1; transform: scale(1); }
        }

        .modal-crown {
            font-size: 3.5rem;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 20px #ffd700);
        }

        .modal-card h2 {
            font-family: var(--font-serif);
            font-size: 2rem;
            margin-bottom: 8px;
            color: #fff;
            text-transform: uppercase;
        }

        .modal-card p {
            color: #cbd5e1;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .referral-gift-card {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(245, 36, 95, 0.15));
            border: 1px solid var(--accent-gold);
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 22px;
            text-align: center;
        }

        .referral-gift-card small {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--gold-bright);
            font-weight: 800;
            display: block;
            margin-bottom: 6px;
        }

        .referral-code-display {
            font-family: monospace;
            font-size: 1.35rem;
            font-weight: 900;
            color: #fff;
            background: rgba(0, 0, 0, 0.4);
            padding: 8px 14px;
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 2px;
            margin-bottom: 10px;
            border: 1px dashed var(--accent-gold);
        }

        .btn-wa-share {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #25d366;
            color: #fff;
            text-decoration: none;
            padding: 15px 24px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 0.95rem;
            letter-spacing: 0.5px;
            width: 100%;
            margin-bottom: 10px;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
            transition: transform 0.2s;
        }

        .btn-wa-share:hover { transform: translateY(-2px); }

        .btn-copy-link {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            width: 100%;
            margin-bottom: 12px;
        }

        .btn-copy-link:hover { background: rgba(255, 255, 255, 0.15); }

        .btn-close-modal {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.8rem;
            cursor: pointer;
            text-decoration: underline;
        }

        /* Floating WhatsApp */
        .floating-wa {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #25d366;
            color: #fff;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
            text-decoration: none;
            z-index: 90;
            transition: transform 0.25s ease;
        }

        .floating-wa:hover { transform: scale(1.1); }

        footer {
            text-align: center;
            padding: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: var(--text-muted);
            font-size: 0.82rem;
            letter-spacing: 1px;
            background: rgba(2, 4, 12, 0.9);
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
                <span class="logo-sub">✧ Convocatoria Oficial 2027 ✧</span>
            </div>
        </a>

        <!-- Conmutador Arica / Iquique -->
        <div class="sede-switch-nav">
            <a href="/casting/?sede=iquique<?= $refCode ? '&ref=' . urlencode($refCode) : '' ?>" class="btn-switch <?= $isIquique ? 'active' : '' ?>">Iquique</a>
            <a href="/casting/?sede=arica<?= $refCode ? '&ref=' . urlencode($refCode) : '' ?>" class="btn-switch <?= !$isIquique ? 'active' : '' ?>">Arica</a>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container">
        
        <div class="hero-banner">
            <div class="live-badge">
                <span>●</span> INSCRIPCIONES OFICIALES ABIERTAS
            </div>
            <h1 class="hero-title">Casting Oficial 2027</h1>
            <div class="hero-calligraphy">La corona de <?= $regionNombre ?> te espera</div>
            <p class="hero-desc">
                Comienza la búsqueda de la mujer que llevará la banda regional rumbo a Miss Universe Chile. 
                Por directriz oficial, la fecha límite e impostergable para confirmar a las representantes comunales es el <strong>1 de Marzo de 2027</strong>. 
                Por ello, nuestro proceso de reclutamiento cerrará definitivamente el <strong>25 de Enero de 2027</strong>.
                Aprovecha la Preventa Exclusiva hasta el 31 de Diciembre con facilidades en cuotas o participa completamente gratis con nuestro 
                <strong>Programa de Embajadoras</strong>.
            </p>
        </div>

        <!-- ==============================================================
             AVISO OFICIAL: DIRECTRIZ NACIONAL MISS UNIVERSE CHILE
             ============================================================== -->
        <div class="official-notice-box">
            <div class="notice-icon">👑</div>
            <div class="notice-content">
                <div class="notice-badge">DIRECTRIZ OFICIAL NACIONAL · MISS UNIVERSE CHILE</div>
                <h3 class="notice-title">Plazo Improrrogable: Elección de Candidatas al 1 de Marzo de 2027</h3>
                <p class="notice-desc">
                    Por instrucción de la Dirección Nacional, la fecha límite e impostergable para elegir y confirmar a las representantes comunales es el <strong>1 de Marzo de 2027</strong>, sin excepciones. Con el fin de coordinar ensayos, fotografía y preparación oficial de alto estándar, <strong>la fecha máxima de reclutamiento e inscripciones será el 25 de Enero de 2027</strong>.
                </p>
            </div>
        </div>

        <!-- ==============================================================
             TARJETA DE TRAMOS DE PRECIO & FACILIDADES
             ============================================================== -->
        <section class="pricing-section">
            <div class="pricing-header">
                <h2>Tramos de Inscripción & <span>Plazos Oficiales</span></h2>
                <p>Asegura tu participación antes del cierre definitivo de convocatoria el 25 de Enero</p>
            </div>

            <div class="tiers-grid">
                <!-- Tramo 1: Preventa Diciembre -->
                <div class="tier-card <?= $esPreventa ? 'highlight' : '' ?>">
                    <?php if ($esPreventa): ?>
                        <span class="tier-badge">🔥 TARIFA MÍNIMA PREVENTA (ACTIVA)</span>
                    <?php endif; ?>
                    <div class="tier-period">Todo Noviembre hasta 31 Diciembre 2026</div>
                    <div class="tier-price">$250.000</div>
                    <div class="tier-save">Ahorras $100.000 CLP</div>
                    <div class="tier-terms">Congela tu cupo con abono inicial desde $70.000 o paga hasta en 3 cuotas.</div>
                </div>

                <!-- Tramo 2: Enero (Cierre Definitivo) -->
                <div class="tier-card <?= !$esPreventa ? 'highlight' : '' ?>">
                    <?php if (!$esPreventa): ?>
                        <span class="tier-badge">⚡ ÚLTIMOS DÍAS DE CASTING</span>
                    <?php else: ?>
                        <span class="tier-badge" style="background:#334155; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);">PRÓXIMO TRAMO</span>
                    <?php endif; ?>
                    <div class="tier-period">Del 1 al 25 de Enero 2027</div>
                    <div class="tier-price">$350.000</div>
                    <div style="font-size:0.75rem; color:#ef4444; font-weight:700; margin-top:4px;">⚠️ CIERRE DEFINITIVO E IMPOSTERGABLE</div>
                    <div class="tier-terms">Últimas postulaciones previas al plazo nacional de elección de candidatas.</div>
                </div>
            </div>

            <!-- Facilidad de Abono -->
            <div class="payment-perks-box">
                <div class="perks-text">
                    <span style="font-size: 1.5rem;">💳</span>
                    <div>
                        <strong>¡Inscríbete hoy abonando desde $70.000!</strong>
                        <div style="font-size:0.78rem; color:#94a3b8;">Congela tu cupo y cancela el saldo hasta en 3 cómodas cuotas durante tu preparación.</div>
                    </div>
                </div>
                <span class="perk-tag">Hasta en 3 Cuotas</span>
            </div>
        </section>

        <!-- ==============================================================
             PROGRAMA VIRAL DE EMBAJADORAS / INFLUENCERS
             ============================================================== -->
        <section class="ambassador-section">
            <div class="ambassador-header">
                <span class="ambassador-badge">👑 PROGRAMA EXCLUSIVO DE EMBAJADORAS</span>
                <h2 class="ambassador-title">Gana $50.000 por cada amiga <br><span>¡O participa 100% GRATIS!</span></h2>
                <p class="ambassador-subtitle">
                    Queremos que el concurso se llene de talento y belleza de nuestra región. 
                    Por cada candidata que invites y postule con tu código o mención, 
                    <strong>se te descontarán $50.000 de tu cuota de inscripción</strong>.
                </p>
            </div>

            <!-- Simulador Interactivo de Beca -->
            <div class="simulator-box">
                <div class="simulator-label">✨ Simulador de Descuento por Amigas Invitadas ✨</div>
                <div class="buttons-amigas-grid">
                    <button type="button" class="btn-amiga active" onclick="setSimulacion(0, this)">0 Amigas</button>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(1, this)">1 Amiga (-$50k)</button>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(2, this)">2 Amigas (-$100k)</button>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(3, this)">3 Amigas (-$150k)</button>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(4, this)">4 Amigas (-$200k)</button>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(5, this)">👑 5 Amigas (<?= $esPreventa ? '¡100% GRATIS!' : '-$250k' ?>)</button>
                    <?php if (!$esPreventa): ?>
                    <button type="button" class="btn-amiga" onclick="setSimulacion(7, this)">👑 7 Amigas (¡100% GRATIS!)</button>
                    <?php endif; ?>
                </div>

                <div class="calc-result-wrap">
                    <div class="calc-box-item">
                        <small>Tu Descuento Acumulado</small>
                        <div class="calc-val-discount" id="simDiscount">$0 CLP</div>
                    </div>
                    <div class="calc-box-item">
                        <small>Tu Valor Final a Pagar (<?= $periodoActualTxt ?>)</small>
                        <div class="calc-val-final" id="simFinal">$<?= number_format($tarifaBaseActual, 0, ',', '.') ?> CLP</div>
                        <div id="simBadgeFree" style="display:none;" class="calc-free-pill">👑 ¡PARTICIPAS 100% GRATIS!</div>
                    </div>
                </div>
            </div>

            <p style="text-align:center; font-size:0.8rem; color:#cbd5e1; margin-top:12px;">
                💡 <em>Al enviar tu postulación recibirás de inmediato tu propio Código de Embajadora y tu enlace personal de invitación para compartir por WhatsApp e Instagram.</em>
            </p>
        </section>

        <!-- ==============================================================
             FORMULARIO OFICIAL DE POSTULACIÓN
             ============================================================== -->
        <div class="form-card">
            <form id="castingForm" enctype="multipart/form-data">
                <input type="hidden" name="sede" value="<?= $sede ?>">

                <!-- 1. Datos Personales -->
                <div class="section-header">
                    <span class="section-number">1</span>
                    <h2>Tus Datos Personales</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="nombres">Nombres <span class="req">*</span></label>
                        <input type="text" id="nombres" name="nombres" required placeholder="Ej: Camila Sofía" autocomplete="given-name">
                    </div>

                    <div class="form-group">
                        <label for="apellidos">Apellidos <span class="req">*</span></label>
                        <input type="text" id="apellidos" name="apellidos" required placeholder="Ej: Valenzuela Castro" autocomplete="family-name">
                    </div>

                    <div class="form-group">
                        <label for="edad">Edad <span class="req">*</span> (Mínimo 18 años)</label>
                        <input type="number" id="edad" name="edad" min="18" max="75" required placeholder="Ej: 21">
                    </div>

                    <div class="form-group">
                        <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fecha_nacimiento" name="fecha_nacimiento">
                    </div>

                    <div class="form-group full">
                        <label for="rut">RUT o DNI</label>
                        <input type="text" id="rut" name="rut" placeholder="Ej: 20.123.456-7">
                    </div>
                </div>

                <!-- 2. Contacto & Redes -->
                <div class="section-header">
                    <span class="section-number">2</span>
                    <h2>Contacto & Redes Sociales</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="telefono_whatsapp">Teléfono / WhatsApp <span class="req">*</span></label>
                        <input type="tel" id="telefono_whatsapp" name="telefono_whatsapp" required placeholder="+56 9 1234 5678" autocomplete="tel">
                    </div>

                    <div class="form-group">
                        <label for="email">Correo Electrónico <span class="req">*</span></label>
                        <input type="email" id="email" name="email" required placeholder="tuemail@gmail.com" autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label for="instagram">Usuario de Instagram</label>
                        <input type="text" id="instagram" name="instagram" placeholder="@tu_usuario">
                    </div>

                    <div class="form-group">
                        <label for="tiktok">TikTok (Opcional)</label>
                        <input type="text" id="tiktok" name="tiktok" placeholder="@tu_tiktok">
                    </div>
                </div>

                <!-- 3. Perfil y Residencia -->
                <div class="section-header">
                    <span class="section-number">3</span>
                    <h2>Perfil & Residencia</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="comuna">Ciudad / Comuna de Residencia <span class="req">*</span></label>
                        <input type="text" id="comuna" name="comuna" required placeholder="Ej: <?= $sedeNombre ?>" value="<?= $sedeNombre ?>">
                    </div>

                    <div class="form-group">
                        <label for="estatura_cm">Estatura Aproximada (en cm)</label>
                        <input type="number" id="estatura_cm" name="estatura_cm" placeholder="Ej: 170">
                    </div>

                    <div class="form-group full">
                        <label for="ocupacion">Profesión, Carrera o Actividad</label>
                        <input type="text" id="ocupacion" name="ocupacion" placeholder="Ej: Estudiante de Ingeniería Comercial / Emprendedora">
                    </div>

                    <div class="form-group full">
                        <label for="motivacion">¿Qué te inspira a ser Miss Universe <?= $sedeNombre ?> 2027?</label>
                        <textarea id="motivacion" name="motivacion" placeholder="Cuéntanos brevemente tu motivación, proyecto social o por qué quieres representar a nuestra ciudad..."></textarea>
                    </div>
                </div>

                <!-- 4. Código de Referida / Embajadora -->
                <div class="section-header">
                    <span class="section-number">4</span>
                    <h2>Programa de Embajadoras (Opcional)</h2>
                </div>

                <div class="form-group full">
                    <label for="referida_por">¿Fuiste invitada por alguna amiga o candidata?</label>
                    <div class="referral-input-wrap">
                        <span class="icon">🎁</span>
                        <input type="text" id="referida_por" name="referida_por" value="<?= htmlspecialchars($refCode) ?>" placeholder="Ingresa su Nombre o Código de Embajadora (ej: MU-AR-VALENTINA48)">
                    </div>
                    <small style="color:var(--text-muted); font-size:0.75rem; margin-top:4px;">
                        Al ingresar su nombre o código, <strong>le acreditarás $50.000 de descuento directo</strong> en su inscripción.
                    </small>
                </div>

                <!-- 5. Modalidad de Pago Preferida -->
                <div class="section-header">
                    <span class="section-number">5</span>
                    <h2>Modalidad de Pago y Participación</h2>
                </div>

                <div class="payment-options-grid">
                    <label class="payment-radio-label">
                        <input type="radio" name="modalidad_pago" value="abono_70" checked>
                        <div class="radio-info">
                            <strong>💎 Abono Inicial ($70.000)</strong>
                            <small>Aseguro mi cupo hoy y saldo en cómodas cuotas durante la preparación.</small>
                        </div>
                    </label>

                    <label class="payment-radio-label">
                        <input type="radio" name="modalidad_pago" value="<?= $esPreventa ? 'contado_250' : 'contado_350' ?>">
                        <div class="radio-info">
                            <strong>⚡ Pago Contado (<?= $esPreventa ? 'Preventa $250.000' : 'Tarifa $350.000' ?>)</strong>
                            <small><?= $esPreventa ? 'Pago al contado con $100.000 de ahorro en preventa (hasta el 31 de Diciembre).' : 'Pago total antes del cierre definitivo del 25 de Enero.' ?></small>
                        </div>
                    </label>

                    <label class="payment-radio-label">
                        <input type="radio" name="modalidad_pago" value="tres_cuotas">
                        <div class="radio-info">
                            <strong>💳 Pago en 3 Cuotas</strong>
                            <small>Cuotas mensuales flexibles durante tu preparación al certamen.</small>
                        </div>
                    </label>

                    <label class="payment-radio-label">
                        <input type="radio" name="modalidad_pago" value="programa_embajadora">
                        <div class="radio-info">
                            <strong>👑 Plan Embajadora (Meta Beca 100% Gratis)</strong>
                            <small>Invitaré a mis amigas al certamen (-$50.000 por cada una) para participar costo cero.</small>
                        </div>
                    </label>
                </div>

                <!-- 6. Fotografías de Preselección -->
                <div class="section-header">
                    <span class="section-number">6</span>
                    <h2>Fotografías de Preselección</h2>
                </div>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">
                    Sube 2 fotos tomadas con tu celular (con buena luz natural y sin filtros exagerados). ¡No necesitas fotos de estudio!
                </p>

                <div class="photo-upload-grid">
                    <div class="upload-box" id="boxRostro">
                        <input type="file" id="foto_rostro" name="foto_rostro" accept="image/*" required onchange="previewImage(this, 'previewRostro', 'boxRostro')">
                        <img id="previewRostro" class="photo-preview" alt="Vista previa rostro">
                        <div class="upload-icon">📸</div>
                        <div class="upload-title">Foto de Rostro <span class="req">*</span></div>
                        <div class="upload-desc">Plano medio / rostro nítido</div>
                    </div>

                    <div class="upload-box" id="boxCuerpo">
                        <input type="file" id="foto_cuerpo" name="foto_cuerpo" accept="image/*" required onchange="previewImage(this, 'previewCuerpo', 'boxCuerpo')">
                        <img id="previewCuerpo" class="photo-preview" alt="Vista previa cuerpo">
                        <div class="upload-icon">🧍‍♀️</div>
                        <div class="upload-title">Cuerpo Completo <span class="req">*</span></div>
                        <div class="upload-desc">De pie / silueta visible</div>
                    </div>
                </div>

                <!-- Términos -->
                <div class="terms-group">
                    <input type="checkbox" id="acepto_requisitos" required>
                    <label for="acepto_requisitos">
                        Declaro ser mayor de 18 años, contar con nacionalidad chilena o residencia legal, y que los antecedentes entregados son verídicos para la evaluación oficial de la Dirección de Miss Universe <?= $sedeNombre ?> 2027.
                    </label>
                </div>

                <!-- Botón de Envío -->
                <button type="submit" class="btn-submit" id="btnSubmit">
                    <span>👑 Enviar mi Postulación Oficial 2027</span>
                </button>
            </form>
        </div>
    </div>

    <!-- ==============================================================
         MODAL DE ÉXITO & GENERACIÓN DE LINK DE EMBAJADORA
         ============================================================== -->
    <div class="modal-overlay" id="modalExito">
        <div class="modal-card">
            <div class="modal-crown">✨👑✨</div>
            <h2>¡Postulación Confirmada!</h2>
            <p id="modalMensaje">
                Tus antecedentes han sido recibidos con éxito por la Dirección Oficial de <strong>Miss Universe <?= $sedeNombre ?> 2027</strong>.
            </p>

            <!-- Tarjeta con Código de Embajadora Asignado -->
            <div class="referral-gift-card">
                <small>🎉 Tu Código Oficial de Embajadora es:</small>
                <div class="referral-code-display" id="modalRefCode">MU-<?= ($isIquique ? 'IQ' : 'AR') ?>-2027</div>
                <div style="font-size:0.8rem; color:#f1f5f9; line-height:1.4;">
                    ¡Comparte este código o tu enlace con tus amigas! <br>
                    <strong>Te descontaremos $50.000 por cada una que postule</strong>, y si sumas a 5 amigas, ¡tu cupo es 100% GRATIS!
                </div>
            </div>

            <a id="btnModalWaShare" href="#" target="_blank" class="btn-wa-share">
                <span>📲 Compartir mi Enlace por WhatsApp</span>
            </a>

            <button type="button" class="btn-copy-link" id="btnCopyRefLink" onclick="copyReferralLink();">
                🔗 Copiar mi Enlace de Invitación
            </button>

            <button type="button" class="btn-close-modal" onclick="window.location.href='/'">
                Volver a la Portada Principal
            </button>
        </div>
    </div>

    <!-- Botón Flotante de WhatsApp para Consultas -->
    <a href="https://wa.me/56956762116?text=Hola,%20tengo%20una%20consulta%20sobre%20las%20postulaciones%20Miss%20Universo%20<?= $sedeNombre ?>%202027" class="floating-wa" target="_blank" title="Consultas sobre Postulación por WhatsApp">
        💬
    </a>

    <!-- Footer -->
    <footer>
        <p>© 2027 MISS UNIVERSE <?= strtoupper($sedeNombre) ?> · FRANQUICIA OFICIAL DE BELLEZA Y LIDERAZGO.</p>
    </footer>

    <!-- Scripts Interactivos -->
    <script>
        // Simulador Interactivo de Beca y Descuento
        const basePrice = <?= (int)$tarifaBaseActual ?>;
        function setSimulacion(amigas, btn) {
            document.querySelectorAll('.btn-amiga').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');

            const discount = Math.min(basePrice, amigas * 50000);
            const finalPrice = Math.max(0, basePrice - discount);

            document.getElementById('simDiscount').textContent = `-$${discount.toLocaleString('es-CL')} CLP`;
            document.getElementById('simFinal').textContent = `$${finalPrice.toLocaleString('es-CL')} CLP`;

            const badgeFree = document.getElementById('simBadgeFree');
            if (finalPrice === 0) {
                badgeFree.style.display = 'inline-block';
            } else {
                badgeFree.style.display = 'none';
            }
        }

        // Previsualización Instantánea de Fotos
        function previewImage(input, previewId, boxId) {
            const preview = document.getElementById(previewId);
            const box = document.getElementById(boxId);
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    box.style.borderColor = '#d4af37';
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        // Envío Reactivo del Formulario vía Fetch
        const form = document.getElementById('castingForm');
        const btnSubmit = document.getElementById('btnSubmit');
        const modal = document.getElementById('modalExito');
        const modalMensaje = document.getElementById('modalMensaje');
        let currentShareLink = '';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span>⏳ Procesando tu postulación...</span>';

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/postular.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    modalMensaje.innerHTML = data.message;
                    
                    if (data.embajadora_info) {
                        const code = data.embajadora_info.codigo;
                        const link = data.embajadora_info.link;
                        currentShareLink = link;

                        document.getElementById('modalRefCode').textContent = code;
                        const waText = encodeURIComponent(data.embajadora_info.texto_whatsapp);
                        document.getElementById('btnModalWaShare').href = `https://wa.me/?text=${waText}`;
                    }

                    modal.style.display = 'flex';
                    form.reset();
                } else {
                    alert('Atención: ' + (data.message || 'No se pudo enviar el formulario. Por favor revisa los datos e inténtalo nuevamente.'));
                }
            } catch (err) {
                console.error(err);
                alert('Ocurrió un error de conexión al enviar el formulario. Por favor verifica tu red e intenta de nuevo.');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<span>👑 Enviar mi Postulación Oficial 2027</span>';
            }
        });

        // Copiar Enlace de Referida al Portapapeles
        function copyReferralLink() {
            if (!currentShareLink) return;
            navigator.clipboard.writeText(currentShareLink).then(() => {
                const btn = document.getElementById('btnCopyRefLink');
                const orig = btn.textContent;
                btn.textContent = '¡Enlace Copiado con Éxito! ✓';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                }, 2500);
            });
        }
    </script>
</body>
</html>
