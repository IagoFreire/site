@echo off
color 0C
echo ========================================
echo  Parando Hytale Manager - PRODUCAO
echo ========================================
echo.

REM Caminho do nginx
set NGINX_PATH=C:\Users\Iago\Documents\Estudos\nginx-1.28.1

echo [1/2] Parando Nginx...
cd /d "%NGINX_PATH%"
nginx.exe -s quit
timeout /t 2 /nobreak >nul

REM Forcar parada se ainda estiver rodando
tasklist | findstr nginx.exe >nul
if %errorlevel% equ 0 (
    echo Forcando parada do Nginx...
    taskkill /F /IM nginx.exe >nul 2>&1
)
color 0A
echo [OK] Nginx parado

echo.
color 0C
echo [2/2] Parando Backend...
echo.
echo ATENCAO: Feche manualmente a janela do backend
echo ou pressione Ctrl+C na janela "Hytale Manager - Backend"
echo.
echo Ou execute:
echo   taskkill /F /FI "WINDOWTITLE eq Hytale Manager - Backend*"
echo.

color 0A
echo ========================================
echo  Nginx parado!
echo ========================================
echo.
pause
