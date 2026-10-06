# Project Sherwood — Product Requirements

Status: gallery FEAT-008/009 implemented locally 2026-10-06; FEAT-010 blocked; four-step V0 and Cook County/API focus approved 2026-10-05; localhost synthetic workflow and read-only live API lookup approved; live comparison/contact and launch gates remain open. This revision supersedes the broader blueprint from earlier the same day. Existing IDs remain permanent; deferred requirements are retained below.

## Authorized local testing scope

On 2026-10-05 the user requested a Node prototype runnable on localhost, then approved the [synthetic-data design](superpowers/specs/2026-10-05-local-prototype-design.md) and [implementation plan](superpowers/plans/2026-10-05-local-prototype.md). This permits demonstration versions of FEAT-001–006 using authored fictional evidence, fictional professionals, test contacts and simulated operator actions. It does not resolve TASK-001–004 for live use or authorize source substitutions, real homeowner evidence, introductions, recruitment, hosting or launch. Existing DEC-012–018 remain unchanged.

The user subsequently approved a bounded live CookViewer lookup addition: address/PIN search, raw source fields/dates and up to five exploratory candidates. It is implemented for local feasibility testing under TASK-001 and demonstration portions of FEAT-001–002/FR-002–004. The exploratory ±20% building-size filter is a visible test setting, not TASK-002 methodology approval. No live discrepancy explanation, persistent source cache or real-contact payload is authorized. Research evidence is in the [API probe](research/2026-10-05-cookviewer-api-probe.md); live feature/release gates remain open.

The user then approved descriptive candidate deltas and hover/focus/tap details in the local live table (prototype FEAT-003–004, FR-007/FR-017 and NFR-006). Arithmetic uses candidate minus freshly fetched subject with subject-denominator percentages; green lower/red higher/neutral equal convey direction only. Size/age deltas and existing-field detail comparisons are included. Missingness, zero denominators and incompatible source periods/concepts remain unavailable where appropriate. This is not expert-method approval or a discrepancy/appeal conclusion; all live release gates remain open.

## Requested gallery demonstration — 2026-10-06

The user requests backlog preparation for a unified **live-feed demo** intended for a free Render web app: Cook County address → actual CookViewer candidates → rough descriptive analysis → simulated complaint handoff to a fictional organization. This replaces the earlier recommendation to publish only the synthetic flow. FEAT-008 is explicitly P1. The user also requests a linked location map with radar effects (FEAT-009), and a visual redesign explicitly blocked pending a separate discussion (FEAT-010).

This is implemented local demo scope, not a production assessment/advice or real complaint service. “Rough analysis” is scoped in the handoff to a deterministic explanation of compatible displayed differences; an expert judgment, causal influence model or appeal recommendation remains outside this exception. The approved map uses approximate County latitude/longitude, OpenStreetMap streets, and rings/connections to illustrate the selected comparison, without a quantitative influence model. Live property evidence and fictional organization/actions must be distinguished. No messages or filings are sent; real contact collection, durable source/request storage and paid services remain excluded. A bounded transient live-demo summary for simulated review is now implemented, extending the prior local no-live-payload boundary. Snapshots expire after 15 minutes; simulated requests after 60 minutes; both are capped at 200 and disappear on restart.

The initial request authorized backlog preparation. The user subsequently approved the gallery design and native implementation plan; FEAT-008/009 are now implemented locally. The user explicitly kept FEAT-010 blocked for a separate design discussion. Public deployment is not performed. The [gallery handoff](BACKLOG.md#gallery-demo-handoff--requested-2026-10-06) defines development and public-release prerequisites separately. Public source-use validation and hosted configuration remain applicable; real-provider onboarding and the full pilot are not prerequisites for a fictional handoff demo. Existing production requirements and decisions retain their scope.

## Product and purpose

A free tool that helps homeowners understand whether their residential assessment appears out of line with similar properties, then optionally request contact with a professional they choose.

The pilot tests two questions: does a clear, credible comparison help homeowners, and do professionals value the resulting voluntary contact requests? Demand, comparison validity, and provider willingness to pay remain unverified.

## The four-step journey

1. **Address.** Enter an address; confirm a parcel only when the match is ambiguous. Clearly identify unsupported or unresolved properties.
2. **Comparison.** Show the subject assessment and a handful of defensibly similar properties, with relevant characteristics, assessment periods, sources, and dates.
3. **Explanation.** Use reviewed plain-language templates to explain an apparent discrepancy, no apparent discrepancy in the available evidence, or insufficient evidence. Do not imply that no discrepancy proves the assessment is correct.
4. **Optional contact.** Show available participating professionals for the property. The homeowner selects one, supplies contact details, and explicitly permits sharing. An operator reviews the request before making the introduction.

Email and an account are not prerequisites for steps 1–3. Step 4 is optional and never triggered by viewing results. Show a request acknowledgment; it is not a promise that an introduction has already occurred.

## Scope and boundaries

V0 serves **Cook County, Illinois**, using the free/public CookViewer parcel API as the primary source (DEC-017). The exact eligible residential classes and any narrower township-level pilot boundary remain open under TASK-002; selecting the county does not promise coverage of every parcel.

Dallas County, Miami-Dade, and all other regions are deferred until Cook County succeeds (DEC-018). Success should demonstrate useful and credible comparisons, voluntary homeowner requests, professional value, and manageable operator time and cost. TASK-004 defines measurable pilot targets before launch; expansion requires reviewing those results and explicit authorization. No parallel region studies or multi-county platform is required for V0.

Use permitted public data, a local-expert-reviewed comparison method, template explanations, manually maintained provider information, and manually reviewed introductions. A simple import or cache is allowed when necessary and permitted; a regional intelligence platform is not a V0 deliverable.

Deferred: dollar savings estimates, automated LOW/MEDIUM/HIGH qualification, paid data, AI explanations, automatic lead billing, formal appeal-outcome analytics, notice upload, saved-report accounts, customer dashboards, social login, provider accounts, maps beyond matching except the requested gallery map under DEC-020, and multi-jurisdiction coverage.

Outside scope: representation, filing or government form generation, full case preparation, provider auctions, multiple-provider resale, CRM integrations, native apps, predictive success probabilities, and automatic jurisdiction onboarding.

Provider-paid introductions remain a business hypothesis. V0 has no billing feature or score-based billable-lead contract. Any actual charges require separately reviewed and agreed commercial terms; scope approval authorizes neither charges nor provider outreach.

## Goals

| ID | Current goal | Pilot evidence |
|---|---|---|
| G-01 | Useful free comparison | Evidence-sufficient comparisons / eligible resolved requests; distinguish unavailable data from technical failures |
| G-02 | Intentional professional contact | Voluntary requests / usable comparisons; reviewed and delivered requests / consented requests |
| G-03 | Learn professional value and operating viability | Manually obtained feedback plus operator time per usable comparison/introduction; unknown feedback remains unknown; pricing validation later |
| G-04 | Defensible comparisons | Agreement with local expert review and reproducibility of displayed facts |
| G-05 | Regional reuse economics — deferred | No reuse-rate target or network-effect claim in V0; see DEC-013 |

The [MVP delivery and pilot plan](BACKLOG.md#the-smallest-useful-mvp) groups the active features into a comparison slice and a contact slice, followed by manual validation under TASK-006. Pilot sample sizes and success signals in that plan are proposals for TASK-004 review; they do not add homeowner steps or a structured outcome subsystem.

Numerical business targets from the research discussion are proposals only. Pilot measurement and operating targets remain TASK-004 decisions. The earlier “60 seconds” promise is not approved public copy for this V0; measure performance before making a timing claim.

## Functional requirements

Revised rows retain their original subject and ID. Deferred rows are not acceptance gates for V0.

| ID | Status and observable requirement | Verification / work |
|---|---|---|
| FR-001 | Active, revised: address-only intake; distinguish unsupported, unresolved, and ambiguous matches; confirm ambiguous parcel; no contact collection required for results | Address fixtures; FEAT-001 |
| FR-002 | Active: resolve Cook County parcels to jurisdiction-scoped IDs; identify source fields, dates, and missingness; other counties are unsupported in V0 | Source fixtures; FEAT-001 |
| FR-003 | Active, revised: use direct queries to the selected CookViewer public parcel API; permitted Cook County open datasets may supplement missing fields; preserve source and effective/retrieval dates; no paid fallback or website-scraping dependency | Source checks; FEAT-002 |
| FR-004 | Active, narrowed: any imported/cached evidence must have permitted use, compatible assessment period, and approved freshness; refresh cannot silently change an earlier retained comparison | Freshness/rights fixtures; FEAT-002 |
| FR-005 | Active: select similar properties using approved local characteristics and assessment period; record inclusion/exclusion rationale; insufficient evidence is explicit | Expert-reviewed cases; FEAT-003 |
| FR-006 | Deferred: LOW/MEDIUM/HIGH score and automated qualification. V0 replacement: explanatory comparison under FR-017 and DEC-014 | No V0 implementation |
| FR-007 | Active, narrowed: display subject and comparable assessments, relevant characteristics, sources, periods, and dates; describe supported differences; no tax-savings estimate, score, or required historic dashboard | Display fixtures; FEAT-004 |
| FR-008 | Deferred: AI explanation. Replaced in V0 by FR-017 and DEC-014 | No model integration |
| FR-009 | Active: homeowner chooses an active eligible participating professional serving the property; use factual profiles and applicable commercial disclosure; no-provider state shares nothing | Provider filtering cases; FEAT-005 |
| FR-010 | Active, revised: after selection collect necessary contact details and affirmative consent to the named provider and stated payload; preserve wording/version/time; exact fields and contact validation set in TASK-003 | Consent negatives; FEAT-005 |
| FR-011 | Active, revised: operator reviews and rechecks consent, provider availability, and permitted payload before introduction; track pending/sent/failed/withdrawn status and prevent accidental duplicate sharing; no billing automation | Manual process walkthrough; FEAT-006 |
| FR-012 | Deferred: score-based billable qualification and billing/credit ledger. V0 contact process is FR-010–011; see DEC-015 | No V0 billing feature |
| FR-013 | Active, narrowed: maintain provider territory, eligibility evidence, active status, contact route, and applicable agreed terms using protected operator access; no pricing engine or score threshold required | Access/configuration checks; FEAT-005 |
| FR-014 | Deferred: structured conversion, appeal-result, and actual-savings tracking. Basic request status remains FR-011; see DEC-015 | FEAT-007 deferred |
| FR-015 | Active, narrowed: protect private requests; define contact retention/deletion and sharing withdrawal; viewing a comparison is not marketing permission; no saved-report account required | Access/lifecycle scenarios; FEAT-005–006, TASK-003–004 |
| FR-016 | Active, revised: distinguish insufficient evidence from an evidence-supported comparison with no apparent discrepancy; no savings, correctness, or appeal-outcome guarantee | Failure fixtures; FEAT-003–004 |
| FR-017 | Active, new: reviewed templates explain only displayed comparison facts and limitations; comparison calculations and interpretation are deterministic and versioned; no AI or opportunity score | Template and replay cases; FEAT-003–004 |
| FR-018 | Requested gallery-only: unified real CookViewer lookup, descriptive rough analysis and explicit simulated handoff to a fictional organization; transient state, no actual contact or filing | FEAT-008; DEC-019 |
| FR-019 | Requested gallery-only: approximate source-backed property map before the candidate table, linked marker/row highlighting and accessible radar-style relationship effect; no invented influence model | FEAT-009; DEC-020 |
| FR-020 | Requested gallery-only, blocked: coherent visual redesign after a separate user design discussion and approval | FEAT-010; DEC-021 |

## Quality requirements

| ID | V0 boundary | Work |
|---|---|---|
| NFR-001 | Measure comparison latency and failures; set modest pilot capacity/availability targets before launch; no unverified speed claim | TASK-004–005 |
| NFR-002 | Retain permitted provenance, evidence snapshot, and method/template version sufficient to reproduce comparisons; lifecycle policy determines retention | FEAT-002–004 |
| NFR-003 | Protect contact requests and operator access; least privilege, encrypted transport/storage, server-side secrets, and no unnecessary contact data in logs | TASK-004–005, FEAT-005–006 |
| NFR-004 | Stale, incompatible, missing, or failed source data cannot silently become a supported comparison | FEAT-002–004 |
| NFR-005 | Approve hosting/service budget and usage limits before paid operation; paid data and model calls are absent from V0 | TASK-004–005 |
| NFR-006 | Responsive, keyboard-usable, labeled forms/results with clear errors; exact accessibility/browser target set in TASK-004 | FEAT-001, FEAT-004–005, TASK-005 |
| NFR-007 | Record consent, operator review, provider status, and dispatch changes without putting contacts into general analytics | FEAT-005–006 |
| NFR-008 | Verify recovery and request reconciliation before real contact data; restoring records must not repeat introductions | TASK-004–005 |

## Data and contact rules

Address is a lookup attribute, not a unique property key. Use jurisdiction plus parcel ID. Compare like assessment concepts and compatible valuation periods; do not mix assessed, market, or taxable values. Nearby properties are not automatically similar. A difference is evidence for investigation, not proof of overassessment.

Source endpoint, published capabilities, and research limitations are recorded in the [architecture source contract](ARCHITECTURE.md#cook-county-data-source). Free/public access is the selected approach, not a guarantee of unlimited requests or permanent service availability.

Public availability does not establish commercial reuse rights. Confirm retrieval, storage, comparison display, and any professional-sharing rights. Keep property observations separate from contact records. Do not import public owner contact details as prospects.

A contact request may share only the homeowner-authorized contact fields, parcel, and permitted comparison summary with the selected provider. No automatic dispatch or resale. Withdrawal before dispatch blocks sharing. Explain the limits of withdrawal after information has already been sent.

TASK-003 must settle eligible requesters, minimum contact validation, provider/category rules, exact payload, retention, deletion, and handling of provider copies. No automatic marketing or unsupported-area demand capture. TASK-004 must select a secure request-handling mechanism; a public case identifier must not expose contact details.

## Constraints

- CON-001: Residential, Cook County only in V0; other regions follow validated Cook County success and separate authorization; no representation or filing.
- CON-002: Free homeowner comparison; provider monetization remains a hypothesis, with billing deferred.
- CON-003: No consumer login; protected operator access is still required.
- CON-004: Node with built-in modules and a plain browser frontend is selected for the local synthetic prototype only; hosting, live store/access setup, budget, team, and delivery date remain unselected. The prior recommendation list was not accepted wholesale.
- CON-005: Required data rights, professional rules, and sharing consent must be honored before use and handoff.

## Decisions

The user approved the simplified four-step process, then explicitly selected Cook County and its free/public API on 2026-10-05, with other regions deferred until Cook County succeeds. The original product/data approvals updated specifications; the later local prototype approval is bounded by the authorized local testing scope above. Selection is a product decision, not a claim that API integration or reuse rights have been verified.

| ID | Decision / disposition |
|---|---|
| DEC-001 | Residential only — retained |
| DEC-002 | Free consumer analysis — retained as free comparison |
| DEC-003 | Qualified-lead monetization — deferred business hypothesis; V0 governed by [DEC-015](#decisions) |
| DEC-004 | Negotiated manual pricing — retained only for any separately authorized commercial trial; not a V0 software dependency |
| DEC-005 | Homeowner chooses provider — retained |
| DEC-006 | Specific consent before sharing — retained |
| DEC-007 | Deterministic score/AI explanation — superseded for V0 by [DEC-014](#decisions) |
| DEC-008 | Public preferred/paid fallback — superseded for V0 by [DEC-013](#decisions) |
| DEC-009 | Regional reuse — reduced to optional permitted caching under [DEC-013](#decisions); dedicated reuse platform deferred |
| DEC-010 | One initial jurisdiction — retained; Cook County selected by [DEC-017](#decisions) |
| DEC-011 | Provider feedback/outcomes — narrowed to basic request tracking and manual learning under [DEC-015](#decisions); structured appeal outcomes deferred |
| DEC-012 | V0 is address → comparison → plain-language explanation → optional chosen-professional contact |
| DEC-013 | Public data only; minimal permitted imports/caching as needed; no paid fallback or regional-platform deliverable |
| DEC-014 | Expert-reviewed comparison method and deterministic templates; no scores, dollar savings estimates, or AI explanations in V0 |
| DEC-015 | Operator-reviewed introductions; no automatic dispatch or lead billing; detailed outcome subsystem deferred |
| DEC-016 | Address-only screening; contact details collected only when help is requested; no required consumer account or dashboard |
| DEC-017 | Cook County, Illinois is the initial market; its free/public CookViewer parcel API is the primary source, using direct data queries. API access, coverage, and reuse validation remain TASK-001 work |
| DEC-018 | Dallas County, Miami-Dade, and other regions are deferred until demonstrated Cook County success and a separately authorized expansion decision |
| DEC-019 | 2026-10-06: request P1 backlog handoff for a merged live-feed gallery journey with rough descriptive analysis and fictional complaint handoff. Actual messaging/filing, real contacts and durable storage remain excluded; implementation/public release are not performed by this documentation request |
| DEC-020 | 2026-10-06: request a gallery map above the table showing approximate subject/candidate locations, linked hover highlighting and radar-style relationships. This narrowly supersedes map deferral for the gallery; coordinate source and effect meaning must be resolved without inventing valuation influence |
| DEC-021 | 2026-10-06: request aesthetic improvement as a separate feature, explicitly blocked until user design discussion and approval |

## Gallery feedback decisions — 2026-10-06

DEC-022 (approved and implemented locally): one visitor-facing live experience reuses Sherwood's existing branding and four numbered steps; retire the synthetic visitor workflow. Move collapsed raw source inspection to the page bottom, remove the duplicate property-button list while keeping map/table interaction, and remove the expert-approved-comparables sentence from the rough analysis. FR-021 covers these presentation changes, delivered by FEAT-011–014. This supersedes conflicting presentation details in the original gallery criteria; it does not unblock FEAT-010's broader visual redesign.

DEC-023 (approved 2026-10-06): the user requests preconfigured disparity thresholds and progressively enthusiastic summary messages. FR-022 tracks this under FEAT-015. The user approved the median of all compatible displayed candidate totals, a minimum of three usable records and a positive median, and gap `(subject − median) / median × 100`. Bands are ≤0%, >0 to <5%, ≥5 to <15%, and ≥15%, with the exact messages in FEAT-015. Missing or unsuitable samples retain factual counts without a band. Method/template version is `live-median-2`. This does not authorize real filings, savings predictions or success guarantees.

DEC-024 (approved and implemented locally, 2026-10-06): the user is otherwise happy with the local build and requests three map presentation follow-ups under FR-019: compact play/pause toggle below the map (FEAT-016), existing street-background checkbox below the map (FEAT-017), and legend below the map (FEAT-018). No new Street View service is requested. The user subsequently authorized these fixes; local implementation is complete. Public release remains separate. FEAT-010 remains blocked.

## Assumptions and risks

ASM-001 public data is usable with appropriate rights; ASM-002 professionals will value/pay for requests; ASM-003 a local expert can validate comparisons; ASM-004 regional reuse improves economics (deferred); ASM-005 homeowners voluntarily request help. All remain unverified; original score/savings and reuse hypotheses are not V0 gates.

| Risk | Current handling |
|---|---|
| RISK-001 invalid comparables | Local method and reviewed examples; TASK-002 |
| RISK-002 data variability | Verify selected source, fields, and joins; TASK-001 |
| RISK-003 false savings precision | Savings estimates excluded by DEC-014 |
| RISK-004 unexpected sharing | Chosen provider, clear disclosure, consent; TASK-003 |
| RISK-005 professional/referral restrictions | Review selected provider category and flow; TASK-003 |
| RISK-006 stale data | Source/period-specific freshness; TASK-002 |
| RISK-007 fraud/duplicates/disputes | Minimal contact checks and operator review; billing disputes deferred |
| RISK-008 AI unsupported claims | No AI explanation under DEC-014 |
| RISK-009 closed appeal windows | Operator confirms provider can help; no invented deadlines or filing promises |
| RISK-010 reuse restrictions | Source rights checked before storing/displaying/sharing; TASK-001–003 |
| RISK-011 outcome bias | No success claims inferred from silence; formal outcomes deferred |

## Decision register

Preserve every original TBD ID. Deferred items do not block the four-step V0.

| ID | Disposition |
|---|---|
| TBD-001 jurisdiction | Resolved: Cook County selected under DEC-017. TASK-001 remains in progress for API feasibility and rights validation; region expansion deferred under DEC-018 |
| TBD-002 comparison method | Open; expert-reviewed method and minimum evidence; TASK-002 |
| TBD-003 score thresholds | Deferred under DEC-014 |
| TBD-004 paid fallback | Deferred under DEC-013 |
| TBD-005 savings method | Deferred under DEC-014 |
| TBD-006 freshness | Open, limited to sources used by V0; TASK-002 |
| TBD-007 lead pricing | Deferred from software scope; separate terms before any authorized charges |
| TBD-008 privacy/legal/eligibility/retention | Open, narrowed to comparison use and manual contact requests; TASK-003 |
| TBD-009 name | Project Sherwood internally; public name deferred until launch preparation |
| TBD-010 stack/hosting/auth | Open, minimal comparison and private request handling only; TASK-004 |
| TBD-011 budget/team/timeline/load | Open, scaled to the small pilot; TASK-004 |
| TBD-012 targets/accessibility/browsers | Open, scoped to four-step journeys; TASK-004 |
| TBD-013 delivery/duplicates/credits | Manual introduction process open in TASK-003; automatic retries and billing credits deferred |
| TBD-014 upload | Explicitly deferred from V0 under DEC-012–016 |

## Remaining gates

Before implementing relevant features: validate the selected Cook County source, approve the comparison method, settle the minimal contact/privacy process, and select the technical setup. Feature implementation still needs explicit scope authorization.

Before a live pilot: verify supported/failure journeys, data rights, expert examples, provider participation, consent/access/deletion, practical performance/cost, and recovery. Deferred AI, savings, scoring, billing, and outcome work is not required. No provider outreach, paid calls, or launch is authorized by this document revision.

DEC-025: user subsequently requests removal of the map playback button, superseding FEAT-016's presentation. Keep the checkbox/legend below the map and CSS reduced-motion support. Static-hosting feasibility was asked about; no hosting migration authorized.

DEC-026: user authorizes a small direct-browser CookViewer probe and removal of the gallery operator portion while preserving visitor Withdraw/Delete. Local CORS probe succeeded. Gallery operator pages/routes/credentials are retired; production pilot requirements remain historical/future scope. No full static migration yet.
