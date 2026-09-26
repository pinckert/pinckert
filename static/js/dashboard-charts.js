/* dashboard-charts.js
   Shared Google Charts helpers. Existing page code can adopt these gradually.
*/
'use strict';

const DashboardCharts = (() => {
    const palette = {
        success: '#16a34a',
        danger: '#dc2626',
        accent: '#2563eb',
        muted: '#64748b',
        grid: '#e5e7eb',
        text: '#334155',
        background: '#ffffff'
    };

    function baseOptions(overrides = {}) {
        return Object.assign({
            backgroundColor: palette.background,
            chartArea: { left: 64, top: 48, right: 24, bottom: 56, width: '78%', height: '68%' },
            fontName: 'Arial',
            titleTextStyle: { color: palette.text, fontSize: 15, bold: true },
            legend: { position: 'bottom', textStyle: { color: palette.muted, fontSize: 12 } },
            hAxis: { textStyle: { color: palette.muted }, gridlines: { color: palette.grid } },
            vAxis: { textStyle: { color: palette.muted }, gridlines: { color: palette.grid } },
            animation: { duration: 500, easing: 'out', startup: true }
        }, overrides);
    }

    function lineOptions(overrides = {}) {
        return baseOptions(Object.assign({ curveType: 'function', pointSize: 4, lineWidth: 3 }, overrides));
    }

    function barOptions(overrides = {}) {
        return baseOptions(Object.assign({ bars: 'horizontal' }, overrides));
    }

    function pieOptions(overrides = {}) {
        return baseOptions(Object.assign({ pieHole: 0.45, sliceVisibilityThreshold: 0.02 }, overrides));
    }

    return { palette, baseOptions, lineOptions, barOptions, pieOptions };
})();
