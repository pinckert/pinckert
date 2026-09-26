/* app-shell.js
   Shared navigation helpers for the statistics application shell.
*/
(function () {
    'use strict';

    function normalize(path) {
        return (path || '').replace(/\\/g, '/').split('/').pop();
    }

    function markActiveNav() {
        const current = normalize(window.location.pathname) || 'index.html';
        document.querySelectorAll('.app-shell-nav a').forEach(link => {
            const target = normalize(link.getAttribute('href'));
            if (target === current || (current === '' && target === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    function rememberLastReport() {
        const current = normalize(window.location.pathname);
        if (current && current !== 'index.html') {
            try { localStorage.setItem('its_last_report', window.location.href); } catch (err) {}
        }
    }

    window.AppShell = {
        markActiveNav,
        rememberLastReport
    };

    document.addEventListener('DOMContentLoaded', () => {
        markActiveNav();
        rememberLastReport();
    });
}());
