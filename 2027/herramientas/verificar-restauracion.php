<?php
require 'C:/MISS UNIVERSO/backups/iquique-20261015/config-prueba.php';
if($pdo->query('SELECT DATABASE()')->fetchColumn()!=='missuniversoiquique2027_test')throw new Exception('La restauración solo puede comprobarse en la base aislada.');
$manifest=json_decode(file_get_contents('C:/MISS UNIVERSO/backups/iquique-20261015/base-local/manifiesto.json'),true);
$exists=$pdo->query("SHOW TABLES LIKE 'candidate'")->fetchColumn();
if(!$exists)$pdo->exec(file_get_contents('C:/MISS UNIVERSO/backups/iquique-20261015/base-local/iquique-completa.sql'));
$total=0;foreach($manifest as $m){if(!preg_match('/^[a-zA-Z0-9_]+$/',$m['table']))throw new Exception('Tabla inválida.');$n=(int)$pdo->query('SELECT COUNT(*) FROM `'.$m['table'].'`')->fetchColumn();if($n!==$m['rows'])throw new Exception('Cantidad de filas no coincide.');$total+=$n;}
echo json_encode(['restore'=>'OK','tables'=>count($manifest),'rows'=>$total]);
