@echo off
title Miss Universe Iquique - PRODUCCION
cls
echo ==================================================
echo   PREPARANDO MODO PRODUCCION: IQUIQUE
echo ==================================================
echo.

if not exist node_modules (
    echo [1/4] Instalando dependencias...
    call npm install
)

echo [2/4] Generando Prisma Client...
call npx prisma generate

echo [3/4] Limpiando cache y construyendo aplicacion...
echo (Este puede tardar 1 o 2 minutos, pero hara que la web vuele)
if exist .next rmdir /s /q .next
call npm run build

echo.
echo [4/4] Iniciando Servidor en MODO VELOZ...
echo ==================================================
echo.
call npm run start
pause
