#!/usr/bin/env bash
# ==============================================================================
# BG Coating Backend Deployment Script (Executed on VPS / via GitHub Actions)
# ==============================================================================
set -e

# Default directory (adjust if your project path on VPS is different)
PROJECT_DIR="${VPS_PROJECT_DIR:-/var/www/bgcoating.com}"
BACKEND_DIR="${PROJECT_DIR}/backend"
VENV_DIR="${BACKEND_DIR}/.venv"
SERVICE_NAME="bgcoating-backend"

echo "=========================================="
echo "🚀 Starting BG Coating Backend Deployment"
echo "📅 Date: $(date)"
echo "📂 Project Path: ${PROJECT_DIR}"
echo "=========================================="

cd "${PROJECT_DIR}"

# 1. Pull latest code from GitHub
echo "📥 Pulling latest changes from origin/main..."
git fetch origin main
git reset --hard origin/main

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

# 4. Run database migrations
echo "🗄️ Running database migrations..."
python "${BACKEND_DIR}/manage.py" migrate --noinput

# 5. Collect static files
echo "🎨 Collecting static files..."
python "${BACKEND_DIR}/manage.py" collectstatic --noinput

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
