# Local Node prototype — proposed design

Status: approved by the user's “yes” on 2026-10-05. The user authorized building a localhost Node prototype and approved this synthetic-data testing scope. Live-feature prerequisites remain open. The synthetic prototype is implemented; automated verification and browser limitations are recorded in worklog.

## Purpose and authority

Test the four-step homeowner experience and manual operator workflow before connecting real evidence or collecting real contacts. Preserve PRD DEC-012–018. This covers prototype versions of FEAT-001–006, linked to FR-001–005, FR-007, FR-009–011, FR-013, FR-015–017 and applicable NFRs. It does not complete those production features or TASK-001–006.

## Options

1. **Recommended: synthetic-data local prototype.** Immediate interaction testing with fictional property evidence, fictional providers, and test contacts. No external services. Live-data validity and business demand remain untested.
2. **Live-data comparison slice first.** Complete TASK-001 and obtain TASK-002 methodology approval before implementing comparisons. More useful for evidence testing, but blocked by unresolved source rights and expert review.
3. **Hybrid demo with live lookups.** Adds integration work while comparison methodology still lacks approval. Defer this until source validation establishes which facts can be used.

## Proposed implementation

One Node application using built-in HTTP serving and a plain HTML/CSS/JavaScript frontend. Bind only to `127.0.0.1`. Use Node's built-in test runner. Avoid product dependencies, hosting, paid calls, model calls, and outbound messaging. Confirm the installed Node version before writing configuration; document verified start/test commands after they exist.

Keep synthetic property fixtures separate from test contact requests. Hold requests in server memory; restart clears them. This is deliberate demo behavior, not an approved retention or recovery policy for live use. A server-generated operator access token stays out of artifacts and logs; provide an explicit local way to obtain it for testing. Protect operator endpoints and avoid public request listings. Define the exact mechanism in the implementation plan.

## Homeowner flow

- Persistent “Synthetic demo — not a real property assessment” labeling. Offer explicit sample addresses and scenario selection; never substitute fixture facts for an arbitrary real address.
- Address intake with distinct ambiguous, unsupported, unresolved, and invalid states. Ambiguity requires selecting a fictional parcel.
- One results page with a synthetic subject and a handful of synthetic comparable properties: class, size, assessment concept and period, fixture provenance, and dates. Fixture provenance never claims retrieval from CookViewer.
- Template explanations for a displayed difference, no apparent difference, insufficient evidence, and simulated source failure. Any demo selection or interpretation rules are labeled unreviewed demonstration rules and versioned. They do not establish an approved discrepancy threshold or local methodology.
- Optional selection of a fictional professional, then test contact entry and affirmative named-recipient consent. Show a pending-review acknowledgment. No real introduction or sharing occurs.
- Include a no-provider scenario, withdrawal, and deletion of test requests. Clearly request fictional contact details only.

No account or email gate for comparison, scores, savings estimates, appeal guarantees, deadlines, AI explanations, billing, other-region adapters, or provider outreach.

## Operator flow

A protected local worklist shows test requests, chosen fictional provider, consent wording/version/time, synthetic summary, and request status. Operator review checks consent, withdrawal, provider availability, and permitted test payload. Status changes simulate review and delivery; “sent” is explicitly labeled simulated. Reject repeated simulated dispatch and dispatch after withdrawal. Failed or uncertain simulations remain visible for manual reconciliation. Provide a reset for demo records.

## Verification

Automated observable tests cover address scenarios; synthetic evidence periods and unavailable states; deterministic templates; named-provider consent negatives; unauthorized operator access; withdrawal; unavailable provider; duplicate simulated dispatch; and deletion. Verify the running server serves the homeowner and operator screens on loopback. Inspect responsive layout, labels, keyboard navigation, and rendered failure states in a browser where available. Record exact results and any browser-verification limitations.

Update README with verified commands and sample scenarios, architecture with prototype boundaries, backlog with prototype progress distinct from live-feature readiness, PRD with the authorized local-testing scope once approved, and append evidence to worklog. Leave live source rights, expert review, real-contact policies, recovery, hosting, and launch decisions open.

## Approval boundary

The synthetic-data scope is approved. Approval of this prototype does not approve synthetic evidence for real homeowners, real contact collection, introductions, recruitment, or launch. No Git initialization or commit is proposed; this directory is currently not a Git repository.
