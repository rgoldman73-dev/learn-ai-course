// Temperature sampler: how temperature and top-p reshape one next-token distribution.
// The scores below are ILLUSTRATIVE numbers chosen for teaching, not output from a real model.
import { h } from '../ui.js';

const PRESETS = {
  concerto: { label: 'Peaked: “The concerto was written for solo …”', logits: { violin: 4.0, piano: 3.6, cello: 2.9, flute: 2.2, trumpet: 1.8, guitar: 1.2, harp: 0.5, voice: 0.3, orchestra: 0.1, airplane: -2.5 } },
  animal: { label: 'Flat: “My favourite animal is the …”', logits: { dog: 2.2, cat: 2.1, octopus: 1.6, elephant: 1.6, wolf: 1.5, owl: 1.4, axolotl: 1.2, tardigrade: 1.0, beetle: 0.9, platypus: 0.9 } },
};

export function probs(logits, T, topP) {
  const ks = Object.keys(logits);
  if (T <= 0.001) { const best = ks.reduce((a, b) => (logits[b] > logits[a] ? b : a)); return Object.fromEntries(ks.map((k) => [k, k === best ? 1 : 0])); }
  const m = Math.max(...ks.map((k) => logits[k]));
  const e = ks.map((k) => [k, Math.exp((logits[k] - m) / T)]); const z = e.reduce((s, [, v]) => s + v, 0);
  let p = e.map(([k, v]) => [k, v / z]).sort((a, b) => b[1] - a[1]);
  if (topP < 1) {   // nucleus: keep the smallest set of top tokens whose total probability reaches top-p
    let c = 0; const keep = []; for (const [k, v] of p) { keep.push([k, v]); c += v; if (c >= topP) break; }
    const z2 = keep.reduce((s, [, v]) => s + v, 0); p = p.map(([k, v]) => [k, keep.some(([kk]) => kk === k) ? v / z2 : 0]);
  }
  return Object.fromEntries(p);
}
const sample = (p) => { let r = Math.random(); for (const [k, v] of Object.entries(p)) { r -= v; if (r <= 0) return k; } return Object.keys(p)[0]; };
const entropy = (p) => -Object.values(p).reduce((s, v) => s + (v > 0 ? v * Math.log2(v) : 0), 0);

export function temperature(el) {
  const st = { preset: 'concerto', T: 1, topP: 1 };
  const bars = h('div', { class: 'wbars' }); const info = h('div', { class: 'small muted' }); const draws = h('div', { class: 'chips' }); const drawInfo = h('div', { class: 'small' });
  const cur = () => probs(PRESETS[st.preset].logits, st.T, st.topP);
  function draw() {
    const p = cur(); bars.replaceChildren();
    for (const [k, v] of Object.entries(p).sort((a, b) => b[1] - a[1])) {
      bars.append(h('div', { class: 'wbar' }, h('span', { class: 'wbl' }, k), h('span', { class: 'wbt' }, h('i', { style: `width:${(v * 100).toFixed(1)}%` })), h('span', { class: 'wbv' }, `${(v * 100).toFixed(1)}%`)));
    }
    info.textContent = `Entropy ${entropy(p).toFixed(2)} bits · tokens still possible: ${Object.values(p).filter((v) => v > 0).length}/10`;
  }
  function many(n) {
    const p = cur(); const got = Array.from({ length: n }, () => sample(p));
    draws.replaceChildren(...got.map((k) => h('span', { class: 'chip' }, k)));
    drawInfo.textContent = `${n} samples → ${new Set(got).size} distinct words.`;
  }
  const sl = (label, key, min, max, step) => {
    const v = h('span', { class: 'muted' }, String(st[key]));
    return h('label', { class: 'wslider' }, h('span', null, label, ' ', v), h('input', { type: 'range', min, max, step, value: st[key], oninput: (e) => { st[key] = +e.target.value; v.textContent = st[key] === 0 && key === 'T' ? '0 (greedy)' : String(st[key]); draw(); } }));
  };
  draw();
  el.append(h('div', { class: 'wtitle' }, '🎲 Temperature sampler'),
    h('p', { class: 'small muted' }, 'One step of generation: the model scores every candidate next word, then a sampler picks one. Scores here are made-up teaching numbers.'),
    h('div', { class: 'chips' }, Object.entries(PRESETS).map(([k, v]) => h('button', { class: 'chip' + (k === st.preset ? ' on' : ''), onclick: (e) => { st.preset = k; e.target.parentElement.querySelectorAll('.chip').forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draws.replaceChildren(); drawInfo.textContent = ''; draw(); } }, v.label))),
    h('div', { class: 'wsliders' }, sl('Temperature', 'T', 0, 2, 0.05), sl('Top-p', 'topP', 0.1, 1, 0.05)),
    bars, info,
    h('div', { class: 'btns' }, h('button', { class: 'btn small primary', onclick: () => many(1) }, 'Sample 1'), h('button', { class: 'btn small', onclick: () => many(20) }, 'Sample 20')),
    draws, drawInfo);
}
