# pinckert Development Journal

This journal records significant development, configuration,
architecture, and deployment decisions for the redevelopment of
**pinckert.com**.

The goal is not to preserve a verbatim transcript of development
conversations, but to maintain a concise record of what was done, why
decisions were made, problems encountered, and their solutions.

------------------------------------------------------------------------

## August 26--28, 2026 --- Initial Server and Development Environment

### Project direction

The existing pinckert.com website dates back to 2007 and accumulated
many experiments, utilities, personal files, and successive
implementations over the years.

Rather than migrate the old codebase, the new site will be developed
from scratch. The old Windows website directory will remain intact as an
archive and reference source. Useful data and content can be migrated
selectively.

Initial goals for the new site include:

-   A clean home page
-   A family photo gallery
-   Pool statistics
-   An archive/files area
-   A structure that can accommodate future projects

The immediate goal is to have a useful replacement site online within
approximately one week.

### Production architecture

A DigitalOcean Droplet was created using Ubuntu 24.04 LTS.

The production request path is:

``` text
Browser
  -> HTTPS / Let's Encrypt
  -> UFW
  -> Nginx
  -> Gunicorn
  -> Flask
```

Nginx accepts public HTTP/HTTPS traffic and proxies application requests
to Gunicorn on the loopback interface:

``` text
127.0.0.1:8000
```

Gunicorn runs the Flask application and is managed by systemd.

### Server security and basic configuration

A non-root administrative account named `dean` was created and
configured for SSH key authentication and sudo access.

SSH was hardened with:

``` text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

UFW was enabled with SSH and Nginx HTTP/HTTPS traffic allowed.

A 2 GB swap file was added to the server.

### Application naming

The initial test application was called `dean-site`. This was renamed
before further development to establish consistent project naming.

Internal project name:

``` text
pinckert
```

Public hostnames:

``` text
pinckert.com
www.pinckert.com
```

Production application directory:

``` text
/var/www/pinckert
```

systemd service:

``` text
pinckert.service
```

Nginx site configuration:

``` text
pinckert
```

Using `pinckert` rather than `pinckert.com` for internal identifiers
avoids unnecessary ambiguity from the period while keeping the public
domain name unchanged.

### Gunicorn/systemd issue after rename

After renaming the application directory, `pinckert.service` entered an
automatic restart loop.

`systemctl status` reported:

``` text
status=203/EXEC
```

The cause was an old absolute path remaining in the systemd service:

``` text
/var/www/dean-site/app/venv/bin/gunicorn
```

The service configuration was corrected to reference:

``` text
/var/www/pinckert/app/venv/bin/gunicorn
```

After reloading systemd and restarting the service, Gunicorn operated
normally.

This reinforced an important deployment consideration: service
definitions and virtual environments can contain absolute filesystem
paths and must be checked when an application directory is moved.

### Earlier Gunicorn port conflict

During initial server configuration, a manually launched Gunicorn
process survived after an SSH/PowerShell session was lost. It continued
holding port 8000.

The systemd-managed Gunicorn instance therefore failed with an
address/port-in-use error and repeatedly restarted.

The manually launched process was identified and terminated, after which
systemd became the sole manager of the production Gunicorn process.

Production Gunicorn should normally be started and stopped through:

``` bash
sudo systemctl start pinckert
sudo systemctl stop pinckert
sudo systemctl restart pinckert
sudo systemctl status pinckert
```

### DNS and HTTPS

DNS A records for both:

``` text
pinckert.com
www.pinckert.com
```

were changed to point to the DigitalOcean Droplet.

Existing nameservers and unrelated DNS records were left unchanged.

Let's Encrypt certificates were installed using Certbot's Nginx
integration. HTTP traffic redirects to HTTPS.

Certificate renewal was tested successfully with:

``` bash
sudo certbot renew --dry-run
```

### Flask application behavior

The initial production Flask application was deliberately minimal.

An important distinction established during testing:

-   Nginx does not execute Flask functions.
-   Nginx proxies requests to Gunicorn.
-   Gunicorn runs the Flask application.
-   Flask routing determines which Python function handles a URL.

For example:

``` python
@app.route("/")
def home():
    ...
```

means Flask invokes `home()` for a request to `/`.

Changing Python application source does not automatically change the
production Gunicorn workers. After production Python changes, Gunicorn
must normally be restarted:

``` bash
sudo systemctl restart pinckert
```

Nginx only needs to be reloaded when its own configuration changes.

------------------------------------------------------------------------

## Windows Development Environment

### Development strategy

Development will initially continue on the existing Windows 10 PC.

Longer term, development may move to a System76 Linux system or a newer
PC. The development workflow is therefore being designed to remain
portable between Windows and Linux.

The intended workflow is:

``` text
Local development
  -> local testing
  -> Git commit
  -> GitHub
  -> deployment to DigitalOcean
```

Deployment will initially remain manual so that each component is
understood. Automation can be introduced later.

### Old website

The old website remains at:

``` text
C:\Users\14088\Desktop\pinckert.com
```

It is an existing Git working tree but has diverged substantially from
its GitHub repository, with many modified, deleted, and untracked files.

No attempt will be made to clean up or migrate that repository as a
whole.

The old directory is now considered an archive/reference source.

### New project

The new project was created at:

``` text
C:\Users\14088\source\pinckert
```

A new Git repository was initialized using the `main` branch.

### Development tools

The Windows development environment now includes:

-   Visual Studio Code
-   Git for Windows 2.55.0
-   Python 3.14.7
-   Flask
-   PowerShell

VS Code replaces Visual Studio 2022 as the primary editor for the new
project. This should make eventual migration to Linux easier because
essentially the same editor and workflow can be used on both platforms.

### Python virtual environment

A project-specific Python virtual environment was created:

``` text
.venv
```

The virtual environment isolates the project's Python packages without
isolating the operating system or filesystem.

This is conceptually related to isolation mechanisms such as `chroot`,
but much lighter-weight: a Python virtual environment primarily provides
a private Python interpreter/package environment for the project.

The environment is activated in PowerShell with:

``` powershell
.\.venv\Scripts\Activate.ps1
```

### PowerShell execution policy

Initial activation of the Python virtual environment failed because
PowerShell script execution was disabled.

The current-user execution policy was changed to:

``` text
RemoteSigned
```

using:

``` powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This allowed the locally generated virtual-environment activation script
to run without requiring an Administrator PowerShell session.

### Flask local development

Flask was installed inside `.venv`.

The initial `app.py` successfully runs locally with:

``` powershell
python app.py
```

and is available at:

``` text
http://127.0.0.1:5000
```

Flask's development server logs incoming HTTP requests to the terminal,
which provides useful immediate feedback during local development.

### Initial project organization

The project is being kept deliberately simple while leaving room for
later modularization.

Current or planned core structure:

``` text
pinckert/
├── .venv/
├── docs/
│   └── development-journal.md
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
├── data/
├── app.py
├── requirements.txt
└── .gitignore
```

Larger application modules such as Photos and Pool may later be
organized using Flask Blueprints once their requirements justify the
additional structure.

### Git exclusions

The local Python virtual environment and generated Python files are not
source code and should not be committed.

The initial `.gitignore` includes:

``` text
.venv/
__pycache__/
*.pyc
.vscode/
```

### Documentation approach

This development journal is stored as Markdown rather than a `.txt`
file.

Markdown remains ordinary text but adds lightweight structural
conventions for headings, lists, links, code, and other formatting. It
is readable directly in text editors and renders cleanly in VS Code and
GitHub.

The journal will be updated at useful project milestones rather than
attempting to preserve a verbatim conversation transcript.

------------------------------------------------------------------------

## Next Steps

The next planned work is:

1.  Commit the initial clean Flask project and this development journal.
2.  Connect the new local Git repository to GitHub.
3.  Establish the initial HTML template and site-wide layout.
4.  Build a useful home page for pinckert.com.
5.  Begin adding the first functional areas, initially Photos and Pool.
6.  Deploy the new application to the existing DigitalOcean production
    environment.
7.  Introduce deployment automation later, after the manual workflow is
    well understood.
