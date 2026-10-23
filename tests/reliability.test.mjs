import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { AudioPlayer, parseSRT } from '../src/audio.js';
import * as S from '../src/store.js';

// A minimal DOM/media double; these tests cover player logic, not browser/SW integration.
class Element extends EventTarget {
  constructor(tag) { super(); this.tag = tag; this.nodeType = 1; this.children = []; this.attrs = {}; this.textContent = ''; this.paused = true; this.currentTime = 0; this.duration = 180; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  append(...children) { this.children.push(...children); }
  play() {
    if (this.rejectPlay) return Promise.reject(new Error('offline'));
    this.paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve();
  }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
  load() { this.error = null; }
}
const walk = (el) => [el, ...el.children.flatMap(walk)];
const flush = () => new Promise((resolve) => setImmediate(resolve));
const storage = new Map();
globalThis.document = { createElement: (tag) => new Element(tag), createTextNode: (s) => Object.assign(new Element('#text'), { textContent: s }) };
globalThis.localStorage = { getItem: (k) => storage.get(k), setItem: (k, v) => storage.set(k, v) };
globalThis.location = { href: 'https://example.test/learn-ai-course/' };
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } });
globalThis.window = {};
S.load();

function player(cache) {
  window.caches = globalThis.caches = { open: async () => cache };
  const root = AudioPlayer({ src: 'audio/m01.mp3', title: 'Test' });
  const elements = walk(root);
  return { audio: elements.find((e) => e.tag === 'audio'), status: elements.find((e) => e.attrs.role === 'status'), button: elements.find((e) => e.attrs['aria-label'] === 'Play'), cap: elements.find((e) => e.className === 'acap') };
}

test('failed first save is retried; only completed caching confirms offline availability', async () => {
  let saved = false, fail = true, attempts = 0;
  const p = player({ match: async () => saved, add: async () => { attempts++; if (fail) throw new Error('quota/network'); saved = true; } });
  await p.button.onclick(); await flush();
  assert.match(p.status.textContent, /not saved offline/);
  fail = false; p.audio.pause(); await p.button.onclick(); await flush();
  assert.equal(attempts, 2); assert.match(p.status.textContent, /available offline/);
});

test('offline cached audio needs no download; fresh audio never claims it is saved', async () => {
  navigator.onLine = false;
  const cached = player({ match: async () => true, add: async () => { throw new Error('must not fetch'); } });
  await flush(); assert.match(cached.status.textContent, /available offline/);
  await cached.button.onclick(); await flush(); assert.match(cached.status.textContent, /available offline/);
  const fresh = player({ match: async () => false, add: async () => { throw new Error('offline'); } });
  fresh.audio.rejectPlay = true;
  await fresh.button.onclick(); await flush();
  assert.match(fresh.status.textContent, /Offline: narration is unavailable/);
  fresh.audio.dispatchEvent(new Event('timeupdate'));
  assert.match(fresh.status.textContent, /Offline:/); // captions must not erase errors
  navigator.onLine = true;
});

test('cached state waits until full download completes', async () => {
  let finish, saved = false;
  const p = player({ match: async () => saved, add: () => new Promise((r) => { finish = () => { saved = true; r(); }; }) });
  await p.button.onclick(); await flush();
  assert.match(p.status.textContent, /Saving narration/);
  finish(); await flush(); assert.match(p.status.textContent, /available offline/);
});

test('media error is reloaded and Play rejection is handled', async () => {
  const p = player({ match: async () => true });
  p.audio.error = { code: 2 }; p.audio.rejectPlay = true;
  await p.button.onclick(); await flush(); assert.equal(p.audio.error, null);
  assert.match(p.status.textContent, /Press Play to retry/);
});

test('progress, notes, quiz stats and preferences survive a store reload', () => {
  S.setDone('m03', true); S.setNote('m03', 'saved'); S.setExercise('m03', true); S.recordAnswer('m03#0', false);
  S.get().speed = 1.5; S.get().captions = false; S.save(); S.load();
  assert.equal(S.isDone('m03'), true); assert.equal(S.get().notes.m03, 'saved');
  assert.equal(S.get().exercise.m03, true); assert.equal(S.get().qstats['m03#0'].last, 'wrong');
  assert.equal(S.get().speed, 1.5); assert.equal(S.get().captions, false);
});

test('citation numbers remain stable across separated lesson sections', async () => {
  // Inline JSON solely to adapt Vite's JSON imports to Node without adding a loader.
  const code = fs.readFileSync(new URL('../src/cite.js', import.meta.url), 'utf8')
    .replace("import sources from './generated/sources.json';", `const sources = ${fs.readFileSync(new URL('../src/generated/sources.json', import.meta.url), 'utf8')};`)
    .replace("'./ui.js'", JSON.stringify(pathToFileURL(new URL('../src/ui.js', import.meta.url).pathname).href));
  const { markCitations, byId } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  const [a, b] = Object.keys(byId), order = [];
  const first = markCitations(`[S:${a}] [S:${b}]`, order);
  const second = markCitations(`[S:${b}] [S:${a}]`, order);
  assert.match(first.md, />1<\/a>.*>2<\/a>/); assert.match(second.md, />2<\/a>.*>1<\/a>/);
});

test('captions accept CRLF and retain seek timing', () => {
  assert.deepEqual(parseSRT('1\r\n00:00:01,500 --> 00:00:03,000\r\nHello\r\nworld\r\n'), [{ start: 1.5, end: 3, text: 'Hello world' }]);
});
