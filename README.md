# Project Sherwood

## Current static build and GitHub Pages

The gallery now runs entirely in the browser. `npm ci`, then `npm start` builds and previews the static site on port 3100. Live queries go directly to CookViewer; the fictional request stays in page memory, supports Withdraw/Delete, and disappears on reload. No operator or backend is deployed.

Validation: `npm run check`, `npm test`, `npm run build`, `npm run check:static`, then `npx playwright install chromium` and `npm run test:browser`. Browser tests use authored County responses and blocked tiles, including the `/sherwood/` project path. Playwright is a development dependency only.

`.github/workflows/pages.yml` runs checks on main pushes and pull requests. Publication requires a manual **Run workflow** on main and all checks passing; it uses the tested `dist` artifact. In repository Settings → Pages, select **GitHub Actions** as the source. No `gh-pages` branch is needed. Remote: `git@github.com:amsecada/sherwood.git`. Public hosted-source checks and existing source-use release review remain outstanding.

Only allowlisted visitor files enter `dist`; local credentials, development tools, backend modules and documents are excluded. The earlier server-based delivery notes below are historical and superseded by this section for current runtime/hosting.


A Cook County property-assessment **gallery demonstration**: actual CookViewer lookup → exploratory candidates → descriptive analysis → optional fictional complaint handoff. FEAT-008/009 and feedback FEAT-011–015 are implemented locally. The existing Sherwood branding and four steps now wrap the sole live workflow; collapsed raw fields appear at the page bottom. No real message, introduction or filing occurs. FEAT-010 (visual redesign) remains **blocked pending the separate user design discussion**.

## Run locally

Requires Node 22 or newer. No application dependencies or installation step.

```bash
npm start
```

Open [the live gallery](http://127.0.0.1:3000). If port 3000 is occupied, use `PORT=3100 npm start` and open port 3100 instead. The implementation walkthrough was left running at [port 3100](http://127.0.0.1:3100).

1. Enter the County's exact street-address spelling, without city/ZIP; try `202 W STATION ST`. Alternatively choose PIN and enter `01011000250000` (dashes accepted). This is not an address geocoder. Up to ten matches are displayed; select a parcel when ambiguous.
2. A unique selection automatically retrieves up to five exploratory candidates with the same township, neighborhood, class, tax year and value label/stage, and building size within ±20%. The subject is re-fetched. This is a research filter, not an expert-approved matching rule; PIN ordering is not a best-comparable ranking.
3. Inspect the map above the table. County latitude/longitude positions are approximate. Hover/focus a marker or row to highlight the matching property; click/tap pins selection, Escape clears it. The table lets you select overlapping pins individually. Rings/connections illustrate which properties are being compared, not their valuation influence. Animation can be paused and honors reduced motion.
4. Inspect candidate-minus-subject value, size and age differences, plus hover/focus/tap details. Green = lower County value; red = higher; neither indicates appeal merit. Value percentages use the subject denominator and are unavailable for zero. Total value per building square foot includes any land component; it is not a building-only valuation or market-price estimate.
5. Read the median-based summary (at least three usable values): at/below median, small difference below 5%, noticeable from 5% to below 15%, substantial at 15% or above. The gap uses the candidate median as denominator. Also read the deterministic count of lower/equal/higher compatible values among the shown candidates. Missing/incompatible values are omitted explicitly. No savings, assessment-correctness conclusion or appeal recommendation is generated. Empty/source-failure states remain distinct.
6. Optionally confirm a simulated handoff to **Demo Neighborhood Assessment Studio**, a fictional organization. Review the live summary and the predefined fictional identity first. No real contact fields or complaint text are collected. Acknowledgment confirms a simulated request; nothing is delivered.

`/live` is an alias of the gallery; `/demo` redirects to it. The synthetic visitor page and API routes are retired. Fixtures remain for automated tests only; live-source errors never fall back to them. Operator pages and APIs have been removed.

## Temporary state and source limits

The server owns each comparison snapshot and gives the browser a private random reference. Handoff uses that snapshot rather than trusting browser-supplied source values or explanation text. Snapshots expire after **15 minutes** with a **200-snapshot cap**. Submitted test requests expire after **60 minutes**, with a **200-request cap** and at most **100 history entries**. Expired entries are purged on operations; restart clears all memory. There is no database or on-disk property cache. Requests can be withdrawn or deleted using their private receipt; the receipt stays in page memory. Reloading loses that receipt, but automatic expiry remains available. Starting another lookup preserves the existing receipt and identifies its original parcel/recipient.

CookViewer queries use a **15-second timeout**, no automatic retry, at most **two concurrent upstream requests** and **60 upstream starts per rolling minute per server**. Candidate retrieval uses two upstream queries. These shared demo safeguards are not County rate-limit claims. Clearing the page does not revoke an already-submitted request; use its management controls.

The street background uses [OpenStreetMap tiles](https://operations.osmfoundation.org/policies/tiles/) only for the currently visible viewport, with visible attribution and normal browser caching. The browser sends an origin referrer and tile coordinates/network metadata to that provider, not parcel IDs, address text or request contents. Disable the street background with the checkbox. If tiles fail, approximate positions and the comparison table remain usable. Missing source locations are never guessed. There is no paid map service, API key, prefetching or offline tile download.

## Direct browser feasibility test

Open `/cors-probe` and choose Run direct query. This makes one real anonymous request directly from the browser to CookViewer, with no app API proxy. A Chromium test from localhost returned HTTP 200, response type `cors`, and the expected parcel on 2026-10-06. Repeat from the eventual hosted origin before static deployment. The main app still uses the existing Node lookup and temporary-request APIs; it has not been migrated to static hosting.

## Hosting preparation

[render.yaml](render.yaml) defines **one free Node web service**, no database/disk/worker. It passed validation against Render's official JSON Schema. It has **not been deployed**, and no Git repository/remote has been created.

Hosted settings:

| Setting | Meaning |
|---|---|
| `HOST=0.0.0.0` | Public network binding; localhost remains the development default |
| `PORT` | Supplied by Render; local default 3000 |
| `PUBLIC_ORIGIN` | Exact assigned HTTPS origin, e.g. your actual Render URL; no path, credentials, query or fragment |
| `NODE_VERSION=22` | Blueprint runtime pin |
| `/healthz` | Minimal health response; no upstream request or private state |

Build: `npm run check`. Start: `npm start`. Automatic deployment is off. Before publication, verify the exact public hostname/configuration, applicable County public display/temporary-use rights, limits and live queries from the hosted app. Render's free-service sleep/restart clears ephemeral demo state. A Git-backed deployment also needs a separately created/pushed repository. Do not add a durable store merely to demonstrate this workflow.

## Verification

```bash
npm test
npm run check
```

HTTP tests need permission to bind loopback. Optional browser checks use an existing external Playwright installation, without adding a product dependency:

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/verify-gallery.mjs --map
```

Browser verification uses an actual local server with authored upstream fixtures and intercepted tiles; it does not scrape public tiles. It covers unique/ambiguous lookup, source failure/empty evidence, consent and private request controls, replacement searches, expiry focus, map/table selection, reordered/missing/overlapping locations, reduced motion and desktop/narrow layouts. A separate actual CookViewer walkthrough verified `202 W STATION ST`, five candidates, six map markers and the simulated operator lifecycle. The visible in-app browser also rendered the real street background. Exact counts, review fixes and limitations are in [worklog](worklog.md). These checks do not establish all-County coverage, expert comparability or public reuse rights.

## Product scope and documents

Cook County is the initial market under DEC-017. Dallas, Miami-Dade and other regions remain deferred under DEC-018. The eventual four-step product uses reviewed comparisons and optional chosen-professional contact; this gallery does not complete that production pilot. No scores, savings estimates, paid property data, AI explanations, billing, accounts, representation or filing guarantees.

- [PRD](docs/PRD.md): product scope, requirements and decisions.
- [Backlog](docs/BACKLOG.md): permanent work items, local delivery and release gates.
- [Architecture](docs/ARCHITECTURE.md): implementation and source contracts.
- [Agent contract](AGENTS.md): working boundaries.
- [Approved gallery design](docs/superpowers/specs/2026-10-06-live-gallery-design.md) and [implementation plan](docs/superpowers/plans/2026-10-06-live-gallery.md).

TASK-001 source coverage/semantics/rights and TASK-002 expert methodology remain open. Real contacts, professional sharing and public launch still require their applicable gates. FEAT-010 stays blocked for the later design discussion.
