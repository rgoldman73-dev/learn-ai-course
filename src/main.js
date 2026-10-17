import './style.css';
import { marked } from 'marked';
import course from './generated/course.json';
import sources from './generated/sources.json';
import * as S from './store.js';
import { buildIndex, query, snippet } from './search.js';
import { h, toast, download, shuffle } from './ui.js';
import { AudioPlayer, stopAudio } from './audio.js';
import { markCitations, wireCitations, byId as srcById, STARS } from './cite.js';
import { mountWidgets, disposeWidgets, WIDGETS } from './widgets/index.js';

const { units, modules } = course;
const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
const unitOf = Object.fromEntries(units.map((u) => [u.id, u]));
const ready = modules.filter((m) => m.ready);
const app = document.getElementById('app');
S.load();
if (S.get().theme !== 'auto') document.documentElement.dataset.theme = S.get().theme;

/* ---------- helpers ---------- */
const core = modules.filter((m) => !m.optional);
const nextModule = () => modules.find((m) => !S.isDone(m.id)) || null;
const doneCount = () => modules.filter((m) => S.isDone(m.id)).length;
const link = (href, text, cls = '') => h('a', { href, class: cls }, text);
const ext = (href, text, cls = '') => h('a', { href, class: cls, target: '_blank', rel: 'noopener noreferrer' }, text);
const num = (m) => Number(m.id.slice(1));
const mdCache = new Map();
const fetchMd = (id) => mdCache.get(id) || mdCache.set(id, fetch(new URL(`data/modules/${id}.md`, location.href)).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })).get(id);
const outlineText = (m) => [m.title, m.objectives.join(' '), m.analogy, m.lab].join(' ');
let index = null;
async function getIndex() {
  if (index) return index;
  const docs = await Promise.all(modules.map(async (m) => {
    let text = outlineText(m);
    if (m.ready) { try { text += ' ' + (await fetchMd(m.id)).replace(/\[S:\d+\]|<[^>]+>|[#*`>|]/g, ' '); } catch { /* offline & uncached */ } }
    return { id: m.id, kind: 'module', title: m.title, text: text + ' ' + (S.get().notes[m.id] || '') };
  }));
  for (const s of sources) docs.push({ id: s.id, kind: 'source', title: s.title, text: `${s.author} ${s.topics.join(' ')}` });
  return (index = buildIndex(docs));
}
S.onChange(() => { index = null; });

function bar(pct) { return h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: `width:${pct}%` })); }
function chip(text, cls = '') { return h('span', { class: 'chip ' + cls }, text); }
function moduleRow(m) {
  const done = S.isDone(m.id);
  return h('a', { class: 'row' + (done ? ' done' : '') + (m.ready ? '' : ' planned'), href: `#/module/${m.id}` },
    h('span', { class: 'tick', 'aria-hidden': 'true' }, done ? '✓' : String(num(m))),
    h('span', { class: 'rowmain' },
      h('span', { class: 'rowtitle' }, m.title),
      h('span', { class: 'rowsub' }, `Unit ${m.unit} · ${m.ready ? `~${m.minutes} min${m.audio ? ' · 🎧' : ''}` : 'planned'}${m.optional ? ' · optional' : ''}`)));
}

/* ---------- layout ---------- */
const TABS = [['#/', 'Today', '🌱'], ['#/modules', 'Modules', '📚'], ['#/quiz', 'Quiz', '❓'], ['#/library', 'Library', '🗂'], ['#/more', 'More', '⋯']];
const MORE = ['#/notes', '#/settings', '#/about', '#/widgets', '#/search'];
function shell(route, content) {
  const nav = h('nav', { class: 'tabs', 'aria-label': 'Main' },
    TABS.map(([href, label, icon]) => h('a', { href, class: route === href || (href === '#/more' && MORE.includes(route)) ? 'on' : '' },
      h('span', { class: 'ic', 'aria-hidden': 'true' }, icon), h('span', null, label))));
  const top = h('header', { class: 'top' },
    h('a', { href: '#/', class: 'brand' }, h('img', { src: './favicon.svg', alt: '', width: 26, height: 26 }), 'Learn AI'),
    h('span', { class: 'net', id: 'net' }, navigator.onLine ? '' : 'offline'),
    h('a', { class: 'icon', href: '#/search', 'aria-label': 'Search' }, '🔎'),
    h('button', { class: 'icon', 'aria-label': 'Toggle dark mode', onclick: toggleTheme }, '◐'));
  return h('div', { class: 'shell' }, top, h('main', { id: 'main' }, content), nav);
}
function toggleTheme() {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  S.setTheme(cur === 'dark' ? 'light' : 'dark');
}
window.addEventListener('online', () => { const n = document.getElementById('net'); if (n) n.textContent = ''; });
window.addEventListener('offline', () => { const n = document.getElementById('net'); if (n) n.textContent = 'offline'; });

/* ---------- Today ---------- */
function Home() {
  const n = doneCount(), total = core.length, nm = nextModule(), sk = S.streaks();
  const wrap = h('div', { class: 'page' });
  if (nm) {
    const u = unitOf[nm.unit];
    wrap.append(h('section', { class: 'card hero' },
      h('div', { class: 'eyebrow' }, sk.doneToday ? 'Done for today: bonus module' : "Today's module"),
      h('h1', null, nm.title),
      h('p', { class: 'muted' }, `Module ${num(nm)} · Unit ${u.id}: ${u.title} · ~${nm.minutes} min`),
      h('p', { class: 'small' }, '🌿 ', nm.analogy),
      nm.ready ? null : h('p', { class: 'small muted' }, 'This module is planned but not written yet: you can read its objectives and lab outline.'),
      h('div', { class: 'btns' },
        link(`#/module/${nm.id}`, nm.ready ? 'Open module' : 'See the plan', 'btn primary'),
        nm.ready ? h('button', { class: 'btn', onclick: () => { S.setDone(nm.id, true); toast('Marked complete 🎉'); render(); } }, 'Mark complete') : null)));
  } else wrap.append(h('section', { class: 'card hero' }, h('h1', null, '🎉 Course complete'), h('p', null, 'Your ecosystem is built. Keep it alive: rerun the evals monthly and add one source a week to the field notebook.')));
  wrap.append(h('section', { class: 'stats' },
    stat(`${sk.current}🔥`, 'day streak', `best ${sk.longest}`),
    stat(`${n}/${modules.length}`, 'modules done', `${Math.round((n / modules.length) * 100)}%`),
    stat(`${ready.length}`, 'modules written', `of ${modules.length} planned`)));
  const st = S.get(); const sched = Math.max(1, S.daysBetween(st.startDate, S.todayStr()) + 1);
  const diff = n - Math.min(total, sched - 1);
  wrap.append(h('section', { class: 'card' }, h('div', { class: 'spread' }, h('strong', null, 'Pace'), h('span', { class: 'muted small' }, `one module a day since ${st.startDate} → ${diff < 0 ? `${-diff} behind` : diff > 0 ? `${diff} ahead` : 'on schedule'}`)), bar((n / modules.length) * 100),
    h('p', { class: 'muted small' }, 'Self-paced: missed days never reset your place. “Today” is always the first module you have not finished.')));
  const us = h('section', { class: 'card' }, h('h2', null, 'Succession: 11 units'));
  for (const u of units) {
    const ms = modules.filter((m) => m.unit === u.id), d = ms.filter((m) => S.isDone(m.id)).length;
    us.append(h('a', { class: 'month', href: `#/modules?unit=${u.id}` }, h('div', { class: 'spread' }, h('strong', null, `${u.id}. ${u.title}`), h('span', { class: 'muted' }, `${d}/${ms.length}`)),
      h('div', { class: 'muted small' }, 'Builds: ' + u.build), bar((d / ms.length) * 100)));
  }
  wrap.append(us);
  const upcoming = modules.filter((m) => !S.isDone(m.id)).slice(1, 4);
  if (upcoming.length) wrap.append(h('section', { class: 'card' }, h('h2', null, 'Up next'), upcoming.map(moduleRow)));
  return wrap;
}
const stat = (big, label, sub) => h('div', { class: 'stat' }, h('div', { class: 'big' }, big), h('div', null, label), h('div', { class: 'muted small' }, sub));

/* ---------- Modules list ---------- */
function Modules(params) {
  let unit = params.get('unit') || 'all', status = 'all', q = '';
  const list = h('div', { class: 'list' });
  const draw = () => {
    list.replaceChildren();
    const f = modules.filter((m) => (unit === 'all' || String(m.unit) === unit) && (status === 'all' || (status === 'done') === S.isDone(m.id)) && (!q || outlineText(m).toLowerCase().includes(q)));
    if (!f.length) list.append(h('p', { class: 'muted' }, 'Nothing matches.'));
    let last = null;
    for (const m of f) { if (m.unit !== last) { last = m.unit; list.append(h('h3', { class: 'grp' }, `Unit ${m.unit}: ${unitOf[m.unit].title}`)); } list.append(moduleRow(m)); }
  };
  const mk = (opts, cur, set) => h('div', { class: 'chips' }, opts.map(([v, l]) => h('button', { class: 'chip' + (cur() === v ? ' on' : ''), onclick: (e) => { set(v); e.target.parentElement.querySelectorAll('button').forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, l)));
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Modules'), h('p', { class: 'muted' }, `${modules.length} modules · ~30 min each · ${ready.length} written so far`),
    mk([['all', 'All'], ...units.map((u) => [String(u.id), 'U' + u.id])], () => unit, (v) => (unit = v)),
    mk([['all', 'Any'], ['todo', 'To do'], ['done', 'Done']], () => status, (v) => (status = v)),
    h('input', { type: 'search', placeholder: 'Filter modules…', class: 'inp', 'aria-label': 'Filter modules', oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } }), list);
  draw();
  return wrap;
}

/* ---------- Module page ---------- */
function splitSelfCheck(md) {
  const m = md.match(/^## [^\n]*Self-check[^\n]*\n[\s\S]*?(?=^## )/m);
  return m ? [md.slice(0, m.index), md.slice(m.index + m[0].length)] : [md, ''];
}
function renderMd(md, citationOrder = []) {
  const { md: marked1 } = markCitations(md, citationOrder);
  const div = h('div', { class: 'md', html: marked.parse(marked1) });
  div.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  div.querySelectorAll('pre').forEach((pre) => {
    const btn = h('button', { class: 'btn small copy', onclick: async () => { try { await navigator.clipboard.writeText(pre.innerText); btn.textContent = 'Copied ✓'; } catch { btn.textContent = 'Select & copy'; } setTimeout(() => (btn.textContent = 'Copy'), 1500); } }, 'Copy');
    pre.before(h('div', { class: 'copyrow' }, btn));
  });
  div.querySelectorAll('blockquote').forEach((b) => { const t = b.textContent.trim().toLowerCase(); if (t.startsWith('where the metaphor fails')) b.classList.add('fails'); else if (t.startsWith('background')) b.classList.add('bg'); });
  wireCitations(div); mountWidgets(div);
  return div;
}
function SelfCheck(m) {
  const qs = h('section', { class: 'card' }, h('h2', null, '🧠 Self-check'), h('p', { class: 'muted small' }, 'Answer in your head first, then reveal. Your grading feeds Quiz mode.'));
  m.questions.forEach((q, i) => {
    const qid = `${m.id}#${i}`;
    const ans = h('div', { class: 'ans', hidden: true }, h('div', { class: 'md', html: marked.parseInline(q.a) }), h('div', { class: 'btns' },
      h('button', { class: 'btn ok small', onclick: (e) => { S.recordAnswer(qid, true); e.target.parentElement.textContent = '✓ got it'; } }, 'Got it'),
      h('button', { class: 'btn bad small', onclick: (e) => { S.recordAnswer(qid, false); e.target.parentElement.textContent = '↻ marked for review'; } }, 'Review')));
    qs.append(h('div', { class: 'q' }, h('p', null, h('strong', null, `${i + 1}. `), q.q), h('button', { class: 'btn small', onclick: (e) => { ans.hidden = !ans.hidden; e.target.textContent = ans.hidden ? 'Show answer' : 'Hide answer'; } }, 'Show answer'), ans));
  });
  return qs;
}
function sourceList(ids) {
  return h('ul', { class: 'srcs' }, ids.map((id) => { const s = srcById[id]; return s ? h('li', null, ext(s.url, s.title), h('span', { class: 'muted small' }, ` · ${s.author} · ${s.date} ${STARS[s.priority]}`)) : null; }));
}
function Module(id) {
  const m = byId[id]; if (!m) return h('div', { class: 'page' }, h('p', null, 'Module not found.'), link('#/modules', 'All modules'));
  const i = modules.indexOf(m), prev = modules[i - 1], next = modules[i + 1], u = unitOf[m.unit];
  const wrap = h('div', { class: 'page' });
  wrap.append(h('div', { class: 'crumbs' }, link('#/modules', '← Modules'), h('span', { class: 'muted' }, `Module ${num(m)}/${modules.length}`)),
    h('h1', null, m.title),
    h('div', { class: 'chips' }, chip(`Unit ${u.id}: ${u.title}`), chip(`~${m.minutes} min`), m.optional ? chip('optional') : null, S.isDone(m.id) ? chip('Completed ✓', 'ok') : null));
  if (!m.ready) {
    wrap.append(h('section', { class: 'card hero' }, h('div', { class: 'eyebrow' }, 'Planned module'), h('p', null, 'The full text, narration and self-check for this module are still being written. Here is the plan.')),
      h('section', { class: 'card' }, h('h2', null, '🎯 Objectives'), h('ul', null, m.objectives.map((o) => h('li', null, o)))),
      h('section', { class: 'card' }, h('h2', null, '🌿 Ecology analogy'), h('p', null, m.analogy)),
      h('section', { class: 'card' }, h('h2', null, '🛠 Lab (outline)'), h('p', null, m.lab)),
      h('section', { class: 'card' }, h('h2', null, '📚 Sources it will draw on'), sourceList(m.source_ids)));
  } else {
    if (m.audio) wrap.append(AudioPlayer({ src: m.audio.mp3, srt: m.audio.srt, title: m.title, album: `Unit ${u.id}: ${u.title}` }));
    else wrap.append(h('p', { class: 'muted small' }, '🎧 Narration for this module has not been generated yet.'));
    const body = h('div', null, h('p', { class: 'muted' }, 'Loading…'));
    const after = h('div');
    wrap.append(body, after);
    fetchMd(m.id).then((md) => {
      const [a, b] = splitSelfCheck(md);
      const citationOrder = [];
      body.replaceChildren(renderMd(a, citationOrder));
      if (m.questions.length) after.append(SelfCheck(m));
      if (b) after.append(renderMd(b, citationOrder));
      const exBox = h('input', { type: 'checkbox', checked: !!S.get().exercise[m.id], onchange: (e) => S.setExercise(m.id, e.target.checked) });
      after.append(h('section', { class: 'card' }, h('label', { class: 'check' }, exBox, ' I did the lab')));
    }).catch(() => body.replaceChildren(h('p', { class: 'muted' }, navigator.onLine ? 'Could not load this module.' : 'Offline and this module is not cached yet.')));
  }
  const ta = h('textarea', { class: 'notes', rows: 5, placeholder: 'Your notes for this module (saved on this device)…', 'aria-label': 'Notes' }, S.get().notes[m.id] || '');
  let tm; ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => S.setNote(m.id, ta.value.trim()), 400); });
  const done = S.isDone(m.id);
  wrap.append(h('section', { class: 'card' }, h('h2', null, '🗒 Field notes'), ta),
    h('div', { class: 'actions' },
      prev ? link(`#/module/${prev.id}`, '‹ Prev', 'btn') : h('span'),
      h('button', { class: 'btn big ' + (done ? '' : 'primary'), onclick: () => { S.setDone(m.id, !done); if (!done) { toast('Module complete 🎉'); const n = nextModule(); if (n) { location.hash = `#/module/${n.id}`; return; } } render(); } }, done ? 'Mark as not done' : 'Mark complete'),
      next ? link(`#/module/${next.id}`, 'Next ›', 'btn') : h('span')));
  return wrap;
}

/* ---------- Quiz ---------- */
function Quiz() {
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Quiz mode'));
  const st = S.get();
  const all = () => modules.flatMap((m) => m.questions.map((q, i) => ({ ...q, qid: `${m.id}#${i}`, mod: m })));
  const pool = (scope) => {
    if (scope === 'today') { const n = nextModule(); return all().filter((x) => n && x.mod.id === n.id); }
    if (scope === 'done') return all().filter((x) => S.isDone(x.mod.id));
    if (scope === 'missed') return all().filter((x) => (st.qstats[x.qid] || {}).last === 'wrong');
    return all();
  };
  const area = h('div');
  wrap.append(h('p', { class: 'muted' }, 'Flashcards from every written module: answer in your head, reveal, grade yourself honestly. Missed cards come back under “Missed”.'));
  const menu = h('div', { class: 'card' });
  [['today', "Today's module", 'Questions from the module you are on'], ['done', 'Completed modules', 'Spaced review of what you have finished'], ['missed', 'Missed questions', 'Cards you marked “Review”'], ['all', 'Everything (random)', 'Any question from all written modules']].forEach(([s, l, d]) => {
    const c = pool(s).length;
    menu.append(h('button', { class: 'menu', disabled: c === 0, onclick: () => { menu.hidden = true; runQuiz(area, shuffle(pool(s)).slice(0, 10), s); } }, h('strong', null, `${l} (${c})`), h('span', { class: 'muted small' }, d)));
  });
  wrap.append(menu, area);
  const hist = st.sessions.slice(-5).reverse();
  if (hist.length) wrap.append(h('section', { class: 'card' }, h('h2', null, 'Recent sessions'), hist.map((s) => h('div', { class: 'spread' }, h('span', null, `${new Date(s.t).toLocaleDateString()} · ${s.scope}`), h('strong', null, `${s.right}/${s.total}`)))));
  return wrap;
}
function runQuiz(area, cards, scope) {
  let i = 0, right = 0;
  const show = () => {
    area.replaceChildren();
    if (i >= cards.length) {
      S.addSession({ t: Date.now(), right, total: cards.length, scope });
      area.append(h('section', { class: 'card hero' }, h('h2', null, 'Session complete'), h('p', { class: 'big' }, `${right} / ${cards.length}`), h('button', { class: 'btn primary', onclick: () => render() }, 'Back to quiz menu')));
      return;
    }
    const c = cards[i];
    const ans = h('div', { class: 'ans md', hidden: true, html: marked.parseInline(c.a) });
    const grade = h('div', { class: 'btns', hidden: true },
      h('button', { class: 'btn ok', onclick: () => { right++; S.recordAnswer(c.qid, true); i++; show(); } }, 'Got it'),
      h('button', { class: 'btn bad', onclick: () => { S.recordAnswer(c.qid, false); i++; show(); } }, 'Missed'));
    area.append(h('section', { class: 'card' }, h('div', { class: 'spread muted small' }, h('span', null, `Card ${i + 1}/${cards.length}`), link(`#/module/${c.mod.id}`, 'module ↗')),
      bar((i / cards.length) * 100), h('p', { class: 'qbig' }, c.q), h('div', { class: 'muted small' }, c.mod.title),
      h('button', { class: 'btn primary', onclick: (e) => { ans.hidden = false; grade.hidden = false; e.target.hidden = true; } }, 'Reveal answer'), ans, grade));
  };
  show();
}

/* ---------- Search ---------- */
function Search(params) {
  const out = h('div'), inp = h('input', { type: 'search', class: 'inp', placeholder: 'e.g. “temperature”, “harness loop”, “BM25”', value: params.get('q') || '', 'aria-label': 'Search the course' });
  const run = async () => {
    const q = inp.value.trim(); if (!q) { out.replaceChildren(); return; }
    const res = query(await getIndex(), q, 15); out.replaceChildren();
    if (!res.length) { out.append(h('p', { class: 'muted' }, 'No matches. Try other keywords.')); return; }
    res.forEach(({ d }) => {
      if (d.kind === 'module') { const m = byId[d.id]; out.append(h('a', { class: 'card hit', href: `#/module/${m.id}` }, h('strong', null, `Module ${num(m)} · ${m.title}`), h('div', { class: 'muted small' }, snippet(d.text, q)))); }
      else { const s = srcById[d.id]; out.append(h('a', { class: 'card hit', href: s.url, target: '_blank', rel: 'noopener noreferrer' }, h('strong', null, `Source · ${s.title}`), h('div', { class: 'muted small' }, `${s.author} · ${s.date} ${STARS[s.priority]}`))); }
    });
  };
  inp.addEventListener('input', () => { clearTimeout(inp._t); inp._t = setTimeout(run, 150); });
  const w = h('div', { class: 'page' }, h('h1', null, 'Search'), h('p', { class: 'muted' }, 'Offline keyword search (BM25) over module text, module plans, source titles and your own notes.'), inp, out);
  run(); return w;
}

/* ---------- Library ---------- */
const TOPICS = [...new Set(sources.flatMap((s) => s.topics))].sort();
const citedBy = {};
modules.forEach((m) => [...new Set([...(m.source_ids || []), ...(m.cites || [])])].forEach((id) => (citedBy[id] = citedBy[id] || []).push(m.id)));
function Library(params) {
  let topic = 'all', prio = 0, q = '', only = params.get('id');
  const list = h('div', { class: 'list' }); const count = h('p', { class: 'muted small' });
  const draw = () => {
    list.replaceChildren();
    const f = sources.filter((s) => (only ? s.id === only : (topic === 'all' || s.topics.includes(topic)) && s.priority >= prio && (!q || (s.title + ' ' + s.author).toLowerCase().includes(q))))
      .sort((a, b) => b.priority - a.priority || b.date.localeCompare(a.date));
    count.textContent = `${f.length} of ${sources.length} sources`;
    f.forEach((s) => list.append(h('div', { class: 'row src' },
      h('span', { class: 'tick', title: `priority ${s.priority}` }, STARS[s.priority]),
      h('span', { class: 'rowmain' }, ext(s.url, s.title, 'rowtitle'),
        h('span', { class: 'rowsub' }, `${s.author} · ${s.date} · ${s.topics.join(', ')}`),
        citedBy[s.id] ? h('span', { class: 'rowsub' }, 'Used in: ', citedBy[s.id].map((id, k) => [k ? ', ' : '', link(`#/module/${id}`, id)])) : null))));
    if (only) list.append(link('#/library', 'Show all sources', 'btn small'));
  };
  const mk = (opts, cur, set) => h('div', { class: 'chips' }, opts.map(([v, l]) => h('button', { class: 'chip' + (cur() === v ? ' on' : ''), onclick: (e) => { only = null; set(v); e.target.parentElement.querySelectorAll('button').forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, l)));
  const w = h('div', { class: 'page' }, h('h1', null, 'Library'),
    h('p', { class: 'muted' }, 'Every source in the course’s research pack, linking to the originals. ★★★ core · ★★ useful · ★ optional/example. Hype-flavoured posts are pointers only; modules teach from primary material wherever possible.'),
    mk([[0, 'Any priority'], [3, '★★★'], [2, '★★+'], [1, '★+']], () => prio, (v) => (prio = v)),
    mk([['all', 'All topics'], ...TOPICS.map((t) => [t, t])], () => topic, (v) => (topic = v)),
    h('input', { type: 'search', class: 'inp', placeholder: 'Filter by title or author…', 'aria-label': 'Filter sources', oninput: (e) => { only = null; q = e.target.value.toLowerCase(); draw(); } }), count, list);
  draw(); return w;
}

/* ---------- Widgets page ---------- */
function Widgets() {
  const w = h('div', { class: 'page' }, h('h1', null, 'Field kit'), h('p', { class: 'muted' }, 'All interactive widgets in one place. Each also appears inside its module.'));
  for (const [k, v] of Object.entries(WIDGETS)) w.append(h('p', { class: 'small muted' }, `From ${v.module}: `, link(`#/module/${v.module}`, byId[v.module]?.title || v.module)), h('div', { 'data-widget': k }));
  mountWidgets(w); return w;
}

/* ---------- More / Notes / Settings / About ---------- */
function More() {
  const w = h('div', { class: 'page' }, h('h1', null, 'More'));
  [['#/search', '🔎 Search', 'Offline search over modules, sources and your notes'], ['#/widgets', '🧪 Field kit', '3D weights and predictions, landscape optimizer, temperature sampler, BM25 playground'], ['#/notes', '🗒 Notes', 'All your module notes'], ['#/settings', '⚙️ Settings & backup', 'Theme, start date, export/import progress, install'], ['#/about', 'ℹ️ About', 'Sources, method and honest limitations']]
    .forEach(([href, t, d]) => w.append(h('a', { class: 'menu', href }, h('strong', null, t), h('span', { class: 'muted small' }, d))));
  return w;
}
function Notes() {
  const notes = Object.entries(S.get().notes).map(([id, t]) => [byId[id], t]).filter(([m]) => m).sort((a, b) => num(a[0]) - num(b[0]));
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Notes'), h('p', { class: 'muted' }, `${notes.length} module${notes.length === 1 ? '' : 's'} with notes. Notes stay on this device.`));
  if (notes.length) wrap.append(h('div', { class: 'btns' }, h('button', { class: 'btn', onclick: () => download('learn-ai-notes.md', notes.map(([m, t]) => `## ${m.id}: ${m.title}\n\n${t}\n`).join('\n'), 'text/markdown') }, 'Export as Markdown')));
  notes.forEach(([m, t]) => wrap.append(h('section', { class: 'card' }, h('h3', null, link(`#/module/${m.id}`, `${m.id}: ${m.title}`)), h('p', { class: 'pre' }, t))));
  if (!notes.length) wrap.append(h('p', null, 'Nothing yet: open a module and jot something down.'));
  return wrap;
}
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; const b = document.getElementById('installBtn'); if (b) b.hidden = false; });
function Settings() {
  const st = S.get();
  const file = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async (e) => { try { S.importJSON(await e.target.files[0].text()); toast('Progress imported'); render(); } catch (err) { toast('Import failed: ' + err.message); } } });
  return h('div', { class: 'page' }, h('h1', null, 'Settings & backup'),
    h('section', { class: 'card' }, h('h2', null, 'Appearance'), h('div', { class: 'chips' }, [['auto', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => h('button', { class: 'chip' + (st.theme === v ? ' on' : ''), onclick: () => { S.setTheme(v); render(); } }, l)))),
    h('section', { class: 'card' }, h('h2', null, 'Start date'), h('p', { class: 'muted small' }, 'Used only for the pace indicator.'), h('input', { type: 'date', class: 'inp', value: st.startDate, onchange: (e) => { if (e.target.value) S.setStartDate(e.target.value); toast('Start date saved'); } })),
    h('section', { class: 'card' }, h('h2', null, 'Install'), h('p', { class: 'muted small' }, 'Install to your home screen or desktop. After the first load the course text works offline; each narration is saved for offline use the first time you play it.'),
      h('button', { class: 'btn primary', id: 'installBtn', hidden: !deferredInstall, onclick: async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; } }, 'Install app'),
      h('p', { class: 'muted small' }, 'No install button? iPhone: Share → Add to Home Screen. Desktop Chrome/Edge: install icon in the address bar.')),
    h('section', { class: 'card' }, h('h2', null, 'Backup'), h('p', { class: 'muted small' }, 'Progress, notes and quiz stats live only in this browser. Export a backup to move devices.'),
      h('div', { class: 'btns' }, h('button', { class: 'btn', onclick: () => download(`learn-ai-progress-${S.todayStr()}.json`, S.exportJSON()) }, 'Export progress'), h('button', { class: 'btn', onclick: () => file.click() }, 'Import progress'), file)),
    h('section', { class: 'card' }, h('h2', null, 'Danger zone'), h('button', { class: 'btn bad', onclick: () => { if (confirm('Erase all progress, notes and quiz stats on this device?')) { S.resetAll(); toast('Reset'); render(); } } }, 'Reset all progress')));
}
function About() {
  return h('div', { class: 'page' }, h('h1', null, 'About'),
    h('section', { class: 'card' }, h('p', null, `${course.title}. ${course.subtitle}`),
      h('p', null, 'Every module is grounded in a curated research pack of ', String(sources.length), ' sources (posts, papers, official docs, course lectures and transcripts). Inline numbered citations open a card with the source; the Library lists them all.'),
      h('p', null, 'Honest notes:'), h('ul', null,
        h('li', null, 'Some linked pages could not be fetched (JavaScript-only sites, 403s) and some videos have no transcript; modules do not summarise what could not be read.'),
        h('li', null, 'Five long X videos were transcribed locally by a small speech model, so names can be mis-heard (e.g. “Claude” as “Cloud”). CMU lecture transcripts are YouTube auto-captions.'),
        h('li', null, 'Some sources are promotional or make unverified numeric claims; modules flag these and teach the durable idea instead.'),
        h('li', null, 'Model and product names change quickly; the course teaches the underlying concept (e.g. “a cheap fast classifier in front of an expensive model”).'),
        h('li', null, 'Narration uses a free neural text-to-speech voice (edge-tts, Ava). Widget numbers are illustrative unless a source is cited.'),
        h('li', null, 'Everything you do is stored locally; nothing is uploaded.')),
      h('p', { class: 'small muted' }, `Content build: ${course.generated}`)));
}

/* ---------- router ---------- */
function render() {
  disposeWidgets();
  stopAudio();
  const [pathPart, qs] = (location.hash || '#/').split('?');
  const params = new URLSearchParams(qs || '');
  const route = pathPart || '#/';
  let view;
  if (route.startsWith('#/module/')) view = Module(route.slice(9));
  else if (route === '#/modules') view = Modules(params);
  else if (route === '#/quiz') view = Quiz();
  else if (route === '#/search') view = Search(params);
  else if (route === '#/library') view = Library(params);
  else if (route === '#/widgets') view = Widgets();
  else if (route === '#/more') view = More();
  else if (route === '#/notes') view = Notes();
  else if (route === '#/settings') view = Settings();
  else if (route === '#/about') view = About();
  else view = Home();
  app.replaceChildren(shell(route.startsWith('#/module/') ? '#/modules' : route, view));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
render();
