import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

ip = "31.97.61.136"
user = "root"
password = "C;vx#5kLpR)&&8/9C7-0"

print(f"Connecting to {user}@{ip}...")
client.connect(ip, port=22, username=user, password=password, timeout=15)
print("Connected successfully!")

deploy_cmd = """
export VPS_PROJECT_DIR="/var/www/bgcoating"
cd "${VPS_PROJECT_DIR}"

echo "=== Current VPS Git Status & Log ==="
git status
git log -n 2 --oneline

# 1. Preserve database
if [ -f "backend/db.sqlite3" ]; then
    echo "💾 Preserving live server SQLite database before deployment..."
    mkdir -p "backend/backups"
    cp -a "backend/db.sqlite3" "backend/backups/db_backup_$(date +%Y%m%d_%H%M%S).sqlite3"
    cp -a "backend/db.sqlite3" "backend/db.sqlite3.preserve"
fi

# 2. Fetch and pull latest changes from origin main
echo "📥 Fetching and resetting to origin/main..."
git fetch origin main
git reset --hard origin/main

# 3. Restore preserved database
if [ -f "backend/db.sqlite3.preserve" ]; then
    echo "🔄 Restoring server SQLite database..."
    mv -f "backend/db.sqlite3.preserve" "backend/db.sqlite3"
fi

# 4. Run backend deployment script (migrations, staticfiles, react calculator, gunicorn restart)
chmod +x backend/deploy/deploy.sh
bash backend/deploy/deploy.sh

# 5. Build and restart Admin Panel
if [ -d "${VPS_PROJECT_DIR}/admin-panel" ]; then
    echo "🛠️ Updating and building Admin Panel..."
    cd "${VPS_PROJECT_DIR}/admin-panel"
    npm install --no-audit || true
    npm run build || true
    pm2 restart bgcoating-admin || pm2 restart all || true
    cd "${VPS_PROJECT_DIR}"
fi

# 6. Check service status
echo "=== Systemd & PM2 Service Status ==="
systemctl is-active bgcoating-backend
pm2 list || true
systemctl reload nginx || true

echo "=== Health check endpoints ==="
sleep 2
curl -s -o /dev/null -w "Django Backend Home: %{http_code}\n" http://127.0.0.1:8011/
curl -s -o /dev/null -w "Django Backend Services: %{http_code}\n" http://127.0.0.1:8011/services/
curl -s -o /dev/null -w "Admin Panel: %{http_code}\n" http://127.0.0.1:3001/admin/services/items || true
"""

print("Running deployment on VPS...")
stdin, stdout, stderr = client.exec_command(deploy_cmd, get_pty=True)

for line in iter(stdout.readline, ""):
    print(line, end="")

exit_status = stdout.channel.recv_exit_status()
print(f"\n[Exit code: {exit_status}]")
client.close()

if exit_status == 0:
    print("Deployment completed successfully!")
else:
    print(f"Deployment failed with exit code {exit_status}")
    sys.exit(exit_status)
