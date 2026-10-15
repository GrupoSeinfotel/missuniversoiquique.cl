<?php
declare(strict_types=1);
// Adaptador de producción PHP/MySQL. Las tablas 2026 nunca se modifican.
date_default_timezone_set('America/Santiago');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');
ini_set('display_errors', '0');
session_name('IQUIQUE2027');
session_set_cookie_params(['lifetime'=>28800,'path'=>'/','secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
session_start();
if (!isset($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(24));
if (isset($_SESSION['expires']) && $_SESSION['expires']<time()) unset($_SESSION['user']);

function reply(array $data, int $status=200): never { http_response_code($status); echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_INVALID_UTF8_SUBSTITUTE); exit; }
function field(array $d,string $key,int $min=0,int $max=5000): string { $v=$d[$key]??''; if(!is_string($v)||strlen(trim($v))<$min||strlen($v)>$max) throw new InvalidArgumentException('Revisa el campo '.$key.'.'); return trim($v); }
function email_value(array $d,string $key='email'): string { $v=strtolower(field($d,$key,3,254)); if(!filter_var($v,FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Ingresa un correo válido.'); return $v; }
function safe_url(string $url): string { if($url==='')return ''; if(preg_match('~^/(?:assets|uploads|watermarked|iquique2027/assets)/[a-zA-Z0-9_./%()@+\-]+$~D',$url)&&!str_contains($url,'..')) return $url; $p=parse_url($url); if(!is_array($p)||($p['scheme']??'')!=='https'||empty($p['host'])||isset($p['user'])||isset($p['pass'])) throw new InvalidArgumentException('Usa una dirección HTTPS o un archivo del sitio.'); return $url; }
const SUPERADMIN_EMAIL='seinfotel.com@gmail.com';
function require_user(?array $u,?string $role=null): array { if(!$u)reply(['error'=>'Inicia sesión para continuar.'],401); if(($u['role']==='superadmin'&&strtolower($u['email'])!==SUPERADMIN_EMAIL)||($role&&$u['role']!==$role&&!($role==='admin'&&$u['role']==='superadmin')))reply(['error'=>'Esta operación requiere permisos de administración.'],403); return $u; }
function query(PDO $db,string $sql,array $args=[]): PDOStatement { $q=$db->prepare($sql);$q->execute($args);return $q; }
function settings(PDO $db): array { $a=[];foreach($db->query('SELECT setting_key,setting_value FROM iquique27_settings') as $r)$a[$r['setting_key']]=json_decode($r['setting_value'],true);return $a; }
function audit(PDO $db,?array $u,string $action): void { query($db,'INSERT INTO iquique27_audit(user_id,action) VALUES(?,?)',[$u['id']??null,$action]); }
function level(PDO $db,string $uid): int { $approved=query($db,"SELECT level FROM iquique27_submissions WHERE user_id=? AND status='approved'",[$uid])->fetchAll(PDO::FETCH_COLUMN);$n=1;while($n<17&&in_array($n,$approved))$n++;return $n; }
function private_dir(): string { $p=getenv('MUI_PRIVATE_DIR')?:dirname(__DIR__,2).'/iquique2027-private';if(!is_dir($p)&&!mkdir($p,0700,true))throw new RuntimeException('Private storage unavailable');return $p; }
function migrate(PDO $db): void {
 try{$done=$db->query("SELECT setting_value FROM iquique27_settings WHERE setting_key='schema_version'")->fetchColumn();if($done==='1')return;}catch(PDOException $e){}
 $sql=[
 "CREATE TABLE IF NOT EXISTS iquique27_users(id VARCHAR(40) PRIMARY KEY,name VARCHAR(120) NOT NULL,email VARCHAR(254) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL,role VARCHAR(20) NOT NULL DEFAULT 'voter',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_candidates(id VARCHAR(100) PRIMARY KEY,user_id VARCHAR(40) NOT NULL UNIQUE,name VARCHAR(120) NOT NULL,bio TEXT,purpose TEXT,photo TEXT,media LONGTEXT,published TINYINT NOT NULL DEFAULT 0,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_votes(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id VARCHAR(40) NOT NULL,candidate_id VARCHAR(100) NOT NULL,vote_day DATE NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY daily_vote(user_id,vote_day)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_leads(id BIGINT AUTO_INCREMENT PRIMARY KEY,kind VARCHAR(20) NOT NULL,name VARCHAR(120) NOT NULL,email VARCHAR(254) NOT NULL,phone VARCHAR(30),company VARCHAR(160),message TEXT,metadata LONGTEXT,status VARCHAR(20) DEFAULT 'pendiente',consent TINYINT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_submissions(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id VARCHAR(40) NOT NULL,level INT NOT NULL,evidence TEXT,status VARCHAR(20) DEFAULT 'pending',review_comment TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY submission_level(user_id,level)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_news(id BIGINT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200) NOT NULL,body LONGTEXT,image TEXT,category VARCHAR(50) DEFAULT 'Certamen',edition INT DEFAULT 2027,published TINYINT DEFAULT 1,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_sponsors(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(160) NOT NULL,description TEXT,logo TEXT,website TEXT,category VARCHAR(50) DEFAULT 'Colaborador',published TINYINT DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_events(id BIGINT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200) NOT NULL,body TEXT,event_date VARCHAR(40),location VARCHAR(200),published TINYINT DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_settings(setting_key VARCHAR(100) PRIMARY KEY,setting_value LONGTEXT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_audit(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id VARCHAR(40),action VARCHAR(200),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
 "CREATE TABLE IF NOT EXISTS iquique27_limits(bucket VARCHAR(64) PRIMARY KEY,started BIGINT NOT NULL,attempts INT NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
 ];foreach($sql as $s)$db->exec($s);
 foreach(['free_voting'=>false,'voting_rules_confirmed'=>false,'casting_open'=>true,'casting_note'=>'Preinscripción 2027. La recepción de antecedentes no confirma selección; la organización comunicará las bases y las próximas etapas.','contact_email'=>'contacto@missuniversoiquique.cl','instagram'=>'https://www.instagram.com/missuniversoiquique/','mission_program_confirmed'=>false,'privacy_contact'=>'contacto@missuniversoiquique.cl'] as $k=>$v) query($db,'INSERT IGNORE INTO iquique27_settings(setting_key,setting_value) VALUES(?,?)',[$k,json_encode($v,JSON_UNESCAPED_UNICODE)]);
 query($db,"INSERT IGNORE INTO iquique27_settings(setting_key,setting_value) VALUES('schema_version','1')");
}
function candidate_media(array $d): array {
 $gallery=$d['gallery']??[];$videos=$d['videos']??[];$socials=$d['socials']??[];
 if(!is_array($gallery)||count($gallery)>40||!is_array($videos)||count($videos)>15||!is_array($socials)||count($socials)>10)throw new InvalidArgumentException('Revisa las galerías y los enlaces.');
 $gallery=array_map(fn($x)=>safe_url((string)$x),$gallery);$videos=array_map(fn($x)=>safe_url((string)$x),$videos);
 $socials=array_map(fn($x)=>['label'=>field($x,'label',1,30),'url'=>safe_url(field($x,'url',1,2000))],$socials);
 return compact('gallery','videos','socials');
}
function store_photo(string $key): array {
 if(!isset($_FILES[$key])||$_FILES[$key]['error']!==UPLOAD_ERR_OK)throw new InvalidArgumentException('Adjunta las fotografías de rostro y cuerpo.');
 $f=$_FILES[$key];if($f['size']>12*1024*1024)throw new InvalidArgumentException('Cada fotografía debe pesar menos de 12 MB.');
 $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);$ext=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'][$mime]??null;
 if(!$ext||!getimagesize($f['tmp_name']))throw new InvalidArgumentException('Usa fotografías JPG, PNG o WEBP válidas. Convierte HEIC antes de enviarlas.');
 $id=bin2hex(random_bytes(20)).'.'.$ext;$path=private_dir().'/'.$id;if(!move_uploaded_file($f['tmp_name'],$path))throw new RuntimeException('Upload failed');chmod($path,0600);return ['id'=>$id,'mime'=>$mime];
}

try {
 $cfg=getenv('MUI_DB_CONFIG')?:dirname(__DIR__).'/config/db.php';
 if(!is_file($cfg))throw new RuntimeException('Database configuration missing');
 ob_start(); require $cfg; ob_end_clean();
 if(!isset($pdo)||!$pdo instanceof PDO)throw new RuntimeException('Database connection unavailable');
 $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);$pdo->exec('SET NAMES utf8mb4');migrate($pdo);
 $path=trim((string)($_GET['action']??'public'),'/');$method=$_SERVER['REQUEST_METHOD'];$user=$_SESSION['user']??null;
 if($user){$fresh=query($pdo,'SELECT id,name,email,role FROM iquique27_users WHERE id=?',[$user['id']])->fetch();$user=$fresh?:null;}
 if($method==='GET'){
  if($path==='me')reply(['user'=>$user,'csrf'=>$_SESSION['csrf']]);
  if($path==='public'){
   $candidates=[];foreach($pdo->query('SELECT * FROM iquique27_candidates WHERE published=1 ORDER BY name') as $r){$media=json_decode($r['media']?:'{}',true)?:[];$r['level']=level($pdo,$r['user_id']);unset($r['user_id'],$r['media']);$candidates[]=array_merge($r,$media);}
   $ranks=$pdo->query('SELECT c.id,c.name,COUNT(v.id) AS votes FROM iquique27_candidates c LEFT JOIN iquique27_votes v ON c.id=v.candidate_id WHERE c.published=1 GROUP BY c.id,c.name ORDER BY votes DESC,c.name')->fetchAll();
   foreach($ranks as $i=>&$r){$r['votes']=(int)$r['votes'];$r['position']=$i===0||$r['votes']!==$ranks[$i-1]['votes']?$i+1:$ranks[$i-1]['position'];}unset($r);
   reply(['candidates'=>$candidates,'ranking'=>$ranks,'news'=>$pdo->query('SELECT * FROM iquique27_news WHERE published=1 ORDER BY date DESC,id DESC')->fetchAll(),'sponsors'=>$pdo->query('SELECT * FROM iquique27_sponsors WHERE published=1 ORDER BY id')->fetchAll(),'events'=>$pdo->query('SELECT * FROM iquique27_events WHERE published=1 ORDER BY event_date')->fetchAll(),'settings'=>settings($pdo)]);
  }
  if($path==='admin'){
   require_user($user,'admin');$leads=$pdo->query('SELECT * FROM iquique27_leads ORDER BY id DESC LIMIT 1000')->fetchAll();foreach($leads as &$l)$l['metadata']=json_decode($l['metadata']?:'{}',true);unset($l);
   reply(['leads'=>$leads,'users'=>$pdo->query('SELECT id,name,email,role FROM iquique27_users ORDER BY created_at DESC')->fetchAll(),'submissions'=>$pdo->query('SELECT s.*,u.name FROM iquique27_submissions s JOIN iquique27_users u ON s.user_id=u.id ORDER BY s.id DESC')->fetchAll(),'candidates'=>$pdo->query('SELECT * FROM iquique27_candidates ORDER BY name')->fetchAll(),'news'=>$pdo->query('SELECT * FROM iquique27_news ORDER BY id DESC')->fetchAll(),'sponsors'=>$pdo->query('SELECT * FROM iquique27_sponsors ORDER BY id DESC')->fetchAll(),'events'=>$pdo->query('SELECT * FROM iquique27_events ORDER BY id DESC')->fetchAll(),'settings'=>settings($pdo),'audit'=>$pdo->query('SELECT action,created_at FROM iquique27_audit ORDER BY id DESC LIMIT 100')->fetchAll()]);
  }
  if($path==='candidate'){
   require_user($user,'candidate');$c=query($pdo,'SELECT * FROM iquique27_candidates WHERE user_id=?',[$user['id']])->fetch();reply(['candidate'=>$c,'level'=>level($pdo,$user['id']),'submissions'=>query($pdo,'SELECT * FROM iquique27_submissions WHERE user_id=? ORDER BY level',[$user['id']])->fetchAll()]);
  }
  if($path==='admin/media'){
   require_user($user,'admin');$id=(string)($_GET['id']??'');if(!preg_match('/^[a-f0-9]{40}\.(jpg|png|webp)$/D',$id))reply(['error'=>'Archivo no encontrado.'],404);
   $file=private_dir().'/'.$id;if(!is_file($file))reply(['error'=>'Archivo no encontrado.'],404);header('Content-Type: '.(new finfo(FILEINFO_MIME_TYPE))->file($file));header('Content-Disposition: inline; filename="foto.'.$id.'"');readfile($file);exit;
  }
  if($path==='admin/export'){
   require_user($user,'admin');header('Content-Type: text/csv; charset=utf-8');header('Content-Disposition: attachment; filename="iquique-postulaciones-2027.csv"');$o=fopen('php://output','w');fwrite($o,"\xEF\xBB\xBF");fputcsv($o,['ID','Tipo','Nombre','Email','Teléfono','Empresa','Mensaje','Estado','Fecha']);foreach($pdo->query('SELECT id,kind,name,email,phone,company,message,status,created_at FROM iquique27_leads ORDER BY id') as $r){foreach($r as &$v)if(is_string($v)&&preg_match('/^[=+@\-\t\r]/',$v))$v="'".$v;unset($v);fputcsv($o,array_values($r));}fclose($o);exit;
  }
  reply(['error'=>'Recurso no encontrado.'],404);
 }
 if($method!=='POST')reply(['error'=>'Método no permitido.'],405);
 $origin=$_SERVER['HTTP_ORIGIN']??'';if($origin&&strcasecmp((string)parse_url($origin,PHP_URL_HOST),(string)explode(':',$_SERVER['HTTP_HOST'])[0])!==0)reply(['error'=>'Origen no permitido.'],403);
 if(!hash_equals($_SESSION['csrf'],(string)($_SERVER['HTTP_X_CSRF_TOKEN']??'')))reply(['error'=>'La sesión del formulario venció. Recarga la página.'],403);
 $bucket=hash('sha256',($_SERVER['REMOTE_ADDR']??'unknown').':'.$path);$now=time();$limit=in_array($path,['login','register'])?25:80;
 $row=query($pdo,'SELECT * FROM iquique27_limits WHERE bucket=?',[$bucket])->fetch();
 if($row&&$now-(int)$row['started']<900&&(int)$row['attempts']>=$limit)reply(['error'=>'Demasiados intentos. Espera unos minutos.'],429);
 query($pdo,'INSERT INTO iquique27_limits(bucket,started,attempts) VALUES(?,?,1) ON DUPLICATE KEY UPDATE attempts=IF(started<VALUES(started)-900,1,attempts+1),started=IF(started<VALUES(started)-900,VALUES(started),started)',[$bucket,$now]);
 $multipart=str_starts_with($_SERVER['CONTENT_TYPE']??'','multipart/form-data');
 if(!$multipart&&(int)($_SERVER['CONTENT_LENGTH']??0)>150000)reply(['error'=>'La solicitud es demasiado grande.'],413);
 $d=$multipart?$_POST:json_decode(file_get_contents('php://input'),true);if(!is_array($d))throw new InvalidArgumentException('Solicitud inválida.');
 if(in_array($path,['login','register'])){
  $login=strtolower(field($d,'email',1,254));$pw=field($d,'password',$path==='register'?12:1,128);
  if($path==='register'){$e=email_value($d);$id=bin2hex(random_bytes(16));query($pdo,"INSERT INTO iquique27_users(id,name,email,password_hash,role) VALUES(?,?,?,?,'voter')",[$id,field($d,'name',1,120),$e,password_hash($pw,PASSWORD_DEFAULT)]);}
  $account=query($pdo,'SELECT * FROM iquique27_users WHERE email=?',[$login])->fetch();$valid=$account&&password_verify($pw,$account['password_hash']);
  if(!$valid&&$path==='login'){
   try{$old=query($pdo,'SELECT username,password_hash,nombre FROM admin_users WHERE username=?',[$login])->fetch();}catch(PDOException $e){$old=null;}
   if($old&&password_verify($pw,$old['password_hash'])){$id='adm_'.substr(hash('sha256',$old['username']),0,32);$mail=filter_var($old['username'],FILTER_VALIDATE_EMAIL)?$old['username']:$old['username'].'@admin.missuniversoiquique.cl';query($pdo,"INSERT INTO iquique27_users(id,name,email,password_hash,role) VALUES(?,?,?,?,'admin') ON DUPLICATE KEY UPDATE name=VALUES(name)",[$id,$old['nombre']?:'Administración',$mail,password_hash($pw,PASSWORD_DEFAULT)]);$account=query($pdo,"SELECT * FROM iquique27_users WHERE id=? AND role='admin'",[$id])->fetch();$valid=(bool)$account;}
  }
  if(!$valid)reply(['error'=>'Correo/usuario o contraseña incorrectos. Las cuentas históricas 2026 conservan su acceso independiente.'],401);
  session_regenerate_id(true);$_SESSION['user']=array_intersect_key($account,array_flip(['id','name','email','role']));$_SESSION['csrf']=bin2hex(random_bytes(24));$_SESSION['expires']=time()+28800;reply(['ok'=>true]);
 }
 if($path==='lead'||$path==='casting'){
  if(!empty($d['website']))reply(['ok'=>true]);
  $kind=$path==='casting'?'casting':field($d,'kind');if(!in_array($kind,['casting','sponsor','contact'],true)||!in_array($d['consent']??false,[true,'true','on','1'],true))throw new InvalidArgumentException('Debes autorizar el tratamiento de tu solicitud.');
  $s=settings($pdo);$meta=[];$files=[];
  if($kind==='casting'){
   if(empty($s['casting_open']))reply(['error'=>'La recepción de postulaciones está cerrada.'],409);
   $age=filter_var($d['age']??null,FILTER_VALIDATE_INT);if($age===false||$age<18||$age>120)throw new InvalidArgumentException('Debes ser mayor de 18 años.');
   if(!$multipart)throw new InvalidArgumentException('Adjunta tus fotografías usando el formulario de casting.');
   try{$meta=['age'=>$age,'commune'=>field($d,'commune',1,160),'occupation'=>field($d,'occupation',0,200),'instagram'=>field($d,'instagram',0,200),'height'=>field($d,'height',0,10)];$files[]=store_photo('face');$files[]=store_photo('body');$meta['photos']=$files;}catch(Throwable $e){foreach($files as $f)@unlink(private_dir().'/'.$f['id']);throw $e;}
  }
  try{query($pdo,'INSERT INTO iquique27_leads(kind,name,email,phone,company,message,metadata,consent) VALUES(?,?,?,?,?,?,?,1)',[$kind,field($d,'name',1,120),email_value($d),field($d,'phone',$kind==='casting'?5:0,30),field($d,'company',$kind==='sponsor'?1:0,160),field($d,'message',1,5000),json_encode($meta,JSON_UNESCAPED_UNICODE)]);}catch(Throwable $e){foreach($files as $f)@unlink(private_dir().'/'.$f['id']);throw $e;}
  reply(['ok'=>true,'id'=>$pdo->lastInsertId(),'message'=>'Recibimos tu solicitud. La organización la revisará y te contactará por los datos que indicaste.']);
 }
 require_user($user);
 if($path==='logout'){unset($_SESSION['user']);session_regenerate_id(true);reply(['ok'=>true]);}
 if($path==='vote'){
  $s=settings($pdo);if(empty($s['free_voting'])||empty($s['voting_rules_confirmed']))reply(['error'=>'La votación 2027 aún no está habilitada.'],409);
  $cid=field($d,'candidate_id',1,100);if(!query($pdo,'SELECT id FROM iquique27_candidates WHERE id=? AND published=1',[$cid])->fetch())throw new InvalidArgumentException('Candidata no publicada.');
  query($pdo,'INSERT INTO iquique27_votes(user_id,candidate_id,vote_day) VALUES(?,?,?)',[$user['id'],$cid,date('Y-m-d')]);reply(['ok'=>true]);
 }
 if($path==='submission'){
  require_user($user,'candidate');$s=settings($pdo);if(empty($s['mission_program_confirmed']))reply(['error'=>'El programa de misiones está pendiente de aprobación.'],409);$n=(int)($d['level']??0);if($n!==level($pdo,$user['id']))throw new InvalidArgumentException('Entrega la evidencia de tu nivel actual.');
  $row=query($pdo,'SELECT status FROM iquique27_submissions WHERE user_id=? AND level=?',[$user['id'],$n])->fetch();if($row&&$row['status']!=='rejected')reply(['error'=>'La evidencia ya está enviada o aprobada.'],409);
  query($pdo,"INSERT INTO iquique27_submissions(user_id,level,evidence) VALUES(?,?,?) ON DUPLICATE KEY UPDATE evidence=VALUES(evidence),status='pending'",[$user['id'],$n,field($d,'evidence',1,5000)]);reply(['ok'=>true]);
 }
 if($path==='candidate/update'){
  require_user($user,'candidate');$media=candidate_media($d);query($pdo,'UPDATE iquique27_candidates SET bio=?,purpose=?,media=? WHERE user_id=?',[field($d,'bio',1,5000),field($d,'purpose',0,5000),json_encode($media),$user['id']]);audit($pdo,$user,$path);reply(['ok'=>true]);
 }
 require_user($user,'admin');
 if($path==='admin/settings'){
  $nextSettings=array_merge(settings($pdo),$d);if(!empty($nextSettings['free_voting'])&&empty($nextSettings['voting_rules_confirmed']))throw new InvalidArgumentException('Debes confirmar las reglas antes de habilitar la votación.');
  $allowed=['free_voting','voting_rules_confirmed','casting_open','casting_note','contact_email','instagram','mission_program_confirmed','privacy_contact'];foreach($d as $k=>$v){if(!in_array($k,$allowed,true))continue;if(in_array($k,['free_voting','voting_rules_confirmed','casting_open','mission_program_confirmed'],true)&&!is_bool($v))throw new InvalidArgumentException('Configuración inválida.');if(is_string($v)&&strlen($v)>5000)throw new InvalidArgumentException('El texto es demasiado largo.');query($pdo,'INSERT INTO iquique27_settings(setting_key,setting_value) VALUES(?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)',[$k,json_encode($v,JSON_UNESCAPED_UNICODE)]);}
 }elseif($path==='admin/candidate'){
  $id=field($d,'id',1,100);if(!preg_match('/^[a-z0-9-]+$/D',$id))throw new InvalidArgumentException('El identificador debe usar letras minúsculas, números y guiones.');
  $owner=query($pdo,'SELECT * FROM iquique27_users WHERE email=?',[email_value($d)])->fetch();if(!$owner||in_array($owner['role'],['admin','superadmin'],true))throw new InvalidArgumentException('La candidata debe crear primero su cuenta de participación 2027.');
  $media=candidate_media($d);query($pdo,'INSERT INTO iquique27_candidates(id,user_id,name,bio,purpose,photo,media,published) VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),bio=VALUES(bio),purpose=VALUES(purpose),photo=VALUES(photo),media=VALUES(media),published=VALUES(published)',[$id,$owner['id'],field($d,'name',1,120),field($d,'bio',1,5000),field($d,'purpose',0,5000),safe_url(field($d,'photo',0,2000)),json_encode($media),!empty($d['published'])?1:0]);query($pdo,"UPDATE iquique27_users SET role='candidate' WHERE id=?",[$owner['id']]);
 }elseif($path==='admin/news'||$path==='admin/sponsor'||$path==='admin/event'){
  $kind=substr($path,6);$spec=['news'=>['title','body','image','category','edition','published'],'sponsor'=>['name','description','logo','website','category','published'],'event'=>['title','body','event_date','location','published']];$table=['news'=>'iquique27_news','sponsor'=>'iquique27_sponsors','event'=>'iquique27_events'][$kind];$values=[];
  foreach($spec[$kind] as $key){if($key==='published')$v=($d[$key]??true)?1:0;elseif($key==='edition'){$v=(int)($d[$key]??2027);if(!in_array($v,[2026,2027],true))throw new InvalidArgumentException('Edición inválida.');}else{$v=field($d,$key,in_array($key,['title','name','body','description'],true)?1:0,in_array($key,['body','description'],true)?30000:2000);if(in_array($key,['image','logo','website'],true))$v=safe_url($v);}$values[$key]=$v;}
  $id=(int)($d['id']??0);if($id){query($pdo,'UPDATE '.$table.' SET '.implode(',',array_map(fn($k)=>$k.'=?',array_keys($values))).' WHERE id=?',[...array_values($values),$id]);}else{query($pdo,'INSERT INTO '.$table.' ('.implode(',',array_keys($values)).') VALUES('.implode(',',array_fill(0,count($values),'?')).')',array_values($values));}
 }elseif($path==='admin/lead'){
  $status=field($d,'status');if(!in_array($status,['pendiente','contactada','seleccionada','descartada','resuelta'],true))throw new InvalidArgumentException('Estado inválido.');query($pdo,'UPDATE iquique27_leads SET status=? WHERE id=?',[$status,(int)($d['id']??0)]);
 }elseif($path==='admin/review'){
  $status=field($d,'status');if(!in_array($status,['approved','rejected'],true))throw new InvalidArgumentException('Estado inválido.');query($pdo,"UPDATE iquique27_submissions SET status=?,review_comment=? WHERE id=? AND status='pending'",[$status,field($d,'comment',0,2000),(int)($d['id']??0)]);
 }else reply(['error'=>'Recurso no encontrado.'],404);
 audit($pdo,$user,$path);reply(['ok'=>true]);
}catch(InvalidArgumentException $e){reply(['error'=>$e->getMessage()],400);}catch(PDOException $e){if($e->getCode()==='23000')reply(['error'=>'El registro ya existe o ya emitiste tu voto de hoy.'],409);error_log('Iquique2027 DB error '.$e->getCode());reply(['error'=>'No fue posible guardar la solicitud. Inténtalo nuevamente.'],503);}catch(Throwable $e){error_log('Iquique2027 error '.get_class($e));reply(['error'=>'El servicio no está disponible temporalmente. Inténtalo más tarde.'],503);}
