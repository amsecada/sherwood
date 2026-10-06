# Project Sherwood — Architecture

Updated 2026-10-06. Aligned to the approved four-step V0 in the [PRD](PRD.md), DEC-012–018. Work authority: [backlog](BACKLOG.md). The approved localhost synthetic prototype uses Node; live stack/store/hosting choices remain open.

## Original synthetic prototype (historical; visitor workflow retired)

Approved [design](superpowers/specs/2026-10-05-local-prototype-design.md) and [plan](superpowers/plans/2026-10-05-local-prototype.md), implemented for testing only:

- `src/server.js`: Node HTTP application bound to `127.0.0.1`, explicit static asset routes, JSON validation/body limits, same-origin checks and protected operator endpoints. Successful startup publishes a random local operator token in ignored `.local/operator-token`; a failed bind does not overwrite the running token.
- `src/fixtures.js` and `src/comparison.js`: authored sample parcel/evidence/provider scenarios and deterministic demonstration templates. No CookViewer query, retrieved dates, commercial data or approved comparison methodology is implied.
- `src/requests.js`: separate in-memory test contact ledger, named fictional-provider consent, random private receipts, current availability checks, withdrawal/deletion and duplicate simulated-dispatch prevention. Failed/uncertain test outcomes require reconciliation before retry. No email mechanism or outbound transport exists.
- `public/`: homeowner and operator screens with safe text insertion, labeled forms, responsive CSS and a persistent synthetic-demo notice. Operator token and homeowner receipt stay in page memory. One homeowner page manages one request until deletion; restart deletes all test records.
- `test/`: deterministic comparison tests and actual loopback HTTP/lifecycle/startup tests. No paid services or provider outreach.

This is a single-instance local demo. It does not provide production authentication, encryption at rest, persistent recovery, retention, verified comparability, or real-contact eligibility. These remain live-use gates. Browser rendering and keyboard walkthroughs are not yet verified. Run and test commands are confirmed in [README](../README.md).

## Original read-only lookup and reusable source contract

A bounded extension to the local Node application, approved after the [anonymous API probe](research/2026-10-05-cookviewer-api-probe.md):

- `src/cookviewer.js` queries the fixed official CookViewer layer using built-in fetch. Address input is case/space-normalized and SQL-quoted; PIN input is restricted to 14 digits. No caller-supplied source URL or raw SQL is accepted. Queries use an explicit field allowlist, no geometry, a 15-second timeout, no redirects/retries, and at most two concurrent upstream requests per server. Those are local limits, not documented County operating allowances.
- `POST /api/live/lookup` returns up to ten source records, explicit empty/limited results and provenance. `POST /api/live/candidates` re-fetches a uniquely resolved subject and returns at most five exploratory candidates matching source township/neighborhood/class/year/valuation label/stage and building size within ±20%. Required-field failures stop the query. Returned candidates are checked again for compatible fields, distinct valid PINs and positive values/sizes. The filter is not an approved comparison method.
- `/live` and `public/live.js` display raw allowlisted values, missingness, source label/stage, source edit timestamps and retrieval dates using text insertion. Source edit dates are not presented as assessment effective dates. User-triggered queries do not create persistent source records or contact requests. No median, discrepancy conclusion, provider payload or synthetic fallback is produced.

The user separately approved descriptive candidate deltas. `public/live-metrics.js` computes candidate-minus-subject differences and subject-denominator percentages for compatible source year/label/stage; missing/nonfinite/negative values suppress arithmetic and zero denominators suppress percentages. `public/live.js` renders the fresh subject baseline, labeled value color/direction, neutral size/age differences and existing-field detail comparisons. Total value per building square foot retains its land-inclusion limitation. No approved comparable ranking or assessment interpretation is introduced.

`public/live-details.js` controls inline disclosures: hover/focus reveal, click/tap pin, departure closes unpinned content, and Escape dismisses without forcing focus away. This follows the intent of [WAI hover/focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html); rendered behavior and conformance have not been verified. Node EventTarget tests exercise only the controller logic. New browser modules are explicitly served by the existing static allowlist; no new upstream fields/queries are used for details.

Live address/PIN/candidate queries succeeded through the actual localhost application. Automated tests use authored response fixtures to test failures without relying on live availability; separate smoke queries verify the real upstream route. Browser rendering/keyboard checks remain not run in this environment.

## Implemented gallery integration — 2026-10-06

FEAT-008/009 are implemented locally under the approved [design](superpowers/specs/2026-10-06-live-gallery-design.md) and [plan](superpowers/plans/2026-10-06-live-gallery.md). This section supersedes the original local-only limitations above for the gallery slice. Production pilot choices below remain distinct. FEAT-010 is blocked.

- `/` and `/live` serve the unified real-source experience; `/demo` redirects to `/`; the synthetic visitor page/script and scenarios/resolve/comparisons/create-request routes are no longer served. Historical fixture modules remain test-only entry points. Lookup automatically retrieves candidates after a unique parcel selection, with ambiguity confirmation and generation/abort guards. Existing table/detail metrics remain. `summarizeCandidates` in `public/live-metrics.js` provides deterministic compatible-value counts and approved median disparity messages (`live-median-2`), never expert interpretation.
- `src/evidence.js` holds cloned server-owned snapshots, with random 32-byte hex bearer references, 15-minute expiry and capacity 200. Unknown/expired, used and full states produce explicit errors. Consuming a reference drops its snapshot and keeps a replay tombstone until expiry. Snapshot issuance is only from the source reader, never arbitrary browser evidence.
- `POST /api/live/requests` accepts only reference, fictional provider ID, affirmative consent and `live-demo-consent-1`. The server reads the trusted snapshot and creates/consumes synchronously. `src/requests.js` uses a predefined fictional identity, isolates independent visitors by private evidence reference, and retains consent/provenance/method and evidence snapshot in request memory. Requests expire after 60 minutes (capacity 200); status history is capped at 100. Expiry is purged on operations and restart clears all state. Withdrawal remains possible at history capacity by discarding the oldest entry. No property/request data is written to disk.
- `GET /api/requests/:id` uses the private receipt and returns only status/expiry. Existing withdrawal/deletion, protected operator access, provider availability, uncertain-delivery reconciliation and duplicate guards apply. `public/live-handoff.js` keeps receipt management separate from new searches, labels the original parcel/recipient, handles expiry without repetitive redraws, and never requests real contact fields. Operator rendering distinguishes synthetic and live-demo evidence.
- `src/cookviewer.js` now includes County `latitude`/`longitude` while still requesting no geometry. Invalid/nonfinite coordinate pairs, including points outside latitude 41.4–42.3/longitude -88.3–-87.4, become unavailable without discarding other property evidence. This broad envelope is a map sanity check, not jurisdiction eligibility. No geocoder is added.
- `public/map-layout.js` fits approximate coordinates using Web Mercator, 256px tiles and bounded zoom. `public/property-map.js` mounts the map before the table, shares PIN identities with rows, and supports hover/focus, click/tap pinning, Escape, overlapping-marker selection list, reduced motion and pause. Connections/rings express comparison relationships only. Disposing a result disconnects observers/listeners and invalidates tile callbacks. Keyboard focus takes precedence over pointer events caused by scrolling.
- OpenStreetMap raster images load only for a visible viewport, with normal browser caching, per-image `origin` referrer, visible linked attribution and an exact CSP image-host allowance. There is no tile proxy, prefetch, API key or application dependency. The street-background toggle allows operation without tiles; missing positions and tile failures preserve the table. The provider receives viewport/network metadata, not parcel IDs, address text or request payloads.
- Upstream work remains at two concurrent queries, 15-second timeout and no retries, now with a shared cap of 60 upstream starts per rolling minute. No unbounded per-IP ledger or trust in forwarded headers is introduced.
- `startServer` supports HOST/PORT/PUBLIC_ORIGIN/OPERATOR_TOKEN. Non-loopback binding requires an explicit HTTPS origin and secret of at least 32 characters. Host/Origin checks remain exact; forwarded headers do not grant access. Hosted secrets are not written to a token file or logged. `/healthz` permits a basic platform probe and exposes only status. `render.yaml` prepares one free service, no persistent infrastructure; schema validated, not deployed.

Verification includes Node regression tests, fixture-driven real Chromium desktop/narrow-width checks and a bounded actual CookViewer/fictional-operator walkthrough. The visible browser rendered the OSM background. Source representative coverage, assessment semantics, applicable public reuse rights, hosted deployment and production pilot validation remain open. See [worklog](../worklog.md) for exact results. The local integration does not establish a right to publish or expert assessment validity.

## Minimal direction

Recommend one application and one store, with a public comparison flow and protected operator handling of contact requests. A Cook County source reader is sufficient for V0; no generalized county plugin system or distributed platform is required. This is a design recommendation for TASK-004, not a technology approval.

## Flow

1. Resolve the entered address to a supported Cook County parcel; ask for confirmation only for ambiguity.
2. Query the CookViewer parcel API directly, using a permitted import/cache if useful and Cook County open datasets only where needed. Check provenance, assessment period, freshness, and required fields.
3. Select comparable properties using the reviewed local method. Produce the comparison facts and template explanation, or an explicit unavailable result.
4. If the homeowner chooses a professional and consents, save a private contact request. An operator reviews it and makes the authorized introduction, recording status.

No email is needed for the comparison. No model call, paid property-data call, savings calculation, automated score, billing event, or automatic introduction is part of this flow.

## Cook County data source

Selected under PRD DEC-017 on 2026-10-05: Cook County's free/public ArcGIS REST parcel service, not a browser bot that simulates CookViewer searches.

- [Layer and field documentation](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0).
- [Query endpoint](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0/query).
- Published fields include `PIN14`, `street_address`, `township_name`, `CURRENTVALUE_TOTAL`, `CURRENTVALUE_LAND`, `CURRENTVALUE_BLDG`, `BLDGSQFT`, `BLDGAGE`, `BCLASS`, `NBHD`, `LANDSF`, and `TAXYR`. Confirm meanings, completeness, and assessment stage/period through representative records before relying on them.
- The directory advertises JSON queries, attribute/spatial filtering, pagination, and a 2,000-record response maximum. That is not a verified requests-per-second allowance or service guarantee.
- [Cook County Assessor open datasets](https://github.com/ccao-data/wiki/blob/master/SOPs/Open-Data.md) can supplement assessment history, addresses, or characteristics if needed and permitted; they are not a requirement to build a countywide warehouse.

The API supplies data and candidate filtering. A separate supported “best comps” endpoint or exact equivalence to CookViewer's comparison selections has not been verified. Sherwood's local reviewed method determines suitability; do not label returned candidates as endorsed appeal comparables.

Access evidence reviewed in this conversation on 2026-10-05: the service directory was publicly readable with no signup/payment requirement identified. The county's [2013 announcement, effective 2014](https://www.cookcountyil.gov/news/county-eliminates-charge-gis-data), describes free GIS data and commercial use when compiled with other data. Current [website terms](https://www.cookcountyil.gov/terms-use) disclaim continuity and accuracy. Applicability to these exact fields, storage, display, and professional sharing remains to be checked.

**Anonymous query smoke checks verified:** six small read-only queries (five Node, one curl) returned records without credentials or payment: one sample parcel, exact-address lookup, five filtered candidates, a two-record next page, exact curl reproduction and direct PIN lookup. Node responses were HTTP 200 and curl completed successfully. See the [dated API probe](research/2026-10-05-cookviewer-api-probe.md) for field evidence, reproduction and limitations. An initial sandbox DNS failure did not reflect County denial. This establishes a working route, not representative coverage or approved comparability.

**Application route verified:** the approved local `/live` page routes successfully queried a real address, formatted PIN and five candidates without an API key. This extends the smoke evidence only.

**Not yet verified:** representative subject/candidate coverage, assessment concept/finality and effective-date semantics, operational rate limits, or applicable commercial storage/display/sharing rights. TASK-001 remains in progress. If a requirement, charge, or material restriction emerges, record it and obtain a source/scope decision rather than silently buying data, scraping pages, or switching counties.

## Responsibilities

| Part | Responsibility |
|---|---|
| Public interface | Address, parcel confirmation, comparison, explanation, and optional provider selection/consent |
| Source reader | Jurisdiction-scoped parcel identity, public fields, source dates, rights, and missingness |
| Comparison logic | Approved matching, inclusion/exclusion reasons, assessment differences, evidence adequacy, and reproducible template inputs |
| Operator workflow | Provider maintenance, private request review, consent/availability recheck, introduction, withdrawal/deletion handling |

These are logical responsibilities within one application, not independently deployed services.

## Necessary records

- Property evidence: jurisdiction/parcel, comparison attributes, assessment meaning and period, source/effective/retrieval dates, permitted uses and freshness.
- Comparison snapshot: permitted evidence used, selected/excluded comparables, method/template version, and displayed facts. Retention is a TASK-003 decision; no user report archive is required.
- Provider: service area, participation/eligibility, active status, factual profile, contact route, and applicable agreed terms.
- Private request: selected provider, authorized contact details and summary, consent version/time, operator review, withdrawal, and dispatch status.

Separate public-property evidence from private contact records. Physical schema and indexes belong to TASK-004. Import/cache expiration is not the same as deletion; retention and rights govern both. Do not build reusable regional intelligence beyond the comparison's actual needs.

## States and failure handling

Comparison: resolving → needs confirmation / unsupported / retrieving → comparison available / insufficient evidence / source failure. “No apparent discrepancy” is a supported interpretation of available comparison evidence, not the substitute for a failed lookup.

Contact request: pending review → sent / blocked / failed / withdrawn. Never show pending as already sent. Operator rechecks consent and provider availability immediately before sharing. If a delivery result is uncertain, reconcile it before another attempt. Record dispatch so retries or restored data cannot cause accidental repeat sharing.

Source failure may use an existing permitted, compatible, fresh import; otherwise show unavailable. No paid fallback. Insufficient comparables must not generate a reassuring or alarming claim. Do not publish a filing deadline without a verified source; the operator checks whether the selected professional can still assist.

## Access, privacy, and operations

Use protected operator access, case-level authorization, encrypted transport/storage, server-side secrets, minimal logs, and a deletion/withdrawal procedure before real contact data. Do not expose private requests through public identifiers. Exact authentication, contact validation, retention, and email mechanism remain TASK-003–004 choices.

No consumer account, emailed report-access system, or dashboard is required. No contact data belongs in reusable property observations. Marketing is not implied by requesting a comparison or introduction.

Keep permitted development fixtures separate from live contacts. Tests and walkthroughs must not contact real providers or spend money. Set a modest operating budget and performance/accessibility targets before launch; do not adopt numerical proposals from the prior research as defaults.

Choose recovery appropriate to the small pilot and verify restoration plus dispatch reconciliation. Select an operator responsible for pending/failed requests and privacy requests. Gallery hosting preparation is documented above and in README; actual public deployment and production operating setup remain unverified.

## Later regions

Under DEC-018, Dallas County, Miami-Dade, and other regions remain deferred until the Cook County pilot meets agreed usefulness, provider-demand, and operator-effort/cost targets. Do not build their adapters, conduct parallel market studies, or introduce a generalized county platform now. Expansion requires separate approval and local data/method/provider validation; Cook County's rules and access assumptions do not carry over automatically.

## Verification

Cover address ambiguity/unsupported properties; incompatible/stale evidence; expert-reviewed comparable selection; no discrepancy versus insufficient evidence; template accuracy; provider unavailable; consent/access negatives; withdrawal before dispatch; duplicate prevention; deletion; and restored request reconciliation.

FR-001–005, FR-007, FR-009–011, FR-013, FR-015–017 and NFR-001–008 govern this design. FR-006, FR-008, FR-012, and FR-014 are deferred. No score, savings, AI, paid fallback, billing, or detailed outcome subsystem should be added to satisfy those deferred requirements.

## Approved gallery feedback implementation — FEAT-011–015

The sole live page reuses the existing Sherwood hero and four-step layout. Raw fields are a collapsed details element after the footer, hidden on clear/unresolved refreshed subject and collapsed on each parcel render. The duplicate map choice list is removed; table rows support pointer, Enter/Space, focus and Escape selection, including overlapping/missing locations. No new styling direction is introduced (FEAT-010 blocked).

`disparityConfig` in the shared metrics module holds version `live-median-2`, minimum count 3 and thresholds 5 and 15. All compatible finite nonnegative shown candidate totals participate in the median; even samples average the middle two. A positive median and finite gap are required. Gap is `(subject − median) / median × 100`; unrounded values select ≤0, >0 to <5, ≥5 to <15, ≥15 bands. The summary includes the median, actual percentage and usable count. Insufficient/zero/nonfinite baselines produce no band. Missingness, source truncation and existing row deltas remain intact. Server evidence computes and snapshots the same explanation/version used by handoff and operator review. The requested expert-approved-comparables sentence is removed from the summary.

FEAT-017/018 retain the street-background checkbox and legend below the viewport. The user subsequently superseded FEAT-016 and requested removal of the playback button; its state/listener and styles are removed. CSS reduced-motion support remains.

## Operator retirement and direct browser probe

FEAT-019 supersedes gallery operator routes, assets and token setup. Private visitor request creation/status/withdraw/delete remain server-backed. `/cors-probe` serves a standalone page with an explicit button performing a direct credential-free CookViewer GET; CSP permits the exact County origin in connect-src. HTTP 200 and readable CORS JSON verified in Chromium. Full static conversion and hosted-origin verification remain future work.

## Static conversion — current runtime

The user authorized static conversion and repository setup. Browser-compatible CookViewer reader now resides in public/cookviewer.js, with direct credential-free fetch and caller cancellation combined with timeout. Limits apply per page. live.js computes analysis locally; simulation.js owns a single cloned fictional request in page memory. No persistence or operator. Historical Node modules remain only as prior implementation/reference and unit-test coverage outside the deployed artifact.

Build emits an explicit allowlist to dist and uses relative paths. GitHub Actions checks syntax, units, artifact and static browser workflow at /sherwood/ before manual publication. Immutable official Action pins and locked Playwright development dependency are used. Actual remote settings/deployment must be verified separately.
