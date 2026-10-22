<?php
/**
 * Setup & Seed: Legado 2026 Candidatas (Arica & Iquique)
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/db.php';

try {
    // 1. Crear tabla legado_2026
    $pdo->exec("CREATE TABLE IF NOT EXISTS legado_2026 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sede ENUM('arica', 'iquique') NOT NULL,
        username VARCHAR(60) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        title_badge VARCHAR(100) DEFAULT 'Candidata Oficial 2026',
        email_personal VARCHAR(150) NOT NULL,
        inst_email VARCHAR(150) NULL,
        photo_main VARCHAR(255) NOT NULL,
        photo_cover VARCHAR(255) NULL,
        photos_gallery TEXT NULL,
        occupation VARCHAR(150) NULL,
        bio TEXT NULL,
        instagram VARCHAR(100) NULL,
        tiktok VARCHAR(100) NULL,
        whatsapp VARCHAR(50) NULL,
        custom_links TEXT NULL,
        mode_editorial TINYINT(1) DEFAULT 1,
        mode_linktree TINYINT(1) DEFAULT 1,
        is_minimal_record TINYINT(1) DEFAULT 0,
        magic_token VARCHAR(64) UNIQUE,
        email_sent_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_sede_username (sede, username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Candidatas extraídas de los respaldos originales
    $candidatasArica = [
        [
            'full_name' => 'Laura Riquelme Cayuleo',
            'username' => 'laurariquelme',
            'email' => 'laurasararc@gmail.com',
            'photo' => '/uploads/admin_cmlk8x21h0003gerkutyqwd53_1773967765801_DSC01282.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Embajadora Cultural'
        ],
        [
            'full_name' => 'Tamara Del Carmen Vergara Vergara',
            'username' => 'tamaravergara',
            'email' => 'tamararosesakamaki@gmail.com',
            'photo' => '/uploads/gallery_cmloa2huw004rgexocsybvjnj_1776350607944_1000134452.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Estudiante & Creadora de Contenido'
        ],
        [
            'full_name' => 'Rayen Millarau Coscio Pizarro',
            'username' => 'rayencoscio',
            'email' => 'rayencoscio06@gmail.com',
            'photo' => '/uploads/gallery_cmlsv1spl000xge2cfm8aorir_1774091557756_5B568FAB-9573-412E-BAC7-107374299AF2.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo de Pasarela'
        ],
        [
            'full_name' => 'Sofia Belen Fredes Gutierrez',
            'username' => 'sofiafredes',
            'email' => 'sofiafredesgu1@gmail.com',
            'photo' => '/uploads/gallery_cmlvq05rs005jgeb4z3n6yvle_1776129845525_IMG-20260413-WA0008.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Emprendedora'
        ],
        [
            'full_name' => 'Camila Xiomara Ríos Chilcumpa',
            'username' => 'camilarios',
            'email' => 'kamilarioschilcumpa@gmail.com',
            'photo' => '/uploads/gallery_cmm4bybrf00mfgeb4p9fn1kzh_1775707760310_inbound7397300269220917351.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Diseño & Comunicación'
        ],
        [
            'full_name' => 'Silvia Muñoz Donoso',
            'username' => 'silviamunoz',
            'email' => 'silviamunozd@gmail.com',
            'photo' => '/uploads/gallery_cmmcokz80002bge7gaq6vwbjz_1775929704462_1000027597.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Liderazgo & Talento Regional'
        ],
        [
            'full_name' => 'Scarlette Arely Mesina Rojas',
            'username' => 'scarlettemesina',
            'email' => 'scarlettemesina@gmail.com',
            'photo' => '/uploads/dsyvu5mupk6a43l3_FULL_BODY_1772714637340_DSC00242.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo Editorial'
        ],
        [
            'full_name' => 'Nicol Estefanía Noemí Viveros Navarro',
            'username' => 'nicolviveros',
            'email' => 'nicolviverosn@gmail.com',
            'photo' => '/uploads/gallery_cmmki79iw005ugef0zo4vl9zp_1775933080796_A23981E5-01E4-4BFA-A344-B494F693F882.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Estudiante de Derecho & Modelo'
        ],
        [
            'full_name' => 'Nayareth Elizabeth Sandoval Sepúlveda',
            'username' => 'nayarethsandoval',
            'email' => 'nayarethsandoval@gmail.com',
            'photo' => '/uploads/gallery_cmmts87ns010mgegkp57r9vax_1777012295374_inbound3697726264616469069.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Emprendedora Social'
        ],
        [
            'full_name' => 'Liz Rivera',
            'username' => 'lizrivera',
            'email' => 'lizrivera@gmail.com',
            'photo' => '/uploads/gallery_cmnb3yj7o000bgewsfoc8jwyq_1776646137784_IMG_1075.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Fitness & Moda'
        ]
    ];

    $candidatasIquique = [
        [
            'full_name' => 'Jacqueline Lorena Corona Herrera',
            'username' => 'jacquelinecorona',
            'email' => 'coronajacque64@gmail.com',
            'photo' => '/uploads/qm4dbeg5cxepxho7_FACE_1770046761213_WhatsApp_Image_2026-01-05_at_8.48.37_PM.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Emprendedora Iquiqueña'
        ],
        [
            'full_name' => 'Quri Mayiri García Ayca',
            'username' => 'qurigarcia',
            'email' => 'qurigarcia@gmail.com',
            'photo' => '/uploads/chhaazemblxifcvu_FACE_1770098445062_IMG_7945.png',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Cultura & Identidad Regional'
        ],
        [
            'full_name' => 'Ayalent Nazareth Álvarez Bautista',
            'username' => 'ayalentalvarez',
            'email' => 'ayalenta@gmail.com',
            'photo' => '/uploads/2la2xo23xuu6fcx5_FACE_1770173002692_IMG_2474.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Comunicación & Redes Sociales'
        ],
        [
            'full_name' => 'Javiera Antonia García Colipi',
            'username' => 'javieragarcia',
            'email' => 'javiera.garciacolipi@gmail.com',
            'photo' => '/uploads/ijy2jqybkplgad56_EDITORIAL_1770918729910_inbound3695573378912821440.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Pasarela & Estilismo'
        ],
        [
            'full_name' => 'Grace Barbara Valdovino Averanga',
            'username' => 'gracevaldovino',
            'email' => 'valdovinograce@gmail.com',
            'photo' => '/uploads/2sistdktft2df65m_FULL_BODY_1770930630126_inbound1942447638686948449.png',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Danza & Arte Escénico'
        ],
        [
            'full_name' => 'Constanza Morales Silva',
            'username' => 'constanzamorales',
            'email' => 'constanzamorales@gmail.com',
            'photo' => '/iquique2027/assets/neon/iquique-muse.webp',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Diseño & Fotografía'
        ],
        [
            'full_name' => 'Valentina Andrea Castillo',
            'username' => 'valentinacastillo',
            'email' => 'valecastillo@gmail.com',
            'photo' => '/iquique2027/assets/neon/iquique-portrait.webp',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Turismo & Relaciones Públicas'
        ],
        [
            'full_name' => 'Martina Paz Soto',
            'username' => 'martinasoto',
            'email' => 'martinasoto@gmail.com',
            'photo' => '/iquique2027/assets/neon/iquique-gala.webp',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo de Alta Costura'
        ]
    ];

    $stmtCheck = $pdo->prepare("SELECT id FROM legado_2026 WHERE sede = ? AND username = ?");
    $stmtInsert = $pdo->prepare("INSERT INTO legado_2026 (sede, username, full_name, title_badge, email_personal, inst_email, photo_main, occupation, bio, custom_links, magic_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $seededCount = 0;

    foreach (['arica' => $candidatasArica, 'iquique' => $candidatasIquique] as $sede => $list) {
        $domain = $sede === 'arica' ? '2026.missuniversoarica.cl' : '2026.missuniversoiquique.cl';
        foreach ($list as $c) {
            $stmtCheck->execute([$sede, $c['username']]);
            if (!$stmtCheck->fetch()) {
                $token = bin2hex(random_bytes(24));
                $instEmail = $c['username'] . '@' . $domain;
                $defaultBio = "Parte de la historia de Miss Universo {$sede} 2026. Representando la belleza, cultura y talento del norte de Chile.";
                
                $defaultLinks = json_encode([
                    ['title' => 'Instagram Oficial', 'url' => 'https://instagram.com/' . $c['username'], 'icon' => 'instagram'],
                    ['title' => 'WhatsApp Contacto', 'url' => 'https://wa.me/56900000000', 'icon' => 'whatsapp']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

                $stmtInsert->execute([
                    $sede,
                    $c['username'],
                    $c['full_name'],
                    $c['title_badge'],
                    $c['email'],
                    $instEmail,
                    $c['photo'],
                    $c['occupation'],
                    $defaultBio,
                    $defaultLinks,
                    $token
                ]);
                $seededCount++;
            }
        }
    }

    $pdo->exec("UPDATE legado_2026 SET username = 'camilarios', inst_email = 'camilarios@2026.missuniversoarica.cl' WHERE username = 'camilaríos'");

    $total = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026")->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'message' => 'Tabla legado_2026 creada y poblada exitosamente',
        'new_seeded' => $seededCount,
        'total_candidatas' => $total
    ]);

} catch (Throwable $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
