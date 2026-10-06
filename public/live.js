import {createCookViewer} from './cookviewer.js';
import {summarizeCandidates} from './live-metrics.js';
const reader = createCookViewer();
import {candidateMetrics, formatDelta} from './live-metrics.js';
import {wireDetails} from './live-details.js';
import {mountHandoff} from './live-handoff.js';
import {mountPropertyMap} from './property-map.js';
const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('en-US');
let selectedPin, busy = false, generation = 0, controller, propertyMap;
const handoff = mountHandoff($('handoff'));
function node(tag, text, className) {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (className) n.className = className;
  return n;
}
function status(text, error = false) {
  $('live-status').textContent = text;
  $('live-status').classList.toggle('error', error);
}
function setBusy(value) {
  busy = value;
  for (const id of ['lookup-submit', 'sample-pin', 'lookup-type', 'lookup-value', 'candidates-button']) $(id).disabled = value;
  for (const b of $('match-list').querySelectorAll('button')) b.disabled = value;
  $('live-form').setAttribute('aria-busy', String(value));
}
function display(value) { return value === null || value === undefined || value === '' ? 'Unavailable' : String(value); }
function date(value) {
  if (value === null || value === undefined || value === '') return 'Unavailable';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Unavailable' : d.toISOString();
}
function clearResults() {
  propertyMap?.destroy(); propertyMap = undefined;
  selectedPin = undefined;
  handoff.clearEvidence(); $('analysis').hidden = true;
  for (const id of ['matches', 'parcel', 'candidate-results', 'raw-source']) $(id).hidden = true;
  for (const id of ['match-list', 'field-rows', 'provenance', 'candidate-content']) $(id).replaceChildren();
}
function showParcel(record, result) {
  selectedPin = /^\d{14}$/.test(record.PIN14 || '') ? record.PIN14 : undefined;
  $('parcel').hidden = false;
  $('raw-source').hidden = false; $('raw-source').open = false;
  $('parcel-heading').textContent = record.street_address || 'Address unavailable';
  $('source-value').textContent = record.CURRENTVALUE_TOTAL === null ? 'Unavailable' : number.format(record.CURRENTVALUE_TOTAL);
  $('source-value-label').textContent = record.current_value_desc || 'Valuation label unavailable';
  $('provenance').replaceChildren();
  const link = node('a', 'CookViewer parcel layer ↗');
  link.href = result.source;
  link.target = '_blank';
  link.rel = 'noreferrer';
  $('provenance').append(link, node('p', `Retrieved: ${date(result.retrievedAt)}`, 'help'), node('p', `Tax year (TAXYR): ${display(record.TAXYR)}`, 'help'), node('p', `Source stage: ${display(record.current_procname)}`, 'help'), node('p', `Source edit timestamp: ${date(record.last_edited_date)}`, 'help'));
  $('field-rows').replaceChildren();
  for (const [key, value] of Object.entries(record)) {
    const row = node('tr');
    row.append(node('td', key), node('td', key === 'last_edited_date' ? `${display(value)}${value === null ? '' : ` (${date(value)})`}` : display(value)));
    $('field-rows').append(row);
  }
  $('candidates-button').disabled = !selectedPin;
}
function rawNumber(value, suffix = '') {
  return typeof value === 'number' && Number.isFinite(value) ? `${new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(value)}${suffix}` : 'Unavailable';
}
function deltaCell(value) {
  const text = formatDelta(value);
  const cell = node('td', undefined, `value-delta delta-${text.tone}`);
  cell.append(node('strong', text.amount), node('small', text.percentage));
  return cell;
}
function attributeCell(value, delta, unit) {
  const cell = node('td', rawNumber(value, ` ${unit}`));
  const direction = delta?.direction === 'higher' ? (unit === 'years' ? 'older' : 'larger') : delta?.direction === 'lower' ? (unit === 'years' ? 'younger' : 'smaller') : 'equal';
  const signed = delta ? `${delta.amount > 0 ? '+' : delta.amount < 0 ? '−' : ''}${rawNumber(Math.abs(delta.amount))}` : '';
  cell.append(node('small', delta ? `Δ ${signed} ${unit} (${direction})` : 'Δ unavailable'));
  return cell;
}
function candidateDetails(candidate, subject, result, metrics) {
  const details = node('details', undefined, 'candidate-details');
  const summary = node('summary', `Details · ${candidate.street_address || candidate.PIN14}`);
  summary.setAttribute('aria-label', `Details for ${candidate.street_address || candidate.PIN14}`);
  const panel = node('div', undefined, 'candidate-detail-panel');
  panel.append(node('p', 'Subject → candidate', 'eyebrow'));
  const facts = node('dl', undefined, 'detail-facts');
  const add = (label, subjectValue, candidateValue) => {
    const item = node('div');
    item.append(node('dt', label), node('dd', `${display(subjectValue)} → ${display(candidateValue)}`));
    facts.append(item);
  };
  add('Building size (sq ft)', rawNumber(subject.BLDGSQFT), rawNumber(candidate.BLDGSQFT));
  add('Age (years)', rawNumber(subject.BLDGAGE), rawNumber(candidate.BLDGAGE));
  add('Land value component', rawNumber(subject.CURRENTVALUE_LAND), rawNumber(candidate.CURRENTVALUE_LAND));
  add('Building value component', rawNumber(subject.CURRENTVALUE_BLDG), rawNumber(candidate.CURRENTVALUE_BLDG));
  add('Lot size (sq ft)', rawNumber(subject.LANDSF), rawNumber(candidate.LANDSF));
  add('County total / building sq ft', rawNumber(metrics.subjectValuePerSqFt), rawNumber(metrics.candidateValuePerSqFt));
  add('Class', subject.BCLASS, candidate.BCLASS);
  add('Class description', subject.class_description, candidate.class_description);
  add('Township / neighborhood', `${display(subject.township_name)} / ${display(subject.NBHD)}`, `${display(candidate.township_name)} / ${display(candidate.NBHD)}`);
  add('Source tax year', subject.TAXYR, candidate.TAXYR);
  add('Source label / stage', `${display(subject.current_value_desc)} / ${display(subject.current_procname)}`, `${display(candidate.current_value_desc)} / ${display(candidate.current_procname)}`);
  add('Source edit date', date(subject.last_edited_date), date(candidate.last_edited_date));
  panel.append(facts);
  if (metrics.lotDelta) panel.append(node('p', `Lot-size Δ: ${formatDelta(metrics.lotDelta).amount} sq ft.`, 'help'));
  panel.append(node('p', 'Total per building square foot divides the entire County value, including any land component, by building size. It is not a building-only valuation or a market-price estimate.', 'help'));
  panel.append(node('p', `Subject retrieved ${date(result.subjectRetrievedAt)}. Candidates retrieved ${date(result.retrievedAt)}. Matched source fields do not establish comparable suitability.`, 'help'));
  panel.append(node('p', 'Click or tap the heading to close. Press Escape to dismiss.', 'help'));
  details.append(summary, panel);
  wireDetails(details, summary);
  return details;
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') for (const details of $('candidate-content').querySelectorAll('details[open]')) details.dispatchEvent(new Event('dismiss'));
});
$('lookup-type').addEventListener('change', () => {
  const isPin = $('lookup-type').value === 'pin';
  $('lookup-label').textContent = isPin ? '14-digit parcel ID (PIN)' : 'Street address';
  $('lookup-value').value = '';
  $('lookup-value').placeholder = isPin ? '01011000250000' : '202 W STATION ST';
  $('lookup-help').textContent = isPin ? 'Use a 14-digit Cook County PIN. Dashes and spaces are accepted.' : 'Use the County’s exact street-address spelling and abbreviations, without city or ZIP. This is not a geocoder. PIN lookup is more precise.';
});
$('sample-pin').addEventListener('click', () => {
  $('lookup-type').value = 'pin';
  $('lookup-type').dispatchEvent(new Event('change'));
  $('lookup-value').value = '01011000250000';
  $('lookup-value').focus();
});
$('clear-live').addEventListener('click', () => {
  controller?.abort(); generation++; setBusy(false); clearResults();
  $('lookup-value').value = '';
  status('Page results cleared. Comparisons stay in this page; submitted simulations can still be managed below.');
});
$('live-form').addEventListener('submit', async e => {
  e.preventDefault();
  controller?.abort(); controller = new AbortController();
  const id = ++generation;
  clearResults(); setBusy(true); status('Querying the live CookViewer parcel API…');
  try {
    const result = await reader.lookup( {type: $('lookup-type').value, value: $('lookup-value').value}, {signal: controller?.signal});
    if (id !== generation) return;
    if (result.state === 'not-found') { status('No matching source record. Check County street spelling or try a PIN. No assessment conclusion can be drawn.'); return; }
    if (result.records.length === 1 && !result.truncated) {
      showParcel(result.records[0], result); await fetchCandidates(id);
    } else {
      $('matches').hidden = false;
      $('match-note').textContent = result.truncated ? 'Only the first 10 matches are shown. Select the correct parcel, or narrow the lookup with a PIN.' : 'Select the parcel you intended.';
      for (const record of result.records) {
        const b = node('button', `${display(record.street_address)} · ${display(record.city_state_zip)}`);
        b.append(node('small', `PIN ${display(record.PIN14)}`)); b.type = 'button';
        b.addEventListener('click', async () => {
          if (busy || id !== generation) return;
          $('matches').hidden = true; showParcel(record, result); await fetchCandidates(id);
        }); $('match-list').append(b);
      }
      status('Confirm a source parcel to continue.');
    }
  } catch (error) { if (id === generation && error.name !== 'AbortError') status(error.message, true); }
  finally { if (id === generation) {setBusy(false); $('candidates-button').disabled = !selectedPin;} }
});
$('candidates-button').addEventListener('click', () => {
  if (busy || !selectedPin) return;
  handoff.clearEvidence(); $('analysis').hidden = true; fetchCandidates(generation);
});
async function fetchCandidates(id) {
  if (!selectedPin || id !== generation) return;
  setBusy(true);
  $('candidate-results').hidden = true;
  $('raw-source').hidden = true; $('raw-source').open = false; $('field-rows').replaceChildren();
  propertyMap?.destroy(); propertyMap = undefined;
  $('candidate-content').replaceChildren();
  status('Refreshing the property and searching matching records…');
  try {
    const result = await reader.candidates(selectedPin, {signal: controller?.signal, onProgress: progress => {
      if (id === generation) status(`Searching matching records… ${progress.examined} examined across ${progress.pages} batch${progress.pages === 1 ? '' : 'es'} (up to 60 records).`);
    }});
    result.analysis = summarizeCandidates(result.subject, result.records || [], {searched: true, truncated: result.truncated});
    result.expiresAt = Date.now() + 900000;
    result.provider = {id: 'demo-professional', name: 'Demo Neighborhood Assessment Studio'};
    if (id !== generation) return;
    $('candidate-results').hidden = false;
    if (result.subject) showParcel(result.subject, {...result, retrievedAt: result.subjectRetrievedAt || result.retrievedAt});
    if (result.state === 'insufficient-fields') {
      $('candidate-note').textContent = `Candidate query stopped. Required source fields are missing or unsuitable: ${result.missing.join(', ')}. No filters were broadened.`;
    } else if (result.state === 'not-found' || result.state === 'ambiguous-subject') {
      $('parcel').hidden = true; $('raw-source').hidden = true; $('field-rows').replaceChildren();
      selectedPin = undefined;
      $('candidate-note').textContent = 'The refreshed subject did not resolve uniquely. Run a new lookup; no candidate conclusion can be drawn.';
    } else {
      const analysis = result.analysis;
      $('candidate-note').textContent = `${result.records.length} matches passed the field checks. ${result.excludedCount ? `${result.excludedCount} duplicate or unsuitable returned records excluded. ` : ''}${result.limitation}`;
      const overview = node('div', undefined, 'search-overview');
      overview.append(node('p', 'A closer look for lower values', 'eyebrow'));
      overview.append(node('h3', analysis.lower ? `${analysis.lower} lower-valued match${analysis.lower === 1 ? '' : 'es'} to explore.` : 'No lower-valued matches found in this search.'));
      overview.append(node('p', `${result.search.examined} records examined in ${result.search.pages} batch${result.search.pages === 1 ? '' : 'es'} · ${analysis.lower} lower · ${analysis.equal} equal · ${analysis.higher} higher.`, 'search-counts'));
      overview.append(node('p', `Lower values come first, then closest building size, then lowest County value. Same township, neighborhood, class, year and value stage; size within ±20%. Age and condition are not matching rules, so review the differences. ${result.truncated ? 'Search limit reached: more source records remain unexamined. These are not necessarily the lowest values available.' : 'The source returned no further matches for these filters.'}`, 'help'));
      $('candidate-content').append(overview);
      const wrap = node('div', undefined, 'table-wrap'), table = node('table');
      const viewNote = node('p', '', 'help'); overview.append(viewNote);
      table.append(node('caption', `Candidate minus subject: ${result.subject.street_address || result.subject.PIN14}. Green = lower County value; red = higher; neither indicates appeal merit.`));
      const head = node('thead'), tr = node('tr');
      for (const title of ['Property / details', 'County value / label', 'County value Δ', 'Building size / Δ', 'Age / Δ', 'Tax year / stage', 'Source edit date']) {
        const th = node('th', title); th.scope = 'col'; tr.append(th);
      }
      head.append(tr); table.append(head);
      const rows = node('tbody'), rowsByPin = new Map();
      const detailArea = node('div', undefined, 'comparison-details');
      const subjectRow = node('tr', undefined, 'subject-baseline');
      const subjectAddress = node('th', result.subject.street_address || 'Subject', 'candidate-address');
      subjectAddress.scope = 'row';
      subjectAddress.append(node('small', `Subject baseline · PIN ${display(result.subject.PIN14)}`));
      const subjectValue = node('td', rawNumber(result.subject.CURRENTVALUE_TOTAL));
      subjectValue.append(node('small', display(result.subject.current_value_desc)));
      const subjectYear = node('td', display(result.subject.TAXYR));
      subjectYear.append(node('small', display(result.subject.current_procname)));
      subjectRow.append(subjectAddress, subjectValue, node('td', 'Baseline'), node('td', rawNumber(result.subject.BLDGSQFT, ' sq ft')), node('td', rawNumber(result.subject.BLDGAGE, ' years')), subjectYear, node('td', date(result.subject.last_edited_date)));
      subjectRow.dataset.pin = result.subject.PIN14; rowsByPin.set(result.subject.PIN14, subjectRow);
      rows.append(subjectRow);
      for (const p of result.records) {
        const metrics = candidateMetrics(result.subject, p);
        const row = node('tr'); row.dataset.pin = p.PIN14; rowsByPin.set(p.PIN14, row);
        const address = node('th', display(p.street_address), 'candidate-address');
        address.scope = 'row';
        address.append(node('small', `PIN ${display(p.PIN14)}`));
        const details = candidateDetails(p, result.subject, result, metrics);
        details.id = `details-${p.PIN14}`; details.hidden = true;
        const toggle = node('button', 'Details', 'detail-toggle secondary'); toggle.type = 'button';
        toggle.setAttribute('aria-label', `Details for ${p.street_address || p.PIN14}`);
        toggle.setAttribute('aria-controls', details.id); toggle.setAttribute('aria-expanded', 'false');
        toggle.onclick = () => {
          const opening = !details.open;
          for (const other of detailArea.querySelectorAll('details')) {other.open = false; other.hidden = true;}
          details.hidden = !opening; details.open = opening;
          if (opening) { details.querySelector('summary').focus(); details.scrollIntoView({block: 'nearest'}); }
        };
        details.addEventListener('toggle', () => {
          toggle.setAttribute('aria-expanded', String(details.open));
          if (!details.open) { if (details.contains(document.activeElement)) toggle.focus(); details.hidden = true; }
        });
        detailArea.append(details); address.append(toggle);
        const value = node('td', rawNumber(p.CURRENTVALUE_TOTAL));
        value.append(node('small', display(p.current_value_desc)));
        const year = node('td', display(p.TAXYR));
        year.append(node('small', display(p.current_procname)));
        row.append(address, value, deltaCell(metrics.valueDelta), attributeCell(p.BLDGSQFT, metrics.sizeDelta, 'sq ft'), attributeCell(p.BLDGAGE, metrics.ageDelta, 'years'), year, node('td', date(p.last_edited_date)));
        rows.append(row);
      }
      const mapContainer = node('div'); $('candidate-content').append(mapContainer);
      table.className = 'comparison-table';
      table.append(rows); wrap.append(table); $('candidate-content').append(wrap, detailArea);
      let showAll = false;
      const viewButton = node('button', `Show all ${result.records.length} matches`, 'secondary');
      viewButton.type = 'button'; viewButton.hidden = result.records.length <= 5;
      table.id = 'comparison-table'; viewButton.setAttribute('aria-controls', table.id);
      const updateView = () => {
        const visibleRecords = showAll ? result.records : result.records.slice(0, 5);
        const visiblePins = new Set([result.subject.PIN14, ...visibleRecords.map(p => p.PIN14)]);
        for (const [pin, row] of rowsByPin) row.hidden = !visiblePins.has(pin);
        for (const details of detailArea.querySelectorAll('details')) {details.open = false; details.hidden = true;}
        viewNote.textContent = `Showing ${visibleRecords.length} of ${result.records.length} matches. The summary below uses all ${result.records.length}, regardless of this view.`;
        viewButton.textContent = showAll ? 'Show shortlist' : `Show all ${result.records.length} matches`;
        viewButton.setAttribute('aria-expanded', String(showAll));
        propertyMap?.destroy(); mapContainer.replaceChildren();
        propertyMap = mountPropertyMap(mapContainer, {...result, records: visibleRecords, rowsByPin: new Map([...rowsByPin].filter(([pin]) => visiblePins.has(pin)))});
      };
      viewButton.onclick = () => {showAll = !showAll; updateView();};
      overview.append(viewButton); updateView();
      const filters = result.filters;
      $('candidate-content').append(node('p', `Exploratory filter: township ${filters.township}; neighborhood ${filters.neighborhood}; class ${filters.class}; year ${filters.year}; label ${filters.valueLabel}; stage ${filters.stage}; building size ${filters.buildingSizeMin}–${filters.buildingSizeMax} sq ft. The size range is a test setting, not an approved matching rule.`, 'help'));
    }
    $('candidate-content').append(node('p', `Source: ${result.source} · Retrieved: ${date(result.retrievedAt)}. Subject was re-fetched for this action.`, 'help'));
    $('analysis').hidden = false;
    $('analysis-content').textContent = result.analysis.explanation;
    handoff.setEvidence(result);
    status('Live comparison ready. The summary describes returned values; the optional handoff is fictional.');
  } catch (error) { if (id === generation && error.name !== 'AbortError') status(error.message, true); }
  finally { if (id === generation) {setBusy(false); $('candidates-button').disabled = !selectedPin;} }
}
