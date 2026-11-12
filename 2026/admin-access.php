<?php
// Acceso exclusivo del propietario al panel de pruebas de Legado 2026.
header('Cache-Control: no-store, private');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
$legacyCity=strpos(strtolower($_SERVER['HTTP_HOST']??''),'iquique')!==false?'iquique':'arica';
if(session_status()!==PHP_SESSION_ACTIVE){session_name(strtoupper($legacyCity).'2027');session_set_cookie_params(['lifetime'=>28800,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);session_start();}
function legacy_owner(PDO $db,string $city): bool {
 $u=$_SESSION['user']??null;
 if(!is_array($u)||strtolower($u['email']??'')!=='seinfotel.com@gmail.com'||($u['role']??'')!=='superadmin'||($_SESSION['expires']??0)<time())return false;
 $table=$city==='iquique'?'iquique27_users':'arica27_users';
 $q=$db->prepare("SELECT role,email FROM $table WHERE id=? LIMIT 1");$q->execute([$u['id']??'']);$a=$q->fetch(PDO::FETCH_ASSOC);
 return $a&&$a['role']==='superadmin'&&strtolower($a['email'])==='seinfotel.com@gmail.com';
}
