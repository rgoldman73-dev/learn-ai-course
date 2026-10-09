// [S:<id>] citations: inline numbered links with a hover/tap card (title, author, date) from the trimmed source index.
import sources from './generated/sources.json';
import { h } from './ui.js';

export const byId = Object.fromEntries(sources.map((s) => [s.id, s]));
export const STARS = { 3: '★★★', 2: '★★', 1: '★' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Replace [S:id] markers in markdown with inline HTML before it goes through marked.
export function markCitations(md) {
  const order = [];
  const out = md.replace(/\[S:(\d{15,20})\]/g, (_, id) => {
    let n = order.indexOf(id); if (n < 0) { order.push(id); n = order.length - 1; }
    const s = byId[id];
    if (!s) return `<span class="cite bad" title="unknown source">[?]</span>`;
    return `<a class="cite" href="${esc(s.url)}" data-sid="${id}" target="_blank" rel="noopener noreferrer" aria-label="Source ${n + 1}: ${esc(s.title)}">${n + 1}</a>`;
  });
  return { md: out, order };
}

let card = null, hideT = null;
function ensureCard() {
  if (card) return card;
  card = h('div', { class: 'citecard', role: 'dialog', hidden: true });
  card.addEventListener('mouseenter', () => clearTimeout(hideT));
  card.addEventListener('mouseleave', () => { hideT = setTimeout(hideCard, 250); });
  document.body.append(card);
  document.addEventListener('click', (e) => { if (card && !card.hidden && !card.contains(e.target) && !e.target.closest('.cite')) hideCard(); });
  window.addEventListener('hashchange', hideCard);
  return card;
}
export function hideCard() { if (card) card.hidden = true; }
export function showCard(el, id) {
  const s = byId[id]; if (!s) return;
  const c = ensureCard(); clearTimeout(hideT);
  c.replaceChildren(
    h('div', { class: 'small muted' }, `${STARS[s.priority] || ''} · ${s.date} · ${s.topics.join(', ')}`),
    h('strong', null, s.title), h('div', { class: 'small' }, s.author),
    h('div', { class: 'btns' }, h('a', { class: 'btn small primary', href: s.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open original ↗'),
      h('a', { class: 'btn small', href: `#/library?id=${id}` }, 'In library')));
  c.hidden = false;
  const r = el.getBoundingClientRect(); const w = Math.min(340, window.innerWidth - 16);
  c.style.width = w + 'px';
  c.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + window.scrollX - w / 2)) + 'px';
  c.style.top = r.bottom + window.scrollY + 6 + 'px';
}
// Wire up all .cite links inside a container: hover shows the card on mouse devices, tap toggles it.
export function wireCitations(root) {
  const hover = matchMedia('(hover: hover)').matches;
  root.querySelectorAll('a.cite[data-sid]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); if (card && !card.hidden && card.dataset.for === a.dataset.sid) return hideCard(); showCard(a, a.dataset.sid); card.dataset.for = a.dataset.sid; });
    if (hover) {
      a.addEventListener('mouseenter', () => { showCard(a, a.dataset.sid); card.dataset.for = a.dataset.sid; });
      a.addEventListener('mouseleave', () => { hideT = setTimeout(hideCard, 300); });
    }
  });
}
