<?php
/**
 * MISS UNIVERSO · API SALÓN DEL LEGADO 2026
 * Acciones:
 * 1. get_linktree: Obtiene datos públicos para el modal Linktree (/2026/#usuario).
 * 2. get_profile: Obtiene datos completos de la candidata usando magic_token.
 * 3. save_profile: Guarda cambios de perfil, username, links y modos.
 * 4. upload_photo: Sube y actualiza foto de perfil o foto de galería.
 * 5. delete_gallery_photo: Elimina una foto secundaria de la galería.
 * 6. request_token: Envía magic link al correo personal si la candidata lo solicita.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$is_api = true;
require_once (getenv('LEGADO_DB_CONFIG') ?: __DIR__ . '/../config/db.php');
require_once __DIR__ . '/mailbox.php';
require_once __DIR__.'/profile.php';

// Detectar sede
$host = $_SERVER['HTTP_HOST'] ?? '';
$sede = (strpos($host, 'iquique') !== false) ? 'iquique' : 'arica';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
require_once __DIR__.'/activation-2026.php';
mu_activation_dispatch($pdo,(string)$action);
legado_mail_dispatch($pdo,(string)$action);
require_once __DIR__.'/history.php';
mu_history_begin($pdo,$sede,(string)$action);

// ==========================================
// 1. OBTENER DATOS PÚBLICOS LINKTREE
// ==========================================
if ($action === 'get_linktree') {
    $user = trim($_GET['user'] ?? '');
    if (empty($user)) {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no especificado']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, sede, username, full_name, title_badge, photo_main, photos_gallery, videos_gallery, occupation, inst_email, custom_links, mode_editorial, mode_linktree, is_minimal_record, instagram, tiktok, whatsapp FROM legado_2026 WHERE sede = ? AND username = ? LIMIT 1");
    $stmt->execute([$sede, $user]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);



    if (!$candidate) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Candidata no encontrada en el registro']);
        exit;
    }

    $candidate=legado_public_record(legado_media_public(legado_mail_public($pdo,$candidate)));

    // Si está en modo mínimo, ocultamos links personales por privacidad
    if (!empty($candidate['is_minimal_record'])) {
        $candidate['custom_links'] = json_encode([]);
        $candidate['instagram'] = null;
        $candidate['tiktok'] = null;
        $candidate['whatsapp'] = null;
    }

    echo json_encode([
        'status' => 'success',
        'candidate' => $candidate
    ]);
    exit;
}

// ==========================================
// 2. OBTENER PERFIL PRIVADO (POR MAGIC TOKEN)
// ==========================================
if ($action === 'get_profile') {
    $token = trim($_GET['token'] ?? $_POST['token'] ?? '');
    if (empty($token) || strlen($token) < 20) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token de seguridad inválido o ausente']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE magic_token = ? AND sede = ? LIMIT 1");
    $stmt->execute([$token,$sede]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'El enlace de acceso no es válido o ha expirado']);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'candidate' => legado_mail_public($pdo,$cand)
    ]);
    exit;
}

// ==========================================
// 3. GUARDAR PERFIL (POR MAGIC TOKEN)
// ==========================================
if ($action === 'save_profile') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        exit;
    }

    $token = trim($_POST['token'] ?? '');
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token no proporcionado']);
        exit;
    }

    // Verificar candidata
    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE magic_token = ? AND sede = ? LIMIT 1");
    $stmt->execute([$token,$sede]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
        exit;
    }

    $id = $cand['id'];
    $currentSede = $cand['sede'];

    // Validar y sanitizar nuevo username
    $rawUser = trim($_POST['username'] ?? $cand['username']);
    $newUsername = strtolower(preg_replace('/[^a-z0-9._-]/i', '', $rawUser));
    if (strlen($newUsername) < 3) {
        echo json_encode(['status' => 'error', 'message' => 'El nombre de usuario debe tener al menos 3 caracteres alfanuméricos.']);
        exit;
    }

    // Comprobar que no esté repetido en la misma sede
    if ($newUsername !== $cand['username']) {
        $check = $pdo->prepare("SELECT id FROM legado_2026 WHERE sede = ? AND username = ? AND id != ? LIMIT 1");
        $check->execute([$currentSede, $newUsername, $id]);
        if ($check->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Ese nombre de usuario ya está en uso por otra embajadora. Por favor elige otro.']);
            exit;
        }
    }

    // La casilla confirmada conserva su dirección al editar el perfil
    $mailState=legado_mail_status($pdo,(string)$id);
    $instEmail=$mailState&&$mailState['status']==='active'?$mailState['address']:'';

    // Campos editables
    $emailPersonal = trim($_POST['email_personal'] ?? $cand['email_personal']);
    $occupation = trim($_POST['occupation'] ?? '');
    $bio = trim($_POST['bio'] ?? '');
    $instagram = trim($_POST['instagram'] ?? '');
    $tiktok = trim($_POST['tiktok'] ?? '');
    $whatsapp = trim($_POST['whatsapp'] ?? '');

    // Sanitizar redes
    $instagram = preg_replace('/^@/', '', $instagram);
    $tiktok = preg_replace('/^@/', '', $tiktok);

    // Links personalizados (JSON)
    $customLinksRaw = $_POST['custom_links'] ?? '[]';
    $customLinks = is_array($customLinksRaw) ? json_encode($customLinksRaw, JSON_UNESCAPED_UNICODE) : $customLinksRaw;
    // Validar formato JSON
    json_decode($customLinks);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $customLinks = '[]';
    }

    // Modos de visualización
    $modeEditorial = isset($_POST['mode_editorial']) ? intval($_POST['mode_editorial']) : 1;
    $modeLinktree = isset($_POST['mode_linktree']) ? intval($_POST['mode_linktree']) : 1;
    $isMinimalRecord = isset($_POST['is_minimal_record']) ? intval($_POST['is_minimal_record']) : 0;

    $rawVideos=$_POST['videos_gallery']??($cand['videos_gallery']?:'[]');$videoList=is_array($rawVideos)?$rawVideos:json_decode($rawVideos,true);
    if(!is_array($videoList)||count($videoList)>40){http_response_code(400);echo json_encode(['status'=>'error','message'=>'Usa una lista de hasta 40 videos.']);exit;}
    $videoList=array_values(array_unique(array_filter(array_map('trim',$videoList))));foreach($videoList as $url)if(!legado_media_url($url)){http_response_code(400);echo json_encode(['status'=>'error','message'=>'Hay un enlace de video no válido.']);exit;}
    $videosGallery=json_encode($videoList,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    $details=json_decode($_POST['profile_details']??($cand['profile_details']?:'{}'),true);if(!is_array($details))$details=[];
    $cleanDetails=[];foreach(['education','hobbies','future_aspirations','height','eye_color','hair_color'] as $key){$v=$details[$key]??'';if(!is_scalar($v)||mb_strlen((string)$v)>5000){http_response_code(400);echo json_encode(['status'=>'error','message'=>'Revisa los datos de tu trayectoria.']);exit;}$cleanDetails[$key]=trim((string)$v);}
    $profileDetails=json_encode($cleanDetails,JSON_UNESCAPED_UNICODE);

    // Actualizar en base de datos
    $updateStmt = $pdo->prepare("
        UPDATE legado_2026 SET
            username = ?,
            inst_email = ?,
            email_personal = ?,
            occupation = ?,
            bio = ?,
            instagram = ?,
            tiktok = ?,
            whatsapp = ?,
            custom_links = ?,
            videos_gallery = ?,
            profile_details = ?,
            mode_editorial = ?,
            mode_linktree = ?,
            is_minimal_record = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $updateStmt->execute([
        $newUsername,
        $instEmail,
        $emailPersonal,
        $occupation,
        $bio,
        $instagram,
        $tiktok,
        $whatsapp,
        $customLinks,
        $videosGallery,
        $profileDetails,
        $modeEditorial,
        $modeLinktree,
        $isMinimalRecord,
        $id
    ]);

    // Devolver objeto actualizado
    $stmtReload = $pdo->prepare("SELECT * FROM legado_2026 WHERE id = ?");
    $stmtReload->execute([$id]);
    $updatedCand = $stmtReload->fetch(PDO::FETCH_ASSOC);
    mu_history_commit($pdo);

    echo json_encode([
        'status' => 'success',
        'message' => '¡Perfil de embajadora actualizado exitosamente!',
        'candidate' => $updatedCand
    ]);
    exit;
}


if($action==='upload_video'){
 if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['status'=>'error','message'=>'Método no permitido']);exit;}
 $token=(string)($_POST['token']??'');$q=$pdo->prepare('SELECT id,sede FROM legado_2026 WHERE magic_token=? AND sede=? LIMIT 1');$q->execute([$token,$sede]);$owner=$q->fetch(PDO::FETCH_ASSOC);
 if(!$owner){http_response_code(403);echo json_encode(['status'=>'error','message'=>'Acceso no válido']);exit;}
 $file=$_FILES['video']??null;if(!$file||$file['error']!==UPLOAD_ERR_OK){http_response_code(400);echo json_encode(['status'=>'error','message'=>'No se pudo recibir el archivo. Máximo 100 MB por video.']);exit;}
 $ext=strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));$mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
 $types=['mp4'=>['video/mp4','application/mp4'],'mov'=>['video/quicktime'],'webm'=>['video/webm']];
 if(!isset($types[$ext])||!in_array($mime,$types[$ext],true)||$file['size']>100*1024*1024){http_response_code(400);echo json_encode(['status'=>'error','message'=>'Usa videos MP4, MOV o WebM válidos de hasta 100 MB.']);exit;}
 $dir=__DIR__.'/../uploads/legado/'.$owner['sede'].'/';if(!is_dir($dir)&&!mkdir($dir,0755,true))throw new RuntimeException('No se pudo crear el archivo');
 $name='video_'.bin2hex(random_bytes(20)).'.'.$ext;$url='/uploads/legado/'.$owner['sede'].'/'.$name;
 if(!move_uploaded_file($file['tmp_name'],$dir.$name)){http_response_code(500);echo json_encode(['status'=>'error','message'=>'No se pudo guardar el archivo']);exit;}
 try{$q=$pdo->prepare('SELECT videos_gallery FROM legado_2026 WHERE id=? FOR UPDATE');$q->execute([$owner['id']]);$urls=json_decode($q->fetchColumn()?:'[]',true)?:[];if(count($urls)>=40)throw new RuntimeException('Tu archivo admite hasta 40 videos o referencias.');$urls[]=$url;$q=$pdo->prepare('UPDATE legado_2026 SET videos_gallery=?,updated_at=NOW() WHERE id=?');$q->execute([json_encode($urls,JSON_UNESCAPED_SLASHES),$owner['id']]);mu_history_commit($pdo);}catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();@unlink($dir.$name);echo json_encode(['status'=>'error','message'=>'No se pudo confirmar el video. Revisa si alcanzaste el límite de 40 archivos.']);exit;}
 echo json_encode(['status'=>'success','video_url'=>$url]);exit;
}

// ==========================================
// 4. SUBIR FOTOS (PORTRAIT O GALERÍA)
// ==========================================
if ($action === 'upload_photo') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        exit;
    }

    $token = trim($_POST['token'] ?? '');
    $type = trim($_POST['type'] ?? 'main'); // 'main' o 'gallery'

    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token requerido']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE magic_token = ? AND sede = ? LIMIT 1");
    $stmt->execute([$token,$sede]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
        exit;
    }

    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'No se recibió ninguna imagen o ocurrió un error al subir.']);
        exit;
    }

    $file = $_FILES['photo'];
    $allowed = ['jpg', 'jpeg', 'png', 'webp'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        echo json_encode(['status' => 'error', 'message' => 'Formato no admitido. Usa JPG, PNG o WebP.']);
        exit;
    }

    if ($file['size'] > 12 * 1024 * 1024) {
        echo json_encode(['status' => 'error', 'message' => 'La imagen excede el límite de 12 MB.']);
        exit;
    }

    if(!@getimagesize($file['tmp_name'])){http_response_code(400);echo json_encode(['status'=>'error','message'=>'El archivo no contiene una imagen válida.']);exit;}
    // Carpeta destino
    $targetDir = __DIR__ . '/../uploads/legado/' . $cand['sede'] . '/';
    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0755, true);
    }

    $fileName = 'legado_' . $cand['username'] . '_' . $type . '_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
    $destPath = $targetDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        echo json_encode(['status' => 'error', 'message' => 'Error al guardar la foto en el servidor.']);
        exit;
    }

    $publicUrl = '/uploads/legado/' . $cand['sede'] . '/' . $fileName;

    try {
    if ($type === 'main') {
        $up = $pdo->prepare("UPDATE legado_2026 SET photo_main = ? WHERE id = ?");
        $up->execute([$publicUrl, $cand['id']]);
    } else {
        // Galería
        $gallery = [];
        if (!empty($cand['photos_gallery'])) {
            $gallery = json_decode($cand['photos_gallery'], true);
            if (!is_array($gallery)) $gallery = [];
        }
        $gallery[] = $publicUrl;
        $up = $pdo->prepare("UPDATE legado_2026 SET photos_gallery = ? WHERE id = ?");
        $up->execute([json_encode($gallery, JSON_UNESCAPED_SLASHES), $cand['id']]);
    }

    mu_history_commit($pdo);
    } catch(Throwable $e) { if($pdo->inTransaction())$pdo->rollBack(); @unlink($destPath); http_response_code(500); exit(json_encode(['status'=>'error','message'=>'No se pudo confirmar el cambio. Inténtalo nuevamente.'])); }
    echo json_encode([
        'status' => 'success',
        'message' => 'Foto subida correctamente',
        'photo_url' => $publicUrl,
        'type' => $type
    ]);
    exit;
}

// ==========================================
// 5. ELIMINAR FOTO DE GALERÍA
// ==========================================
if ($action === 'delete_gallery_photo') {
    $token = trim($_POST['token'] ?? '');
    $photoUrl = trim($_POST['photo_url'] ?? '');

    if (empty($token) || empty($photoUrl)) {
        echo json_encode(['status' => 'error', 'message' => 'Parámetros incompletos']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE magic_token = ? AND sede = ? LIMIT 1");
    $stmt->execute([$token,$sede]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
        exit;
    }

    $gallery = [];
    if (!empty($cand['photos_gallery'])) {
        $gallery = json_decode($cand['photos_gallery'], true);
        if (!is_array($gallery)) $gallery = [];
    }

    $newGallery = array_values(array_filter($gallery, function($p) use ($photoUrl) {
        return $p !== $photoUrl;
    }));

    $up = $pdo->prepare("UPDATE legado_2026 SET photos_gallery = ? WHERE id = ?");
    $up->execute([json_encode($newGallery, JSON_UNESCAPED_SLASHES), $cand['id']]);

    mu_history_commit($pdo);
    echo json_encode([
        'status' => 'success',
        'message' => 'Foto eliminada de la galería',
        'gallery' => $newGallery
    ]);
    exit;
}

// ==========================================
// 6. SOLICITAR MAGIC TOKEN POR EMAIL
// ==========================================
if ($action === 'request_token') {
    $email = trim($_POST['email'] ?? '');
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Ingresa un correo electrónico válido']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM legado_2026 WHERE email_personal = ? AND sede = ? LIMIT 1");
    $stmt->execute([$email,$sede]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        // También verificar por username si lo ingresaron
        $stmt2 = $pdo->prepare("SELECT * FROM legado_2026 WHERE username = ? AND sede = ? LIMIT 1");
        $stmt2->execute([$email,$sede]);
        $cand = $stmt2->fetch(PDO::FETCH_ASSOC);
    }

    if (!$cand) {
        echo json_encode([
            'status' => 'error',
            'message' => 'No encontramos ninguna embajadora con ese correo. Contáctanos a contacto@missuniverso' . $sede . '.cl'
        ]);
        exit;
    }

    $candSede = $cand['sede'];
    $magicUrl = "https://missuniverso{$candSede}.cl/2026/editar.php?token={$cand['magic_token']}";
    $fromEmail = "contacto@missuniverso{$candSede}.cl";
    $subject = "Acceso a tu Panel de Embajadora 2026 · Miss Universo " . ucfirst($candSede);

    $htmlBody = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='utf-8'></head>
    <body style='background:#010820; color:#f1f5f9; font-family:sans-serif; padding:30px; margin:0;'>
        <div style='max-width:550px; margin:0 auto; background:rgba(4,16,48,0.9); border:1px solid #eab308; border-radius:16px; padding:32px; text-align:center;'>
            <div style='font-size:36px; margin-bottom:10px;'>👑</div>
            <h1 style='color:#f7d070; font-size:22px; margin-bottom:6px;'>Miss Universo " . ucfirst($candSede) . "</h1>
            <p style='color:#94a3b8; font-size:14px; margin-top:0;'>Salón del Legado 2026</p>
            <div style='margin:25px 0; padding:20px; background:rgba(255,255,255,0.04); border-radius:12px;'>
                <p style='font-size:16px; margin:0 0 10px 0;'>Hola <strong>" . htmlspecialchars($cand['full_name']) . "</strong>,</p>
                <p style='font-size:14px; color:#cbd5e1; line-height:1.5;'>Aquí tienes tu enlace directo y seguro para acceder a tu panel de embajadora oficial:</p>
                <a href='{$magicUrl}' style='display:inline-block; margin-top:15px; background:linear-gradient(135deg, #f5245f, #eab308); color:#fff; text-decoration:none; padding:14px 28px; border-radius:30px; font-weight:bold; font-size:15px;'>Ingresar a mi Panel</a>
            </div>
            <p style='font-size:12px; color:#64748b;'>Este enlace es privado y exclusivo para ti. No lo compartas con terceros.</p>
        </div>
    </body>
    </html>";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Miss Universo " . ucfirst($candSede) . " <{$fromEmail}>\r\n";
    $headers .= "Reply-To: {$fromEmail}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @mail($cand['email_personal'], $subject, $htmlBody, $headers);

    echo json_encode([
        'status' => 'success',
        'message' => 'Te hemos enviado tu enlace mágico de acceso a tu correo: ' . htmlspecialchars($cand['email_personal'])
    ]);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Acción no reconocida']);
