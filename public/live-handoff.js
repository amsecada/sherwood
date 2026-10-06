import {createSimulation} from './simulation.js';
const node = (tag, text, className) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
export function mountHandoff(container) {
  let evidence, request, destroyed = false, evidenceExpired = false;
  const simulation = createSimulation();
  const choice = node('section', undefined, 'card'), management = node('section', undefined, 'card');
  const message = node('p', '', 'status'); message.setAttribute('role', 'status');
  container.append(choice, management, message);
  function draw() {
    if (destroyed) return;
    request = simulation.read();
    choice.replaceChildren(); choice.hidden = !evidence || evidence.analysis?.state !== 'available';
    management.replaceChildren(); management.hidden = !request;
    if (!choice.hidden) {
      choice.append(node('p', 'Step 04 · Your next step', 'eyebrow'), node('h2', 'Try the fictional handoff.'));
      if (request) choice.append(node('p', 'Manage your current test request below. Delete it before creating another.'));
      else if (evidence.expiresAt <= Date.now()) choice.append(node('p', 'This comparison has expired. Run the lookup again to simulate a handoff.'));
      else {
        choice.append(node('h3', evidence.provider.name), node('p', 'Fictional organization. Nothing will be sent or filed.'), node('p', `Parcel: ${evidence.subject.street_address || evidence.subject.PIN14} · PIN ${evidence.subject.PIN14}`), node('p', evidence.analysis.explanation), node('p', 'This simulation stays in this page only. Refreshing or closing the page clears it. No contact information is collected.', 'help'));
        const label = node('label', undefined, 'check-label'), consent = node('input'); consent.type = 'checkbox';
        label.append(consent, node('span', `I confirm a simulated handoff of this live summary to ${evidence.provider.name}. Nothing is sent or filed.`));
        const submit = node('button', 'Create simulated request'); submit.type = 'button'; submit.disabled = true;
        consent.onchange = () => { submit.disabled = !consent.checked; };
        submit.onclick = () => {
          try { simulation.create(evidence, consent.checked); message.textContent = 'Simulated request created.'; }
          catch (error) { message.textContent = error.message; }
          draw();
        };
        choice.append(label, submit);
      }
    }
    if (request) {
      management.append(node('h2', 'Your test request'), node('p', `${request.subject.street_address || request.subject.PIN14} · PIN ${request.subject.PIN14}`), node('p', `Fictional recipient: ${request.provider.name}`), node('p', `Simulated request: ${request.status}.`), node('p', 'Keep this page open to manage the simulation. Reloading or closing clears it; it also expires after one hour.', 'help'));
      const actions = node('div', undefined, 'actions');
      const withdraw = node('button', 'Withdraw test request', 'secondary'); withdraw.type = 'button'; withdraw.disabled = request.status === 'withdrawn';
      withdraw.onclick = () => { try { simulation.withdraw(); message.textContent = ''; } catch(error) { message.textContent = error.message; } draw(); };
      const remove = node('button', 'Delete test request', 'secondary'); remove.type = 'button';
      remove.onclick = () => { simulation.delete(); evidence = undefined; message.textContent = 'Test request deleted. Run a new comparison to try again.'; draw(); };
      actions.append(withdraw, remove); management.append(actions);
    }
  }
  const timer = setInterval(() => {
    if (request && !simulation.read()) { message.textContent = 'Test request expired. Nothing was sent.'; draw(); }
    else if (evidence && evidence.expiresAt <= Date.now() && !evidenceExpired) { evidenceExpired = true; draw(); }
  }, 1000);
  draw();
  return {setEvidence(value) { evidence = structuredClone(value); evidenceExpired = false; draw(); }, clearEvidence() { evidence = undefined; draw(); }, destroy() { destroyed = true; clearInterval(timer); container.replaceChildren(); }};
}
