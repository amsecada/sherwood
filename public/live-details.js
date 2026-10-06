// Inline disclosure: hover/focus preview, click/tap pinning, explicit dismissal.
export function wireDetails(details, summary) {
  let pinned = false, focused = false;
  details.addEventListener('mouseenter', () => { details.open = true; });
  details.addEventListener('mouseleave', () => { if (!pinned && !focused) details.open = false; });
  details.addEventListener('focusin', () => { focused = true; details.open = true; });
  details.addEventListener('focusout', event => {
    if (!details.contains(event.relatedTarget)) {
      focused = false;
      if (!pinned) details.open = false;
    }
  });
  summary.addEventListener('click', event => {
    event.preventDefault(); // Avoid the native toggle undoing the focus preview.
    pinned = !pinned;
    details.open = pinned;
  });
  details.addEventListener('dismiss', () => { pinned = false; details.open = false; });
}
