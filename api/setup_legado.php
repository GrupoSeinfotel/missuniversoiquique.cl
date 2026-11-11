<?php
http_response_code(410);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo json_encode(['status'=>'retired','message'=>'El instalador inicial de Legado 2026 fue retirado. Administra los perfiles desde el panel de la organizacion.']);
exit;
