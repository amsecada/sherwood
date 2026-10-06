# CookViewer anonymous API probe

Research under TASK-001, FR-002–005, DEC-017. User requested baseline API functionality for the localhost prototype. Probe performed during 2026-10-05 America/New_York; evidence recorded at 2026-10-06T00:17:42Z. This is a small feasibility check, not representative coverage or an approved comparison method.

## Tested behavior

Six small read-only queries (five Node fetch calls and one curl command) to the selected [parcel endpoint](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0/query) succeeded with HTTP 200 and feature records. No API key, login, token or payment was used. Requested property fields only, with geometry disabled; no owner contacts or imagery.

1. A filtered single-record query found PIN `01011000250000`, `202 W STATION ST`, Barrington. Returned `TAXYR=2026`, `BCLASS=203`, `NBHD=12`, `BLDGSQFT=1248`, `CURRENTVALUE_TOTAL=37000`, `current_value_desc=2026 Assessor Valuation`, and `current_procname=CCAOVALUE`. `class_description` was null. The source row's `last_edited_date` converts to `2026-08-12T14:58:24.000Z`; that is an edit timestamp, not an established assessment effective date.
2. Exact case-normalized address filtering returned the same PIN.
3. A query excluding that PIN and matching township, class, neighborhood, tax year and valuation label/stage, with building size between 998 and 1498 square feet, returned five candidates. This approximately ±20% size filter is exploratory, not an approved matching rule. Candidate ages varied; this filter alone does not establish comparable suitability.
4. The same query with `resultOffset=5` and `resultRecordCount=2` returned two additional distinct PINs. `exceededTransferLimit=true` signaled more records beyond the requested page; it is not a completeness guarantee or a rate-limit allowance.

5. The exact curl reproduction below returned the same parcel and tax year.
6. Direct `PIN14` lookup returned the same address, year and source value.

Initial sandbox fetch failed with `EAI_AGAIN`. The same request outside the network-restricted sandbox succeeded. This was an execution-environment restriction, not evidence that the County API was unavailable.

## Reproduce a baseline query

Run this read-only command in a terminal with network access. It retrieves a maximum of five matches for the demonstrated exact street address; it does not calculate a discrepancy or contact anyone.

```bash
curl --get --max-time 20 \
  'https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0/query' \
  --data-urlencode 'f=json' \
  --data-urlencode "where=UPPER(street_address) = '202 W STATION ST'" \
  --data-urlencode 'outFields=PIN14,street_address,township_name,TAXYR,BCLASS,NBHD,BLDGSQFT,CURRENTVALUE_TOTAL,current_value_desc,current_procname,last_edited_date' \
  --data-urlencode 'returnGeometry=false' \
  --data-urlencode 'resultRecordCount=5' \
  --data-urlencode 'orderByFields=PIN14'
```

The exact curl invocation was executed successfully, returning one match with PIN `01011000250000` and tax year 2026. A direct PIN lookup using `where=PIN14 = '01011000250000'` also succeeded.

## Source evidence and rights boundary

The [layer directory](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0) advertises JSON, pagination and a 2,000-record maximum. The maximum is a response-size capability, not documented requests per second. Layer copyright text is empty; that alone grants no rights.

The County's [GIS policy announcement](https://www.cookcountyil.gov/news/county-eliminates-charge-gis-data) describes free noncommercial educational/research use and commercial use when compiled with other data. This supports a limited local research probe; it does not establish unrestricted commercial reuse of every field. [Current website terms](https://www.cookcountyil.gov/terms-use) disclaim data accuracy/continuity and County endorsement. No reproduction of imagery was attempted.

Still open: representative residential coverage, exact assessment concept/stage/finality, effective dates, freshness, operational limits, applicable storage/display/professional-sharing rights for live product use, and expert-reviewed comparison rules. Do not multiply values by an assessment ratio or relabel this field as market/taxable value without source validation.

## Approved bounded prototype addition

The user approved and received a separate live lookup page in the existing Node app: address/PIN lookup, explicit ambiguous selection, source field/date inspection, and an optional query for at most five exploratory candidates. No discrepancy conclusion, synthetic fallback, persistent source cache, contact request or provider sharing. Keep the synthetic four-step demo available for workflow testing. Address, formatted PIN and a five-candidate query subsequently passed smoke verification through the actual localhost app. See README for `/live` usage. TASK-001 remains in progress because representative coverage, source semantics/rights/limits and expert method are unresolved.
