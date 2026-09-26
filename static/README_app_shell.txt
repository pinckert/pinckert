# Itchin' ta Scratch Analytics - application shell package

This package adds a landing page and shared application shell on top of the structured 8-ball/9-ball project.

## New files

- `index.html` — landing page / dashboard entry point
- `css/app-shell.css` — shared top navigation, breadcrumbs, landing cards, and report launch layout
- `js/app-shell.js` — active navigation highlighting and small app-shell utilities

## Updated pages

The five report pages now include shared navigation and breadcrumbs:

- `pages/individual8.html`
- `pages/opponents8.html`
- `pages/individual9.html`
- `pages/opponents9.html`
- `pages/team.html`

## Legacy dependencies

As before, the report pages expect these existing files in `legacy/`:

- `itchy.css`
- `individual.css`
- `opponents.css`
- `sessionUtil.js`
- `DOMUtil.js`
- image files such as `itchy.jpg`, `8-ball.jpg`, and any team artwork used by the reports

## Notes

The landing page is intentionally conservative. It links into all five reports and establishes the application identity without trying to load both 8-ball and 9-ball raw data files into the same global JavaScript namespace. That avoids conflicts between the two data files while the project is still using legacy global variables.

A future enhancement could add a dedicated data loader that imports 8-ball and 9-ball data into isolated namespaces, making live landing-page statistics possible without global collisions.
