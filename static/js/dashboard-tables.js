/* dashboard-tables.js
   Reusable table presentation helper for the stats dashboard pages.
   It wraps existing HTML tables in a compact, searchable, scrollable card.
*/
(function (global) {
    'use strict';

    function normalizeText(value) {
        return String(value || '').toLowerCase();
    }

    function countDataRows(table) {
        if (!table) return 0;
        const bodyRows = table.tBodies && table.tBodies.length ? table.tBodies[0].rows : null;
        if (bodyRows) return bodyRows.length;
        return Math.max(0, table.rows.length - 1);
    }

    function setTableFilter(table, filterValue) {
        const needle = normalizeText(filterValue).trim();
        const rows = Array.from(table.tBodies && table.tBodies.length ? table.tBodies[0].rows : table.rows);

        rows.forEach((row, index) => {
            if (!table.tBodies.length && index === 0 && row.querySelector('th')) return;
            const haystack = normalizeText(row.textContent);
            row.style.display = (!needle || haystack.includes(needle)) ? '' : 'none';
        });
    }

    function render(host, options) {
        if (!host) return null;

        const config = Object.assign({
            title: 'Table',
            subtitle: '',
            table: null,
            searchable: true,
            compactRows: 5,
            emptyMessage: 'No rows to display.'
        }, options || {});

        host.innerHTML = '';
        host.classList.add('dashboard-table-host');

        const card = document.createElement('section');
        card.className = 'dashboard-table-card';

        const header = document.createElement('div');
        header.className = 'dashboard-table-header';

        const titleBlock = document.createElement('div');
        const title = document.createElement('h2');
        title.className = 'dashboard-table-title';
        title.textContent = config.title;
        titleBlock.appendChild(title);

        const rowCount = countDataRows(config.table);
        const meta = document.createElement('p');
        meta.className = 'dashboard-table-meta';
        meta.textContent = config.subtitle || `${rowCount} ${rowCount === 1 ? 'entry' : 'entries'}`;
        titleBlock.appendChild(meta);
        header.appendChild(titleBlock);

        if (config.searchable && config.table && rowCount > 0) {
            const search = document.createElement('input');
            search.type = 'search';
            search.className = 'dashboard-table-search';
            search.placeholder = 'Search table...';
            search.setAttribute('aria-label', `Search ${config.title}`);
            search.addEventListener('input', () => setTableFilter(config.table, search.value));
            header.appendChild(search);
        }

        const scroller = document.createElement('div');
        scroller.className = 'dashboard-table-scroll';
        scroller.style.setProperty('--dashboard-table-visible-rows', String(config.compactRows || 5));

        if (config.table) {
            config.table.classList.add('dashboard-table');
            scroller.appendChild(config.table);
        } else {
            const empty = document.createElement('p');
            empty.className = 'dashboard-table-empty';
            empty.textContent = config.emptyMessage;
            scroller.appendChild(empty);
        }

        card.appendChild(header);
        card.appendChild(scroller);
        host.appendChild(card);
        return card;
    }

    global.DashboardTable = {
        render,
        setTableFilter
    };
})(window);
