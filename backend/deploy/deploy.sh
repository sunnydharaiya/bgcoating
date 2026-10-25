#!/usr/bin/env bash
# ==============================================================================
# BG Coating Backend Deployment Script (Executed on VPS / via GitHub Actions)
# ==============================================================================
set -e

# Auto-detect repository directory from script location or use VPS_PROJECT_DIR
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_PROJECT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
PROJECT_DIR="${VPS_PROJECT_DIR:-$DEFAULT_PROJECT_DIR}"
BACKEND_DIR="${PROJECT_DIR}/backend"
VENV_DIR="${BACKEND_DIR}/.venv"
SERVICE_NAME="bgcoating-backend"

echo "=========================================="
echo "🚀 Starting BG Coating Backend Deployment"
echo "📅 Date: $(date)"
echo "📂 Project Path: ${PROJECT_DIR}"
echo "=========================================="

cd "${PROJECT_DIR}"

# 1. Pull latest code from GitHub (Safely preserving production SQLite database)
if [ -f "${BACKEND_DIR}/db.sqlite3" ]; then
    echo "💾 Preserving server SQLite database before git update..."
    mkdir -p "${BACKEND_DIR}/backups"
    cp -a "${BACKEND_DIR}/db.sqlite3" "${BACKEND_DIR}/backups/db_backup_$(date +%Y%m%d_%H%M%S).sqlite3"
    cp -a "${BACKEND_DIR}/db.sqlite3" "${BACKEND_DIR}/db.sqlite3.preserve"
fi

echo "📥 Pulling latest changes from origin/main..."
git fetch origin main
git reset --hard origin/main

# Restore preserved database if git reset removed or touched it
if [ -f "${BACKEND_DIR}/db.sqlite3.preserve" ]; then
    echo "🔄 Restoring server SQLite database..."
    mv -f "${BACKEND_DIR}/db.sqlite3.preserve" "${BACKEND_DIR}/db.sqlite3"
fi

# 2. Ensure virtual environment exists
if [ ! -d "${VENV_DIR}" ]; then
    echo "🐍 Creating virtual environment..."
    python3 -m venv "${VENV_DIR}"
fi

# 3. Activate virtualenv and update packages
echo "📦 Installing/Updating Python dependencies..."
source "${VENV_DIR}/bin/activate"
pip install --upgrade pip setuptools wheel --quiet
pip install -r "${BACKEND_DIR}/requirements.txt" --quiet

# 4. Safe backup & run database migrations
if [ -f "${BACKEND_DIR}/db.sqlite3" ]; then
    echo "💾 Creating safety backup of SQLite database..."
    mkdir -p "${BACKEND_DIR}/backups"
    cp "${BACKEND_DIR}/db.sqlite3" "${BACKEND_DIR}/backups/db_backup_$(date +%Y%m%d_%H%M%S).sqlite3"
    # Keep only 10 most recent backups
    ls -t "${BACKEND_DIR}/backups/db_backup_"*.sqlite3 2>/dev/null | tail -n +11 | xargs -r rm -f --
fi

echo "🗄️ Running database migrations..."
python "${BACKEND_DIR}/manage.py" migrate --noinput

# 5. Collect static files
echo "🎨 Collecting static files..."
python "${BACKEND_DIR}/manage.py" collectstatic --noinput

# 5.1 Build calculator-react frontend (if node/npm is installed on VPS)
if command -v npm &> /dev/null && [ -d "${PROJECT_DIR}/calculator-react" ]; then
    echo "⚛️ Building calculator-react frontend..."
    cd "${PROJECT_DIR}/calculator-react"
    npm ci --prefer-offline --no-audit || npm install --no-audit
    npm run build || true
    cd "${PROJECT_DIR}"
fi

# 6. Ensure permissions for media, staticfiles, and SQLite database
if [ -f "${BACKEND_DIR}/db.sqlite3" ]; then
    chmod 664 "${BACKEND_DIR}/db.sqlite3" || true
fi
chmod 775 "${BACKEND_DIR}" || true
mkdir -p "${BACKEND_DIR}/media" "${BACKEND_DIR}/staticfiles"
chmod -R 775 "${BACKEND_DIR}/media" "${BACKEND_DIR}/staticfiles" || true

# 7. Restart / Reload Gunicorn systemd service
echo "🔄 Reloading Gunicorn service (${SERVICE_NAME})..."
if systemctl is-active --quiet "${SERVICE_NAME}"; then
    sudo systemctl restart "${SERVICE_NAME}"
else
    echo "⚠️ Service ${SERVICE_NAME} is not running, attempting start..."
    sudo systemctl enable --now "${SERVICE_NAME}"
fi

echo "=========================================="
echo "✅ Backend Deployment Completed Successfully!"
echo "=========================================="
