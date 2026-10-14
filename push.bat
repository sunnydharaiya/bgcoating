@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo             BG Coating - Git Push to Main
echo ===================================================
echo.

:: Navigate to repository root directory
cd /d "%~dp0"

:: 1. Display current status
echo Working directory changes:
git status -s
echo.

:: 2. Check if there are any uncommitted changes (modified, untracked, deleted)
git status --porcelain | findstr /r "." >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] No uncommitted changes detected.
    echo Checking for unpushed commits...
    git log origin/main..HEAD --oneline >nul 2>&1
    if %errorlevel% neq 0 (
        echo [INFO] Everything is already up to date with origin/main.
        echo.
        pause
        exit /b 0
    )
    goto dopush
)

:: 3. Get commit message from arguments if provided
set "commit_msg=%*"

:prompt_message
if "%commit_msg%"=="" (
    set /p "commit_msg=Enter commit message (or Ctrl+C to abort): "
)

:: Trim and validate
if "%commit_msg%"=="" (
    echo [WARNING] Commit message cannot be empty!
    goto prompt_message
)

echo.
echo [1/3] Staging all files (git add -A)...
git add -A

echo [2/3] Committing changes...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git commit failed.
    pause
    exit /b %errorlevel%
)

:dopush
echo.
echo [3/3] Pushing to origin main...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git push failed. Please check network connection or permissions.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo    SUCCESS: All changes committed and pushed to main!
echo ===================================================
echo.
pause
