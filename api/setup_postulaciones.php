<?php
/**
 * Setup & Migración: Postulaciones Miss Universe 2027 & Programa de Embajadoras / Referidos
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/db.php';

try {
    // 1. Crear tabla si no existe
    $pdo->exec("CREATE TABLE IF NOT EXISTS postulantes_2027 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sede ENUM('arica', 'iquique') NOT NULL,
        nombres VARCHAR(120) NOT NULL,
        apellidos VARCHAR(120) NOT NULL,
        rut VARCHAR(30) NULL,
        edad INT NOT NULL,
        fecha_nacimiento DATE NULL,
        telefono_whatsapp VARCHAR(50) NOT NULL,
        email VARCHAR(150) NOT NULL,
        instagram VARCHAR(100) NULL,
        tiktok VARCHAR(100) NULL,
        estatura_cm INT NULL,
        ocupacion VARCHAR(150) NULL,
        comuna VARCHAR(100) NULL,
        experiencia_modelaje TEXT NULL,
        motivacion TEXT NULL,
        foto_rostro VARCHAR(255) NULL,
        foto_cuerpo VARCHAR(255) NULL,
        codigo_embajadora VARCHAR(60) NULL,
        referida_por VARCHAR(150) NULL,
        modalidad_pago VARCHAR(100) DEFAULT 'abono_70',
        tramo_tarifa VARCHAR(100) DEFAULT 'diciembre_250',
        descuento_referidas INT DEFAULT 0,
        monto_final INT DEFAULT 250000,
        estado ENUM('pendiente', 'contactada', 'seleccionada', 'descartada') DEFAULT 'pendiente',
        ip_registro VARCHAR(60) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_sede (sede),
        INDEX idx_estado (estado),
        INDEX idx_codigo_embajadora (codigo_embajadora)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Agregar columnas si la tabla ya existía
    $columnsToAdd = [
        "codigo_embajadora VARCHAR(60) NULL AFTER foto_cuerpo",
        "referida_por VARCHAR(150) NULL AFTER codigo_embajadora",
        "modalidad_pago VARCHAR(100) DEFAULT 'abono_70' AFTER referida_por",
        "tramo_tarifa VARCHAR(100) DEFAULT 'diciembre_250' AFTER modalidad_pago",
        "descuento_referidas INT DEFAULT 0 AFTER tramo_tarifa",
        "monto_final INT DEFAULT 250000 AFTER descuento_referidas"
    ];

    foreach ($columnsToAdd as $colDef) {
        try {
            $pdo->exec("ALTER TABLE postulantes_2027 ADD COLUMN " . $colDef);
        } catch (Throwable $e) {
            // Ya existía la columna
        }
    }

    // Limpiar registros de prueba si se solicita
    if (isset($_GET['clean_test'])) {
        $pdo->exec("DELETE FROM postulantes_2027 WHERE email IN ('prueba.casting@missuniversoiquique.cl', 'amiga.invitada@gmail.com')");
    }

    $total = (int)$pdo->query("SELECT COUNT(*) FROM postulantes_2027")->fetchColumn();
    $totArica = (int)$pdo->query("SELECT COUNT(*) FROM postulantes_2027 WHERE sede = 'arica'")->fetchColumn();
    $totIquique = (int)$pdo->query("SELECT COUNT(*) FROM postulantes_2027 WHERE sede = 'iquique'")->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'message' => 'Tabla postulantes_2027 actualizada con soporte para Programa de Embajadoras y Referidos.',
        'total_postulantes' => $total,
        'arica' => $totArica,
        'iquique' => $totIquique
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
