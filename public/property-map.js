import {fitMap} from './map-layout.js';
const node = (tag, text, className) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
const svgNode = tag => document.createElementNS('http://www.w3.org/2000/svg', tag);
export function mountPropertyMap(container, {subject, records, rowsByPin}) {
  let destroyed = false, visible = false, pinned, selected, layout, renderVersion = 0;
  const cleanup = [], buttons = new Map();
  const points = [subject, ...records].filter(Boolean).map((p, i) => ({pin: p.PIN14, latitude: p.latitude, longitude: p.longitude, isSubject: i === 0, label: `${i === 0 ? 'Subject' : `Candidate ${i}`} · ${p.street_address || p.PIN14}`}));
  const shell = node('section', undefined, 'property-map');
  shell.append(node('h3', 'The properties around your comparison.'));
  const legend = node('p', 'S = subject · numbered circles = candidates. Approximate County locations. Pulses connect the selected comparison; they do not measure valuation influence.', 'help');
  const viewport = node('div', undefined, 'map-viewport'), tiles = node('div', undefined, 'map-tiles'), markers = node('div', undefined, 'map-markers');
  const connections = svgNode('svg'); connections.classList.add('map-connections'); connections.setAttribute('aria-hidden', 'true');
  const line = svgNode('line'); line.classList.add('radar-link'); const ring = svgNode('circle'); ring.classList.add('radar-ring'); ring.setAttribute('r', '28');
  connections.append(line, ring); viewport.append(tiles, connections, markers);
  const details = node('p', 'Hover, focus or select a property to link it with its table entry.', 'map-selection'); details.setAttribute('role', 'status');
  const tileStatus = node('p', '', 'help'), locations = node('p', '', 'help');
  const attribution = node('p', undefined, 'map-attribution');
  const credit = node('a', '© OpenStreetMap contributors'); credit.href = 'https://www.openstreetmap.org/copyright'; credit.target = '_blank'; credit.rel = 'noreferrer';
  const issue = node('a', 'Report a map issue'); issue.href = 'https://www.openstreetmap.org/fixthemap'; issue.target = '_blank'; issue.rel = 'noreferrer';
  attribution.append(credit, document.createTextNode(' · '), issue);
  shell.append(viewport, attribution, legend, details, locations, tileStatus, node('p', 'Street tiles are loaded only for the visible map. OpenStreetMap receives tile requests and network metadata, not your parcel ID, address text or simulated request. Street-map availability is best-effort.', 'help'));
  container.append(shell);
  function on(element, event, fn) { element.addEventListener(event, fn); cleanup.push(() => element.removeEventListener(event, fn)); }
  function select(pin) {
    if (destroyed) return;
    selected = pin;
    for (const [id, row] of rowsByPin) row.classList.toggle('map-selected', id === pin);
    for (const [id, b] of buttons) { b.classList.toggle('selected', id === pin); b.setAttribute('aria-pressed', String(id === pinned)); }
    const point = layout?.markers.find(p => p.pin === pin), baseline = layout?.markers.find(p => p.isSubject);
    const identity = points.find(p => p.pin === pin);
    details.textContent = identity ? `${identity.label}${point ? '' : ' · location unavailable'}` : 'Hover, focus or select a property to link it with its table entry.';
    line.style.display = point && baseline && !point.isSubject ? '' : 'none'; ring.style.display = point ? '' : 'none';
    if (point) { ring.setAttribute('cx', point.x); ring.setAttribute('cy', point.y); }
    if (point && baseline) for (const [key, value] of Object.entries({x1: baseline.x, y1: baseline.y, x2: point.x, y2: point.y})) line.setAttribute(key, value);
  }
  function focusedPin() {
    const active = document.activeElement;
    for (const [pin, row] of rowsByPin) if (row === active || row.contains(active)) return pin;
    for (const [pin, button] of buttons) if (button === active) return pin;
  }
  function hover(pin) { select(focusedPin() || pin || pinned); }
  function bind(element, pin, isRow = false) {
    on(element, 'mouseenter', () => hover(pin)); on(element, 'mouseleave', () => { if (!element.contains(document.activeElement)) hover(); });
    on(element, 'focusin', () => select(pin)); on(element, 'focusout', e => { if (!element.contains(e.relatedTarget)) select(pinned); });
    on(element, 'click', e => {
      if (isRow && e.target.closest('button,a,summary,details,input')) return;
      pinned = pinned === pin ? undefined : pin; select(pinned);
    });
    if (isRow) on(element, 'keydown', e => { if (e.target === element && ['Enter', ' '].includes(e.key)) { e.preventDefault(); pinned = pinned === pin ? undefined : pin; select(pinned); } });
  }
  on(shell, 'keydown', e => { if (e.key === 'Escape') { pinned = undefined; select(undefined); } });
  for (const point of points) {
    const row = rowsByPin.get(point.pin);
    if (row) { row.tabIndex = 0; bind(row, point.pin, true); on(row, 'keydown', e => { if (e.key === 'Escape') { pinned = undefined; select(undefined); } }); }
  }
  function drawTiles() {
    const version = ++renderVersion; tiles.replaceChildren(); tileStatus.textContent = '';
    if (!visible || !layout?.markers.length) return;
    for (const tile of layout.tiles) {
      const image = document.createElement('img'); image.alt = ''; image.referrerPolicy = 'origin'; image.draggable = false;
      image.style.left = `${tile.left}px`; image.style.top = `${tile.top}px`;
      image.onerror = () => { if (!destroyed && version === renderVersion) {tileStatus.textContent = 'Street background unavailable. Property positions and the comparison table remain available.'; image.style.visibility = 'hidden';} };
      image.src = `https://tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`; tiles.append(image);
    }
  }
  function render() {
    if (destroyed) return;
    const width = viewport.clientWidth, height = viewport.clientHeight;
    if (!width || !height) return;
    layout = fitMap(points, width, height); markers.replaceChildren(); buttons.clear();
    connections.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const omitted = points.length - layout.markers.length;
    locations.textContent = !layout.markers.length ? 'Locations unavailable. The table and descriptive analysis remain usable.' : `${omitted ? `${omitted} location(s) unavailable. ` : ''}${layout.markers.some(p => p.isSubject) ? '' : 'Subject location unavailable; no subject connections shown. '}Select overlapping locations individually in the table below.`;
    for (const point of layout.markers) {
      const index = points.findIndex(p => p.pin === point.pin), b = node('button', point.isSubject ? 'S' : String(index), `map-marker${point.isSubject ? ' subject-marker' : ''}`);
      b.type = 'button'; b.dataset.pin = point.pin; b.setAttribute('aria-label', point.label); b.style.left = `${point.x}px`; b.style.top = `${point.y}px`;
      // These listeners belong to disposable marker nodes; do not retain nodes across resize.
      b.onmouseenter = () => hover(point.pin); b.onmouseleave = () => { if (document.activeElement !== b) hover(); };
      b.onfocus = () => select(point.pin); b.onblur = () => select(pinned); b.onclick = () => { pinned = pinned === point.pin ? undefined : point.pin; select(pinned); };
      buttons.set(point.pin, b); markers.append(b);
    }
    select(selected); drawTiles();
  }
  const resize = new ResizeObserver(render); resize.observe(viewport);
  const intersection = new IntersectionObserver(entries => { if (destroyed) return; const next = entries[0].isIntersecting; if (next !== visible) { visible = next; drawTiles(); } }); intersection.observe(viewport);
  render();
  return {destroy() { destroyed = true; renderVersion++; resize.disconnect(); intersection.disconnect(); cleanup.forEach(fn => fn()); for (const row of rowsByPin.values()) {row.classList.remove('map-selected'); row.removeAttribute('tabindex');} shell.remove(); }};
}
