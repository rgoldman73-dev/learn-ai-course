// Per-module narration player: play/pause, ±15 s, speed 0.8-2×, SRT captions + transcript, Media Session (lock screen).
// Audio is not precached; the first play stores the full mp3 in the 'learn-ai-audio' cache that the service worker serves from.
import { h } from './ui.js';
import * as S from './store.js';

const SPEEDS = [0.8, 1, 1.25, 1.5, 1.75, 2];
let current = null;   // the <audio> of the module on screen
export function stopAudio() { if (current) { current.pause(); current = null; } }

const ts = (s) => { const [hh, mm, rest] = s.split(':'); const [ss, ms] = rest.split(/[,.]/); return +hh * 3600 + +mm * 60 + +ss + +ms / 1000; };
export function parseSRT(text) {
  return text.replace(/\r/g, '').split(/\n\n+/).map((b) => {
    const lines = b.trim().split('\n'); const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) return null;
    const [a, z] = lines[i].split('-->').map((x) => ts(x.trim()));
    return { start: a, end: z, text: lines.slice(i + 1).join(' ') };
  }).filter(Boolean);
}
const clock = (s) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

async function cacheOnFirstPlay(url) {
  if (!('caches' in window)) return false;
  try {
    const c = await caches.open('learn-ai-audio');
    if (!(await c.match(url))) await c.add(url);
    return !!(await c.match(url));
  } catch { return false; /* offline or quota: retry on the next play */ }
}

export function AudioPlayer({ src, srt, title, album }) {
  const url = new URL(src, location.href).href;
  const audio = h('audio', { preload: 'metadata', src: url });
  current = audio;
  audio.playbackRate = S.get().speed || 1;
  const playBtn = h('button', { class: 'btn primary aplay', 'aria-label': 'Play' }, '▶');
  const seek = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'aseek', 'aria-label': 'Seek' });
  const time = h('span', { class: 'muted small atime' }, '0:00');
  const speed = h('select', { class: 'aspeed', 'aria-label': 'Playback speed' }, SPEEDS.map((v) => h('option', { value: v, selected: v === audio.playbackRate }, `${v}×`)));
  const cap = h('div', { class: 'acap', 'aria-live': 'off' });
  const status = h('p', { class: 'muted small', role: 'status' }, 'Narration is saved offline only after its full download finishes.');
  const ccBtn = h('button', { class: 'btn small', 'aria-pressed': 'true' }, 'CC');
  const transcript = h('details', { class: 'atrans' }, h('summary', { class: 'small' }, 'Transcript'));
  let cues = []; let showCC = S.get().captions !== false;
  ccBtn.setAttribute('aria-pressed', String(showCC)); cap.hidden = !showCC;

  const jump = (d) => { audio.currentTime = Math.min(Math.max(0, audio.currentTime + d), audio.duration || 1e9); };
  let playbackFailed = false;
  const showError = () => {
    playbackFailed = true;
    status.textContent = navigator.onLine ? 'Audio could not be loaded. Press Play to retry.' : 'Offline: narration is unavailable. Connect and play it to save the full audio on this device.';
  };
  const play = async () => {
    try { if (audio.error) audio.load(); await audio.play(); }
    catch { showError(); }
  };
  playBtn.onclick = () => (audio.paused ? play() : audio.pause());
  speed.onchange = () => { audio.playbackRate = +speed.value; S.get().speed = +speed.value; S.save(); };
  ccBtn.onclick = () => { showCC = !showCC; cap.hidden = !showCC; ccBtn.setAttribute('aria-pressed', String(showCC)); S.get().captions = showCC; S.save(); };
  seek.oninput = () => { if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration; };
  let saving = null;
  if ('caches' in window) caches.open('learn-ai-audio').then((c) => c.match(url)).then((r) => {
    if (r && !saving && !playbackFailed) status.textContent = 'Narration available offline on this device.';
  }).catch(() => {});
  audio.addEventListener('play', () => {
    playbackFailed = false;
    playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', 'Pause');
    if (!saving) {
      status.textContent = 'Saving narration for offline use…';
      saving = cacheOnFirstPlay(url).then((ok) => {
        if (playbackFailed) return;
        status.textContent = ok ? 'Narration available offline on this device.' : 'Narration was not saved offline. Check your connection and device storage, then pause and play to retry.';
      }).finally(() => { saving = null; });
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Learn AI', album, artwork: [{ src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }] });
      const ms = navigator.mediaSession;
      const set = (a, f) => { try { ms.setActionHandler(a, f); } catch { /* unsupported action */ } };
      set('play', play); set('pause', () => audio.pause());
      set('seekbackward', (e) => jump(-(e.seekOffset || 15))); set('seekforward', (e) => jump(e.seekOffset || 15));
      set('seekto', (e) => { audio.currentTime = e.seekTime; });
      set('stop', () => { audio.pause(); audio.currentTime = 0; });
    }
  });
  audio.addEventListener('pause', () => { playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play'); });
  audio.addEventListener('ratechange', () => { speed.value = String(audio.playbackRate); });
  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime, d = audio.duration || 0;
    time.textContent = `${clock(t)} / ${clock(d)}`;
    if (d) seek.value = String(Math.round((t / d) * 1000));
    const c = cues.find((x) => t >= x.start && t < x.end); cap.textContent = c ? c.text : '';
    if ('mediaSession' in navigator && d && navigator.mediaSession.setPositionState) {
      try { navigator.mediaSession.setPositionState({ duration: d, playbackRate: audio.playbackRate, position: Math.min(t, d) }); } catch { /* ignore */ }
    }
  });
  audio.addEventListener('loadedmetadata', () => { time.textContent = `0:00 / ${clock(audio.duration)}`; });
  audio.addEventListener('error', showError);

  if (srt) fetch(new URL(srt, location.href)).then((r) => (r.ok ? r.text() : '')).then((t) => {
    cues = parseSRT(t);
    transcript.append(h('div', { class: 'small' }, cues.map((c) => h('p', null, h('a', { href: '#', onclick: (e) => { e.preventDefault(); audio.currentTime = c.start; play(); } }, clock(c.start)), ' ', c.text))));
  }).catch(() => {});

  return h('section', { class: 'card player' },
    h('div', { class: 'spread' }, h('h2', null, '🎧 Narrated intro'), time),
    h('div', { class: 'acontrols' },
      h('button', { class: 'btn', 'aria-label': 'Back 15 seconds', onclick: () => jump(-15) }, '↺15'),
      playBtn,
      h('button', { class: 'btn', 'aria-label': 'Forward 15 seconds', onclick: () => jump(15) }, '15↻'),
      speed, ccBtn),
    seek, cap, status, transcript, audio);
}
