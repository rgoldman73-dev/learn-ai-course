// Validate the committed course without the optional, untracked research pack.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseSRT } from '../src/audio.js';
const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const course = JSON.parse(read('src/generated/course.json'));
const sources = JSON.parse(read('src/generated/sources.json'));
const ids = new Set(sources.map((s) => s.id));
assert.equal(ids.size, sources.length, 'Duplicate source IDs');
for (const s of sources) assert.match(s.url, /^https?:\/\//, `Invalid URL for ${s.id}`);
for (const m of course.modules) {
  assert.ok(m.ready && m.questions.length && m.audio?.srt, `Incomplete ${m.id}`);
  const text = read(`public/data/modules/${m.id}.md`);
  assert.ok(text.length > 100 && !text.startsWith('---'), `Invalid lesson body ${m.id}`);
  for (const id of [...m.source_ids, ...m.cites, ...Array.from(text.matchAll(/\[S:(\d+)\]/g), (x) => x[1])]) {
    assert.ok(ids.has(id), `${m.id}: unknown source ${id}`);
  }
  assert.ok(fs.statSync(new URL('../public/' + m.audio.mp3, import.meta.url)).size > 1000, `Missing audio ${m.id}`);
  const cues = parseSRT(read('public/' + m.audio.srt));
  assert.ok(cues.length, `Missing captions ${m.id}`);
  for (const [i, c] of cues.entries()) {
    assert.ok(Number.isFinite(c.start) && c.end > c.start && c.text, `Invalid cue ${m.id}#${i}`);
    if (i) assert.ok(c.start >= cues[i - 1].end, `Overlapping cues ${m.id}#${i}`);
  }
}
console.log(`Validated ${course.modules.length} lessons, audio/captions, and ${sources.length} source records.`);
