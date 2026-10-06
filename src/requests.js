import {randomUUID, randomBytes, timingSafeEqual} from 'node:crypto';
import {compareParcel} from './comparison.js';
import {providers} from './fixtures.js';
export function fail(status, message) { const e = new Error(message); e.status = status; throw e; }
export function authorized(token, expected) {
  if (typeof token !== 'string' || typeof expected !== 'string') return false;
  const a = Buffer.from(token), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function createRequests({now = Date.now} = {}) {
  const records = new Map();
  let active = true;
  const timestamp = () => new Date(now()).toISOString();
  function purge() { for (const [id, r] of records) if (r.expiresAt <= now()) records.delete(id); }
  const safe = r => { const {receipt, reference, ...publicRecord} = r; return structuredClone(publicRecord); };
  const event = (r, action) => r.history.push({action, at: timestamp()});
  function get(id) { purge(); const r = records.get(id); if (!r) fail(410, 'Test request expired or removed. Start a new demonstration.'); return r; }
  function save(fields) {
    purge();
    if (records.size >= 200) fail(409, 'Demo is full. Try after requests expire.');
    const id = randomUUID(), receipt = randomBytes(32).toString('hex'), at = timestamp();
    const r = {...fields, id, receipt, status: 'pending', createdAt: at, expiresAt: now() + 60 * 60 * 1000,
      history: [{action: 'created', at}]};
    records.set(id, r);
    return {id, receipt, status: r.status, expiresAt: r.expiresAt};
  }
  return {
    isActive: () => active,
    list() { purge(); return [...records.values()].map(safe).reverse(); },
    status(id, token) { const r = get(id); if (!authorized(token, r.receipt)) fail(401, 'Private request receipt required.'); return {id, status: r.status, expiresAt: r.expiresAt}; },
    create(p) {
      purge();
      const comparison = compareParcel(p.parcelId);
      if (comparison.state !== 'available' || !active || !comparison.providers.some(v => v.id === p.providerId)) fail(400, 'Choose an available fictional professional for a supported sample.');
      if (p.consent !== true || p.consentVersion !== 'demo-consent-1') fail(400, 'Affirmative consent to the selected fictional professional is required.');
      if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > 80 || typeof p.email !== 'string' || p.email.length > 120 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(test|invalid|example)$/i.test(p.email)) fail(400, 'Use a test name and a fictional email ending in .test, .invalid or .example.');
      if ([...records.values()].some(r => r.evidenceType === 'synthetic' && r.email === p.email.toLowerCase() && r.parcelId === p.parcelId && r.providerId === p.providerId && !['withdrawn', 'blocked'].includes(r.status))) fail(409, 'A test request for this property and professional already exists.');
      return save({evidenceType: 'synthetic', name: p.name.trim(), email: p.email.toLowerCase(), parcelId: p.parcelId, providerId: p.providerId, providerName: providers[0].name,
        consent: {version: 'demo-consent-1', at: timestamp(), wording: `I permit sharing my test name, fictional email, sample parcel and synthetic comparison summary with ${providers[0].name} after operator review. This is a simulation; nothing will be sent.`},
        summary: {address: comparison.subject.address, assessment: comparison.subject.assessment, median: comparison.median, period: comparison.subject.period, methodVersion: comparison.methodVersion, explanation: comparison.explanation}});
    },
    createLive({snapshot, reference, providerId, consent, consentVersion}) {
      purge();
      if (!active || providerId !== providers[0].id || consent !== true || consentVersion !== 'live-demo-consent-2') fail(400, 'Confirm the current simulation consent and available fictional organization.');
      if (!snapshot?.subject || snapshot.analysis?.state !== 'available') fail(400, 'Usable live evidence is required.');
      if ([...records.values()].some(r => r.reference === reference)) fail(409, 'This comparison already has a simulated request.');
      return save({evidenceType: 'live-demo', reference, name: 'Demo Homeowner (fictional)', email: 'homeowner@example.test', parcelId: snapshot.subject.PIN14, providerId, providerName: providers[0].name,
        consent: {version: 'live-demo-consent-2', at: timestamp(), wording: `I confirm a simulated handoff of this live parcel summary and a predefined fictional identity to ${providers[0].name}. Nothing is sent or filed.`},
        summary: structuredClone({...snapshot, address: snapshot.subject.street_address || snapshot.subject.PIN14, period: snapshot.subject.TAXYR, methodVersion: snapshot.analysis.methodVersion, explanation: snapshot.analysis.explanation})});
    },
    withdraw(id, token) {
      const r = get(id); if (!authorized(token, r.receipt)) fail(401, 'Private request receipt required.');
      if (r.status === 'sent') fail(409, 'Already simulated as sent. Delete the test record instead.');
      r.status = 'withdrawn';
      // Withdrawal must remain possible even after the bounded operator history fills.
      if (r.history.length >= 100) r.history.shift(); event(r, 'withdrawn'); return {status: r.status};
    },
    delete(id, token, operator = false) { const r = get(id); if (!operator && !authorized(token, r.receipt)) fail(401, 'Private request receipt required.'); records.delete(id); return {deleted: true}; },
    change(id, p) {
      const r = get(id);
      if (['withdrawn', 'sent'].includes(r.status)) fail(409, 'This request cannot be dispatched or changed again.');
      if (r.history.length >= 100) fail(409, 'Demo history is full. Delete this request or reset the demonstration.');
      if (!['sent', 'failed', 'uncertain', 'blocked', 'reconcile'].includes(p.action)) fail(400, 'Choose a valid simulated action.');
      if (p.action === 'reconcile') {
        if (!['failed', 'uncertain', 'blocked'].includes(r.status) || p.reviewed !== true) fail(409, 'Confirm reconciliation before retrying.');
        r.status = 'pending'; event(r, 'reconciled — no simulated delivery occurred'); return safe(r);
      }
      if (p.action === 'blocked') { r.status = 'blocked'; event(r, 'blocked'); return safe(r); }
      const version = r.evidenceType === 'live-demo' ? 'live-demo-consent-2' : 'demo-consent-1';
      if (r.status !== 'pending' || p.reviewed !== true || !active || r.consent.version !== version) fail(409, 'Recheck consent, provider availability, payload and current pending status before simulated dispatch.');
      r.status = p.action; event(r, `simulated ${p.action}`); return safe(r);
    },
    provider(p) { if (typeof p.active !== 'boolean') fail(400, 'Provider active must be true or false.'); active = p.active; return {active}; },
    reset() { records.clear(); active = true; return {reset: true}; }
  };
}
