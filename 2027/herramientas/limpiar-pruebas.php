<?php
require 'C:/MISS UNIVERSO/backups/iquique-20261015/config-prueba.php';
if($pdo->query('SELECT DATABASE()')->fetchColumn()!=='missuniversoiquique2027_test')throw new Exception('Solo se permite limpiar la base de pruebas creada para esta revisión.');
foreach(['iquique27_candidates','iquique27_news','iquique27_votes','iquique27_leads','iquique27_submissions','iquique27_sponsors','iquique27_events','iquique27_audit','iquique27_limits'] as $table)$pdo->exec('TRUNCATE TABLE '.$table);
$pdo->exec("DELETE FROM iquique27_users WHERE role<>'admin'");
echo "Datos sintéticos eliminados exclusivamente de la base de pruebas.\n";
