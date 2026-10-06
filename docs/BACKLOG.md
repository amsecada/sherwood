# Project Sherwood — Backlog

Updated 2026-10-06. Aligned to the four-step [PRD](PRD.md), DEC-012–021, and [architecture](ARCHITECTURE.md). Earlier acceptance criteria requiring scores, savings, AI, paid data, billing, or structured outcomes are superseded by the scope below. IDs are permanent.

## Authorized prototype delivery

User approved the [synthetic localhost Node design](superpowers/specs/2026-10-05-local-prototype-design.md) and [plan](superpowers/plans/2026-10-05-local-prototype.md) on 2026-10-05. Demonstration versions of FEAT-001–006 are implemented: fictional-address resolution and confirmation, synthetic comparison/provenance, deterministic unreviewed explanation templates, fictional-provider consented requests, protected operator review and simulated status/lifecycle actions.

This is a testing exception to the live-data stop/go point below, not completion of the live acceptance criteria. No commercial source rights, expert-reviewed method, real-provider participation or private live-contact policy has been established. TASK-001 remains in progress, TASK-002–006 and live FEAT-001–006 remain proposed; FEAT-007 remains deferred. Local Node setup is approved only for this prototype. Browser visual/keyboard walkthroughs remain not run; see [worklog](../worklog.md) for exact automated verification and review results.

The user also approved and received a bounded read-only live CookViewer lookup under TASK-001 and prototype portions of FEAT-001–002: exact street-address/PIN lookup, ambiguity selection, raw source fields/provenance/dates and at most five exploratory candidates. Anonymous upstream queries through the app are verified. No expert method, discrepancy conclusion, persistent source use or real contact workflow is enabled. This extends the local research/testing exception, not live-feature completion. All production statuses and permanent IDs remain unchanged.

The approved local candidate-table extension adds descriptive value amount/percentage, size and age deltas plus hover/focus/tap details using existing source fields (prototype FEAT-003–004; FR-007/FR-017, NFR-002/NFR-006). It preserves missingness/source compatibility and labels colors as direction rather than merit. Arithmetic and disclosure-controller tests pass; real browser visual/native-input verification remains not run. Expert-reviewed matching and interpretation are still TASK-002 gates; live FEAT-003–004 acceptance is not complete.

## Gallery demo handoff — requested 2026-10-06

The user requests a **live-feed gallery demonstration**, combining real Cook County lookup and descriptive analysis with a fictional complaint-handling organization. This is separate from the production pilot: it does not require recruiting providers, collecting real contacts or filing complaints. The user subsequently approved the design/plan and native implementation. FEAT-008/009 are implemented and verified locally; public release remains blocked on source-use and hosted checks. FEAT-010 remains blocked. Historical acceptance criteria below are preserved. Product scope is recorded in PRD DEC-019–021 and FR-018–020. Existing FEAT-001–007 and TASK-001–006 keep their IDs and production statuses.

| Order | Item | Priority | Handoff status |
|---|---|---|---|
| 1 | FEAT-008 — Unified live-feed demonstration | P1 (explicit user priority) | Implemented/verified locally; public release blocked on source-use and hosted checks |
| 2 | FEAT-009 — Linked property map and radar effects | P2 (proposed sequencing after merge) | Implemented/verified locally; County coordinates and OSM street-map design approved |
| 3 | FEAT-010 — Visual redesign | P2 (proposed) | **Blocked — separate design discussion with user required** |

### Pre-implementation functionality review (2026-10-06)

- `/` (`public/index.html`, `public/app.js`) resolves only authored fictional addresses, displays a synthetic median/explanation, and offers fictional-provider consent and a test request. `src/comparison.js` and `src/fixtures.js` supply all its property evidence.
- `/live` (`public/live.html`, `public/live.js`, `src/cookviewer.js`) performs exact County street-address or PIN lookup; it is not general address autocomplete/geocoding. It handles parcel ambiguity, then requires a separate candidate-fetch action. Up to five candidates match township, neighborhood, class, tax year, value label/stage and ±20% building size. Results are ordered by PIN, not ranked as best or nearest comparables.
- `public/live-metrics.js` already calculates candidate-minus-subject value/percentage, size and age differences, with compatibility/missing-value checks. `public/live-details.js` supports hover/focus/tap details. There is no live narrative summary or live-to-fictional handoff.
- `src/requests.js` re-runs the **synthetic** comparison from `parcelId`; passing it a live PIN will not merge the workflows. Its bounded in-memory ledger, receipts, consent, duplicate checks, withdrawal/deletion and simulated operator states are reusable behaviors, not an existing live evidence contract. `/operator` is token protected; no outbound messaging exists.
- `src/cookviewer.js` requests `returnGeometry=false` and does not expose coordinates. No map renderer, map/table identity binding or radar animation exists. `public/styles.css` supplies the current styling; no new visual direction is approved.
- `src/server.js` binds to loopback, only accepts localhost Host/HTTP Origin values, and writes a local operator token. It is not public-host ready. No database, dependency installation, build pipeline, Render configuration or Git repository is present. Source results are transient; fictional requests are shared server memory and reset on restart.
- Baseline verification earlier on 2026-10-06: 34/34 tests and syntax checks passed after local port binding was allowed. This handoff review inspects code, not rendered appearance; browser/mobile/keyboard verification must be performed during delivery. No new live-source coverage or rights verification is claimed.

### Local delivery evidence

Approved [design](superpowers/specs/2026-10-06-live-gallery-design.md) and [plan](superpowers/plans/2026-10-06-live-gallery.md) executed natively. Live primary route, descriptive summary, private expiring evidence/requests, simulated operator review, linked approximate map/radar effects and free Render preparation are implemented. Automated and real-browser checks, independent review corrections, an actual CookViewer/fictional-lifecycle walkthrough and visible OSM street rendering are recorded in [worklog](../worklog.md). No application dependency/database, real contact, Git initialization or deployment was added. Existing styling retained; FEAT-010 explicitly blocked. The implementation does not complete production FEAT-001–006 or TASK-001–006.

## FEAT-008 — Merge live lookup, rough analysis and fictional handoff

- Type/status/priority: gallery demonstration feature; **P1, implemented and verified locally; public release blocked**. Approved design and plan executed; this is not a production launch.
- Value: a visitor follows one coherent journey: Cook County address → actual County feed → exploratory comparison candidates → understandable descriptive analysis → optional simulated complaint handoff to a clearly fictional organization. Live evidence is the primary experience, not the fictional fixture flow.
- Requirements: FR-018; demo portions of FR-001–004, FR-007, FR-009–011, FR-015–017; NFR-002–007; DEC-019. Production FEAT-001–006 gates remain unchanged.
- Dependencies: existing live lookup/metrics and synthetic lifecycle code. TASK-001 public display/use evidence and TASK-004 hosted-demo configuration are public-release gates, not reasons to require a real-provider pilot for local demo development. TASK-002 remains necessary for expert comparability or assessment conclusions, not simple descriptive arithmetic.

### Acceptance criteria

1. The primary entry page uses real Cook County address lookup, with PIN as an alternative. Explain the currently supported exact street-address format and show actionable no-match guidance; do not silently introduce a geocoder or promise every County address resolves. Resolve ambiguity explicitly; after a unique selection, retrieve candidates as part of the same flow without requiring a visit to another page. Preserve source limits and do not silently broaden filters. Keep authored fixtures only as clearly separated developer/test scenarios, never as fallback evidence after a live failure.
2. Show the freshly fetched subject and returned candidates with the current deltas, detail interactions, source links, retrieval times, tax year and County value label/stage. Explicitly describe them as exploratory candidates, not certified/best appeal comparables. Show truncated results and exclusions. Clear prior analysis, selection and unsent handoff state when the subject changes; ignore superseded asynchronous responses.
3. Provide a deterministic, versioned, plain-language **rough analysis** of displayed compatible values: report how many shown candidates have lower/equal/higher County values and describe their displayed deltas. Count only candidates with usable compatible values; state the usable denominator and any omitted records. Example wording: “Of the 4 shown candidates with compatible values, 3 are lower and 1 is higher than this property.” This is a proposed implementation contract using existing arithmetic, not an expert assessment method. Do not reuse the synthetic median/threshold interpretation as a live conclusion. No savings, overassessment verdict, merit score, filing advice or claim that equal values prove correctness. Any additional aggregate or interpretation requires an explicit design decision.
4. Distinguish invalid input, unresolved/ambiguous parcel, unsupported scope where known, missing fields, no candidates, unusable comparison values, timeout, upstream error and query-capacity limit. Empty/error states must not become “no discrepancy.” A map failure (FEAT-009) must not prevent the table or rough analysis. No simulated complaint submission is offered when usable analysis is unavailable.
5. After usable analysis, offer an explicit optional **simulated handoff** to a named fictional organization. Show the proposed payload before confirmation: selected live parcel identity, displayed descriptive summary and provenance/limitations, plus fictional contact fields only if retained from the existing demo. Use predefined fictional identity details where possible; do not solicit real homeowner contact data or complaint free text. Clearly label live property evidence versus fictional recipient/actions at each relevant step.
6. Confirmation creates a pending simulated request visible in the protected operator view. Existing review and simulated sent/failed/uncertain/withdrawn/deleted behavior remains available; acknowledge “simulation only—nothing sent or filed.” Recheck fictional-recipient availability, consent and duplicate prevention on the server. Never connect email, a government complaint endpoint or a real organization.
7. Define a separate live-demo evidence contract rather than coercing a live PIN through the synthetic resolver. The server must validate the source and summary used for a request; arbitrary browser-provided values or explanation text cannot become trusted evidence. Design must choose a bounded short-lived server snapshot/reference or server re-query with reconfirmation if facts changed. Record snapshot expiry, maximum records, reset behavior and method/template versions before coding. No disk/database source cache or durable request store. This transient simulation payload is the narrowly requested extension to the prior no-live-payload boundary.
8. Refresh/restart/expired snapshot or receipt produces an honest cleared/expired state and lets the visitor restart. A shared gallery must not expose another visitor's request or operator controls. Retain body limits, safe text rendering, private receipts and bounded memory; define a reset/expiry policy so an unattended demo does not remain full. Automated tests must make no actual contact or paid calls.
9. Prepare for one free Render web service: configurable bind address and trusted public HTTPS origin, explicit Node runtime/start command, protected operator credential supplied through hosting configuration, and a health check. Keep localhost development working and unauthorized origins rejected. Document ephemeral resets, upstream request limits and public abuse controls. Secrets and source/contact payloads must not enter logs. No persistent disk/database, keep-alive service, multiple-account workaround or paid infrastructure required.
10. Public gallery release must demonstrate **actual** CookViewer queries from the hosted app, retaining clear failure states when the source is unavailable. Before publication, record applicable public display/temporary-use rights under TASK-001, hosted settings and limits under TASK-004, source smoke results and browser verification. Do not mark the feature deployed based on fixtures/local tests. Source access or rights blockers must be reported; do not substitute the fake flow or a different data provider. Deployment execution is a later handoff step, not part of this backlog edit.

### Dev handoff and verification

Start with `src/server.js`, `src/cookviewer.js`, `src/requests.js`, `public/app.js`, `public/live.js`, `public/live-metrics.js` and the operator UI. Document the unified page/API contract and transient evidence choice in architecture before implementation; reuse validated metrics and lifecycle logic without importing synthetic property claims. FEAT-008 can ship without FEAT-009/010.

Verify an end-to-end fixture journey from unique and ambiguous address lookup through simulated operator review; live provenance and correct summary counts; no-candidate/missing/incompatible/zero-value/truncated/error cases; subject change during requests; stale/tampered evidence; consent/recipient/duplicate negatives; cross-visitor isolation; withdrawal/deletion/uncertain retry; restart/expiry; trusted HTTPS origin and localhost behavior. Run `npm test` and `npm run check`, plus desktop/mobile and keyboard walkthroughs. Separately record a bounded real-source smoke test; never treat fixture tests as proof of current upstream availability or rights.

Done: the unified journey and required safeguards are verified and docs/worklog updated. Record local implementation and hosted release separately; unresolved publication gates mean “implemented locally; release blocked,” not full completion or production launch.

## FEAT-009 — Map subject and candidates with linked highlights and radar effects

- Type/status/priority: gallery demonstration feature; **P2, implemented and verified locally**. Public hosting/source-use gates are shared with FEAT-008; user specified only FEAT-008 as P1.
- Value: show the rough locations of the subject and the displayed comparison candidates immediately **before the candidate table**, with clear identification and interactive links between the map and rows.
- Requirements: FR-019; FR-007; NFR-002, NFR-004–006; DEC-020.
- Dependencies: FEAT-008's selected subject, stable PINs and current result snapshot. Before implementation, verify coordinate availability/meaning, spatial reference and permitted use under TASK-001; decide the renderer/basemap and attribution under TASK-004. No provider, library, API key or commercial terms are selected here. FEAT-010 does not block a functional map using existing styles.

### Acceptance criteria

1. Derive approximate subject/candidate positions from verified permitted source coordinates or parcel geometry. Document coordinate conversion, precision and point derivation (for example a parcel representative point, if supported); label positions approximate and do not imply building entrances or legal boundaries. Never invent coordinates from an address string. Prefer existing CookViewer source capabilities; if inadequate, stop for a source decision rather than silently introducing paid geocoding or another provider.
2. Render the subject distinctly and label each candidate with a stable identity shared with its table row. Fit available points in view. Define behavior for overlapping points so every mapped record remains identifiable. Keep candidates without valid locations in the table with “location unavailable”; no guessed pins. Zero/one-point, missing subject location and failed map/basemap states remain understandable and do not break the comparison.
3. Hovering or keyboard-focusing a marker reveals its identity and highlights exactly its corresponding row; hovering/focusing a row highlights its marker. Click/tap selects the equivalent state on touch devices; Escape clears a pinned selection. Match by PIN, never array position, and clear selection when the result snapshot changes. Do not rely on color alone or force focus/scroll jumps on incidental hover. Popups must not obstruct required interaction.
4. Include the requested radar-style visual effect linking the active candidate and subject. **Proposed meaning:** animated rings or a connecting pulse illustrate which properties are being compared and their spatial relationship; they do not quantify causal influence, valuation weight, similarity confidence or appeal merit. The developer must confirm the exact visual treatment and legend during focused map design. If quantitative “influence” is intended, stop for a separately approved method rather than inventing weights from distance or deltas.
5. Offer reduced-motion/static treatment and a pause/disable control for continuing animation. Preserve visible keyboard focus, usable touch targets, readable labels/legend and the full text/table alternative. Marker/row inspection must not trigger a fresh County lookup or per-hover geocoding call.
6. Use the same subject/candidate snapshot as the analysis/table. Keep source provenance and coordinate omissions explicit. Document any map-provider traffic and necessary attribution; send no contact/consent information to the map provider. Do not retain property location history, introduce a paid service or weaken the global content-security policy broadly to load a map.

### Dev handoff and verification

Start with the response contract in `src/cookviewer.js`, result rendering in `public/live.js` (or its FEAT-008 successor), static routes/security policy in `src/server.js`, and `public/styles.css`. First record a small coordinate-capability investigation and the renderer/interaction choice in architecture. This is a scoped map, not a new geographic comparable-ranking engine.

Verify projection/coordinate validation with known fixtures; PIN-to-marker-to-row mapping after reorder; missing/duplicate/overlapping locations; stale result replacement; map failure while analysis remains usable; safe popup text; no extra request on hover; pointer, keyboard, touch and reduced-motion behavior in a real browser. Record screenshot/browser evidence at desktop and narrow widths. Geometry/API/attribution checks are explicit prerequisites, not presumed passed.

Done: requested map placement, linked highlighting and agreed radar effect work accessibly against the live-feed result contract; source/provider gates verified, regression checks pass and documentation updated. Do not mark ready for implementation until coordinate and map-design decisions are recorded.

## FEAT-010 — Improve the site's visual design

- Type/status/priority: design and implementation feature; **BLOCKED, P2** (proposed priority).
- Blocker: the user explicitly requires a **separate design discussion before styling implementation**. Do not choose a theme, brand, layout overhaul, typography or animation direction on their behalf.
- Value: make the merged gallery demo attractive, coherent and readable while preserving the honest distinction between live evidence and fictional handoff.
- Requirements: FR-020; FR-007; NFR-006; DEC-021.
- Dependencies: user design discussion and approval; FEAT-008 journey and FEAT-009 placement/contracts as design inputs. FEAT-008/009 may progress using current styles and necessary functional layout/accessibility changes.
- Unblock deliverable: record intended audience/tone, reference examples, visual hierarchy, colors/typography, desktop/mobile layouts, table/details/map treatment, loading/empty/error/confirmation states, accessibility and motion expectations. Present a coherent proposed direction and get the user's explicit approval; record it in a linked design artifact before changing this item's status.
- Acceptance after unblock: implement the approved direction consistently across lookup, results/analysis, map (when available), fictional handoff and operator screens within the approved design scope. Keep source labels, limitations, simulation notices and keyboard focus readable; avoid cosmetic styling that implies assessment correctness or guaranteed outcomes. Define measurable visual checks from the approved design, not invented branding criteria now.
- Verification/Done: approved reference/design linked; responsive visual and keyboard review against it; contrast/reduced-motion checks and functional regression checks completed; docs/worklog updated. This item cannot be marked ready or done merely because a dev agent improved CSS. No visual redesign is authorized by this backlog preparation.

## Gallery feedback — 2026-10-06

Five separately trackable follow-ups requested after the local walkthrough. User approved the bounded design and proposed median bands. FEAT-011–015 are implemented locally; verification recorded in worklog. These narrowly supersede conflicting FEAT-008/009 presentation criteria. FEAT-010 stays blocked: reusing the existing branding/layout is not a new visual redesign. No deployment or real handoff is included.

## FEAT-011 — One branded four-step live experience

- Status/priority: implemented and verified locally, P1 (proposed sequencing first).
- Requirements: FR-018, FR-021; DEC-022; NFR-006. Depends on FEAT-008.
- Outcome: combine the existing Sherwood hero, brand content and numbered four-step presentation with actual CookViewer lookup. There is no separate visitor-facing synthetic workflow.
- Acceptance: (1) `/` and `/live` show the same branded live journey; `/demo` redirects to `/`, and no navigation offers fictional scenarios. (2) Reuse existing hero and four-step styling: find property → compare evidence → understand differences → optional fictional handoff. Update step-four copy to match the simulated action. (3) Only real source responses populate the visitor flow; preserve ambiguity selection, errors, missingness, consent and receipt controls. (4) Retire the synthetic page/script from served visitor assets; authored fixtures may remain solely for automated tests. Audit legacy synthetic endpoints and retire visitor-only paths without breaking protected request management. (5) Verify routes, live failures, four-step sequence, desktop/narrow layout and keyboard navigation.
- Handoff: `public/index.html`, `public/live.html`, `public/live.js`, `public/app.js`, `public/styles.css`, `src/server.js`; update route/browser tests and README. Preserve historical completed prototype records rather than deleting their IDs.

## FEAT-012 — Move raw source inspection to the bottom

- Status/priority: implemented and verified locally, P2.
- Requirements: FR-007, FR-021; NFR-004, NFR-006; DEC-022. Depends on FEAT-008.
- Acceptance: (1) Place “Inspect raw source fields” at the very bottom of the page, after the handoff, receipt and normal footer content. (2) It is collapsed initially and resets to collapsed for each new property; hidden when no property is selected. (3) Clear/replacement/error states never leave old property fields visible. (4) Keep normal source attribution and timing near the comparison; only the technical raw-field table moves. (5) Verify DOM order, keyboard expansion and new-search/clear behavior.
- Handoff: `public/live.html`, `public/live.js`; browser regressions.

## FEAT-013 — Remove duplicate property buttons before the table

- Status/priority: implemented and verified locally, P2.
- Requirements: FR-019, FR-021; NFR-006; DEC-022. Depends on FEAT-009.
- Acceptance: (1) Remove the map's separate address-button list (`.map-choices`), not the map markers or parcel ambiguity selector. (2) The table is the sole property list; retain map/table hover, focus, pinned selection and Escape behavior. (3) Every property remains reachable from its table row by keyboard and click/tap, including overlapping map locations and records without coordinates; missing locations are never invented. (4) No extra source fetch occurs on inspection. (5) Update overlap, missing-coordinate, focus and narrow-layout browser checks; remove unused list code/styles.
- Handoff: `public/property-map.js`, `public/live.js`, `public/styles.css`, map browser verification.

## FEAT-014 — Simplify rough-analysis wording

- Status/priority: implemented and verified locally, P2.
- Requirements: FR-017–018, FR-021; DEC-022; NFR-002, NFR-004. Depends on FEAT-008.
- Acceptance: (1) Remove “Exploratory candidates are not expert-approved comparables” from the rough-analysis text, as explicitly requested. (2) Keep the summary focused on displayed values, usable count and omitted values; do not replace the deleted phrase with equivalent repetitive qualification. (3) Preserve truthful unavailable states and the existing distinction between live evidence and simulated handoff. Do not introduce certification or outcome claims. (4) The server-owned summary, visitor preview and operator snapshot agree; version changed templates and test exact requested phrase removal plus unavailable cases.
- Handoff: `public/live-metrics.js`, `src/evidence.js` and summary/receipt tests. This supersedes FEAT-008's requirement to repeat the expert-comparability qualification in the rough-summary paragraph.

## FEAT-015 — Threshold-based disparity messages

- Status/priority: **approved and implemented locally**, P2. Depends on FEAT-014 and FEAT-008 snapshot contract.
- Requirements: FR-017–018, FR-022; DEC-023; NFR-002, NFR-004.
- Requested outcome: deterministic, preconfigured messages become more enthusiastic as the subject's value exceeds the displayed comparison baseline. Different results must produce meaningfully different copy.
- Approved decision: median of compatible displayed candidate total County values; gap = `(subject total − candidate median) / candidate median × 100`. Use all compatible displayed candidates, including higher values, rather than selecting only favorable records. At least three usable candidates and a positive median are required for a band; otherwise retain factual counts and say the sample cannot support this summary.
- Approved bands/copy: gap ≤0%: “This property's value is at or below the middle of the comparison group.”; >0 to <5%: “A small difference in the values.”; ≥5 to <15%: “A noticeable difference worth a closer look.”; ≥15%: “A substantial difference stands out.” Show the actual gap, median and sample size beside the message. Enthusiasm follows the measured disparity, not promised savings or appeal success. These are demo copy thresholds, not validated assessment thresholds.
- Acceptance criteria: (1) Store approved thresholds in one named, versioned configuration, with explicit inclusive/exclusive boundaries. (2) Compute deterministically from the server-owned evidence and mirror the exact result in visitor/handoff/operator views. (3) Preserve omitted counts, truncation context and compatibility checks; no band for missing/nonfinite/zero-denominator/insufficient values. (4) New searches reset the old message; source errors cannot show an earlier enthusiastic result. (5) Test every boundary, odd/even medians, mixed higher/lower values, incompatible years/stages, missing values, insufficient samples, zero median and snapshot replay. (6) Record approved formula/copy in PRD and architecture before product implementation.
- Handoff: `public/live-metrics.js`, `src/evidence.js`, `public/live-handoff.js`, summary/server/browser tests. Do not reuse the synthetic interpretation silently. Decision: user approved the median/5%/15% bands on 2026-10-06.

## Map presentation feedback — 2026-10-06

The user is otherwise happy with the current build and requests registration of these three remaining presentation items. The user subsequently authorized implementation; FEAT-016–018 are implemented and verified locally. No public-release approval inferred. Deliver together as a small map-controls update; FEAT-010 remains blocked for its separate design discussion. All three link to FR-019, NFR-006 and PRD DEC-024 and depend on the implemented FEAT-009/013 map/table interaction.

## FEAT-016 — Compact play/pause toggle below the map (superseded)

- Status/priority: **superseded by subsequent user request to remove playback controls**.
- Outcome: replace the large “Pause map animation” text button above the map with a compact play/pause toggle underneath it.
- Acceptance: show the pause icon while animation is running and the play icon while paused; activation toggles the existing radar animation without recreating the map or losing the selected property. Provide an accessible action name, exposed state, visible keyboard focus and a usable touch target. Retain reduced-motion behavior; do not imply animation is running while reduced-motion settings suppress it. Place the control below the map viewport and before the property table, with no duplicate control above the map.
- Handoff/verification: `public/property-map.js`, `public/styles.css`, `scripts/verify-gallery.mjs`. Verify both toggle states, repeated activation, keyboard/touch-equivalent input, selected-row preservation, reduced motion and narrow-screen layout. Use existing styling; no new animation system or dependency.

User subsequently requested removal of the toggle entirely. Playback button, JavaScript state/listener and dedicated styles removed; CSS reduced-motion support remains. Historical acceptance criteria above describe the superseded delivery.

## FEAT-017 — Move street-background checkbox below the map

- Status/priority: **implemented and verified locally, P2**.
- Outcome: move the existing “Show street background (OpenStreetMap)” checkbox underneath the map, alongside the playback control where space permits.
- Acceptance: checkbox appears below the viewport and before the property table, preserving its label association, checked state, keyboard operation and existing background-toggle behavior. Toggling affects only the tile background; markers, selection, table and analysis remain usable. Retain attribution and existing tile-loading constraints. Wrap controls cleanly on narrow screens.
- Scope clarification: the user's “Show Streetview” refers to this existing street-background checkbox; this item does not add photographic Street View or change the map provider.
- Handoff/verification: `public/property-map.js`, `public/styles.css`, `scripts/verify-gallery.mjs`; check DOM placement, keyboard toggle, background on/off and mobile layout.

## FEAT-018 — Move the map legend below the map

- Status/priority: **implemented and verified locally, P2**.
- Outcome: move “S = subject · numbered circles = candidates” and its existing explanation underneath the map.
- Acceptance: legend appears below the viewport and before the property table, with no duplicate legend above the map. Keep subject/candidate marker meanings, approximate-location context and radar relationship meaning intact. Preserve readable text, normal screen-reader order and responsive wrapping. Attribution remains visible.
- Handoff/verification: `public/property-map.js`, `public/styles.css`, `scripts/verify-gallery.mjs`; verify legend placement/content and desktop/narrow layouts with selection and missing-location states. Coordinate placement with FEAT-016/017 to keep one coherent area beneath the map.

## The smallest useful MVP

Build one Cook County comparison flow and one protected operator worklist. Keep the homeowner's four steps intact. Optimize for quickly reviewing evidence and handling a small number of requests; no polished marketplace or custom analytics dashboard is needed.

| Order | Deliverable | Existing work | What it validates |
|---|---|---|---|
| 1 | Prove a real address can resolve to a parcel and retrieve usable comparison candidates from the free API | TASK-001–002 | The data route actually works and supports a defensible comparison |
| 2 | Address form and a single results page with subject/comparable assessments, sources, dates, and a short template explanation | FEAT-001–004 | A homeowner can understand the evidence without an account or email gate |
| 3 | Small, manually maintained professional list and a named-provider contact request form | FEAT-005 | Homeowners voluntarily ask for professional help |
| 4 | Protected request list/detail with contact, chosen professional, consent, comparison summary, and pending/sent/blocked/failed/withdrawn status | FEAT-006; provider setup in FEAT-005 | The operator can review and make useful introductions without repeated copying or accidental sharing |
| 5 | Run a small authorized pilot and record a continue/change/stop decision | TASK-005 readiness, then TASK-006 learning | Professionals value requests and the manual workload is sustainable |

TASK-003–004 settle only the policies and setup needed for these deliverables. Existing IDs below are acceptance checklists for this small build, not separate applications or a requirement for twelve releases. Deliver FEAT-001–004 together as one end-to-end comparison slice, then FEAT-005–006 as the contact slice.

**Keep manual:** provider onboarding, review of unusual comparisons, introduction email, provider feedback, and pilot measurement. Use basic protected administration and an approved minimal ledger; do not create provider accounts, an automated email campaign, CRM, billing system, or an appeal-outcome database.

**First stop/go point:** do not build the full interface until TASK-001 demonstrates actual record queries and TASK-002 establishes usable comparisons. A public API directory alone is insufficient. If sample coverage is poor, adjust the eligible property segment or method before adding features.

## Pilot validation plan

These are proposed experiment sizes and decision signals for TASK-002/004 review, not accepted numerical product targets, statistically proven benchmarks, or authorization to recruit/contact anyone. Record the final cohort, observation period, and thresholds before the live pilot.

| Question | Small experiment | Proposed positive signal |
|---|---|---|
| Can we get useful evidence? | Try 20 representative properties within the proposed supported segment, selected before seeing results; separately test ambiguity, unsupported addresses, sparse data, and source failure | At least 16/20 yield usable evidence; record every exclusion/failure rather than replacing inconvenient cases |
| Are comparisons credible? | A local expert reviews all evidence-sufficient sample results and explanations | All material mismatches/unsupported claims are corrected before pilot use; unresolved cases show unavailable |
| Do homeowners want help? | Invite 25 eligible homeowners to try the flow during a relevant appeal window; log how they were recruited | At least five distinct voluntary, consented requests; report counts both per eligible participant and per usable comparison |
| Do professionals value the requests? | After authorization, arrange participation with one or two eligible professionals; manually seek feedback on each delivered introduction | At least three of the first five delivered introductions considered relevant and worth following up, and at least one professional wants to continue; no response stays unknown |
| Is it manageable for the operator? | Time comparison review and request handling separately; record service spend and exceptional cases | Median total operator handling time at most ten minutes per delivered introduction; also report total pilot labor and time spent on cases that never generated a request |

Offer only participating professionals and clearly describe limited availability. Do not imply a choice of several firms if only one participates. Do not nudge users with unsupported discrepancy claims to hit a conversion target.

Measure basic counts (eligible attempts, usable comparisons, failures/unavailable, requests, deliveries, provider feedback), operator minutes, and direct costs using case IDs and aggregate results. Keep contact information in the protected request record, not the measurement ledger. No paid analytics product is required.

**Decision:** continue improving Cook County if evidence is credible, requests are useful, and effort is manageable. If data quality fails, fix scope/method first; if demand or provider value is weak, investigate that before adding automation. An undersized cohort or closed appeal window makes the result inconclusive, not a success. Provider interest does not prove willingness to pay; a later authorized commercial trial must validate pricing. These early signals support another Cook County iteration, not automatic regional expansion.

## Sequence and Definition of Done

TASK-001 remains in progress: Cook County and its free/public CookViewer API are selected under DEC-017; small anonymous query smoke checks now pass (see the [API probe](research/2026-10-05-cookviewer-api-probe.md)), while representative records/joins, coverage, field semantics, limits and live reuse rights remain open. TBD-001 jurisdiction selection is resolved, but source validation is not done. TASK-002–004 are proposed until applicable inputs are settled. TASK-005 is proposed for release readiness; new TASK-006 is proposed for post-launch pilot learning. Production FEAT-001–006 remain proposed and FEAT-007 deferred; gallery requests FEAT-008–010 have the separate statuses above. Nothing is done merely because these documents were revised.

Research may continue without choosing unapproved technologies or commercial terms. The synthetic localhost implementation is explicitly authorized. Live implementation, paid calls, outreach, live introductions, and launch require their applicable explicit authorization.

Global Definition of Done: observable criteria verified; linked active requirements covered; failures and limitations recorded; data rights and privacy respected; canonical docs/worklog updated; no scope drift. Verify only relevant gates, not deferred features. Record exact checks actually performed.

| Milestone / epic | Status / exit |
|---|---|
| M1 / EPIC-001 — Feasibility | Proposed, P0: TASK-001–004 establish usable data, comparison method, minimal contact policy, and technical choices |
| M2 / EPIC-002 — Free comparison | Proposed, P1: FEAT-001–004 demonstrate address → comparison → explanation |
| M3 / EPIC-003 — Optional contact | Proposed, P1: FEAT-005–006 demonstrate chosen-provider consent and operator-reviewed introduction |
| M4 / EPIC-004 — Small pilot | Proposed, P0: TASK-005 verifies readiness; TASK-006 records pilot results and a continue/change/stop decision. Structured feedback feature FEAT-007 is deferred and not an exit dependency |

Epics inherit their children's active requirements and verification. These are delivery groupings, not extra product features.

## TASK-001 — Validate the selected Cook County public API

- Type/status/priority: research task; in progress; P0.
- Value/scope: validate the selected free/public CookViewer parcel API for Cook County comparisons. See the [source contract and evidence](ARCHITECTURE.md#cook-county-data-source). Dallas, Miami-Dade, and other-region work are deferred under DEC-018.
- Requirements: FR-002–005; CON-001, CON-005; RISK-002, RISK-010; TBD-001.
- Dependencies: none for read-only validation; county/API selection is already approved. Implementation still requires its own scope authorization.
- Acceptance: successfully query a subject and comparison candidates without credentials or payment, or record the specific blocker. Verify address/parcel matching, usable attributes, assessment meaning/stage/period, freshness, pagination, documented access limits, and rights for storage/display/sharing. Join supplemental Cook datasets only when required. Preserve dated source links and representative field evidence; distinguish documentation from tested behavior. A failed query leaves validation incomplete and does not reopen county selection automatically.
- Verification: primary-source inspection, representative joins, and source-rights evidence. A failed retrieval is not proof that the source is unavailable.
- Scope reduction: no three-county selection study, other-region integration, paid data, or browser-scraping implementation. Broad sales history and outcome datasets are not required for this method. No purchases or source/provider outreach.
- Done: representative anonymous queries, required field/period coverage, and applicable source rights verified and recorded. Selection is complete; validation remains in progress until those checks pass.

## TASK-002 — Approve comparison and freshness rules

- Type/status/priority: research/design task; proposed; P0.
- Value/scope: defensible comparisons and readable explanations, without score or savings methodology.
- Requirements: FR-004–005, FR-007, FR-016–017; NFR-002, NFR-004; TBD-002, TBD-006.
- Dependencies: TASK-001 source feasibility; Cook County selection already settled by DEC-017.
- Acceptance: local expert approves supported property classes, matching attributes, assessment periods, minimum evidence, discrepancy interpretation, and template wording. Specify field/source freshness and unavailable conditions. Examples cover apparent discrepancy, no apparent discrepancy, sparse/unsuitable comps, missing fields, and incompatible periods.
- Verification: permitted expert-reviewed cases with independently checked expected comparison facts; reviewer and method version recorded.
- Done: reviewed method and examples approved before FEAT-003. Proposed counts or thresholds from earlier research are not defaults.

## TASK-003 — Define minimal consent and manual introduction policy

- Type/status/priority: research/design task; proposed; P0.
- Value/scope: homeowner-controlled contact with a participating professional.
- Requirements: FR-009–011, FR-013, FR-015; NFR-003, NFR-007; TBD-008, active part of TBD-013.
- Dependencies: Cook County selected by DEC-017; define the eligible local provider category here, using TASK-001 sharing-rights evidence and TASK-002 comparison payload.
- Acceptance: define eligible requesters/providers, factual profiles/disclosures, necessary contact fields and validation, named-provider consent, permitted summary, manual review and dispatch, withdrawal, duplicate prevention, retention/deletion, and provider-copy limits. Identify provider participation only when actually confirmed. Any separately authorized charges need reviewed terms; billing software is excluded.
- Verification: walk through approved, no-consent, unavailable-provider, withdrawn, duplicate, failed, and uncertain-delivery requests using fictional contacts.
- Done: policy and operator responsibility approved before private request collection or real introductions. Outreach/legal engagements are not authorized by this item.

## TASK-004 — Select the small implementation and operating setup

- Type/status/priority: design task; proposed; P0.
- Value/scope: make implementation choices explicit without adding product scope.
- Requirements: NFR-001–008; FR-003, FR-013, FR-015; CON-003–004; TBD-010–012.
- Dependencies: source needs from TASK-001 and relevant TASK-002–003 policies.
- Acceptance: select stack/store/hosting, protected operator access, secure request handling, manual email mechanism, budget/load targets, accessibility/browser coverage, retention enforcement, recovery approach, and operating owner. Define Cook County pilot success measures for comparison quality, homeowner requests, professional value, operator time, and cost; these inform any later expansion decision. One application/store is the recommended starting point. No AI, paid property-data, billing, account, or dashboard subsystem.
- Verification: review design against active requirements and practical budget; live commands require actual configuration; the approved local prototype commands are confirmed in README.
- Done: choices approved, with no implied infrastructure provisioning or implementation authorization.

## FEAT-001 — Resolve the address

- Type/status/priority: feature; proposed; P1.
- Value/scope: step 1, one address form and necessary parcel confirmation; deliver with FEAT-002–004 as the first comparison slice.
- Requirements: FR-001–002; NFR-003, NFR-006.
- Dependencies: TASK-001, TASK-004; approved source use.
- Acceptance: supported Cook County addresses resolve stable parcel IDs; other counties are unsupported in V0; ambiguity prompts confirmation; invalid, unsupported, and unresolved cases differ. Email/login never gates results. Keyboard-accessible errors and forms work.
- Verification/Done: representative address and accessibility fixtures pass; permitted source evidence recorded.

## FEAT-002 — Read usable public evidence

- Type/status/priority: feature; proposed; P1.
- Value/scope: supply compatible Cook County assessments and characteristics through direct CookViewer API queries for step 2; supplemental public datasets and simple imports/caching only as needed.
- Requirements: FR-003–004; NFR-002, NFR-004–005.
- Dependencies: FEAT-001, TASK-002, TASK-004.
- Acceptance: source provenance and dates persist; stale, rights-restricted, incompatible, or missing evidence is excluded or refreshed. No paid fallback. Retained comparison evidence is not silently mutated by refresh.
- Verification/Done: source, freshness, missingness, rights-denial, and outage fixtures pass. No regional-reuse performance target or platform required.

## FEAT-003 — Compare similar properties

- Type/status/priority: feature; proposed; P1.
- Value/scope: case-specific comparison facts and interpretation for steps 2–3.
- Requirements: FR-005, FR-007, FR-016–017; NFR-002, NFR-004.
- Dependencies: FEAT-002 and approved TASK-002.
- Acceptance: reviewed cases reproduce expected facts; mismatched classes/periods/attributes are excluded with reasons; too little evidence yields unavailable. No opportunity score, tax savings, or success probability.
- Verification/Done: expert-reviewed cases and calculation/replay checks pass; fixed evidence yields stable outputs.

## FEAT-004 — Show and explain the comparison

- Type/status/priority: feature; proposed; P1.
- Value/scope: steps 2–3, a single results page with compact assessment comparison and plain-language templates; no separate dashboard or PDF generator. The gallery-only map extension is tracked separately in FEAT-009.
- Requirements: FR-007, FR-016–017; NFR-001–002, NFR-004, NFR-006.
- Dependencies: FEAT-003, TASK-004.
- Acceptance: show subject, similar properties, relevant characteristics, assessment periods, sources/dates, and supported differences. Distinguish no apparent discrepancy, insufficient evidence, and source failure. No email/account required; no AI or promised savings. Source text cannot become executable instructions or page markup.
- Verification/Done: display/template accuracy, unavailable states, and accessibility scenarios pass. No saved-report access subsystem required.

## FEAT-005 — Request contact with a chosen professional

- Type/status/priority: feature; proposed; P1.
- Value/scope: step 4, a short factual list of participating professionals and a consented contact form; protected manual provider setup, with no provider self-service portal.
- Requirements: FR-009–010, FR-013, FR-015; NFR-003, NFR-006–007.
- Dependencies: FEAT-004 and approved TASK-003–004.
- Acceptance: eligible active providers only; no-provider state sends nothing; contact details requested only after voluntary help selection. Consent identifies recipient and payload. Request acknowledgment is not delivery confirmation. Unconsented disclosure and unauthorized request/admin access fail. Lifecycle controls exist before storing live contacts.
- Verification/Done: filtering, consent, authorization, accessibility, and retention/deletion scenarios pass using fictional contacts.

## FEAT-006 — Review and make the introduction manually

- Type/status/priority: feature/workflow; proposed; P1.
- Value/scope: fulfill step 4 through one protected request list/detail view, using basic administration rather than a custom CRM. Show the chosen professional, approved contact fields, consent, permitted comparison summary, and basic status. Operator sends the introduction manually.
- Requirements: FR-011, FR-015; NFR-003, NFR-007–008.
- Dependencies: FEAT-005 and approved TASK-003–004.
- Acceptance: operator verifies consent, selected provider, availability, and payload before dispatch; withdrawal blocks pending sharing; failed/uncertain deliveries remain visible and are reconciled before retry. Record sent state and prevent accidental duplicate sharing, including after recovery. No automatic lead billing or score-based qualification.
- Verification/Done: fictional-contact walkthroughs for happy path, withdrawal, duplicate, provider change, failure, deletion, and restored records pass. No real introduction during verification.

## FEAT-007 — Structured feedback and appeal outcomes (deferred)

- Type/status/priority: feature; deferred; P2.
- Original value/scope: formal conversion, appeal result, assessment reduction, and actual-savings tracking, linked to FR-014.
- Replacement: [FEAT-006](#feat-006--review-and-make-the-introduction-manually) handles basic request status; [FEAT-005](#feat-005--request-contact-with-a-chosen-professional) and FEAT-006 now own active FR-015 privacy/lifecycle requirements.
- Dependencies: explicit future scope approval after pilot learning.
- Acceptance/verification/Done: future criteria must be defined before readiness; no implementation authorized. Unknown outcomes must never be inferred from silence.

## TASK-005 — Verify the four-step pilot

- Type/status/priority: verification task; proposed; P0.
- Value/scope: verify the small product and manual operating process before launch.
- Requirements: all active FRs (FR-001–005, FR-007, FR-009–011, FR-013, FR-015–017); NFR-001–008.
- Dependencies: approved TASK-001–004; FEAT-001–006. FEAT-007 and deferred requirements are not dependencies.
- Acceptance: supported and failure journeys pass; comparison examples match expert review; permitted source use, participating providers, consent/access/deletion, measured performance/cost, accessibility, and recovery/request reconciliation are verified. No unsupported timing or savings claims.
- Verification: recorded fixture/end-to-end results and manual operator walkthroughs; exact failures and limitations retained.
- Done: active acceptance criteria met and explicit launch authorization obtained; documentation approval alone does not authorize launch.

## TASK-006 — Run the small pilot and decide what to do next

- Type/status/priority: validation task; proposed; P1.
- Value/scope: test homeowner demand, professional value, and operator effort through the MVP; see the [pilot validation plan](#pilot-validation-plan). This is manual research, not the deferred structured-outcome feature FEAT-007.
- Requirements/enabling needs: G-01–04; ASM-001–003, ASM-005; FR-009–011, FR-015; NFR-005, NFR-007; DEC-018.
- Dependencies: TASK-005 readiness complete, approved TASK-004 cohort/targets/observation period, and explicit pilot/recruitment/provider-contact authorization. Provider participation must be confirmed before introductions.
- Acceptance: record participant recruitment and eligibility, all usable/unavailable/failed cases, distinct consented requests, actual deliveries, provider responses including unknowns, operator time, and direct spend. Use approved minimized records. Compare results with predeclared targets; report sample size, missingness, timing, and limitations. Produce a short continue/change/stop recommendation and the next smallest experiment.
- Verification: reconcile aggregate counts against protected request/status records; confirm that no withdrawal, no-provider case, duplicate, or failed delivery is counted as a successful introduction. Keep unobserved conversion and appeal outcomes unknown.
- Done: the experiment and decision report are complete even if the hypothesis fails; do not mark done for merely launching the app. No pricing validation claim without actual commercial evidence, and no automatic authorization for another region.

## Deferred work and audit scope

FR-006 scoring, FR-008 AI, FR-012 billing qualification, and FR-014 structured outcomes are deferred; replacements/dispositions are in the [PRD](PRD.md#functional-requirements). Paid fallback, savings, regional-platform work, uploads, social login, dashboards, and further jurisdictions require later authorization. Dallas County, Miami-Dade, and other regions are contingent on demonstrated Cook County success under DEC-018; no other-region work is currently ready. Preserve existing IDs and assign new ones only when new work is defined.

Audit this revision against active requirements and DEC-012–021, including gallery-only FR-018–020. A passing document audit does not complete feasibility research or application testing. Exact results are recorded in the [worklog](../worklog.md).

## FEAT-019 — Direct-browser source probe and operator retirement

- Status: implemented locally at user request. Requirements: FR-018, DEC-026; gallery-only scope.
- Standalone `/cors-probe` reads one real parcel through browser fetch directly to CookViewer, normal CORS, no credentials or proxy. HTTP 200/readable JSON confirmed from localhost Chromium; hosted-origin verification remains outstanding.
- Operator navigation, served page/script, API routes and startup credentials removed. Visitor simulated handoff and private Withdraw/Delete remain. Consent updated to version 2 without operator-review wording. Legacy request-model methods are not exposed by routes.
- Full static migration not implemented; main app retains existing Node lookup and ephemeral request APIs pending that separate change.

## FEAT-020 — Static gallery and test-gated GitHub Pages

- Authorized by user: browser-only conversion, initialize sherwood, sync SSH remote and push. Local implementation complete; remote CI and public deployment tracked separately. Requirements FR-018/019, NFR-004/006; static hosting supersedes Render preparation for this gallery.
- Direct browser lookup, page-memory simulated request with Withdraw/Delete, relative project paths, allowlisted artifact, locked development browser tests and manual Pages deployment after required checks implemented. No operator, storage or real messages.
- Validation: 45 local unit tests plus syntax/build/artifact checks passed; static browser workflow verified. Public-host smoke/source-use review and Pages settings remain release checks. FEAT-010 remains blocked.

## FEAT-021 — Ready-to-host static files and friendly README

- User-authorized follow-up to FEAT-020, FR-018 and NFR-006. Implemented: public/ serves directly without npm/build/backend; Pages tests and publishes that same directory. Existing live source and simulated Withdraw/Delete retained.
- README rewritten around purpose, four-step usage, example address, real-data/fictional-handoff distinction and simple hosting. Technical test commands moved into docs/DEVELOPMENT.md. No broader visual redesign or deployment included.

## FEAT-022 — Explicit compact details and mobile comparison

- User-authorized, implemented locally. FR-007/019, NFR-006; narrow presentation follow-up, not FEAT-010 redesign.
- Removed hover/focus disclosure. Row Details buttons toggle one full-width panel beneath the table; native summary closes it, Escape dismisses, aria-expanded/controls and focus return retained. Facts use a compact responsive grid rather than a narrow vertical popout.
- Mobile table keeps property/value/delta; building size, age and source period remain in Details. Hide duplicate hero step list on phones, reduce spacing/map height and use 16px form inputs.
- Verified 320/375/390/768 widths and desktop with browser checks; no page/panel horizontal overflow. Real-device touch/screen-reader audit not performed.
