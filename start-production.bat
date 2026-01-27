@echo off
color 0A
echo ========================================
echo  Iniciando Hytale Manager - PRODUCAO
echo ========================================
echo.

REM Caminho do nginx
set NGINX_PATH=C:\Users\Iago\Documents\Estudos\nginx-1.28.1

echo [1/4] Testando configuracao do Nginx...
cd /d "%NGINX_PATH%"
nginx.exe -t
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERRO] Configuracao do Nginx invalida!
    echo Corrija os erros e tente novamente.
    pause
    exit /b 1
)
color 0A
echo [OK] Configuracao do Nginx valida!

echo.
echo [2/4] Verificando se backend ja esta rodando...
netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    color 0E
    echo [AVISO] Backend ja esta rodando na porta 3001
) else (
    color 0A
    echo [OK] Porta 3001 disponivel
)

echo.
echo [3/4] Iniciando Backend em nova janela...
start "Hytale Manager - Backend" cmd /k "cd /d %~dp0server && echo Iniciando backend... && npm start"
echo [OK] Backend iniciado

echo.
echo [4/4] Iniciando/Recarregando Nginx...
cd /d "%NGINX_PATH%"

REM Verificar se nginx esta rodando
tasklist | findstr nginx.exe >nul
if %errorlevel% equ 0 (
    echo Nginx ja esta rodando, recarregando...
    nginx.exe -s reload
    echo [OK] Nginx recarregado
) else (
    echo Nginx nao esta rodando, iniciando...
    start nginx.exe
    echo [OK] Nginx iniciado
)

echo.
color 0A
echo ========================================
echo  Sistema iniciado com sucesso!
echo ========================================
echo.
echo Acesse:
echo - Local: http://localhost/hytale
echo - Rede: http://192.168.X.X/hytale
echo - Internet: http://iagofreire.dev/hytale
echo.
echo Backend rodando em: http://localhost:3001
echo.
echo Para parar, feche as janelas ou execute:
echo   stop-production.bat
echo.
pause
