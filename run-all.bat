@echo off
chcp 65001 >nul
title BG Coating - Unified Launcher
setlocal EnableDelayedExpansion

set ROOT_DIR=%~dp0

:START_SERVICES
cls
echo =====================================================================
echo           BG COATING ^& CONSULTANT - FULL STACK LAUNCHER
echo =====================================================================
echo.
echo Starting all three services in dedicated windows:
echo.
echo   [1/3] Backend (Django API)       : Port 7777
echo   [2/3] Admin Panel (NestJS CMS)   : Port 3001
echo   [3/3] Calculator (React / Vite)  : Port 3000
echo.
echo ---------------------------------------------------------------------

:: 1. Launch Backend (Django)
echo [*] Launching Django Backend on http://localhost:7777 ...
if exist "%ROOT_DIR%backend\.venv\Scripts\python.exe" (
    start "BG Coating - Backend (Django :7777)" cmd /k "cd /d "%ROOT_DIR%backend" && call .venv\Scripts\activate.bat && python manage.py runserver 7777"
) else (
    start "BG Coating - Backend (Django :7777)" cmd /k "cd /d "%ROOT_DIR%backend" && python manage.py runserver 7777"
)

:: Wait 2 seconds before launching admin
timeout /t 2 /nobreak >nul

:: 2. Launch Admin Panel (NestJS)
echo [*] Launching NestJS Admin Panel on http://localhost:3001 ...
start "BG Coating - Admin Panel (NestJS :3001)" cmd /k "cd /d "%ROOT_DIR%admin-panel" && npm run dev"

:: Wait 2 seconds before launching calculator
timeout /t 2 /nobreak >nul

:: 3. Launch Calculator (React Vite)
echo [*] Launching React Calculator on http://localhost:3000 ...
start "BG Coating - Calculator (React :3000)" cmd /k "cd /d "%ROOT_DIR%calculator-react" && npm run dev"

echo.
echo =====================================================================
echo                      ALL SERVICES INITIALIZED
echo =====================================================================
echo.
echo   - Calculator / Manpower:  http://localhost:3000/manpower-estimation/
echo   - Calculator Home:        http://localhost:3000/
echo   - Admin Panel (NestJS):   http://localhost:3001/
echo   - Backend API (Django):   http://localhost:7777/api/v1/
echo.
echo =====================================================================
echo                            CONTROL MENU
echo =====================================================================
echo   [1] Open Manpower Estimation in Browser
echo   [2] Open Admin Panel in Browser
echo   [3] Open Django Backend API in Browser
echo   [4] Open All Three URLs in Browser
echo   [5] Restart All Services
echo   [6] Stop All Services (Free Ports 7777, 3001, 3000)
echo   [Q] Exit this control console (Leaves services running)
echo =====================================================================
echo.

:MENU_LOOP
set /p CHOICE="Select an option [1-6, Q]: "

if /i "%CHOICE%"=="1" (
    start http://localhost:3000/manpower-estimation/
    goto MENU_LOOP
)
if /i "%CHOICE%"=="2" (
    start http://localhost:3001/
    goto MENU_LOOP
)
if /i "%CHOICE%"=="3" (
    start http://localhost:7777/api/v1/
    goto MENU_LOOP
)
if /i "%CHOICE%"=="4" (
    start http://localhost:3000/manpower-estimation/
    start http://localhost:3001/
    start http://localhost:7777/api/v1/
    goto MENU_LOOP
)
if /i "%CHOICE%"=="5" (
    echo.
    echo Stopping running instances...
    call "%ROOT_DIR%stop-all.bat" >nul 2>&1
    timeout /t 2 /nobreak >nul
    goto START_SERVICES
)
if /i "%CHOICE%"=="6" (
    echo.
    call "%ROOT_DIR%stop-all.bat"
    echo.
    echo All services stopped.
    goto MENU_LOOP
)
if /i "%CHOICE%"=="Q" (
    echo Exiting launcher console. Background windows remain active.
    exit /b 0
)

echo Invalid choice. Please enter 1, 2, 3, 4, 5, 6, or Q.
goto MENU_LOOP
