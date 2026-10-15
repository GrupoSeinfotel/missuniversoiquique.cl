<?php
// Solo para comprobar localmente los medios heredados; no se publica.
$path=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH));
$site=dirname(__DIR__,2);$production=$site.'/2027/produccion';
if(is_file($production.$path))return false;
if(preg_match('~^/(uploads|watermarked|assets|_next)/~',$path)){
 foreach([$site.'/public',$site.'/out'] as $base){$file=realpath($base.$path);$root=realpath($base);if($file&&str_starts_with($file,$root.DIRECTORY_SEPARATOR)&&is_file($file)){$mime=['js'=>'application/javascript','css'=>'text/css','svg'=>'image/svg+xml','png'=>'image/png','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','webp'=>'image/webp','mp4'=>'video/mp4','mov'=>'video/quicktime','woff2'=>'font/woff2'][strtolower(pathinfo($file,PATHINFO_EXTENSION))]??'application/octet-stream';header('Content-Type: '.$mime);readfile($file);return true;}}
}
return false;
