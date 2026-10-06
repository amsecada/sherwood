import {randomBytes} from 'node:crypto';
import {summarizeCandidates} from '../public/live-metrics.js';
import {fail} from './requests.js';

export function createEvidence({now = Date.now} = {}) {
  const snapshots = new Map();
  function purge() {
    for (const [key, value] of snapshots) if (value.expiresAt <= now()) snapshots.delete(key);
  }
  function get(reference) {
    purge();
    const value = typeof reference === 'string' && snapshots.get(reference);
    if (!value) fail(410, 'This comparison has expired. Run the lookup again.');
    if (value.used) fail(409, 'This comparison already has a simulated request.');
    return value;
  }
  return {
    issue(result) {
      purge();
      const analysis = summarizeCandidates(result.subject, result.records);
      if (analysis.state !== 'available') fail(400, 'Usable comparison evidence is required.');
      if (snapshots.size >= 200) fail(429, 'The demo comparison capacity is full. Try again later.');
      const reference = randomBytes(32).toString('hex');
      const expiresAt = now() + 15 * 60 * 1000;
      snapshots.set(reference, {snapshot: structuredClone({...result, analysis}), expiresAt, used: false});
      return {reference, expiresAt, analysis};
    },
    read(reference) { return structuredClone(get(reference).snapshot); },
    consume(reference) { const value = get(reference); value.used = true; value.snapshot = null; },
    clear() { snapshots.clear(); }
  };
}
