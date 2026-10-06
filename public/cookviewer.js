// Read-only feasibility queries. No cache, owner fields, contacts or interpretations.
export const COOKVIEWER_LAYER = 'https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0';
const endpoint = `${COOKVIEWER_LAYER}/query`;
const stringFields = ['PIN14', 'street_address', 'city_state_zip', 'township_name', 'BCLASS', 'class_description', 'current_value_desc', 'current_procname'];
const numberFields = ['TAXYR', 'NBHD', 'BLDGSQFT', 'BLDGAGE', 'LANDSF', 'CURRENTVALUE_TOTAL', 'CURRENTVALUE_LAND', 'CURRENTVALUE_BLDG', 'last_edited_date', 'latitude', 'longitude'];
const fields = [...stringFields, ...numberFields];
const limitation = 'Exploratory candidates are not expert-approved comparables. No discrepancy, correctness, savings or appeal conclusion is produced.';
function error(status, message) {
  const e = new Error(message);
  e.status = status;
  throw e;
}
function pin(value) {
  if (typeof value !== 'string') error(400, 'Enter a 14-digit Cook County PIN.');
  const normalized = value.replace(/[-\s]/g, '');
  if (!/^\d{14}$/.test(normalized)) error(400, 'Enter a 14-digit Cook County PIN; dashes are optional.');
  return normalized;
}
function sqlString(value) { return `'${value.replaceAll("'", "''")}'`; }
function normalize(attributes) {
  const record = {};
  for (const key of stringFields) record[key] = typeof attributes[key] === 'string' ? attributes[key] : null;
  for (const key of numberFields) record[key] = typeof attributes[key] === 'number' && Number.isFinite(attributes[key]) ? attributes[key] : null;
  if (!(record.latitude >= 41.4 && record.latitude <= 42.3 && record.longitude >= -88.3 && record.longitude <= -87.4)) {
    record.latitude = null; record.longitude = null;
  }
  return record;
}
const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const integer = value => Number.isInteger(value) && value >= 0;
export function createCookViewer({fetchImpl = fetch, now = Date.now} = {}) {
  let activeQueries = 0;
  const queryStarts = [];
  async function query(where, limit, signal, offset = 0) {
    signal?.throwIfAborted();
    if (activeQueries >= 2) error(429, 'Two source queries are already running. Please wait and try again.');
    while (queryStarts.length && queryStarts[0] <= now() - 60000) queryStarts.shift();
    if (queryStarts.length >= 60) error(429, 'The page source limit is reached. Try again in a minute.');
    const url = new URL(endpoint);
    url.search = new URLSearchParams({f: 'json', where, outFields: fields.join(','), returnGeometry: 'false', resultRecordCount: String(limit), orderByFields: 'PIN14', resultOffset: String(offset)});
    activeQueries++;
    queryStarts.push(now());
    try {
      const response = await fetchImpl(url, {mode: 'cors', credentials: 'omit', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000), redirect: 'error', headers: {Accept: 'application/json'}});
      if (!response.ok) error(502, 'CookViewer returned an HTTP error. No source data is available for this query.');
      const data = await response.json();
      signal?.throwIfAborted();
      if (data?.error) error(502, 'CookViewer rejected this query. No source conclusion can be drawn.');
      if (!data || !Array.isArray(data.features) || data.features.some(f => !f?.attributes || typeof f.attributes !== 'object' || Array.isArray(f.attributes))) error(502, 'CookViewer returned an unexpected response.');
      return {
        source: COOKVIEWER_LAYER,
        retrievedAt: new Date().toISOString(),
        truncated: data.exceededTransferLimit === true || data.features.length > limit,
        records: data.features.slice(0, limit).map(f => normalize(f.attributes))
      };
    } catch (e) {
      if (signal?.aborted) throw signal.reason;
      if (e.status) throw e;
      if (e.name === 'TimeoutError' || e.name === 'AbortError') error(504, 'CookViewer timed out. Try again later; no evidence conclusion can be drawn.');
      error(502, 'Could not read CookViewer. Check your internet connection or try again later.');
    } finally { activeQueries--; }
  }
  return {
    async lookup(input, {signal} = {}) {
      if (!input || typeof input !== 'object') error(400, 'Choose address or PIN lookup.');
      let where;
      if (input.type === 'pin') where = `PIN14 = ${sqlString(pin(input.value))}`;
      else if (input.type === 'address') {
        if (typeof input.value !== 'string') error(400, 'Enter the street address as recorded by the County.');
        const value = input.value.trim().replace(/\s+/g, ' ').toUpperCase();
        if (!value || value.length > 100 || !/^[\p{L}\p{N} .#'/-]+$/u.test(value)) error(400, 'Enter a street address of at most 100 characters without wildcard characters.');
        where = `UPPER(street_address) = ${sqlString(value)}`;
      } else error(400, 'Choose address or PIN lookup.');
      const result = await query(where, 10, signal);
      return {...result, state: result.records.length ? 'matches' : 'not-found', limitation};
    },
    async candidates(value, {signal, onProgress} = {}) {
      const id = pin(value);
      const subjectResult = await query(`PIN14 = ${sqlString(id)}`, 2, signal);
      if (!subjectResult.records.length) return {...subjectResult, state: 'not-found', limitation};
      if (subjectResult.records.length !== 1 || subjectResult.truncated) return {...subjectResult, state: 'ambiguous-subject', limitation};
      const subject = subjectResult.records[0];
      const required = ['township_name', 'BCLASS', 'NBHD', 'TAXYR', 'BLDGSQFT', 'current_procname', 'current_value_desc'];
      const missing = required.filter(key => key === 'BLDGSQFT' ? !positive(subject[key]) : ['NBHD', 'TAXYR'].includes(key) ? !integer(subject[key]) : !subject[key]?.trim());
      if (subject.PIN14 !== id) missing.push('PIN14');
      if (!positive(subject.CURRENTVALUE_TOTAL)) missing.push('CURRENTVALUE_TOTAL');
      if (missing.length) return {source: subjectResult.source, retrievedAt: subjectResult.retrievedAt, state: 'insufficient-fields', subject, records: [], missing, limitation};
      const low = Math.ceil(subject.BLDGSQFT * 0.8), high = Math.floor(subject.BLDGSQFT * 1.2);
      const where = [`PIN14 <> ${sqlString(id)}`, `township_name = ${sqlString(subject.township_name)}`, `NBHD = ${subject.NBHD}`, `BCLASS = ${sqlString(subject.BCLASS)}`, `TAXYR = ${subject.TAXYR}`, `current_procname = ${sqlString(subject.current_procname)}`, `current_value_desc = ${sqlString(subject.current_value_desc)}`, `BLDGSQFT BETWEEN ${low} AND ${high}`, 'CURRENTVALUE_TOTAL > 0'].join(' AND ');
      const seen = new Set([id]), records = [];
      let result, examined = 0, pages = 0;
      // Walk a value-independent, PIN-ordered sample; never retry for a desired outcome.
      for (let page = 0; page < 3; page++) {
        result = await query(where, 20, signal, page * 20);
        pages++;
        examined += result.records.length;
        for (const record of result.records) {
          if (!/^\d{14}$/.test(record.PIN14 || '') || seen.has(record.PIN14)) continue;
          if (['township_name', 'NBHD', 'BCLASS', 'TAXYR', 'current_procname', 'current_value_desc'].some(key => record[key] !== subject[key])) continue;
          if (!positive(record.BLDGSQFT) || record.BLDGSQFT < low || record.BLDGSQFT > high || !positive(record.CURRENTVALUE_TOTAL)) continue;
          seen.add(record.PIN14);
          records.push(record);
        }
        onProgress?.({pages, examined});
        signal?.throwIfAborted();
        if (!result.truncated) break;
      }
      records.sort((a, b) => {
        const lowerFirst = Number(b.CURRENTVALUE_TOTAL < subject.CURRENTVALUE_TOTAL) - Number(a.CURRENTVALUE_TOTAL < subject.CURRENTVALUE_TOTAL);
        return lowerFirst || Math.abs(a.BLDGSQFT - subject.BLDGSQFT) - Math.abs(b.BLDGSQFT - subject.BLDGSQFT)
          || a.CURRENTVALUE_TOTAL - b.CURRENTVALUE_TOTAL || a.PIN14.localeCompare(b.PIN14);
      });
      return {...result, records, subject, subjectRetrievedAt: subjectResult.retrievedAt, state: records.length ? 'candidates' : 'no-candidates', excludedCount: examined - records.length, search: {examined, pages, limit: 60, version: 'bounded-pool-1'}, filters: {class: subject.BCLASS, neighborhood: subject.NBHD, township: subject.township_name, year: subject.TAXYR, stage: subject.current_procname, valueLabel: subject.current_value_desc, buildingSizeMin: low, buildingSizeMax: high}, limitation};
    }
  };
}
