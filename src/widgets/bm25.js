// BM25 playground over a small bundled subset of corpus chunks (short excerpts of the core sources).
import { h } from '../ui.js';
import { buildIndex, query, snippet } from '../search.js';
import { byId } from '../cite.js';

let chunks = null;
const load = () => chunks || (chunks = fetch(new URL('data/chunks.json', location.href)).then((r) => r.json()));

export function bm25(el) {
  const st = { k1: 1.4, b: 0.75 };
  const out = h('div'); const meta = h('p', { class: 'small muted' }, 'Loading excerpts…');
  const inp = h('input', { type: 'search', class: 'inp', placeholder: 'e.g. “harness loop tools memory”', value: 'context window compaction', 'aria-label': 'BM25 query' });
  let idx = null;
  const run = () => {
    if (!idx) return; out.replaceChildren();
    const q = inp.value.trim(); if (!q) return;
    const res = query(idx, q, 6, st.k1, st.b);
    if (!res.length) { out.append(h('p', { class: 'muted small' }, 'No excerpt contains those words. BM25 only matches exact (lower-cased) words.')); return; }
    res.forEach(({ d, score, parts }, i) => {
      const s = byId[d.source_id];
      out.append(h('div', { class: 'whit' },
        h('div', { class: 'spread' }, h('strong', { class: 'small' }, `${i + 1}. ${d.title}`), h('span', { class: 'chip' }, score.toFixed(2))),
        h('div', { class: 'small muted' }, parts.map((p) => `${p.term}: tf ${p.tf} × idf ${p.idf.toFixed(2)} → ${p.contrib.toFixed(2)}`).join(' · ')),
        h('div', { class: 'small' }, snippet(d.text, q, 200)),
        s ? h('a', { class: 'small', href: s.url, target: '_blank', rel: 'noopener noreferrer' }, `${s.author} ↗`) : null));
    });
  };
  const sl = (label, key, min, max, step) => {
    const v = h('span', { class: 'muted' }, String(st[key]));
    return h('label', { class: 'wslider' }, h('span', null, label, ' ', v), h('input', { type: 'range', min, max, step, value: st[key], oninput: (e) => { st[key] = +e.target.value; v.textContent = String(st[key]); run(); } }));
  };
  inp.addEventListener('input', () => { clearTimeout(inp._t); inp._t = setTimeout(run, 150); });
  el.append(h('div', { class: 'wtitle' }, '🔎 BM25 playground'),
    h('p', { class: 'small muted' }, 'Keyword search the way corpus/query.py does it: rare words count more (idf), repeated words count with diminishing returns (k1), long passages are penalised (b).'),
    inp, h('div', { class: 'wsliders' }, sl('k1 (term-frequency saturation)', 'k1', 0, 3, 0.1), sl('b (length normalisation)', 'b', 0, 1, 0.05)), meta, out);
  load().then((c) => {
    idx = buildIndex(c.map((x) => ({ ...x, title: '', text: x.text })), 1);
    meta.textContent = `${c.length} short excerpts from the ★★★ sources · average length ${Math.round(idx.avg)} words.`;
    run();
  }).catch(() => { meta.textContent = 'Could not load the excerpt bundle (offline before first load?).'; });
}
