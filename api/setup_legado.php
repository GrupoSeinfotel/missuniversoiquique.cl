<?php
/**
 * Setup & Seed: Legado 2026 Candidatas (Arica: 10 & Iquique: 12 Oficiales)
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

    // Limpiar candidatas dummy que se crearon de prueba inicial en Iquique
    $pdo->exec("DELETE FROM legado_2026 WHERE sede = 'iquique' AND username IN ('constanzamorales', 'valentinacastillo', 'martinasoto', 'camila')");

    // CANDIDATAS OFICIALES ARICA (10)
    $candidatasArica = [
        [
            'full_name' => 'Laura Riquelme Cayuleo',
            'username' => 'laurariquelme',
            'email' => 'laurasararc@gmail.com',
            'photo' => '/uploads/admin_cmlk8x21h0003gerkutyqwd53_1773967765801_DSC01282.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Embajadora Cultural',
            'gallery' => [
                '/uploads/admin_cmlk8x21h0003gerkutyqwd53_1773967765801_DSC01282.jpg'
            ]
        ],
        [
            'full_name' => 'Tamara Del Carmen Vergara Vergara',
            'username' => 'tamaravergara',
            'email' => 'tamararosesakamaki@gmail.com',
            'photo' => '/uploads/gallery_cmloa2huw004rgexocsybvjnj_1776350607944_1000134452.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Estudiante & Creadora de Contenido',
            'gallery' => [
                '/uploads/gallery_cmloa2huw004rgexocsybvjnj_1776350607944_1000134452.jpg',
                '/uploads/admin_cmlk8x21h0003gerkutyqwd53_1773967765801_DSC01282.jpg'
            ]
        ],
        [
            'full_name' => 'Rayen Millarau Coscio Pizarro',
            'username' => 'rayencoscio',
            'email' => 'rayencoscio06@gmail.com',
            'photo' => '/uploads/gallery_cmlsv1spl000xge2cfm8aorir_1774091557756_5B568FAB-9573-412E-BAC7-107374299AF2.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo de Pasarela',
            'gallery' => [
                '/uploads/gallery_cmlsv1spl000xge2cfm8aorir_1774091557756_5B568FAB-9573-412E-BAC7-107374299AF2.jpeg'
            ]
        ],
        [
            'full_name' => 'Sofia Belen Fredes Gutierrez',
            'username' => 'sofiafredes',
            'email' => 'sofiafredesgu1@gmail.com',
            'photo' => '/uploads/gallery_cmlvq05rs005jgeb4z3n6yvle_1776129845525_IMG-20260413-WA0008.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Emprendedora',
            'gallery' => [
                '/uploads/gallery_cmlvq05rs005jgeb4z3n6yvle_1776129845525_IMG-20260413-WA0008.jpg'
            ]
        ],
        [
            'full_name' => 'Camila Xiomara Ríos Chilcumpa',
            'username' => 'camilarios',
            'email' => 'kamilarioschilcumpa@gmail.com',
            'photo' => '/uploads/gallery_cmm4bybrf00mfgeb4p9fn1kzh_1775707760310_inbound7397300269220917351.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Diseño & Comunicación',
            'gallery' => [
                '/uploads/gallery_cmm4bybrf00mfgeb4p9fn1kzh_1775707760310_inbound7397300269220917351.jpg'
            ]
        ],
        [
            'full_name' => 'Silvia Muñoz Donoso',
            'username' => 'silviamunoz',
            'email' => 'Sm2572117@gmail.com',
            'photo' => '/uploads/gallery_cmmcokz80002bge7gaq6vwbjz_1775929704462_1000027597.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Liderazgo & Talento Regional',
            'gallery' => [
                '/uploads/gallery_cmmcokz80002bge7gaq6vwbjz_1775929704462_1000027597.jpg'
            ]
        ],
        [
            'full_name' => 'Scarlette Arely Mesina Rojas',
            'username' => 'scarlettemesina',
            'email' => 'scarlette.2000arelyyy@gmail.com',
            'photo' => '/uploads/dsyvu5mupk6a43l3_FULL_BODY_1772714637340_DSC00242.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo Editorial',
            'gallery' => [
                '/uploads/dsyvu5mupk6a43l3_FULL_BODY_1772714637340_DSC00242.jpeg'
            ]
        ],
        [
            'full_name' => 'Nicol Estefanía Noemí Viveros Navarro',
            'username' => 'nicolviveros',
            'email' => 'viverosnani@gmail.com',
            'photo' => '/uploads/gallery_cmmki79iw005ugef0zo4vl9zp_1775933080796_A23981E5-01E4-4BFA-A344-B494F693F882.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Estudiante de Derecho & Modelo',
            'gallery' => [
                '/uploads/gallery_cmmki79iw005ugef0zo4vl9zp_1775933080796_A23981E5-01E4-4BFA-A344-B494F693F882.jpeg'
            ]
        ],
        [
            'full_name' => 'Nayareth Elizabeth Sandoval Sepúlveda',
            'username' => 'nayarethsandoval',
            'email' => 'nayisandosep02@gmail.com',
            'photo' => '/uploads/gallery_cmmts87ns010mgegkp57r9vax_1777012295374_inbound3697726264616469069.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Emprendedora Social',
            'gallery' => [
                '/uploads/gallery_cmmts87ns010mgegkp57r9vax_1777012295374_inbound3697726264616469069.jpg'
            ]
        ],
        [
            'full_name' => 'Liz Rivera',
            'username' => 'lizrivera',
            'email' => 'lizriverajofre@gmail.com',
            'photo' => '/uploads/gallery_cmnb3yj7o000bgewsfoc8jwyq_1776646137784_IMG_1075.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Fitness & Moda',
            'gallery' => [
                '/uploads/gallery_cmnb3yj7o000bgewsfoc8jwyq_1776646137784_IMG_1075.jpeg'
            ]
        ]
    ];

    // CANDIDATAS OFICIALES IQUIQUE (12 REALES)
    $candidatasIquique = [
        [
            'full_name' => 'Jacqueline Lorena Corona Herrera',
            'username' => 'jacquelinecorona',
            'email' => 'coronajacque64@gmail.com',
            'photo' => '/uploads/qm4dbeg5cxepxho7_FACE_1770046761213_WhatsApp_Image_2026-01-05_at_8.48.37_PM.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Emprendedora Iquiqueña',
            'gallery' => [
                '/uploads/qm4dbeg5cxepxho7_FACE_1770046761213_WhatsApp_Image_2026-01-05_at_8.48.37_PM.jpeg',
                '/uploads/qm4dbeg5cxepxho7_PROFILE_1770046779346_WhatsApp_Image_2026-01-05_at_8.48.37_PM_(1).jpeg',
                '/uploads/qm4dbeg5cxepxho7_FULL_BODY_1770046900167_WhatsApp_Image_2025-12-29_at_5.34.57_PM.jpeg',
                '/uploads/qm4dbeg5cxepxho7_EDITORIAL_1770046919668_WhatsApp_Image_2026-01-12_at_9.12.46_PM.jpeg'
            ]
        ],
        [
            'full_name' => 'Quri Mayiri García Ayca',
            'username' => 'qurigarcia',
            'email' => 'qurigarcia@gmail.com',
            'photo' => '/uploads/chhaazemblxifcvu_FACE_1770098445062_IMG_7945.png',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Cultura & Identidad Regional',
            'gallery' => [
                '/uploads/chhaazemblxifcvu_FACE_1770098445062_IMG_7945.png',
                '/uploads/chhaazemblxifcvu_PROFILE_1770098445420_IMG_7942.jpeg',
                '/uploads/chhaazemblxifcvu_FULL_BODY_1770098469155_IMG_7948.png',
                '/uploads/chhaazemblxifcvu_EDITORIAL_1770098471020_IMG_7949.jpeg',
                '/uploads/gallery_cml66yj17000vge7c2ck2ewsk_1774845879817_IMG_7038.jpeg',
                '/uploads/gallery_cml66yj17000vge7c2ck2ewsk_1774845891622_IMG_7041.jpeg',
                '/uploads/gallery_cml66yj17000vge7c2ck2ewsk_1776428334422_IMG_9439.jpeg'
            ]
        ],
        [
            'full_name' => 'Ayalent Nazareth Álvarez Bautista',
            'username' => 'ayalentalvarez',
            'email' => 'ayalenta@gmail.com',
            'photo' => '/uploads/2la2xo23xuu6fcx5_FACE_1770173002692_IMG_2474.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Comunicación & Redes Sociales',
            'gallery' => [
                '/uploads/2la2xo23xuu6fcx5_FACE_1770173002692_IMG_2474.jpeg',
                '/uploads/2la2xo23xuu6fcx5_PROFILE_1770173012638_IMG_2478.jpeg',
                '/uploads/2la2xo23xuu6fcx5_FULL_BODY_1770173020645_IMG_2480.jpeg',
                '/uploads/2la2xo23xuu6fcx5_EDITORIAL_1770173041215_IMG_0466.jpeg',
                '/uploads/gallery_cml7fh4kr0011ge7cwto5eiy3_1774956244979_990f5bc4-ad1f-4615-97c0-fcdd4fbcbc02.jpeg',
                '/uploads/gallery_cml7fh4kr0011ge7cwto5eiy3_1774956308607_IMG_6329.jpeg'
            ]
        ],
        [
            'full_name' => 'Javiera Antonia García Colipi',
            'username' => 'javieragarcia',
            'email' => 'javiera.garciacolipi@gmail.com',
            'photo' => '/uploads/ijy2jqybkplgad56_EDITORIAL_1770918729910_inbound3695573378912821440.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Pasarela & Estilismo',
            'gallery' => [
                '/uploads/ijy2jqybkplgad56_EDITORIAL_1770918729910_inbound3695573378912821440.jpg',
                '/uploads/gallery_cmljrb49t0003gem40xu4v2r8_1774574375744_inbound1883467856359551550.jpg',
                '/uploads/gallery_cmljrb49t0003gem40xu4v2r8_1774574428248_inbound5565458151900826306.jpg',
                '/uploads/gallery_cmljrb49t0003gem40xu4v2r8_1774610548818_inbound6231487968327669847.jpg',
                '/uploads/gallery_cmljrb49t0003gem40xu4v2r8_1774622599553_inbound8144867710405423382.png',
                '/uploads/gallery_cmljrb49t0003gem40xu4v2r8_1774622622210_inbound8836512741724488917.png'
            ]
        ],
        [
            'full_name' => 'Grace Barbara Valdovino Averanga',
            'username' => 'gracevaldovino',
            'email' => 'valdovinograce@gmail.com',
            'photo' => '/uploads/2sistdktft2df65m_FULL_BODY_1770930630126_inbound1942447638686948449.png',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Danza & Arte Escénico',
            'gallery' => [
                '/uploads/2sistdktft2df65m_FULL_BODY_1770930630126_inbound1942447638686948449.png',
                '/uploads/2sistdktft2df65m_EDITORIAL_1770930861710_inbound2272069602084231267.jpg',
                '/uploads/gallery_cmljylsgt0009gem4abqv4slv_1775769099868_inbound434680223171452494.jpg',
                '/uploads/gallery_cmljylsgt0009gem4abqv4slv_1775769472019_inbound8750299611960434791.jpg',
                '/uploads/gallery_cmljylsgt0009gem4abqv4slv_1775769670982_inbound2742629846065857751.jpg',
                '/uploads/gallery_cmljylsgt0009gem4abqv4slv_1775770160373_inbound3979275635157099748.jpg'
            ]
        ],
        [
            'full_name' => 'Yessenia Rojas Figueroa',
            'username' => 'yesseniarojas',
            'email' => 'yesseniarojas9@gmail.com',
            'photo' => '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1774399010327_inbound1596184113045379334.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Modelo & Comunicadora',
            'gallery' => [
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1774399010327_inbound1596184113045379334.jpg',
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1775115588985_WhatsApp_Image_2026-04-02_at_04.38.00.jpeg',
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1775115612873_WhatsApp_Image_2026-04-02_at_04.38.01.jpeg',
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1775115642952_WhatsApp_Image_2026-04-02_at_04.38.00_(1).jpeg',
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1775116133980_WhatsApp_Image_2026-04-02_at_04.48.18.jpeg',
                '/uploads/gallery_cmlx3o0f700cegerwqtdkg9tl_1775116148983_WhatsApp_Image_2026-04-02_at_04.48.19.jpeg'
            ]
        ],
        [
            'full_name' => 'Valentina Andrea Medel Ossandón',
            'username' => 'valentinamedel',
            'email' => 'vlntna.mo@gmail.com',
            'photo' => '/uploads/bk73ykzhw4xvyxgb_FACE_1773367611524_temp_image_D8AC8880-DB2F-47E6-A4D8-71C1CB7A0377.webp',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Diseño & Alta Costura',
            'gallery' => [
                '/uploads/bk73ykzhw4xvyxgb_FACE_1773367611524_temp_image_D8AC8880-DB2F-47E6-A4D8-71C1CB7A0377.webp',
                '/uploads/bk73ykzhw4xvyxgb_EDITORIAL_1773368184976_F4687016-792A-470F-83CB-21DF8D8B7083.jpeg',
                '/uploads/gallery_cmmo9sevw003zgezwmohjlcxc_1777000780608_IMG_1421.jpeg',
                '/uploads/gallery_cmmo9sevw003zgezwmohjlcxc_1777001980596_IMG_9969.jpeg',
                '/uploads/gallery_cmmo9sevw003zgezwmohjlcxc_1777002216163_IMG_1587.jpeg'
            ]
        ],
        [
            'full_name' => 'Bianca Javiera Ahuile Franchini',
            'username' => 'biancaahuile',
            'email' => 'ahuile.bianca@gmail.com',
            'photo' => '/uploads/5a3bwyadsthw4v3o_PROFILE_1773616793975_IMG_4103.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Publicidad & Fotografía de Moda',
            'gallery' => [
                '/uploads/5a3bwyadsthw4v3o_PROFILE_1773616793975_IMG_4103.jpg',
                '/uploads/5a3bwyadsthw4v3o_FULL_BODY_1773616837779_IMG_4296.jpg',
                '/uploads/5a3bwyadsthw4v3o_EDITORIAL_1773616861161_IMG_4268.jpg',
                '/uploads/gallery_cmmsfgaek0061gejkx2ukwj31_1774575074323_IMG_4278.jpg',
                '/uploads/gallery_cmmsfgaek0061gejkx2ukwj31_1774575091218_IMG_4287.jpg',
                '/uploads/gallery_cmmsfgaek0061gejkx2ukwj31_1774575121289_IMG_4104.jpg'
            ]
        ],
        [
            'full_name' => 'Carla Vial Muñoz',
            'username' => 'carlavial',
            'email' => 'carla.vial.munoz@gmail.com',
            'photo' => '/uploads/bpwpth3o345amghu_FACE_1773798472596_WhatsApp_Image_2026-03-17_at_8.38.56_PM.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Gestión Cultural & Turismo',
            'gallery' => [
                '/uploads/bpwpth3o345amghu_FACE_1773798472596_WhatsApp_Image_2026-03-17_at_8.38.56_PM.jpeg',
                '/uploads/bpwpth3o345amghu_PROFILE_1773798491014_WhatsApp_Image_2026-03-17_at_8.38.34_PM.jpeg',
                '/uploads/bpwpth3o345amghu_FULL_BODY_1773798495060_WhatsApp_Image_2026-03-17_at_8.39.28_PM.jpeg',
                '/uploads/bpwpth3o345amghu_EDITORIAL_1773798501244_WhatsApp_Image_2026-03-17_at_8.40.37_PM.jpeg',
                '/uploads/gallery_cmmvdye7m003xgelc9bc5nq7h_1774361073140_4B9D21CA-CF3F-41FF-8379-5FF8050F1695.jpeg',
                '/uploads/gallery_cmmvdye7m003xgelc9bc5nq7h_1774361112167_046A61EF-5735-4784-B90A-AC169E87E7C4.jpeg'
            ]
        ],
        [
            'full_name' => 'Javiera Andrea Vivar Suazo',
            'username' => 'javieravivar',
            'email' => 'vivarjaviera2504@gmail.com',
            'photo' => '/uploads/haewywys7clf3uak_PROFILE_1774368672074_1000198988.jpg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Estudiante de Derecho & Modelo',
            'gallery' => [
                '/uploads/haewywys7clf3uak_PROFILE_1774368672074_1000198988.jpg',
                '/uploads/haewywys7clf3uak_FULL_BODY_1774368680848_1000198965.jpg',
                '/uploads/haewywys7clf3uak_EDITORIAL_1774368694906_1000200004.jpg',
                '/uploads/gallery_cmn4tbzpm0073geckusv9mv2l_1774705946636_1000205539.jpg',
                '/uploads/gallery_cmn4tbzpm0073geckusv9mv2l_1774879055520_WhatsApp_Image_2026-03-29_at_10.49.20_PM.jpeg'
            ]
        ],
        [
            'full_name' => 'Poleth Valentina León Tapia',
            'username' => 'polethleon',
            'email' => 'poleth.valentina19@gmail.com',
            'photo' => '/uploads/a75cykvvd32j5ybf_FACE_1774371243745_IMG_0082.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Actuación & Modelaje Publicitario',
            'gallery' => [
                '/uploads/a75cykvvd32j5ybf_FACE_1774371243745_IMG_0082.jpeg',
                '/uploads/a75cykvvd32j5ybf_PROFILE_1774371313436_IMG_0088.jpeg',
                '/uploads/a75cykvvd32j5ybf_FULL_BODY_1774371606044_IMG_0086.jpeg',
                '/uploads/a75cykvvd32j5ybf_EDITORIAL_1774371649440_1c13f325-e2ff-473d-bd95-57c6e1ade21c.jpeg',
                '/uploads/gallery_cmn4v2vvf008ngeck7jwky06t_1775307820693_IMG_0134.jpeg',
                '/uploads/gallery_cmn4v2vvf008ngeck7jwky06t_1775307839057_7c661c21-67f0-4ad2-9f1a-e80bf22aa1ae.jpeg'
            ]
        ],
        [
            'full_name' => 'Yessamin Natalia Peredo Celedón',
            'username' => 'yessaminperedo',
            'email' => 'yessaa.peredo@gmail.com',
            'photo' => '/uploads/2mipvwmmh3mq6ppt_FACE_1774487466089_36125E14-670F-4EF4-8823-6BCD08EB7141.jpeg',
            'title_badge' => 'Candidata Oficial 2026',
            'occupation' => 'Emprendimiento & Belleza Integral',
            'gallery' => [
                '/uploads/2mipvwmmh3mq6ppt_FACE_1774487466089_36125E14-670F-4EF4-8823-6BCD08EB7141.jpeg',
                '/uploads/2mipvwmmh3mq6ppt_PROFILE_1774487405511_IMG_0321.jpeg',
                '/uploads/2mipvwmmh3mq6ppt_EDITORIAL_1774487453262_IMG_9348.jpeg'
            ]
        ]
    ];

    $stmtInsert = $pdo->prepare("
        INSERT INTO legado_2026 (
            sede, username, full_name, title_badge, email_personal, inst_email,
            photo_main, photos_gallery, occupation, bio, custom_links, magic_token
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            photo_main = VALUES(photo_main),
            photos_gallery = VALUES(photos_gallery),
            occupation = VALUES(occupation),
            email_personal = VALUES(email_personal),
            inst_email = VALUES(inst_email)
    ");

    $seededCount = 0;

    foreach (['arica' => $candidatasArica, 'iquique' => $candidatasIquique] as $sede => $lista) {
        foreach ($lista as $c) {
            $token = bin2hex(random_bytes(24));
            $instEmail = "{$c['username']}@2026.missuniverso{$sede}.cl";
            $defaultBio = "Parte imborrable de la historia oficial de Miss Universo {$sede} 2026. Representando la belleza, elegancia, liderazgo y talento del norte de Chile.";
            $galleryJson = json_encode($c['gallery'] ?? [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            
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
                $galleryJson,
                $c['occupation'],
                $defaultBio,
                $defaultLinks,
                $token
            ]);
            $seededCount++;
        }
    }

    $total = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026")->fetchColumn();
    $totArica = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'arica'")->fetchColumn();
    $totIquique = (int)$pdo->query("SELECT COUNT(*) FROM legado_2026 WHERE sede = 'iquique'")->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'message' => 'Base de datos de legado actualizada con 10 candidatas de Arica y 12 candidatas de Iquique',
        'total' => $total,
        'arica' => $totArica,
        'iquique' => $totIquique
    ]);

} catch (Throwable $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
