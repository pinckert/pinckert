# Development Journal

## August 27, 2026

### DigitalOcean server

Renamed the application from `dean-site` to `pinckert`.

Production architecture:

Browser
→ HTTPS / Let's Encrypt
→ Nginx
→ Gunicorn
→ Flask

Application location:

    /var/www/pinckert

Systemd service:

    pinckert.service

### Problem: Gunicorn failed after rename

`systemctl status pinckert` reported:

    status=203/EXEC

Cause: `ExecStart` still referred to:

    /var/www/dean-site/app/venv/bin/gunicorn

Changed the service configuration to `/var/www/pinckert/...`,
reloaded systemd and restarted the service.

### Windows development environment

New source directory:

    C:\Users\14088\source\pinckert

Installed:
- Git 2.55
- VS Code
- Python 3.14.7

Old website remains untouched at:

    C:\Users\14088\Desktop\pinckert.com

The old site is being treated as an archive/reference rather than
the basis of the new application.