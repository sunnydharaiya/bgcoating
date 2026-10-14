"""
Gunicorn Production Configuration for BG Coating Backend
Run with: gunicorn -c gunicorn_conf.py bgcoating_config.wsgi:application
"""

import multiprocessing
import os

# WSGI Application entrypoint
wsgi_app = "bgcoating_config.wsgi:application"

# Socket / Network Binding
# Can be overridden via GUNICORN_BIND env var
bind = os.environ.get("GUNICORN_BIND", "127.0.0.1:8011")

# Worker Processes
# Standard formula: (2 x $num_cores) + 1
default_workers = (multiprocessing.cpu_count() * 2) + 1
workers = int(os.environ.get("GUNICORN_WORKERS", default_workers))
worker_class = os.environ.get("GUNICORN_WORKER_CLASS", "gthread")
threads = int(os.environ.get("GUNICORN_THREADS", 2))

# Timeouts & Keep-Alive
timeout = int(os.environ.get("GUNICORN_TIMEOUT", 60))
keepalive = int(os.environ.get("GUNICORN_KEEPALIVE", 5))
graceful_timeout = 30

# Memory Management (Restarts worker periodically to prevent memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = os.environ.get("GUNICORN_ACCESS_LOG", "-")  # '-' logs to stdout
errorlog = os.environ.get("GUNICORN_ERROR_LOG", "-")    # '-' logs to stderr
loglevel = os.environ.get("GUNICORN_LOG_LEVEL", "info")
capture_output = True

# Process Naming
proc_name = "bgcoating_backend_gunicorn"

# Preload application code before worker processes are forked
preload_app = True


def on_starting(server):
    """
    Automatic Migration & Data Protection Lifecycle Hook.
    Runs once in the master process before worker processes are created.
    1. Creates a timestamped backup of db.sqlite3 to prevent accidental data loss.
    2. Automatically executes 'python manage.py migrate --noinput'.
    """
    import subprocess
    import sys
    import shutil
    from datetime import datetime

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    manage_py = os.path.join(backend_dir, "manage.py")
    db_file = os.path.join(backend_dir, "db.sqlite3")
    backup_dir = os.path.join(backend_dir, "backups")

    # 1. Automatic backup of SQLite database before migration
    if os.path.isfile(db_file):
        try:
            os.makedirs(backup_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(backup_dir, f"db_auto_backup_{timestamp}.sqlite3")
            shutil.copy2(db_file, backup_file)
            server.log.info(f"Database safety backup created: {backup_file}")

            # Keep only the 10 most recent backups to save disk space
            backups = sorted(
                [os.path.join(backup_dir, f) for f in os.listdir(backup_dir) if f.startswith("db_auto_backup_")],
                key=os.path.getmtime
            )
            for old_backup in backups[:-10]:
                try:
                    os.remove(old_backup)
                except Exception:
                    pass
        except Exception as err:
            server.log.warning(f"Could not create safety backup of db.sqlite3: {err}")

    # 2. Automatically execute Django migrations
    server.log.info("Running automatic Django database migrations (python manage.py migrate)...")
    try:
        res = subprocess.run(
            [sys.executable, manage_py, "migrate", "--noinput"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            check=True
        )
        if res.stdout:
            server.log.info(f"Migration output:\n{res.stdout.strip()}")
        server.log.info("Automatic database migrations completed successfully.")
    except subprocess.CalledProcessError as err:
        server.log.error(f"Automatic migration failed with exit code {err.returncode}!")
        if err.stdout:
            server.log.error(f"Migration stdout:\n{err.stdout.strip()}")
        if err.stderr:
            server.log.error(f"Migration stderr:\n{err.stderr.strip()}")
    except Exception as err:
        server.log.error(f"Error running automatic migrations: {err}")

