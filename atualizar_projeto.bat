@echo off
chcp 65001 > nul
echo ========================================================
echo        CONECTA MAIS CRM - ATUALIZAR PROJETO NO GITHUB
echo ========================================================
echo.
echo Adicionando modificações...
"C:\Users\jaans\git-portable\cmd\git.exe" add .

echo.
set /p commitMsg="Digite a descrição da alteração (ou dê ENTER para padrão): "
if "%commitMsg%"=="" set commitMsg="Atualização Conecta Mais CRM"

echo.
echo Criando commit: %commitMsg%...
"C:\Users\jaans\git-portable\cmd\git.exe" commit -m %commitMsg%

echo.
echo Enviando para o GitHub e Vercel...
"C:\Users\jaans\git-portable\cmd\git.exe" push origin main

echo.
echo ========================================================
echo   ✅ PROJETO ATUALIZADO COM SUCESSO NO GITHUB E VERCEL!
echo ========================================================
pause
