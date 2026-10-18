#!/usr/bin/env node
// Build-time data prep. Reads the course content (course/) and, when present, the RAG pack (learn-ai-rag/),
// and writes the small data files the app ships:
//   src/generated/course.json   outline + per-module metadata (questions, audio, sources) -> bundled
//   src/generated/sources.json  trimmed source index (id, title, author, date, url, topics, priority) -> bundled
//   public/data/modules/mNN.md  module text (precached by the service worker)
//   public/data/chunks.json     small chunk subset for the BM25 playground (fetched on demand)
// The pack is NOT in the git repo. Without it (e.g. in CI) the pack-derived files that are already committed are kept.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PACK = path.join(ROOT, 'learn-ai-rag');
const COURSE = path.join(ROOT, 'course');
const GEN = path.join(ROOT, 'src/generated');
const PUB = path.join(ROOT, 'public/data');
const AUDIO = path.join(ROOT, 'public/audio');
const hasPack = fs.existsSync(path.join(PACK, 'sources/index.json'));
fs.mkdirSync(GEN, { recursive: true });
fs.mkdirSync(path.join(PUB, 'modules'), { recursive: true });
const writeJSON = (p, o) => fs.writeFileSync(p, JSON.stringify(o) + '\n');
const readJSON = (p, fb) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fb);

/* ---------- 1. trimmed source index ---------- */
if (hasPack) {
  const idx = JSON.parse(fs.readFileSync(path.join(PACK, 'sources/index.json'), 'utf8'));
  const P = { H: 3, M: 2, L: 1 };
  const trimmed = idx.map((m) => ({
    id: m.id, title: m.title, author: m.handle ? `${m.author} (@${m.handle})` : m.author,
    date: (m.date || '').slice(0, 10), url: m.url, topics: m.topics || [], priority: P[m.priority] || 1,
  }));
  writeJSON(path.join(GEN, 'sources.json'), trimmed);
  console.log(`sources: ${trimmed.length} trimmed records`);
} else if (!fs.existsSync(path.join(GEN, 'sources.json'))) {
  throw new Error('No RAG pack at learn-ai-rag/ and no committed src/generated/sources.json');
} else console.log('sources: pack not found, keeping committed src/generated/sources.json');

/* ---------- 2. chunk subset for the BM25 playground ---------- */
if (hasPack) {
  const pick = new Map();   // source_id -> count
  const out = [];
  const lines = fs.readFileSync(path.join(PACK, 'corpus/chunks.jsonl'), 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    const c = JSON.parse(line);
    if (c.priority !== 'H') continue;
    const n = pick.get(c.source_id) || 0;
    if (n >= 3) continue;
    // short excerpt only (copyright + bundle size); strip URLs and markdown noise
    const words = c.text.replace(/^- Post opens with:.*$/gm, '').replace(/^#+ .*$/gm, '').replace(/https?:\/\/\S+/g, '')
      .replace(/[#*_`>|[\]]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    if (words.length < 60) continue;
    pick.set(c.source_id, n + 1);
    out.push({ id: c.id, source_id: c.source_id, title: c.source_title.slice(0, 90), kind: c.kind, topics: c.topics, text: words.slice(0, 110).join(' ') });
  }
  writeJSON(path.join(PUB, 'chunks.json'), out);
  console.log(`chunks: ${out.length} excerpts from ${pick.size} core sources`);
}

/* ---------- 3. course: outline + modules + narration manifest ---------- */
const outline = readJSON(path.join(COURSE, 'outline.json'), null);
if (!outline) throw new Error('course/outline.json missing');
const manifest = readJSON(path.join(AUDIO, 'manifest.json'), {});

function parseModule(md) {
  const fm = {}; let body = md;
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (m) { body = md.slice(m[0].length); for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = l.slice(i + 1).trim(); } }
  // self-check: "**Q1. question**" then "A: answer" (until next Q or next heading)
  const sc = body.match(/^## [^\n]*Self-check[^\n]*\n([\s\S]*?)(?=^## )/m);
  const questions = [];
  if (sc) for (const q of sc[1].matchAll(/\*\*Q\d+\.\s*([\s\S]+?)\*\*\s*\n+A:\s*([\s\S]+?)(?=\n\s*\*\*Q\d+\.|\s*$)/g)) questions.push({ q: q[1].trim(), a: q[2].trim() });
  const built = (body.match(/^## [^\n]*What you built today[^\n]*\n+([^\n]+)/m) || [])[1] || '';
  const cites = [...new Set([...body.matchAll(/\[S:(\d{15,20})\]/g)].map((x) => x[1]))];
  return { fm, body, questions, built: built.trim(), cites };
}

const mods = [];
for (const u of outline.units) for (const mo of u.modules) {
  const file = path.join(COURSE, 'modules', `${mo.id}.md`);
  const rec = { id: mo.id, unit: u.id, title: mo.title, optional: !!mo.optional, objectives: mo.objectives, analogy: mo.analogy, lab: mo.lab, source_ids: mo.source_ids, ready: false, questions: [], built: '', audio: null, minutes: 30 };
  if (fs.existsSync(file)) {
    const p = parseModule(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(path.join(PUB, 'modules', `${mo.id}.md`), p.body);
    Object.assign(rec, { ready: true, questions: p.questions, built: p.built, cites: p.cites, title: p.fm.title || mo.title, minutes: Number(p.fm.minutes) || 30 });
  }
  const a = manifest[`${mo.id}.md`] || manifest[mo.id] || Object.values(manifest).find((x) => x && x.file === `${mo.id}.mp3`);
  if (a && fs.existsSync(path.join(AUDIO, `${mo.id}.mp3`))) rec.audio = { mp3: `audio/${mo.id}.mp3`, srt: fs.existsSync(path.join(AUDIO, `${mo.id}.srt`)) ? `audio/${mo.id}.srt` : null, seconds: a.seconds || null };
  mods.push(rec);
}
// drop stale module files
for (const f of fs.readdirSync(path.join(PUB, 'modules'))) if (!mods.some((m) => m.ready && `${m.id}.md` === f)) fs.unlinkSync(path.join(PUB, 'modules', f));

/* ---------- 4. optional companion tracks (course/tracks/*.md -> public/data/tracks/) ---------- */
const tracks = [];
const TR = path.join(COURSE, 'tracks');
fs.rmSync(path.join(PUB, 'tracks'), { recursive: true, force: true });
if (fs.existsSync(TR)) {
  fs.mkdirSync(path.join(PUB, 'tracks'), { recursive: true });
  for (const f of fs.readdirSync(TR).filter((x) => x.endsWith('.md')).sort()) {
    const p = parseModule(fs.readFileSync(path.join(TR, f), 'utf8'));
    fs.writeFileSync(path.join(PUB, 'tracks', f), p.body);
    tracks.push({ id: f.slice(0, -3), title: p.fm.title || f.slice(0, -3), cites: p.cites });
  }
}

const course = {
  tracks,
  title: outline.title, subtitle: outline.subtitle, generated: new Date().toISOString().slice(0, 10),
  units: outline.units.map((u) => ({ id: u.id, title: u.title, theme: u.theme, build: u.build })),
  modules: mods,
};
writeJSON(path.join(GEN, 'course.json'), course);
console.log(`tracks: ${tracks.length}`);
console.log(`course: ${mods.length} modules in outline, ${mods.filter((m) => m.ready).length} written, ${mods.filter((m) => m.audio).length} with audio`);
