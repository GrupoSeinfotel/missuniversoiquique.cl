<?php
/**
 * Redirección permanente al Panel Único de Superadministración
 */
header("HTTP/1.1 301 Moved Permanently");
header("Location: /admin/");
exit;
