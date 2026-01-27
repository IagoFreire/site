@echo off
echo ========================================
echo  Iniciando Hytale Server Manager
echo ========================================
echo.

echo Iniciando backend em nova janela...
start "Hytale Manager - Backend" cmd /k "cd server && npm start"

timeout /t 2 /nobreak >nul

echo Iniciando frontend em nova janela...
start "Hytale Manager - Frontend" cmd /k "npm run dev"

echo.
echo Ambos os servicos foram iniciados!
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173/hytale
echo.
echo Feche este terminal quando quiser parar os servicos.
pause
