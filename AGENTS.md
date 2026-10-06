# Agent Contract

## Mission and authority

Build only authorized backlog work for Project Sherwood’s four-step property-assessment comparison tool (PRD DEC-012–023). The project has one locally implemented CookViewer gallery at / and /live; /demo redirects to it and synthetic visitor endpoints are retired (FEAT-008/009, FEAT-011–015): descriptive summary, approximate linked map and fictional handoff. FEAT-010 remains blocked pending the separate user design discussion. Descriptive arithmetic and approved median-based message bands (DEC-023) are approved for this local table; do not implement assessment conclusions, expert-comparable qualification, persistent source use or real-contact behavior until applicable item gates and authorization are resolved. The approved gallery design permits bounded transient server evidence and simulated request memory only, County coordinate fields and OpenStreetMap raster context. No real message/filing or durable source store. Public deployment/source-use gates remain open; render.yaml is preparation only. See the PRD and approved gallery design.

Precedence: latest explicit user instruction → accepted PRD/architecture decisions → AGENTS.md → ready backlog item → existing implementation/tests → assumptions. Stop and ask if higher-authority sources conflict.

Read [README](README.md), relevant [PRD](docs/PRD.md), [architecture](docs/ARCHITECTURE.md) and [backlog](docs/BACKLOG.md) before work. Name the item and linked requirements. Inspect relevant code/tests when they exist. Product facts are canonical in the PRD; technical design in architecture; work criteria in backlog. Never silently invent a missing decision.

## Repository map and commands

README.md: front door. docs/PRD.md: product. docs/BACKLOG.md: execution. docs/ARCHITECTURE.md: technical design. worklog.md: evidence.

Local prototype commands: `npm start`, `npm test`, `npm run check`, `npm run operator-token`; see README and package.json. Node 22+, built-in modules, plain HTML/CSS/JavaScript in public/, logic in src/, tests in test/. No product dependencies. Syntax checks and a free Render Blueprint are configured; no actual deployment, production rollback or live infrastructure has been provisioned. Verify commands from actual configuration; do not mark a test passed when it was not run.

## Workflow

1. Confirm authorized scope, item status, dependencies and unresolved gates.
2. Inspect existing artifacts and applicable implementation. Keep IDs permanent; deprecate/supersede removed items with replacement links.
3. Implement or research only the authorized slice. Stay within scope; no unsolicited infrastructure or external messaging.
4. Test observable behavior with appropriate fixtures and failure cases. Use no real introductions, production writes or paid calls unless explicitly authorized.
5. Update affected canonical docs, traceability and append-only worklog. Record exact pass/fail/not-run results, limitations and known references.
6. Mark done only after acceptance criteria and Definition of Done are verified. Otherwise leave proposed, blocked or in progress as warranted.

## Product and security boundaries

Cook County is the approved initial market, using the free/public CookViewer parcel API through direct queries (DEC-017). Validate anonymous querying, coverage, limits, and reuse terms under TASK-001; do not claim that selection proves access or rights. Dallas County, Miami-Dade, and other regions are deferred until Cook County success and explicit expansion authorization (DEC-018). Do not build other-region adapters or replace the API with page scraping or paid data by default.

V0 is address → assessment comparison → plain-language template explanation → optional chosen-professional contact. No email or account is required to view the comparison. Operators review introductions before sharing. Scores, savings estimates, paid data, AI explanations, automatic lead billing, and structured appeal outcomes are deferred; never restore them as implicit implementation or launch gates.

No representation, filing or advice guarantees. Preserve unavailable states; no invented discrepancies, deadlines or source data. Any imported/cached observations require rights, freshness and subject-specific comparability checks. Keep contacts separate from property evidence.

Protect credentials and PII. No secrets in artifacts, commits, logs or prompts. Enforce named-provider consent and current eligibility before sharing. No multiple-provider resale or provider outreach without authorization. Do not assume SSO supplies a phone number or establishes property ownership.

## Git and stop conditions

Inspect Git status when a repository exists; protect unrelated work. Do not claim commits, branches, PRs or pushes unless completed. No destructive Git operation, force push or migration without explicit authorization. Git initialization, integration target and branch conventions TBD.

Stop for ambiguous behavior, conflicting authoritative sources, destructive migration, material scope expansion, unavailable data rights or unresolved release gates relevant to the current item. Research may identify options without choosing unapproved technologies or commercial terms. Do not disguise open decisions as defaults.

## Definition of Done

Observable acceptance criteria met; linked requirements covered; relevant tests/reviews actually performed; failures/limitations recorded; security and data rights honored; no scope drift or secrets; affected docs and worklog updated; traceability audit passes or explicitly reports remaining TBDs. A research item is done on verified deliverable completion, not because its recommendation has been adopted. A feature is not ready merely because this specification exists.

Latest gallery override (DEC-026): operator UI/API/token setup retired at user request; preserve visitor Withdraw/Delete. Direct-browser feasibility page approved and locally verified. Do not reintroduce operator behavior based on historical prototype instructions. Main workflow remains server-backed until static conversion is authorized/implemented.

Current runtime override: the user authorized static conversion and GitHub repository setup/push. npm start builds and serves static dist; browser CookViewer and page-memory simulation replace application API calls. Historical Node code is excluded from deployment. Pages workflow checks every main push/PR and deploys only on manual dispatch after checks. Do not restore backend/operator behavior from older instructions.

No-build override (DEC-027): public/ now contains the complete deployable site including index.html. Do not restore an npm build requirement. npm scripts are development checks or optional preview only; Pages publishes public/.
