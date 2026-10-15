<?php
// Detección automática de la sede
$host = $_SERVER['HTTP_HOST'] ?? '';
$isIquique = strpos($host, 'iquique') !== false;

$sede = $isIquique ? 'iquique' : 'arica';
$sedeNombre = $isIquique ? 'Iquique' : 'Arica';
$regionNombre = $isIquique ? 'Tarapacá' : 'Arica y Parinacota';
$colorAcento = '#f5245f';
$colorDorado = '#d4af37';
$metaImage = $isIquique ? '/og-image-iquique.png' : '/og-image-arica.png';
$whatsappHelp = '+56956762116';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casting Oficial 2027 | Miss Universe <?= $sedeNombre ?></title>
    <meta name="description" content="Inscríbete al casting oficial de Miss Universe <?= $sedeNombre ?> 2027. Sé la próxima representante de <?= $regionNombre ?> rumbo a Miss Universe Chile.">
    
    <!-- Open Graph / Redes Sociales -->
    <meta property="og:title" content="Casting Oficial 2027 | Miss Universe <?= $sedeNombre ?>">
    <meta property="og:description" content="Convocatoria abierta. Postula para ser la próxima reina de <?= $sedeNombre ?> 2027.">
    <meta property="og:image" content="<?= $metaImage ?>">
    <meta property="og:type" content="website">

    <!-- Fuentes Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Raleway:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-dark: #070709;
            --bg-card: rgba(18, 18, 24, 0.85);
            --border-glow: rgba(245, 36, 95, 0.25);
            --accent-pink: #f5245f;
            --accent-gold: #d4af37;
            --text-light: #f5f5f7;
            --text-muted: #8e8e99;
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Raleway', sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(245, 36, 95, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 45%);
            color: var(--text-light);
            font-family: var(--font-sans);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.6;
        }

        /* Header */
        header {
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(10px);
            background: rgba(7, 7, 9, 0.7);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            color: #fff;
        }

        .logo span {
            color: var(--accent-pink);
        }

        .back-btn {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: color 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .back-btn:hover {
            color: #fff;
        }

        /* Container & Hero */
        .container {
            max-width: 820px;
            margin: 0 auto;
            padding: 40px 20px 80px;
            flex: 1;
            width: 100%;
        }

        .hero-title {
            text-align: center;
            margin-bottom: 40px;
        }

        .badge-edition {
            display: inline-block;
            background: linear-gradient(135deg, rgba(245, 36, 95, 0.15), rgba(212, 175, 55, 0.15));
            border: 1px solid var(--border-glow);
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--accent-gold);
            margin-bottom: 15px;
        }

        .hero-title h1 {
            font-family: var(--font-serif);
            font-size: clamp(2.2rem, 5vw, 3.4rem);
            font-weight: 900;
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .hero-title h1 span {
            background: linear-gradient(135deg, #fff 30%, #f5245f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-title p {
            color: var(--text-muted);
            font-size: 1.05rem;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Form Card */
        .form-card {
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
        }

        @media (max-width: 600px) {
            .form-card {
                padding: 24px 18px;
            }
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 30px 0 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .section-header:first-of-type {
            margin-top: 0;
        }

        .section-number {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--accent-pink);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 800;
        }

        .section-header h2 {
            font-size: 1.1rem;
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
            .form-grid {
                grid-template-columns: 1fr;
                gap: 14px;
            }
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
            color: #bbb;
        }

        label span.req {
            color: var(--accent-pink);
        }

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
            padding: 13px 16px;
            border-radius: 10px;
            font-family: var(--font-sans);
            font-size: 0.95rem;
            transition: all 0.25s ease;
            outline: none;
        }

        input:focus,
        select:focus,
        textarea:focus {
            border-color: var(--accent-pink);
            background: rgba(245, 36, 95, 0.05);
            box-shadow: 0 0 0 3px rgba(245, 36, 95, 0.18);
        }

        textarea {
            resize: vertical;
            min-height: 90px;
        }

        /* Foto Upload Cards */
        .photo-upload-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 10px;
        }

        @media (max-width: 600px) {
            .photo-upload-grid {
                grid-template-columns: 1fr;
            }
        }

        .upload-box {
            border: 2px dashed rgba(255, 255, 255, 0.15);
            border-radius: 14px;
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
            min-height: 180px;
        }

        .upload-box:hover {
            border-color: var(--accent-pink);
            background: rgba(245, 36, 95, 0.04);
        }

        .upload-box input[type="file"] {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }

        .upload-icon {
            font-size: 2rem;
            margin-bottom: 8px;
            color: var(--accent-pink);
        }

        .upload-title {
            font-size: 0.85rem;
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
            border-radius: 12px;
        }

        /* Checkbox Terms */
        .terms-group {
            margin: 30px 0 25px;
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
            color: #bbb;
            text-transform: none;
            cursor: pointer;
            line-height: 1.5;
        }

        /* Submit Button */
        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, #f5245f 0%, #a6123c 100%);
            color: #fff;
            border: none;
            padding: 18px 30px;
            border-radius: 12px;
            font-size: 1.05rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(245, 36, 95, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(245, 36, 95, 0.55);
        }

        .btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Modal Éxito */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 1000;
        }

        .modal-card {
            background: #121218;
            border: 1px solid var(--accent-pink);
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 25px 60px rgba(245, 36, 95, 0.35);
            animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes modalPop {
            from { opacity: 0; transform: scale(0.85); }
            to { opacity: 1; transform: scale(1); }
        }

        .modal-icon {
            font-size: 3.5rem;
            color: var(--accent-gold);
            margin-bottom: 15px;
        }

        .modal-card h2 {
            font-family: var(--font-serif);
            font-size: 1.8rem;
            margin-bottom: 12px;
            color: #fff;
            text-transform: uppercase;
        }

        .modal-card p {
            color: #bbb;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .btn-whatsapp-direct {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #25d366;
            color: #fff;
            text-decoration: none;
            padding: 14px 24px;
            border-radius: 10px;
            font-weight: 800;
            font-size: 0.95rem;
            letter-spacing: 1px;
            width: 100%;
            margin-bottom: 12px;
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
        }

        .btn-close-modal {
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            width: 100%;
        }

        /* Floating WhatsApp */
        .floating-wa {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #25d366;
            color: #fff;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
            text-decoration: none;
            z-index: 90;
            transition: transform 0.25s ease;
        }

        .floating-wa:hover {
            transform: scale(1.1);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            color: var(--text-muted);
            font-size: 0.8rem;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <a href="/" class="logo">MU <span><?= $sedeNombre ?></span></a>
        <a href="/" class="back-btn">← Volver al Sitio</a>
    </header>

    <!-- Main Content -->
    <div class="container">
        
        <div class="hero-title">
            <span class="badge-edition">Convocatoria Oficial 2027</span>
            <h1>Casting <span>Miss Universe <?= $sedeNombre ?></span></h1>
            <p>El camino hacia la corona más prestigiosa del planeta inicia aquí. Completa el formulario y sé parte de la selección oficial de <?= $regionNombre ?>.</p>
        </div>

        <div class="form-card">
            <form id="castingForm" enctype="multipart/form-data">
                <input type="hidden" name="sede" value="<?= $sede ?>">

                <!-- 1. Datos Personales -->
                <div class="section-header">
                    <span class="section-number">1</span>
                    <h2>Datos Personales</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="nombres">Nombres <span class="req">*</span></label>
                        <input type="text" id="nombres" name="nombres" required placeholder="Ej: Sofía Belén">
                    </div>

                    <div class="form-group">
                        <label for="apellidos">Apellidos <span class="req">*</span></label>
                        <input type="text" id="apellidos" name="apellidos" required placeholder="Ej: González Pérez">
                    </div>

                    <div class="form-group">
                        <label for="edad">Edad <span class="req">*</span> (Mínimo 18 años)</label>
                        <input type="number" id="edad" name="edad" min="18" max="75" required placeholder="Ej: 22">
                    </div>

                    <div class="form-group">
                        <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fecha_nacimiento" name="fecha_nacimiento">
                    </div>

                    <div class="form-group full">
                        <label for="rut">RUT o DNI</label>
                        <input type="text" id="rut" name="rut" placeholder="Ej: 19.876.543-2">
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
                        <input type="tel" id="telefono_whatsapp" name="telefono_whatsapp" required placeholder="Ej: +56 9 1234 5678">
                    </div>

                    <div class="form-group">
                        <label for="email">Correo Electrónico <span class="req">*</span></label>
                        <input type="email" id="email" name="email" required placeholder="tuemail@ejemplo.com">
                    </div>

                    <div class="form-group">
                        <label for="instagram">Usuario de Instagram</label>
                        <input type="text" id="instagram" name="instagram" placeholder="Ej: @sofiagonzalez">
                    </div>

                    <div class="form-group">
                        <label for="tiktok">Usuario de TikTok (Opcional)</label>
                        <input type="text" id="tiktok" name="tiktok" placeholder="Ej: @sofiagonzalez_">
                    </div>
                </div>

                <!-- 3. Perfil y Ubicación -->
                <div class="section-header">
                    <span class="section-number">3</span>
                    <h2>Perfil & Medidas</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="estatura_cm">Estatura aproximada (en cm)</label>
                        <input type="number" id="estatura_cm" name="estatura_cm" placeholder="Ej: 172">
                    </div>

                    <div class="form-group">
                        <label for="comuna">Comuna / Ciudad de Residencia <span class="req">*</span></label>
                        <input type="text" id="comuna" name="comuna" required placeholder="Ej: <?= $sedeNombre ?>">
                    </div>

                    <div class="form-group full">
                        <label for="ocupacion">Profesión / Ocupación / Carrera</label>
                        <input type="text" id="ocupacion" name="ocupacion" placeholder="Ej: Estudiante de Derecho / Emprendedora">
                    </div>

                    <div class="form-group full">
                        <label for="experiencia_modelaje">¿Tienes experiencia previa en modelaje o certámenes?</label>
                        <textarea id="experiencia_modelaje" name="experiencia_modelaje" placeholder="Cuéntanos brevemente si has participado en fotos, pasarelas o si es tu primera vez (¡no es requisito excluyente!)"></textarea>
                    </div>

                    <div class="form-group full">
                        <label for="motivacion">¿Por qué deseas ser Miss Universe <?= $sedeNombre ?> 2027?</label>
                        <textarea id="motivacion" name="motivacion" placeholder="¿Cuál es tu propósito, causa social o motivación para llevar la banda de nuestra ciudad?"></textarea>
                    </div>
                </div>

                <!-- 4. Fotos Oficiales para Preselección -->
                <div class="section-header">
                    <span class="section-number">4</span>
                    <h2>Fotografías de Preselección</h2>
                </div>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">
                    Sube 2 fotos recientes (pueden ser tomadas con tu celular, con buena luz y sin filtros excesivos).
                </p>

                <div class="photo-upload-grid">
                    <div class="upload-box" id="boxRostro">
                        <input type="file" id="foto_rostro" name="foto_rostro" accept="image/*" required onchange="previewImage(this, 'previewRostro', 'boxRostro')">
                        <img id="previewRostro" class="photo-preview" alt="Vista previa rostro">
                        <div class="upload-icon">📸</div>
                        <div class="upload-title">Foto de Rostro <span class="req" style="color:var(--accent-pink)">*</span></div>
                        <div class="upload-desc">Plano medio / rostro claro</div>
                    </div>

                    <div class="upload-box" id="boxCuerpo">
                        <input type="file" id="foto_cuerpo" name="foto_cuerpo" accept="image/*" required onchange="previewImage(this, 'previewCuerpo', 'boxCuerpo')">
                        <img id="previewCuerpo" class="photo-preview" alt="Vista previa cuerpo">
                        <div class="upload-icon">🧍‍♀️</div>
                        <div class="upload-title">Foto Cuerpo Completo <span class="req" style="color:var(--accent-pink)">*</span></div>
                        <div class="upload-desc">De pie / silueta visible</div>
                    </div>
                </div>

                <!-- Términos -->
                <div class="terms-group">
                    <input type="checkbox" id="acepto_requisitos" required>
                    <label for="acepto_requisitos">
                        Declaro ser mayor de 18 años, contar con nacionalidad chilena o residencia legal, y que todos los datos ingresados son fidedignos para la evaluación de la Dirección de Miss Universe <?= $sedeNombre ?> 2027.
                    </label>
                </div>

                <!-- Botón Enviar -->
                <button type="submit" class="btn-submit" id="btnSubmit">
                    <span>👑 Enviar mi Postulación 2027</span>
                </button>
            </form>
        </div>
    </div>

    <!-- Modal de Éxito -->
    <div class="modal-overlay" id="modalExito">
        <div class="modal-card">
            <div class="modal-icon">✨👑✨</div>
            <h2>¡Postulación Recibida!</h2>
            <p id="modalMensaje">
                Tus antecedentes han sido recibidos con éxito por la Dirección Oficial de <strong>Miss Universe <?= $sedeNombre ?> 2027</strong>.
            </p>
            <a href="https://wa.me/56956762116?text=Hola%20Dirección%20Miss%20Universo,%20acabo%20de%20enviar%20mi%20postulación%20al%20Casting%202027" target="_blank" class="btn-whatsapp-direct">
                💬 Confirmar por WhatsApp
            </a>
            <button class="btn-close-modal" onclick="window.location.href='/'">Volver a la Portada</button>
        </div>
    </div>

    <!-- Botón Flotante WhatsApp -->
    <a href="https://wa.me/56956762116?text=Hola,%20tengo%20una%20consulta%20sobre%20el%20Casting%20Miss%20Universo%20<?= $sedeNombre ?>%202027" class="floating-wa" target="_blank" title="Consultas Casting por WhatsApp">
        💬
    </a>

    <!-- Footer -->
    <footer>
        <p>© 2027 MISS UNIVERSE <?= strtoupper($sedeNombre) ?> OS. | TODOS LOS DERECHOS RESERVADOS</p>
    </footer>

    <!-- JavaScript Form Handler -->
    <script>
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

        const form = document.getElementById('castingForm');
        const btnSubmit = document.getElementById('btnSubmit');
        const modal = document.getElementById('modalExito');
        const modalMensaje = document.getElementById('modalMensaje');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span>⏳ Enviando Postulación...</span>';

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/postular.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    modalMensaje.innerHTML = data.message;
                    modal.style.display = 'flex';
                    form.reset();
                } else {
                    alert('Error: ' + (data.message || 'No se pudo enviar la postulación. Intenta nuevamente.'));
                }
            } catch (err) {
                console.error(err);
                alert('Ocurrió un error al enviar el formulario. Verifica tu conexión a internet.');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<span>👑 Enviar mi Postulación 2027</span>';
            }
        });
    </script>
</body>
</html>
