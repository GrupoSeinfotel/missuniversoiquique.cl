<?php
require 'C:/MISS UNIVERSO/backups/iquique-20261015/config-prueba.php';
$account=json_decode(file_get_contents('C:/MISS UNIVERSO/backups/iquique-20261015/cuenta-prueba.json'),true);
$pdo->exec("CREATE TABLE IF NOT EXISTS admin_users(id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(254) UNIQUE,password_hash VARCHAR(255),nombre VARCHAR(120))");
$q=$pdo->prepare('INSERT INTO admin_users(username,password_hash,nombre) VALUES(?,?,?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash)');
$q->execute([$account['email'],password_hash($account['password'],PASSWORD_DEFAULT),'Administración de prueba']);
echo "Administrador de pruebas listo en base aislada.\n";
