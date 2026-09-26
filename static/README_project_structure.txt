Structured stats project - first pass
====================================

Goal
----
This package keeps the working versions of the pages intact while moving toward a real project structure.
It intentionally avoids a large rewrite so each page remains easy to test.

Folders
-------
css/
  dashboard.css          Shared dashboard variables, layout, cards, buttons, form controls, table basics.
  individual8.css        CSS extracted from the stable modernized individual page.
  team.css               CSS extracted from the fixed team performance page.

js/
  dashboard-charts.js    Shared Google Charts option helpers for gradual adoption.
  individual8.js         JavaScript extracted from individual8_modernized_charts.html.
  team.js                JavaScript extracted from team_fixed.html.

data/
  itchyscratchy8.js      Current uploaded data source.

pages/
  individual8.html       Refactored page shell using external CSS/JS.
  team.html              Refactored page shell using external CSS/JS.

legacy/
  Put existing support files here: sessionUtil.js, DOMUtil.js, itchy.css, images, etc.

Suggested install layout
------------------------
Project root/
  css/
  js/
  data/
  pages/
  legacy/

Then open:
  pages/individual8.html
  pages/team.html

Notes
-----
1. This is a conservative architecture pass. The next pass should remove duplicated CSS from individual8.css and team.css into dashboard.css.
2. The next JavaScript pass should move repeated chart option objects to DashboardCharts helpers.
3. After individual8 and team are stable in this structure, opponents8 can be added as the third page.
4. If your live site expects all files in one directory, you can either update paths or keep root-level wrapper files that redirect to pages/.


DashboardTable component
------------------------
The project now includes js/dashboard-tables.js.  This helper wraps a normal HTML table in a reusable card with:
- compact vertical scrolling, defaulting to about five visible rows
- sticky table headers
- optional table search
- row count metadata

The individual8 complete match list uses this component. Other long detail tables can adopt it by creating the table as usual and calling:

DashboardTable.render(hostNode, {
    title: 'Complete match list',
    table: tableElement,
    searchable: true,
    compactRows: 5
});


Opponents8 structured page
--------------------------
This package now includes a structured opponents page:
- pages/opponents8.html
- css/opponents8.css
- js/opponents8.js

The page is based on the working accordion version of opponents8. Its inline style and script blocks were moved into separate files while preserving the existing behavior: session range controls, opponent/team ordering, team quick links, search, summary cards, collapsible team sections, and sortable tables.

Required legacy files to place in legacy/:
- itchy.css
- opponents.css, if you still want the old legacy styles loaded
- sessionUtil.js
- DOMUtil.js
- itchy.jpg

The shared DashboardTable helper is included for consistency with the new project baseline. Opponents8 does not yet require it for its accordion tables, but the include is available for future long-detail tables.


Update: individual8 session summaries now render as a graphical performance card with a compact chart and collapsible numeric details.


9-ball adaptation notes
-----------------------
This package adds first-pass 9-ball pages using the same structured folders:

  pages/individual9.html
  pages/opponents9.html
  data/itchyscratchy9.js
  js/individual9.js
  js/opponents9.js
  css/individual9.css
  css/opponents9.css
  js/game-config.js

The 9-ball pages preserve the uploaded 9-ball scoring logic while adopting the
same page structure and dashboard includes used by the 8-ball pages. The next
refactor step would be to merge individual8.js + individual9.js into a single
individual.js that reads from GameConfigs, then do the same for opponents.

9-ball UI update:
- individual9 now uses the same modern chart styling, DashboardTable match list, and graphical session summary pattern as individual8.
- opponents9 now uses the same accordion dashboard UI pattern as opponents8 with 9-ball score colors.
