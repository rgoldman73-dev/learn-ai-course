// Fitness-landscape optimizer: gradient descent vs a simple (1+λ) evolutionary strategy on a 2-D loss surface.
// Low loss = high fitness. Tap the map to choose a starting point.
import { h } from '../ui.js';

const R = 3;   // domain [-R, R]^2
const g = (x, y, cx, cy, s) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
const PEAKS = [[1.6, 1.4, 0.9, 1.0], [-1.5, 1.2, 0.7, 0.75], [-1.2, -1.7, 0.5, 0.6], [1.7, -1.6, 0.6, 0.5]];   // cx, cy, width, depth
function loss(x, y, rug) {
  let v = 1.2 + 0.04 * (x * x + y * y);
  for (const [cx, cy, s, d] of PEAKS) v -= d * g(x, y, cx, cy, s);
  return v + rug * 0.14 * (Math.sin(3.1 * x) * Math.cos(2.7 * y) + 0.5 * Math.sin(5.3 * x + 1.7 * y));
}
// success = ending within 0.6 of the deepest well's centre (the global basin)
const inGlobal = ([x, y]) => Math.hypot(x - PEAKS[0][0], y - PEAKS[0][1]) < 0.6;
function grad(x, y, rug) { const e = 1e-3; return [(loss(x + e, y, rug) - loss(x - e, y, rug)) / (2 * e), (loss(x, y + e, rug) - loss(x, y - e, rug)) / (2 * e)]; }
const randn = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const clamp = (v) => Math.max(-R, Math.min(R, v));

function color(t) {   // t in [0,1], 0 = low loss (fit): deep green -> pale yellow
  const stops = [[13, 59, 46], [22, 120, 86], [94, 168, 92], [190, 205, 110], [246, 236, 180]];
  const p = Math.max(0, Math.min(0.9999, t)) * (stops.length - 1); const i = Math.floor(p), f = p - i;
  return stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * f));
}

export function landscape(el) {
  const S = 300;
  const cv = h('canvas', { width: S, height: S, class: 'wcanvas', 'aria-label': 'Loss landscape. Tap to set the starting point.' });
  const ctx = cv.getContext('2d');
  const st = { rug: 0.5, lr: 0.3, sigma: 0.35, lambda: 8, start: [-2.4, -0.2], step: 0 };
  let gd, es, bg, timer = null;
  const toPx = (x) => ((x + R) / (2 * R)) * S, toW = (p) => (p / S) * 2 * R - R;
  const out = h('div', { class: 'wout small' });

  function paintBg() {
    const img = ctx.createImageData(S, S); let lo = 1e9, hi = -1e9; const vals = new Float32Array(S * S);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) { const v = loss(toW(i), -toW(j), st.rug); vals[j * S + i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); }
    for (let k = 0; k < S * S; k++) {
      const t = (vals[k] - lo) / (hi - lo); const [r, gg, b] = color(t);
      const band = Math.abs(((t * 14) % 1) - 0.5) < 0.04 ? 0.85 : 1;   // contour lines
      img.data.set([r * band, gg * band, b * band, 255], k * 4);
    }
    bg = img;
  }
  function reset() {
    stop(); st.step = 0;
    gd = { p: [...st.start], path: [[...st.start]], evals: 0 };
    es = { p: [...st.start], path: [[...st.start]], pop: [], evals: 0 };
    draw();
  }
  function stepOnce() {
    st.step++;
    const [gx, gy] = grad(gd.p[0], gd.p[1], st.rug); gd.evals += 1;
    gd.p = [clamp(gd.p[0] - st.lr * gx), clamp(gd.p[1] - st.lr * gy)]; gd.path.push([...gd.p]);
    // (1+λ)-ES: λ mutants around the parent; the best of parent+offspring survives (elitist selection)
    let best = es.p, bl = loss(es.p[0], es.p[1], st.rug); es.pop = [];
    for (let k = 0; k < st.lambda; k++) {
      const c = [clamp(es.p[0] + st.sigma * randn()), clamp(es.p[1] + st.sigma * randn())]; es.pop.push(c);
      const l = loss(c[0], c[1], st.rug); if (l < bl) { bl = l; best = c; }
    }
    es.evals += st.lambda; es.p = [...best]; es.path.push([...best]);
  }
  function draw() {
    ctx.putImageData(bg, 0, 0);
    const line = (path, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); path.forEach(([x, y], i) => (i ? ctx.lineTo(toPx(x), toPx(-y)) : ctx.moveTo(toPx(x), toPx(-y)))); ctx.stroke(); };
    const dot = ([x, y], col, r = 5) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(toPx(x), toPx(-y), r, 0, 7); ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke(); };
    ctx.globalAlpha = 0.55; es.pop.forEach((c) => dot(c, '#c4b5fd', 2.5)); ctx.globalAlpha = 1;
    line(gd.path, '#fb923c'); line(es.path, '#a78bfa');
    dot(st.start, '#fff', 4); dot(gd.p, '#fb923c'); dot(es.p, '#a78bfa');
    const lg = loss(gd.p[0], gd.p[1], st.rug), le = loss(es.p[0], es.p[1], st.rug);
    out.replaceChildren(
      h('div', null, h('b', { style: 'color:#fb923c' }, '● Gradient descent'), ` loss ${lg.toFixed(3)} ${inGlobal(gd.p) ? '✓ global basin' : ''} · ${gd.evals} gradient evals`),
      h('div', null, h('b', { style: 'color:#a78bfa' }, '● Evolution (1+λ)'), ` loss ${le.toFixed(3)} ${inGlobal(es.p) ? '✓ global basin' : ''} · ${es.evals} fitness evals`),
      h('div', { class: 'muted' }, `Generation / step ${st.step}`));
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; runBtn.textContent = 'Run 60'; } }
  const runBtn = h('button', { class: 'btn primary small', onclick: () => {
    if (timer) return stop();
    let n = 0; runBtn.textContent = 'Stop';
    timer = setInterval(() => { stepOnce(); draw(); if (++n >= 60) stop(); }, 60);
  } }, 'Run 60');
  function trial() {   // 50 random starts × 80 steps each, both optimisers
    stop(); let okG = 0, okE = 0; const N = 50, T = 80; const save = st.start;
    for (let t = 0; t < N; t++) {
      st.start = [Math.random() * 2 * R - R, Math.random() * 2 * R - R]; reset();
      for (let k = 0; k < T; k++) stepOnce();
      if (inGlobal(gd.p)) okG++; if (inGlobal(es.p)) okE++;
    }
    const msg = `${N} random starts × ${T} steps → reached the global basin: gradient descent ${okG}/${N}, evolution ${okE}/${N}. Cost per run: ${T} gradient evaluations vs ${st.lambda * T} fitness evaluations.`;
    st.start = save; reset(); trialOut.textContent = msg;
  }
  const trialOut = h('p', { class: 'small' });
  const slider = (label, key, min, max, stepv, fmt = (v) => v) => {
    const val = h('span', { class: 'muted' }, fmt(st[key]));
    return h('label', { class: 'wslider' }, h('span', null, label, ' ', val),
      h('input', { type: 'range', min, max, step: stepv, value: st[key], oninput: (e) => { st[key] = +e.target.value; val.textContent = fmt(st[key]); if (key === 'rug') paintBg(); reset(); } }));
  };
  cv.addEventListener('click', (e) => { const r = cv.getBoundingClientRect(); st.start = [toW(((e.clientX - r.left) / r.width) * S), -toW(((e.clientY - r.top) / r.height) * S)]; reset(); });
  paintBg(); reset();
  el.append(h('div', { class: 'wtitle' }, '🧭 Fitness-landscape optimizer'),
    h('p', { class: 'small muted' }, 'Dark green = low loss (high fitness). Tap the map to choose a start. Orange follows the local slope; purple mutates and keeps the best of each generation.'),
    cv, out,
    h('div', { class: 'btns' }, h('button', { class: 'btn small', onclick: () => { stop(); stepOnce(); draw(); } }, 'Step'), runBtn, h('button', { class: 'btn small', onclick: reset }, 'Reset'), h('button', { class: 'btn small', onclick: trial }, '50 random starts')),
    trialOut,
    h('div', { class: 'wsliders' },
      slider('Learning rate (GD step size)', 'lr', 0.02, 1.5, 0.02),
      slider('Mutation size σ (ES)', 'sigma', 0.05, 1.5, 0.05),
      slider('Offspring per generation λ', 'lambda', 2, 30, 1),
      slider('Ruggedness', 'rug', 0, 1.5, 0.05)));
}
