# Live gallery integration and property map

Date: 2026-10-06. Status: approved by the user on 2026-10-06; native implementation completed locally; public release remains gated. Scope: FEAT-008 and FEAT-009; FR-018–019, DEC-019–020, and their linked backlog requirements. FEAT-010 remains blocked at the user's latest explicit direction. The VS Code agent works in a different project/checkout.

## Intended result

One primary experience: enter a Cook County street address (or PIN), confirm an ambiguous parcel, retrieve actual exploratory candidates automatically, inspect their locations and values, read a descriptive summary, and optionally simulate sending that summary to a fictional organization. No real message or complaint is sent. Retain current colors, typography and general styling; only add the layout needed for the merged workflow and map.

## Approaches considered

1. Recommended: extend the existing plain JavaScript/Node application, use server-owned short-lived evidence snapshots, and render a small map with browser-native elements. Reuses tested arithmetic and operator lifecycle, adds no application dependency or database.
2. Re-query source evidence at handoff: avoids retaining a pre-submission snapshot but can change the values between review and confirmation, requiring another confirmation cycle and more County calls.
3. Replace the UI with a framework and mapping SDK: unnecessary migration for a maximum of six map points; introduces packages and a larger maintenance surface.

## Unified flow

`/` becomes the live gallery; `/live` remains an alias for that experience. Move the existing fictional homeowner flow to `/demo`, clearly labeled as authored test scenarios, and preserve its existing API contracts/tests. `/operator` supports both types of simulated request with accurate evidence labels.

The address/PIN form keeps the exact-address limitation visible. A unique result immediately triggers the current candidate query; ambiguous results require a parcel selection before this query. Preserve the five-candidate maximum, compatibility filters, provenance, truncation notice and current missing/error distinctions. Busy states prevent accidental duplicate actions; an operation generation/abort mechanism prevents obsolete responses replacing a newer search. Starting a search clears the previous unsent summary and consent, while any submitted private receipt remains separately manageable until removed/expired.

The result order is subject overview, location map, candidate table/details, plain-language analysis, then optional simulated handoff. Analysis reuses the existing compatible value deltas to count candidates lower/equal/higher than the subject and gives a usable-record denominator. No live median interpretation, merit threshold or correctness claim is added. Empty or incompatible evidence produces unavailable analysis and disables handoff.

## Evidence and simulated requests

The server computes the summary from the exact candidate response and holds a snapshot under a random, unguessable bearer reference. Proposed operating limits: 15-minute snapshot lifetime, at most 200 snapshots; refuse new snapshots at capacity after purging expired entries. Disclose expiry to the visitor. A snapshot contains the allowlisted subject/candidates, provenance, generated summary and method/template version. Do not accept browser-authored evidence or summary text.

A new live-demo request endpoint accepts only the snapshot reference, named fictional organization ID, explicit consent and consent version. Identity is a server-assigned fictional demo identity; no name/email/free-text input is needed. Associate duplicate checks with the visitor's private evidence reference rather than one global fictional email, so independent visitors can demonstrate the same parcel. Consume/mark the reference after submission to prevent a second request from it. Keep private request receipts in page memory, preserve operator authorization, and retain withdrawal, deletion and reconciliation-before-retry behavior.

Proposed request retention: 60 minutes, maximum 200 requests, explicit expiry and cleanup on operations. Retain a bounded evidence snapshot with a request only until its expiry/deletion. Restart clears all memory. Receipt-authorized status reads support an honest expired state. Limit status history to avoid unbounded repeated operator actions. No filesystem/database cache, email integration, contact capture or government endpoint.

## Map and radar

Use CookViewer's existing `latitude` and `longitude` attributes, added to the numeric allowlist. Validate finite geographic ranges and reject unusable locations; never infer a pin from a string address. Treat these as approximate source positions, not surveyed boundaries or entrances. Missing coordinates do not remove a candidate from the table or analysis.

Evidence: the official layer metadata lists latitude/longitude. A single read-only query on 2026-10-06 returned HTTP 200 for the existing sample parcel, with latitude 42.153581 and longitude -88.138673. A returned parcel polygon projected by the source to EPSG:4326 was consistent with that approximate position. This proves a sample route, not all-County coverage or all-field rights. Initial sandbox DNS failure was resolved by an authorized network-enabled retry. No source dataset was saved.

Recommended renderer: a fixed fitted viewport using standard Web Mercator positioning, ordinary raster tile images for street context and a browser-native SVG/HTML overlay. No drag/pan or arbitrary map exploration is needed in this slice; refit on container resize. Fit the valid points with a bounded zoom and clear subject/candidate labels. Provide a marker list/selection control for overlapping points without moving their claimed geographic position.

Proposed basemap: standard OpenStreetMap tiles, requested by the browser only for the currently visible viewport. Use visible linked attribution, normal browser caching, image-specific origin referrer policy, no proxy/prefetch/offline download, and an exact tile-host image CSP allowlist. The existing app responses remain no-store; browser tile caching is separate from storing property evidence. Disclose that the tile provider receives viewport tile requests and network metadata, but no parcel IDs, address text, request contents or contacts. This provider choice requires design approval and is best-effort, not an availability guarantee. If unavailable, keep the coordinate overlay with a clearly labeled no-street-background state and keep the table usable.

Hover/focus a marker to highlight its PIN-matched row; hover/focus a row to highlight the marker. Click/tap pins selection and Escape clears it. Never re-query on selection. A ring around the selected candidate and a pulse along its connection to the subject illustrate the comparison relationship only. No distance weights, influence scores or causal claim. Include a legend, animation pause control, reduced-motion static rendering, non-color labels and keyboard-visible focus. If the subject lacks coordinates, candidates may still be shown, but omit subject connections and explain the omission.

## Hosting preparation

Keep localhost as the development default. Add explicit bind host, trusted public origin and hosted operator-secret configuration; reject untrusted hosts/origins rather than removing safeguards. Add a health endpoint and a single free-service Render configuration with Node runtime and npm start. Configure bounded source traffic in addition to the existing two-query concurrency limit, and record its exact limits in README. No database or disk, new account, Git initialization or publication during local implementation.

Public release remains separately gated by applicable CookViewer display/temporary-use evidence and hosted smoke checks. The County's public GIS announcement and general site terms were reviewed, but do not alone resolve every field's reuse rights; do not mark TASK-001 complete. Local implementation can proceed under the user-requested demo scope after design approval.

## Verification and completion

Add meaningful tests for summary counts/missingness; coordinate validation and projection; private snapshot expiry/capacity/tampering/replay; request isolation/lifecycle; hosted HTTPS origins and localhost compatibility. Keep existing synthetic tests passing. Test no candidates, malformed source, timeouts and stale search responses. Check map selection by PIN after reorder, overlaps/missing positions, tile failure and no selection-triggered network queries.

Run npm test and npm run check. Perform a real-browser desktop/narrow-width walkthrough of address selection, map/table interactions, keyboard/touch-equivalent selection, reduced motion, consent, simulated review, withdrawal and reset. Record actual tests and remaining limitations; do not substitute controller tests for browser evidence. Use a bounded live County smoke query separately from fixtures. Update canonical docs and append the worklog. FEAT-010 stays blocked. Report local feature completion and public deployment status separately.

## Sources

- [CookViewer layer metadata](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0?f=pjson)
- [Cook County GIS announcement](https://www.cookcountyil.gov/news/county-eliminates-charge-gis-data)
- [Cook County terms](https://www.cookcountyil.gov/terms-use)
- [OpenStreetMap tile policy](https://operations.osmfoundation.org/policies/tiles/)
