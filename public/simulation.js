// One fictional request per page. No persistence, network or real delivery.
export function createSimulation({now = Date.now} = {}) {
  let request = null;
  const read = () => {
    if (request && request.expiresAt <= now()) request = null;
    return request ? structuredClone(request) : null;
  };
  return {
    read,
    create(evidence, consent) {
      if (read()) throw new Error('Delete the current test request before creating another.');
      if (consent !== true || evidence?.analysis?.state !== 'available' || !evidence.provider || !(evidence.expiresAt > now())) throw new Error('Confirm a current, usable comparison before creating a simulation.');
      request = structuredClone({...evidence, status: 'created', expiresAt: now() + 3600000});
      return read();
    },
    withdraw() {
      if (!read()) throw new Error('This test request has expired.');
      request.status = 'withdrawn'; return read();
    },
    delete() { request = null; }
  };
}
