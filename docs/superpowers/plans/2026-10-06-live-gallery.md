# Live Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. Recommended execution for this tightly connected change: native implementation in the current session, followed by independent review.

**Goal:** Deliver FEAT-008's unified live-feed/simulated-handoff journey and FEAT-009's linked property map, keeping FEAT-010 blocked.

**Architecture:** Extend the existing Node/vanilla-JavaScript application. Server-owned expiring evidence references connect live results to the existing protected simulation ledger; a native map overlay uses CookViewer coordinates and browser-loaded OpenStreetMap tiles. Preserve synthetic APIs and move their page to `/demo`.

**Tech Stack:** Node 22+, built-in modules, HTML/CSS/JavaScript, node:test; no product packages or database.

**Spec:** [Approved live gallery design](../specs/2026-10-06-live-gallery-design.md), approved by the user on 2026-10-06. Plan status: approved for native execution and completed locally on 2026-10-06; public release remains gated.

## Global Constraints

- FEAT-010 remains blocked; retain current colors, typography and general styling.
- No real message or complaint is sent; no real contact fields, free-text complaint, paid service or government submission.
- Snapshot lifetime: 15 minutes; maximum 200 snapshots; reject new snapshots at capacity after purging expired entries.
- Request retention: 60 minutes; maximum 200 requests; restart clears all memory.
- Preserve five-candidate maximum, exact-address/PIN input, source compatibility filters and unavailable/error states.
- No filesystem/database property cache. Browser tile caching follows provider headers and is separate from application evidence.
- Local implementation and hosting preparation only; no Git initialization, publishing, new accounts or infrastructure provisioning.
- The directory is not a Git repository. Record verified task checkpoints in the worklog; do not issue commit commands or claim commits.
- Existing localhost behavior/tests remain supported. Public release still requires source-use evidence and hosted verification.

## Review Focus

1. A refresh or second search must not orphan a submitted receipt in the page, mix parcels or reuse old consent (Task 4).
2. Different visitors looking up the same parcel must not block each other or see each other's simulated requests (Task 3).
3. Zero, out-of-area or missing coordinates must not create misleading pins; overlapping points remain selectable (Tasks 1/5).
4. Delayed tiles or resize callbacks from an old result must not modify a replacement map or leak event listeners (Task 5).
5. Configured public HTTPS origin must work behind Render without trusting arbitrary forwarded headers or exposing the operator token (Task 6).

## File responsibilities

- `public/live-metrics.js`: retain the existing arithmetic and add shared pure summary generation; usable by Node import.
- `src/cookviewer.js`: add coordinate fields/normalization and bounded upstream traffic; keep fixed upstream URL and query validation.
- `src/evidence.js` (new): private expiring snapshot references and replay state.
- `src/requests.js`: preserve synthetic workflow while accepting trusted live-demo snapshots internally; retention, private status and bounded history.
- `src/server.js`: route integration, trusted hosting config, health response and explicit static allowlist.
- `public/live.js` / `public/live.html`: unified lookup/results orchestration, analysis and simulated handoff; reuse existing table/details.
- `public/live-handoff.js` (new): consent, private request receipt and lifecycle UI isolated from search state.
- `public/map-layout.js` (new): pure projection, fitted viewport and tile calculations.
- `public/property-map.js` (new): map DOM, accessible linked selection, radar effects and cleanup.
- `public/styles.css`: only functional map/selection/layout additions.
- `public/operator.js` / `public/operator.html`: accurate synthetic/live evidence labels and expiry feedback.
- `public/index.html` / `public/app.js`: remain the synthetic page implementation served under `/demo`; update navigation.
- `render.yaml` (new), `package.json`: free-service configuration and syntax-check coverage.
- `test/`: extend existing tests plus evidence, gallery lifecycle and map tests described below.
- README, PRD, architecture, backlog, AGENTS and worklog: reflect implemented demo scope and exact verification, preserving permanent IDs.

## Task 1: Source coordinates and descriptive analysis

**Files:** Modify `src/cookviewer.js`, `public/live-metrics.js`, `test/cookviewer.test.js`, `test/live-metrics.test.js`.

**Interfaces:** Existing `candidateMetrics(subject, candidate)` stays unchanged. Add `summarizeCandidates(subject, records)` returning `{state, shown, usable, omitted, lower, equal, higher, explanation, methodVersion, templateVersion}`; `state` is `available` or `unavailable`, versions are `live-descriptive-1`. Existing source records gain nullable numeric `latitude`/`longitude`.

- [x] Write failing tests: summary of candidate deltas -10/0/+10 plus missing and mismatched-year records must return `{shown:5, usable:3, omitted:2, lower:1, equal:1, higher:1}`; empty/all-incompatible records produce unavailable; zero subject value may support amount comparison but never a percentage. Assert wording reports the shown subset, not County-wide evidence or assessment correctness.
- [x] Write source tests: valid sample coordinates survive normalization; null/string/nonfinite or invalid latitude/longitude becomes unavailable. Reject points outside the approximate Cook County envelope latitude 41.4–42.3, longitude -88.3–-87.4 for map purposes without excluding their property evidence. This envelope is a location sanity check, not jurisdiction eligibility. Assert geometry remains omitted and coordinate fields are explicitly requested.
- [x] Run `node --test test/live-metrics.test.js test/cookviewer.test.js`; confirm new assertions fail for absent behavior.
- [x] Implement the two additions using existing compatibility checks and finite numeric validation. One unusable coordinate makes the pair unavailable; no address-based fallback.
- [x] Repeat the focused command; all assertions must pass. Record checkpoint and observed limitations.

## Task 2: Private evidence snapshots

**Files:** Create `src/evidence.js`, `test/evidence.test.js`.

**Interfaces:** `createEvidence({now=Date.now}={})` returns `{issue(result), read(reference), consume(reference), clear()}`. `issue` stores a structured clone of a usable candidate response plus Task 1 analysis and returns `{reference, expiresAt, analysis}`. `read` returns a clone of the trusted snapshot; `consume` marks it used but keeps a tombstone until expiry. References are 32 random bytes encoded as hex. Issue only from server-owned reader responses. Errors use existing HTTP-status error convention; unavailable analysis is 400, expired/unknown reference 410, used reference 409, capacity 429.

- [x] Write failing tests with an injected clock: `read` succeeds at 899999 ms and fails at 900000 ms; 200 issued snapshots succeed, the 201st returns 429; expiry releases capacity. Mutating caller/read-returned objects cannot alter stored evidence. Consumed references reject replay; `clear` removes them; no unusable analysis can be issued.
- [x] Run `node --test test/evidence.test.js`; confirm failure for the absent module.
- [x] Implement bounded storage, lazy expiry purge on every operation and immutable copies. Store no contact data, credentials in logs or disk files.
- [x] Re-run focused tests and record checkpoint.

## Task 3: Live-demo handoff and operator lifecycle

**Files:** Modify `src/requests.js`, `src/server.js`, `public/operator.js`, `public/operator.html`; create `test/gallery-server.test.js`; extend `test/server.test.js`.

**Interfaces:** `createRequests({now=Date.now}={})` keeps existing methods and adds `createLive({snapshot,reference,providerId,consent,consentVersion})` and `status(id,receipt)`. Provider is existing `demo-professional`; consent version `live-demo-consent-1`; fictional identity is server-created and labeled. New `POST /api/live/requests` body is exactly `{reference,providerId,consent,consentVersion}`. `GET /api/requests/:id` requires the private receipt; return only `{id,status,expiresAt}`. Candidate route adds Task 2 `{reference,expiresAt,analysis}` when analysis is usable; unavailable results have no reference. Create response preserves `{id,receipt,status}` and adds `expiresAt`.

- [x] Write failing HTTP tests: get candidates → private evidence reference → consented live request → protected operator summary matching the exact source evidence; browser-supplied summary/name/email rejected. False consent, wrong version/provider, inactive provider, unknown/expired reference and replay fail. Source error produces no evidence token. Fixtures perform no live network calls.
- [x] Add lifecycle tests for two independent references to the same PIN both succeeding, unauthorized status/withdraw/delete failing, private receipt access, 60-minute expiry, capacity 200, reset clearing evidence and requests, restart, withdrawal blocking simulated sent, uncertain state requiring reconciliation and bounded history (maximum 100 entries; reject further transitions with 409 until deletion/reset). Assert one visitor's identifiers cannot expose another request.
- [x] Run `node --test test/gallery-server.test.js test/server.test.js test/live-server.test.js`; inspect expected new failures.
- [x] Implement trusted snapshot integration synchronously: validate and create request, then consume reference with no intervening await. No browser evidence or synthetic resolver is used for live requests. Snapshot expiry does not remove an already-confirmed request before its separate 60-minute expiry. Extend existing lifecycle logic without weakening synthetic consent checks; purge expired records on operations.
- [x] Update operator labels/checklists by evidence type, show source provenance/version/expiry and only permitted summary; never render source strings as HTML. `reset` clears pending snapshots too. Existing fictional-request tests remain unchanged except intentional added expiry fields.
- [x] Run the three test files and record passing checkpoint.

## Task 4: Merge the primary visitor journey

**Files:** Modify `public/live.html`, `public/live.js`, `public/index.html`, `public/app.js`, `src/server.js`; create `public/live-handoff.js` and frontend interaction tests as supported by the available browser runtime.

**Interfaces:** `/` and `/live` serve `live.html`; `/demo` serves `index.html`. Add `mountHandoff(container)` returning `{setEvidence({reference,expiresAt,analysis,subject,source,provider}),clearEvidence(),destroy()}`. Keep submitted request state separate from `setEvidence/clearEvidence`; receipt stays only in page memory. Source/table metrics remain the existing API shapes with Task 3 additions.

- [x] Add route tests asserting primary/live pages are the live journey and `/demo` remains synthetic. Add browser assertions for automatic candidate retrieval after unique lookup, ambiguity requiring selection, no synthetic fallback, and no optional handoff for unavailable analysis.
- [x] Exercise delayed lookup A then clear/search B: A must never replace B; changing subject clears old consent and pending evidence but preserves management of an already-submitted request. Refreshing loses private page access and explicitly explains that requests expire automatically. Write assertions before implementing these transitions.
- [x] Implement generation/abort guarded lookup and candidate orchestration, retaining source errors/truncation/missingness/details. Extract raw fields into a disclosure to keep the main journey readable; retain existing styling. Add map insertion point immediately before the table and analysis/handoff after it.
- [x] Implement the handoff panel: named fictional recipient, payload preview, explicit consent, simulated pending acknowledgment, receipt-authorized refresh/withdraw/delete and expiry text. No editable real contact fields. Disable duplicate submission; show server errors without losing the receipt.
- [x] Run HTTP regressions and browser checks with fixtures; confirm search failure never sends or offers an invented summary. Record checkpoint; live-source smoke is reserved for Task 7.

## Task 5: Linked map and radar behavior

**Files:** Create `public/map-layout.js`, `public/property-map.js`, `test/map-layout.test.js`; modify `public/live.js`, `public/styles.css`, `src/server.js`; add browser map interaction tests/evidence.

**Interfaces:** `fitMap(points,width,height)` returns `{zoom,originX,originY,markers,tiles}`; each input point is `{pin,latitude,longitude,label,isSubject}`, each marker includes pixel x/y and stable PIN. Tiles are `{z,x,y,left,top}`. Use 256px Web Mercator tiles, zoom integers 8–18, 40px fitting padding, north-up. `mountPropertyMap(container,{subject,records,rowsByPin})` returns `{destroy()}` and fits on resize; rowsByPin maps PIN strings to existing row elements.

- [x] Write failing pure tests for known projection positions, orientation, fitted bounds, zero/one/many points, same-coordinate records, invalid coordinates, sub-320px layouts and visible-only tile enumeration. Confirm no tile outside the viewport is requested and missing locations preserve their table records.
- [x] Run `node --test test/map-layout.test.js`, implement pure math, then repeat until passing. Keep exact source positions; overlaps use the accessible marker list, not fabricated geographic offsets.
- [x] Add browser tests: marker/row hover and focus select the same PIN after record reorder; click/tap pins, Escape clears, no-source-call count changes on inspection; missing subject suppresses connections; all-missing locations show an explanation. Old map resize/tile callbacks after replacement cannot mutate new content.
- [x] Implement native image/SVG/button layers and observer/listener cleanup. Only mount/load street tiles when the map is actually visible. Use `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, standard browser caching, per-image `referrerPolicy='origin'`, visible linked attribution and map-issue link. Add only that image host to CSP; scripts remain self-only. Provide a disable-street-background control/config so the map can operate without third-party tiles. No proxy, prefetch, service worker, token or contact data sent to tiles.
- [x] Implement radar ring/connection pulse for selected candidate with relationship-only legend, pause control and static prefers-reduced-motion treatment. Tile errors leave markers and table usable with an explicit unavailable street-background notice. Distinguish labels/shapes as well as color; visible focus and 44px marker controls.
- [x] Run pure tests and real-browser desktop/narrow-width, keyboard, touch-equivalent and reduced-motion checks with stubbed tiles. Do not use automated map browsing to bulk-fetch public OSM tiles. Record checkpoint.

## Task 6: Hosting-ready configuration and bounded operation

**Files:** Modify `src/server.js`, `src/cookviewer.js`, `package.json`, `README.md`; create `render.yaml`, `test/hosting.test.js`; extend source tests.

**Interfaces:** Startup reads `HOST` (default `127.0.0.1`), `PORT` (existing default 3000), `PUBLIC_ORIGIN` and `OPERATOR_TOKEN`. A non-loopback bind requires a validated HTTPS public origin and a token of at least 32 characters. Local generated-token behavior remains; when supplied, do not write/log the hosted token. `GET /healthz` returns only `{status:'ok'}` without source traffic or sensitive details. Explicit origin/Host validation applies to app routes; health path permits the hosting probe's Host without opening any other route.

- [x] Write failing HTTP/startup tests for exact configured public host/HTTPS Origin acceptance, wrong scheme/host/port/origin and forged forwarded headers rejection, localhost compatibility, missing hosted secret/config rejection, safe health probe and no token-file write for supplied credentials. Reuse the failed-second-bind credential-preservation test.
- [x] Add upstream traffic tests with injected clock: retain two concurrent queries and 15-second timeout; allow at most 60 actual upstream query starts per rolling 60 seconds per server, then 429 without fetch; capacity becomes available as starts age out. A candidate lookup consumes two upstream calls. Invalid input consumes none. Do not use spoofable forwarded IP headers or grow per-IP maps.
- [x] Run focused tests to observe failures, then implement config validation, fixed-host upstream limit and environment parsing. Static assets/health/receipt/operator actions do not consume source budget. Document global shared limit and best-effort availability.
- [x] Add a single Node free web service Blueprint: build `npm run check`, start `npm start`, health `/healthz`, HOST `0.0.0.0`, Node 22 pin, PUBLIC_ORIGIN manually supplied for the assigned HTTPS hostname and generated OPERATOR_TOKEN. No disk/database/worker or keep-alive. Validate YAML with available tooling; do not deploy or initialize Git.
- [x] Extend `npm run check` to new modules; run focused tests and syntax checks. Record exact Blueprint validation performed versus unavailable tooling.

## Task 7: Integrated verification, review and documentation

**Files:** README, docs/PRD.md, docs/ARCHITECTURE.md, docs/BACKLOG.md, AGENTS.md, worklog.md; test files touched by corrections.

- [x] Run `npm test` and `npm run check` with local port-binding permission as needed; all tests pass. Obtain an independent scoped review once implementation is complete; fix actionable findings with appropriate regression tests and rerun affected checks.
- [x] Use browser fixture responses to verify all states and interactions above, including operator workflow and source strings rendered inertly. Capture desktop/narrow-width evidence; explicitly list any unavailable browser capability rather than claiming it passed.
- [x] Run one user-initiated live address/PIN/candidate journey through the actual local app, verify County provenance and coordinates, and simulate handoff with fictional identity. Inspect status only through authorized operator access without printing/saving the credential. Record actual upstream outcomes; failure stays failure. Inspect a normal visible basemap view if permitted by available browser tooling; do not prefetch tiles.
- [x] Update canonical scope/status: design approved and locally implemented only where verified; FEAT-010 blocked; full production features and TASK-001 rights/coverage still unresolved. Record exact new routes, limits, expiry, map provider/referrer behavior, operator configuration and Render steps. Keep publication blocked until applicable source-use and hosted checks pass.
- [x] Check relative documentation links/anchors, unique permanent work IDs and FR-018/019 acceptance traceability. Append exact test counts, browser/live-source evidence, review findings, limitations and no-deployment status to worklog.
- [x] Present the working local app and concise outcome; name any unmet criteria. No commit, push or deployment claim without that action actually occurring.

## Plan self-review

Coverage checked: unified flow/error states (Tasks 1/4), trusted ephemeral handoff/lifecycle (2/3), map/provider/selection/accessibility (1/5), hosting and upstream limits (6), verification/canonical docs (7). The five review-focus conditions each have owning test steps. FEAT-010 is excluded. Shared interfaces use the same field names across tasks; source evidence remains separate from fictional identity. Further implementation choices within these contracts do not require new product scope.
