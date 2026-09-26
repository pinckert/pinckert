// DOMUtil.js
// Utility routines to convert JavaScript data structures into DOM tables.
// Must NOT have external dependencies.
// Copyright Dean Pinckert 2017-23 http://www.pinckert.com/copyright.html

'use strict';

/*
  Notes:
  - addRow accepts either an Object (dictionary) or an Array.
  - Table builders accept a variety of input shapes used by the original app:
    - array of dicts (tableFromDictArray)
    - object-of-arrays (tableFromObjectArrays)
    - array-of-arrays (tableFromArrayArrays)
*/

function addRow(obj, isHeader = false) {
    const cellType = isHeader ? 'th' : 'td';
    const row_ = document.createElement('tr');

    if (Array.isArray(obj)) {
        // array of values -> create cells in order
        obj.forEach(val => {
            const cell_ = document.createElement(cellType);
            if (typeof val === 'string' || typeof val === 'number') {
                cell_.appendChild(document.createTextNode(val));
            } else {
                // object or other structure: try to stringify safely
                cell_.appendChild(document.createTextNode(String(val)));
            }
            row_.appendChild(cell_);
        });
        return row_;
    }

    // object -> create cells in property key order
    const keys = Object.keys(obj);
    keys.forEach(entry => {
        const cell_ = document.createElement(cellType);
        // maintain previous special-case behavior for 'date' fields that use APAlinkFromMatchDate/linkDate
        if (entry === 'date') {
            console.log('Date object in addRow()');
            const htmllink = (typeof APAlinkFromMatchDate === 'function') ? APAlinkFromMatchDate(obj[entry]) : obj[entry];
 //           const htmllink = (typeof linkDate === 'function') ? linkDate(obj[entry], link) : obj[entry];
            // use innerHTML for the link since linkDate returns an HTML string
            cell_.innerHTML = htmllink;
        } else {
            // simple text node
            const txt = (obj[entry] === undefined || obj[entry] === null) ? '' : obj[entry];
            cell_.appendChild(document.createTextNode(txt));
        }
        row_.appendChild(cell_);
    });

    return row_;
}

// Array of homogeneous dictionaries => table
function tableFromDictArray(da = [], labels = null, formatters = null) {
    console.log('tableFromDictArray()');
    if (!Array.isArray(da) || da.length === 0) {
        const empty = document.createElement('table');
        return empty;
    }

    const tab_ = document.createElement('table');
    const thead = tab_.appendChild(document.createElement('thead'));
    const headerRow = document.createElement('tr');

    const keys = labels || Object.keys(da[0]);
    keys.forEach(label => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(label));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = tab_.appendChild(document.createElement('tbody'));
    da.forEach(entry => {
        tbody.appendChild(addRow(entry));
    });

    return tab_;
}

// Object-of-arrays => table
function tableFromObjectArrays(da = {}, labels = null) {
    console.log('tableFromObjectArrays()');

    const tab_ = document.createElement('table');
    const thead = tab_.appendChild(document.createElement('thead'));
    labels = labels || Object.keys(da);

    const headRow = document.createElement('tr');
    labels.forEach(label => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(label));
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = tab_.appendChild(document.createElement('tbody'));
    const keys = Object.keys(da);
    keys.forEach(key => {
        // each array becomes a row; ensure first cell holds the key if no heading provided
        const rowArray = Array.isArray(da[key]) ? [...da[key]] : [da[key]];
        // some callers expect the key as first element
        rowArray.unshift(key);
        tbody.appendChild(addRow(rowArray));
    });

    return tab_;
}

// Array-of-arrays => table (first row optionally labels)
function tableFromArrayArrays(aa = [], labels = null) {
    console.log('tableFromArrayArrays()');
    if (!Array.isArray(aa) || aa.length === 0) {
        const empty = document.createElement('table');
        return empty;
    }

    const tab_ = document.createElement('table');
    const thead = tab_.appendChild(document.createElement('thead'));
    const headerRow = document.createElement('tr');

    const headerLabels = labels || aa[0];
    headerLabels.forEach(label => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(label));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = tab_.appendChild(document.createElement('tbody'));
    // if labels came from aa[0], skip that row when building rows
    const startIndex = (labels === null) ? 1 : 0;
    for (let i = startIndex; i < aa.length; i++) {
        tbody.appendChild(addRow(aa[i]));
    }
    return tab_;
}

// Convert a plain object (key/value) into a two-column table
function tableFromDict(dict = {}, caption = 'Table') {
    console.log('tableFromDict()');
    const tab_ = document.createElement('table');
    tab_.innerHTML = `<thead><th colspan="2">${caption}</th></thead>`;
    const tbody = tab_.appendChild(document.createElement('tbody'));
    Object.keys(dict).forEach(key => {
        const row = addRow({ [key]: dict[key] });
        tbody.appendChild(row);
    });
    return tab_;
}

// Sortable table from array-of-dicts
function sortableTableFromDictArray(da = [], labels = null, sorters = []) {
    console.log('sortableTableFromDictArray()');
    console.dir({ da, labels, sorters });

    if (!Array.isArray(da) || da.length === 0) {
        return document.createElement('table');
    }

    const tab_ = tableFromDictArray(da, labels);
    // attach data for re-rendering after sort
    tab_.data = JSON.parse(JSON.stringify(da)); // shallow clone to avoid accidental side-effects

    const headers = tab_.getElementsByTagName('th');
    [...headers].forEach((header_, index) => {
        header_.innerHTML = (labels && labels[index]) ? labels[index] : header_.innerHTML;
        header_.style.cursor = 'pointer';
        header_.addEventListener('click', function () {
            if (!sorters || !sorters[index]) {
                console.log('No sorter provided for column:', index);
                return;
            }
            // determine the object key for this column from the first data item
            const objKeys = Object.keys(tab_.data[0]);
            const columnKey = objKeys[index];
            tab_.data.sort((a, b) => sorters[index](a[columnKey], b[columnKey]));
            // rebuild table body
            updateTable(tab_, tab_.data);
        });
    });

    return tab_;
}

// Sortable table from array-of-arrays
function sortableTableFromArrayArrays(da = [], sorter = [], formatter = []) {
    console.log('sortableTableFromArrayArrays()');
    if (!Array.isArray(da) || da.length === 0) return document.createElement('table');

    const tab_ = tableFromArrayArrays(da);
    tab_.data = JSON.parse(JSON.stringify(da));
    tab_.sorter = sorter;
    tab_.formatter = formatter;

    const headers = tab_.getElementsByTagName('th');
    [...headers].forEach((colHeader, colIndex) => {
        colHeader.style.cursor = 'pointer';
        colHeader.addEventListener('click', function () {
            if (!sorter || !sorter[colIndex]) {
                console.log('No sorter for column', colIndex);
                return;
            }
            tab_.data.sort((a, b) => sorter[colIndex](a[colIndex], b[colIndex]));
            updateTable(tab_, tab_.data);
        });
    });

    return tab_;
}

// Replace table rows with new data array (array-of-dicts or array-of-arrays)
function updateTable(table_, data) {
    console.log('updateTable()');
    // remove existing tbody if present
    const oldBody = table_.getElementsByTagName('tbody')[0];
    if (oldBody) oldBody.remove();

    const tbody = table_.appendChild(document.createElement('tbody'));

    // if data is array of arrays, use addRow for arrays; if array of objects, ensure same ordering
    if (data.length === 0) return;

    if (Array.isArray(data[0])) {
        data.forEach(rowData => tbody.appendChild(addRow(rowData)));
    } else {
        data.forEach(obj => tbody.appendChild(addRow(obj)));
    }
}

// Misc sorters and formatters
function sort_alpha(a = '', b = '') { return (String(a).toLowerCase() > String(b).toLowerCase()) ? 1 : -1; }
function sort_caseSensitive(a = '', b = '') { return (a > b) ? 1 : -1; }
function sort_int(a = 0, b = 0) { return (parseInt(a, 10) - parseInt(b, 10)); }
function sort_date(a, b) {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return (aDate > bDate) ? 1 : -1;
}
function sort_lastName(a = '', b = '') {
    const aSurname = (String(a).split(' ')[1] || '').toLowerCase();
    const bSurname = (String(b).split(' ')[1] || '').toLowerCase();
    return (aSurname > bSurname) ? 1 : -1;
}
function sort_float(a, b) {
    const fa = parseFloat(a), fb = parseFloat(b);
    return (fa === fb) ? 0 : (fa > fb ? 1 : -1);
}

function format_float(value) {
    const v = parseFloat(value);
    return isNaN(v) ? value : Number(v).toFixed(2);
}

function format_link(value, convertValueToLink = undefined) {
    let link = value;
    if (convertValueToLink !== undefined) link = convertValueToLink(link);
    // keep basic behavior: return linkified string
    return (typeof linkify === 'function') ? linkify(value) : value;
}

// Arrow helpers (minimal DOM-only UI helpers; left for potential visual indicators)
function addArrows(tag_) {
    tag_.innerHTML = tag_.innerHTML + " \u25BC \u25B2";
}
function hideArrows(tag_) { /* placeholder - kept for compatibility */ }

