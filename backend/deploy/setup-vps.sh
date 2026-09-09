#!/usr/bin/env bash
# ==============================================================================
# One-Time VPS Setup Script for BG Coating Backend (Ubuntu/Debian)
# ==============================================================================
set -e

PROJECT_DIR="/var/www/bgcoating.com"
BACKEND_DIR="${PROJECT_DIR}/backend"
SERVICE_NAME="bgcoating-backend"

echo "=========================================="
echo "🛠️ Initializing VPS for BG Coating Backend"
echo "=========================================="

# 1. Update system and install required system packages
echo "📦 Installing system packages (Python 3, Nginx, Git, Certbot)..."
sudo apt update
sudo apt install -y python3 python3-pip python3-venv python3-dev \
                    build-essential libpq-dev git nginx ufw \
                    curl certbot python3-certbot-nginx

# 2. Setup UFW Firewall rules
echo "🛡️ Configuring Firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable || true

# 3. Setup Project Directory permissions
echo "📁 Setting up directory permissions..."
sudo mkdir -p "${PROJECT_DIR}"
sudo chown -R $USER:$USER "${PROJECT_DIR}"

# 4. Setup Python Virtual Environment
if [ ! -d "${BACKEND_DIR}/.venv" ]; then
    echo "🐍 Creating virtual environment at ${BACKEND_DIR}/.venv..."
    python3 -m venv "${BACKEND_DIR}/.venv"
fi

source "${BACKEND_DIR}/.venv/bin/activate"
pip install --upgrade pip setuptools wheel
pip install -r "${BACKEND_DIR}/requirements.txt"

# 5. Setup .env file if not exists
if [ ! -f "${BACKEND_DIR}/.env" ]; then
    echo "⚙️ Creating .env from .env.example..."
    cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
    echo "⚠️ Please edit ${BACKEND_DIR}/.env and set your production SECRET_KEY and ALLOWED_HOSTS!"
fi

# 6. Copy and Register Systemd Service
echo "⚙️ Registering Systemd Gunicorn service..."
sudo cp "${BACKEND_DIR}/deploy/gunicorn.service" "/etc/systemd/system/${SERVICE_NAME}.service"
sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"

# 7. Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp "${BACKEND_DIR}/deploy/nginx.conf" "/etc/nginx/sites-available/${SERVICE_NAME}"
sudo ln -sf "/etc/nginx/sites-available/${SERVICE_NAME}" "/etc/nginx/sites-enabled/"
# Remove default nginx site if present
sudo rm -f /etc/nginx/sites-enabled/default || true

sudo nginx -t
sudo systemctl reload nginx

echo "=========================================="
echo "🎉 VPS Setup Completed Successfully!"
echo ""
echo "Next Steps:"
echo "1. Edit ${BACKEND_DIR}/.env with your real SECRET_KEY and domain names."
echo "2. Run: bash ${BACKEND_DIR}/deploy/deploy.sh"
echo "3. (Optional) For free SSL, run: sudo certbot --nginx -d api.yourdomain.com"
echo "=========================================="
