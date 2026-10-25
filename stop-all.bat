@echo off
chcp 65001 >nul
title BG Coating - Stop All Services
echo =====================================================================
echo                BG COATING - STOPPING SERVICES
echo =====================================================================
echo.
echo Terminating processes on:
echo   - Port 7777 (Django Backend)
echo   - Port 3001 (NestJS Admin CMS)
echo   - Port 3000 (React Calculator)
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-services.ps1"

echo.
echo =====================================================================
