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
bind = os.environ.get("GUNICORN_BIND", "127.0.0.1:8000")

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
