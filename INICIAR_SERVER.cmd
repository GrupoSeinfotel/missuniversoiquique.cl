@echo off
title Miss Universe Iquique - Server Console
cls
echo ==================================================
echo   INICIANDO SERVIDOR: MISS UNIVERSO IQUIQUE
echo ==================================================
echo.

if not exist node_modules (
    echo [0/2] No se detectaron librerias. Instalando dependencias...
    echo.
    call npm install
    echo.
)

echo [1/2] Generando Prisma Client (Modelos v3)...
call npx prisma generate
echo.
echo [2/2] Iniciando Servidor Next.js (Puerto 8373)...
echo.
echo Acceso Local: http://localhost:8373
echo Acceso Admin: http://localhost:8373/admin
echo.
echo ==================================================
call npm run dev
pause
