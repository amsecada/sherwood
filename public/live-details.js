// Details open only through explicit native click/tap/keyboard activation.
export function wireDetails(details) {
  details.addEventListener('dismiss', () => { details.open = false; });
}
