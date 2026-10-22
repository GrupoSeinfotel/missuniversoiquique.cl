<?php
// Included by the site's authenticated API; every query is scoped to this city.
if (!in_array($path,['hero','admin/hero','admin/hero/upload'],true)) return;
$heroCity='iquique';
function hero_schema(PDO $db): void {
 $db->exec("CREATE TABLE IF NOT EXISTS slider_slides(id INT AUTO_INCREMENT PRIMARY KEY,sede VARCHAR(20) NOT NULL,title VARCHAR(255) NOT NULL,img_desktop VARCHAR(255) NOT NULL,img_mobile VARCHAR(255),pos_desktop VARCHAR(50),pos_mobile VARCHAR(50),mobile_pan_start VARCHAR(50),mobile_pan_end VARCHAR(50),order_num INT DEFAULT 0,is_active TINYINT DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
 $columns=$db->query('SHOW COLUMNS FROM slider_slides')->fetchAll(PDO::FETCH_COLUMN);
 if(!in_array('motion_json',$columns,true))$db->exec('ALTER TABLE slider_slides ADD COLUMN motion_json LONGTEXT NULL');
}
function hero_rows(PDO $db,string $city,bool $admin): array {
 try{$q=query($db,'SELECT * FROM slider_slides WHERE sede=?'.($admin?'':' AND is_active=1').' ORDER BY order_num,id',[$city]);$rows=$q->fetchAll();}catch(PDOException $e){return [];}
 foreach($rows as &$r){$r['motion']=json_decode($r['motion_json']??'null',true);unset($r['motion_json']);}unset($r);return $rows;
}
if($path==='hero'&&$method==='GET')reply(['status'=>'success','sede'=>$heroCity,'slides'=>hero_rows($pdo,$heroCity,false)]);
require_user($user,'admin');
hero_schema($pdo);
if($path==='admin/hero'&&$method==='GET')reply(['slides'=>hero_rows($pdo,$heroCity,true)]);
if($method!=='POST')reply(['error'=>'Método no permitido.'],405);
if(!hash_equals($_SESSION['csrf'],$_SERVER['HTTP_X_CSRF_TOKEN']??''))reply(['error'=>'Recarga la página para continuar.'],403);
$origin=$_SERVER['HTTP_ORIGIN']??'';if($origin&&strcasecmp((string)parse_url($origin,PHP_URL_HOST),(string)explode(':',$_SERVER['HTTP_HOST'])[0])!==0)reply(['error'=>'Origen no permitido.'],403);
if($path==='admin/hero/upload'){
 $f=$_FILES['image']??null;if(!$f||$f['error']!==UPLOAD_ERR_OK||$f['size']>12*1024*1024)throw new InvalidArgumentException('Sube una imagen JPG, PNG o WEBP de hasta 12 MB.');
 $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);$ext=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'][$mime]??null;
 if(!$ext||!getimagesize($f['tmp_name']))throw new InvalidArgumentException('El archivo no es una imagen válida.');
 $dir=__DIR__.'/assets/slider';if(!is_dir($dir)&&!mkdir($dir,0755,true))throw new RuntimeException('No se pudo crear la carpeta de imágenes.');
 $name=bin2hex(random_bytes(20)).'.'.$ext;if(!move_uploaded_file($f['tmp_name'],$dir.'/'.$name))throw new RuntimeException('No se pudo guardar la imagen.');
 reply(['url'=>'/iquique2027/assets/slider/'.$name]);
}
$d=json_decode(file_get_contents('php://input'),true);if(!is_array($d))throw new InvalidArgumentException('Datos no válidos.');
$id=(int)($d['id']??0);if($id&&!query($pdo,'SELECT id FROM slider_slides WHERE id=? AND sede=?',[$id,$heroCity])->fetch())reply(['error'=>'Ese fondo no pertenece a este sitio.'],404);
$number=function($v,float $min,float $max):float{if(!is_numeric($v)||!is_finite((float)$v)||(float)$v<$min||(float)$v>$max)throw new InvalidArgumentException('Revisa los límites de encuadre y duración.');return (float)$v;};
$motion=['duration'=>$number($d['motion']['duration']??10,3,60)];
foreach(['desktop','mobile'] as $device){foreach(['start','end'] as $point){$v=$d['motion'][$device][$point]??[];$motion[$device][$point]=['x'=>$number($v['x']??50,0,100),'y'=>$number($v['y']??50,0,100),'zoom'=>$number($v['zoom']??1,1,3)];}}
$title=field($d,'title',1,200);$desktop=safe_url(field($d,'img_desktop',1,2000));$mobile=safe_url(field($d,'img_mobile',0,2000));$order=(int)$number($d['order_num']??0,0,9999);$active=!empty($d['is_active'])?1:0;
if($id)query($pdo,'UPDATE slider_slides SET title=?,img_desktop=?,img_mobile=?,order_num=?,is_active=?,motion_json=? WHERE id=? AND sede=?',[$title,$desktop,$mobile,$order,$active,json_encode($motion),$id,$heroCity]);
else{query($pdo,'INSERT INTO slider_slides(sede,title,img_desktop,img_mobile,order_num,is_active,motion_json) VALUES(?,?,?,?,?,?,?)',[$heroCity,$title,$desktop,$mobile,$order,$active,json_encode($motion)]);$id=(int)$pdo->lastInsertId();}
audit($pdo,$user,'hero/save/'.$id);reply(['ok'=>true,'id'=>$id]);
