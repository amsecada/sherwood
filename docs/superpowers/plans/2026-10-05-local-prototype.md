# Local Node Prototype Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task after user review. Native execution is recommended; no delegation is proposed.

**Goal:** Build a localhost synthetic demo of the four homeowner steps and operator review.

**Architecture:** One loopback-only Node server serves static frontend assets and JSON endpoints. Synthetic evidence is separate from in-memory test requests; nothing is sent externally.

**Tech Stack:** Node 22 or newer, built-in HTTP, crypto, filesystem and test modules; plain HTML, CSS and JavaScript. Node v22.22.0 was verified locally. No product dependencies.

**Spec:** [Approved prototype design](../specs/2026-10-05-local-prototype-design.md).

## Global Constraints

- Bind only to `127.0.0.1`; no hosting or live integrations.
- Persistent “Synthetic demo — not a real property assessment” labeling.
- Fixtures never claim CookViewer retrieval or expert approval.
- No scores, savings estimates, deadlines, AI, billing, or real introductions.
- Test requests clear on restart; real contacts are outside scope.
- No Git initialization, commits, or pushes.

## Review Focus

- Arbitrary addresses must not receive unrelated fixture evidence — Task 1.
- Incompatible evidence must not generate a reassuring explanation — Task 1.
- Malformed/oversized input must fail without crashing the server — Task 2.
- Cross-origin requests must not change records or obtain operator access — Task 2.
- Stale browser views must not allow duplicate or withdrawn dispatch — Task 2.

### Task 1: Synthetic comparison flow

**Files:** `package.json`, `src/fixtures.js`, `src/comparison.js`, `test/comparison.test.js`.

**Interfaces:** `resolveAddress(address)` returns a tagged resolution state; `compareParcel(parcelId)` returns immutable display evidence and a versioned template explanation; fixtures export explicit sample scenarios and fictional provider eligibility.

- [x] Write failing tests for blank, unknown, unsupported and ambiguous addresses; parcel confirmation; displayed arithmetic; stable replay; insufficient/incompatible evidence; simulated source failure; and no-provider cases. Assert arbitrary addresses never resolve a fixture parcel.
- [x] Run `node --test test/comparison.test.js`; confirm missing behavior fails.
- [x] Implement fixture-only resolution and versioned comparison facts. Use an explicit demonstration rule, label it unreviewed, and retain exclusion reasons. Never infer real assessment validity.
- [x] Run the same tests; require zero failures.

### Task 2: Local server and private test requests

**Files:** `src/server.js`, `src/requests.js`, `scripts/operator-token.js`, `test/server.test.js`, `.gitignore`.

**Interfaces:** `createServer()` returns a testable HTTP server. `npm start` serves on loopback port 3000 (allow validated `PORT` override). Public routes: `GET /api/scenarios`, `POST /api/resolve`, `GET /api/comparisons/:parcel`, `POST /api/requests`; per-request random bearer receipts authorize withdrawal/deletion. Operator routes under `/api/operator` require a separate bearer token.

- [x] Write HTTP tests for unauthorized operator reads; missing/false/wrong-recipient consent; invalid test contacts; provider eligibility; malformed JSON; 16 KiB body limit; cross-origin mutation rejection; receipt ownership; withdrawal/deletion; failed/uncertain simulations; duplicate dispatch; and restart clearing records.
- [x] Run `node --test test/server.test.js`; verify missing behavior fails.
- [x] Implement the routes and server-side validation. Separate contacts from comparison fixtures. Store consent version, wording and timestamp. For simulated sending require explicit review confirmation and current provider availability; block withdrawn/already-sent requests. Block uncertain/failed retry until the operator records reconciliation.
- [x] Generate a random operator token at startup into an ignored `.local/operator-token` file with restrictive permissions. The local helper reads the token only for the user; do not expose it over HTTP or log it. Compare authorization tokens safely. Require same-origin browser mutations and loopback Host headers. Static assets use an explicit allowlist, safe text rendering and a restrictive content-security policy.
- [x] Run `npm test`; require zero failures. Verify reset deletes test records; generated secrets stay outside public files and documentation.

### Task 3: Homeowner and operator screens

**Files:** `public/index.html`, `public/operator.html`, `public/styles.css`, `public/app.js`, `public/operator.js`.

**Interfaces:** Screens consume Task 2 routes. Operator token is pasted into a password input and held in page memory; request receipts remain in homeowner page memory. Reloading does not grant access to another request.

- [x] Start the server and verify missing screens before creating frontend assets.
- [x] Build a responsive four-step page with sample scenarios, parcel confirmation, comparison table/cards, template explanation, fictional provider selection, test contact form, explicit named-provider consent, pending acknowledgment, withdrawal and deletion. Use labeled inputs, keyboard-accessible controls, live error/status regions, visible focus, and text-only insertion of source facts.
- [x] Build a protected operator login/worklist/detail screen showing consent and test payload; review checkboxes, simulated status actions, reconciliation and reset. Label every delivery action as simulated. Clear public contact inputs after submission.
- [x] Check both screens in a browser when available: supported result, ambiguity, insufficient evidence, failure, optional request, no consent, operator access, withdrawal, duplicate dispatch, mobile layout and keyboard navigation. Record any unavailable checks honestly.

### Task 4: Verification and documentation

**Files:** README, PRD, architecture, backlog, worklog, this plan.

- [x] Run full `npm test`, syntax checks for server/frontend JavaScript, and HTTP smoke checks against the running server. Verify loopback binding and no outbound services.
- [x] Review implementation against the spec and all five Review Focus cases; correct failures before completion.
- [x] Document verified `npm start`, `npm test`, operator-token helper, sample scenarios and restart behavior. Update canonical documents to distinguish approved local prototype completion from unresolved live FEAT/TASK acceptance gates; keep permanent IDs.
- [x] Append exact checks, failures/limitations and known references to worklog; mark plan steps only from actual evidence. No application build/lint/deploy claims without corresponding configuration and execution.

## Execution record

Self-review: the plan covers homeowner flow, protected operator simulation, fixture provenance, contact isolation, failure states, lifecycle, verification and canonical documentation. No live-data or production decision is adopted. The user approved native execution. Implementation and automated checks are complete; browser rendering/keyboard verification could not run because the UI tool reported no available browser. A fresh reviewer identified three important lifecycle/startup issues, corrected in one fix pass. See worklog for exact evidence and limitations.
