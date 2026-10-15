import { h } from '../ui.js';
import { LIMIT, TARGET_WEIGHTS, bound, predict, samples, loss, trainStep } from './weight-model.js';

export function weights3d(el) {
  const W = 900, H = 570, N = 40;
  const st = { weights: [0.15, 1.9], model: 'nonlinear', mode: 'loss', yaw: -0.72, pitch: 0.7, zoom: 1, rate: 0.12, step: 0, x: 0.8 };
  let mesh = [], maxLoss = 1, trail = [], timer = null, drag = null;
  const surface = h('canvas', { width: W, height: H, class: 'weights3d-surface', tabindex: 0, role: 'img', 'aria-label': 'Rotatable 3D weight landscape. Horizontal axes: weight one and weight two. Height: prediction loss. Drag or use arrow keys to rotate. Use the weight sliders to move the model.' });
  const ctx = surface.getContext('2d');
  const graph = h('canvas', { width: 800, height: 310, class: 'weights3d-graph', role: 'img', 'aria-label': 'Prediction plot. Orange is the current model; mint dots are the 19 training targets. Dashed lines show prediction errors.' });
  const pc = graph.getContext('2d');
  const metrics = h('div', { class: 'weights3d-metrics' });
  const probe = h('p', { class: 'small weights3d-probe' });
  const notice = h('p', { class: 'small muted', role: 'status' });
  const live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
  const weightControls = [];
  const textScale = () => W / (surface.clientWidth || Math.min(692, window.innerWidth - 66));
  function stop() { if (timer !== null) clearInterval(timer); timer = null; run.textContent = 'Train 60 steps'; }
  function reset(weights = [0.15, 1.9]) {
    stop(); st.weights = [...weights]; st.step = 0; trail = [[...weights]]; notice.textContent = ''; draw();
  }
  function makeMesh() {
    mesh = []; maxLoss = 0;
    const vertices = Array.from({ length: N + 1 }, (_, j) => Array.from({ length: N + 1 }, (_, i) => {
      const a = -LIMIT + 2 * LIMIT * i / N, b = -LIMIT + 2 * LIMIT * j / N, l = loss([a, b], st.model);
      maxLoss = Math.max(maxLoss, l); return [a, b, l];
    }));
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) mesh.push([vertices[j][i], vertices[j][i + 1], vertices[j + 1][i + 1], vertices[j + 1][i]]);
  }
  const height = (l) => (st.mode === 'loss' ? l / maxLoss : 1 - l / maxLoss) * 2.8 - 1.4;
  function project(x, y, z) {
    const u = x * Math.cos(st.yaw) - y * Math.sin(st.yaw), d = x * Math.sin(st.yaw) + y * Math.cos(st.yaw);
    const scale = 78 * st.zoom;
    return [W / 2 + u * scale, H * 0.49 + (d * Math.sin(st.pitch) - z * Math.cos(st.pitch)) * scale, d * Math.cos(st.pitch) + z * Math.sin(st.pitch)];
  }
  function line(points, color, width = 1) {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function marker(weights, color, radius, label) {
    const p = project(...weights, height(loss(weights, st.model)) + 0.06);
    ctx.beginPath(); ctx.arc(p[0], p[1], radius + 5, 0, Math.PI * 2); ctx.fillStyle = color + '24'; ctx.fill();
    ctx.beginPath(); ctx.arc(p[0], p[1], radius, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    if (label) {
      const scale = textScale(), known = label === 'known fit';
      const text = scale > 2 ? (known ? 'fit' : 'model') : label;
      const x = p[0] + 12 * scale, y = p[1] + (known ? 20 : -12) * scale;
      ctx.font = `600 ${13 * scale}px system-ui`; ctx.fillStyle = '#f3faf6'; ctx.strokeStyle = '#0b1c18'; ctx.lineWidth = 3 * scale; ctx.strokeText(text, x, y); ctx.fillText(text, x, y);
    }
  }
  function drawSurface() {
    ctx.fillStyle = '#0b1c18'; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * .5, H * .38, 0, W * .5, H * .38, 430); glow.addColorStop(0, '#20483b'); glow.addColorStop(1, '#0b1c18'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    for (let i = -3; i <= 3; i++) { line([project(i, -3, -1.55), project(i, 3, -1.55)], '#8ddcb51c'); line([project(-3, i, -1.55), project(3, i, -1.55)], '#8ddcb51c'); }
    const faces = mesh.map((face) => ({ face, p: face.map(([x, y, l]) => project(x, y, height(l))) }));
    faces.sort((a, b) => a.p.reduce((s, p) => s + p[2], 0) - b.p.reduce((s, p) => s + p[2], 0));
    for (const { face, p } of faces) {
      const t = face.reduce((s, v) => s + v[2], 0) / (4 * maxLoss);
      ctx.beginPath(); p.forEach((v, i) => i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1])); ctx.closePath();
      ctx.fillStyle = `hsl(${163 - t * 115} 45% ${32 + t * 22}%)`; ctx.fill(); ctx.strokeStyle = '#d2ffe52b'; ctx.lineWidth = .65; ctx.stroke();
    }
    // Trails are a schematic overlay, intentionally visible through the mesh.
    line(trail.map((p) => project(...p, height(loss(p, st.model)) + .07)), '#fbab62', 3);
    marker(TARGET_WEIGHTS[st.model], '#9df3d0', 5, 'known fit'); marker(st.weights, '#ffae66', 7, 'your weights');
    const origin = project(-3, -3, -1.55);
    const axes = [[project(3.35, -3, -1.55), 'w₁', '#abc9ef'], [project(-3, 3.35, -1.55), 'w₂', '#c8b6f1'], [project(-3, -3, 1.7), st.mode === 'loss' ? 'loss ↑' : 'fitness ↑', '#e2f3e9']];
    const ts = textScale();
    for (const [p, title, col] of axes) { line([origin, p], col, 1.5); ctx.fillStyle = col; ctx.font = `600 ${15 * ts}px system-ui`; ctx.fillText(title, Math.max(15, Math.min(W - 105 * ts, p[0] + 8)), Math.max(24, Math.min(H - 58 * ts, p[1]))); }
    ctx.font = `${12 * ts}px system-ui`; ctx.fillStyle = '#c0d7ca';
    ctx.fillText(st.mode === 'loss' ? 'Loss: lower is better' : 'Fitness = −loss: higher is better', 20 * ts, 25 * ts);
    ctx.fillText('Weight axes: −3 to +3', 20 * ts, H - 30 * ts);
    ctx.fillText('Mint: low error · Gold: high error', 20 * ts, H - 12 * ts);
  }
  function drawPredictions() {
    const data = samples(st.model), width = graph.width, heightPx = graph.height;
    const predictions = Array.from({ length: 121 }, (_, i) => { const x = -2.4 + i * 4.8 / 120; return { x, y: predict(x, st.weights, st.model) }; });
    const extent = Math.max(1.7, ...predictions.map((p) => Math.abs(p.y)), ...data.map((p) => Math.abs(p.y))) * 1.14;
    const px = (x) => 55 + (x + 2.4) / 4.8 * (width - 90), py = (y) => 25 + (extent - y) / (extent * 2) * (heightPx - 65);
    pc.fillStyle = '#0b1c18'; pc.fillRect(0, 0, width, heightPx);
    pc.strokeStyle = '#698278'; pc.lineWidth = 1; pc.beginPath(); pc.moveTo(55, py(0)); pc.lineTo(width - 35, py(0)); pc.stroke();
    pc.fillStyle = '#b9cfc4'; pc.font = '16px system-ui'; pc.fillText('prediction y', 14, 17); pc.fillText('input x', width - 85, heightPx - 7);
    for (const x of [-2.4, 0, 2.4]) pc.fillText(String(x), px(x) - 13, heightPx - 10);
    pc.fillText(extent.toFixed(1), 5, 35); pc.fillText((-extent).toFixed(1), 5, heightPx - 39);
    for (const p of data) { pc.setLineDash([3, 4]); pc.strokeStyle = '#e7c09e80'; pc.beginPath(); pc.moveTo(px(p.x), py(p.y)); pc.lineTo(px(p.x), py(predict(p.x, st.weights, st.model))); pc.stroke(); }
    pc.setLineDash([]); pc.strokeStyle = '#ffae66'; pc.lineWidth = 3; pc.beginPath(); predictions.forEach((p, i) => i ? pc.lineTo(px(p.x), py(p.y)) : pc.moveTo(px(p.x), py(p.y))); pc.stroke();
    for (const p of data) { pc.fillStyle = '#9df3d0'; pc.beginPath(); pc.arc(px(p.x), py(p.y), 4.5, 0, Math.PI * 2); pc.fill(); }
    pc.strokeStyle = '#c8b6f1'; pc.setLineDash([4, 4]); pc.beginPath(); pc.moveTo(px(st.x), 25); pc.lineTo(px(st.x), heightPx - 40); pc.stroke(); pc.setLineDash([]);
    pc.fillStyle = '#fff'; pc.beginPath(); pc.arc(px(st.x), py(predict(st.x, st.weights, st.model)), 6, 0, Math.PI * 2); pc.fill();
  }
  function announce() { live.textContent = `Step ${st.step}. Weight one ${st.weights[0].toFixed(3)}, weight two ${st.weights[1].toFixed(3)}. Mean squared error ${loss(st.weights, st.model).toFixed(4)}.`; }
  function draw() {
    const l = loss(st.weights, st.model);
    metrics.replaceChildren(...[['w₁', st.weights[0].toFixed(3)], ['w₂', st.weights[1].toFixed(3)], [st.mode === 'loss' ? 'Loss · MSE' : 'Fitness · −MSE', (st.mode === 'loss' ? l : -l).toFixed(4)], ['Training step', st.step]].map(([name, value]) => h('div', null, h('span', null, name), h('strong', null, value))));
    weightControls.forEach(({ input, value, i }) => { input.value = st.weights[i]; value.textContent = st.weights[i].toFixed(3); });
    probe.textContent = `At x = ${st.x.toFixed(2)}, your model predicts ${predict(st.x, st.weights, st.model).toFixed(3)}; target ${predict(st.x, TARGET_WEIGHTS[st.model], st.model).toFixed(3)}.`;
    surface.setAttribute('aria-label', `3D ${st.mode} landscape for a ${st.model} model. Weight one ${st.weights[0].toFixed(3)}, weight two ${st.weights[1].toFixed(3)}. MSE ${l.toFixed(4)}. Drag or arrow keys rotate the view; sliders change weights.`);
    drawSurface(); drawPredictions();
  }
  function step() { st.weights = trainStep(st.weights, st.rate, st.model); st.step++; trail.push([...st.weights]); if (trail.length > 601) trail.shift(); draw(); }
  const run = h('button', { class: 'btn primary', onclick: () => {
    if (timer !== null) { stop(); announce(); return; }
    let remaining = 60; run.textContent = 'Pause training'; notice.textContent = 'Following the negative gradient. The model can settle in a local valley.';
    timer = setInterval(() => { if (!el.isConnected || document.hidden) { stop(); return; } step(); if (--remaining === 0) { stop(); announce(); } }, 85);
  } }, 'Train 60 steps');
  const controls = [0, 1].map((i) => {
    const value = h('output', null, st.weights[i].toFixed(3));
    const input = h('input', { type: 'range', min: -3, max: 3, step: .001, value: st.weights[i], 'aria-label': `Weight ${i + 1}`, oninput: (e) => { stop(); st.weights[i] = bound(+e.target.value); st.step = 0; trail = [[...st.weights]]; notice.textContent = 'Weights moved manually. Train from this starting point.'; draw(); }, onchange: announce });
    weightControls.push({ input, value, i });
    return h('label', { class: 'wslider' }, h('span', null, `Weight w${i === 0 ? '₁' : '₂'} `, value), input);
  });
  const modelChoice = h('select', { class: 'weights3d-select', 'aria-label': 'Prediction model', onchange: (e) => { st.model = e.target.value; makeMesh(); reset(st.model === 'linear' ? [-1.3, 1.7] : [0.15, 1.9]); formula.textContent = st.model === 'linear' ? 'ŷ = w₁x + w₂' : 'ŷ = sin(w₁x) + 0.5 sin(1.4w₂x + 0.3)'; announce(); } }, h('option', { value: 'nonlinear' }, 'Nonlinear · ridges and valleys'), h('option', { value: 'linear' }, 'Linear · a smooth bowl'));
  const modeButtons = ['loss', 'fitness'].map((mode) => h('button', { class: 'btn small', 'aria-pressed': mode === st.mode ? 'true' : 'false', onclick: () => { st.mode = mode; modeButtons.forEach((b, i) => b.setAttribute('aria-pressed', ['loss', 'fitness'][i] === mode ? 'true' : 'false')); draw(); announce(); } }, mode === 'loss' ? 'Loss · descend' : 'Fitness · climb'));
  const formula = h('code', { class: 'weights3d-formula' }, 'ŷ = sin(w₁x) + 0.5 sin(1.4w₂x + 0.3)');
  const viewReset = () => { st.yaw = -.72; st.pitch = .7; st.zoom = 1; drawSurface(); };
  const rotate = (dx, dy) => { st.yaw += dx; st.pitch = Math.max(.22, Math.min(1.35, st.pitch + dy)); drawSurface(); };
  surface.addEventListener('pointerdown', (e) => { drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; surface.setPointerCapture(e.pointerId); surface.focus({ preventScroll: true }); });
  surface.addEventListener('pointermove', (e) => { if (!drag || drag.id !== e.pointerId) return; rotate((e.clientX - drag.x) * .009, (e.clientY - drag.y) * .007); drag.x = e.clientX; drag.y = e.clientY; });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) surface.addEventListener(type, () => { drag = null; });
  surface.addEventListener('keydown', (e) => { const moves = { ArrowLeft: [-.12, 0], ArrowRight: [.12, 0], ArrowUp: [0, -.08], ArrowDown: [0, .08] }; if (moves[e.key]) { e.preventDefault(); rotate(...moves[e.key]); } });
  // The router disposes mounted widgets, so a detached lesson cannot keep training.
  const dispose = () => stop();
  el.append(h('div', { class: 'weights3d-header' }, h('div', null, h('span', { class: 'eyebrow' }, 'WEIGHTS → PREDICTIONS → ERROR'), h('h3', null, 'A model you can walk through')), h('span', { class: 'chip' }, 'Interactive 3D')),
    h('p', { class: 'small muted' }, 'One point = one pair of weights. Every height is the model’s measured error on the same 19 training examples.'),
    h('div', { class: 'weights3d-toolbar' }, modelChoice, h('div', { class: 'weights3d-modes', role: 'group', 'aria-label': 'Landscape height' }, ...modeButtons)),
    surface,
    h('div', { class: 'weights3d-viewbar' }, h('span', { class: 'small muted' }, 'Drag to orbit · arrow keys also work'), h('div', null, h('button', { class: 'btn small', 'aria-label': 'Zoom out landscape', onclick: () => { st.zoom = Math.max(.7, st.zoom - .1); drawSurface(); } }, '−'), h('button', { class: 'btn small', 'aria-label': 'Zoom in landscape', onclick: () => { st.zoom = Math.min(1.25, st.zoom + .1); drawSurface(); } }, '+'), h('button', { class: 'btn small', onclick: viewReset }, 'Reset view'))),
    metrics, h('div', { class: 'wsliders' }, ...controls),
    h('div', { class: 'btns' }, h('button', { class: 'btn', onclick: () => { stop(); step(); announce(); } }, 'One training step'), run, h('button', { class: 'btn', onclick: () => { reset(st.model === 'linear' ? [-1.3, 1.7] : [0.15, 1.9]); announce(); } }, 'Reset weights'), h('button', { class: 'btn', onclick: () => { reset([-2.2, -1.6]); announce(); } }, 'Try a distant start')),
    h('label', { class: 'wslider' }, h('span', null, 'Learning rate ', h('output', { class: 'weights3d-rate' }, '0.12')), h('input', { type: 'range', min: .01, max: .5, step: .01, value: st.rate, 'aria-label': '3D model learning rate', oninput: (e) => { stop(); st.rate = +e.target.value; el.querySelector('.weights3d-rate').textContent = st.rate.toFixed(2); } })), notice,
    h('div', { class: 'weights3d-predictions' }, h('h4', null, 'What these weights predict'), formula, h('p', { class: 'small muted' }, 'Orange curve: predictions · mint dots: targets · dashed gaps: errors. The surface height is the mean of these squared gaps.'), graph,
      h('label', { class: 'wslider' }, h('span', null, 'Probe an input x'), h('input', { type: 'range', min: -2.4, max: 2.4, step: .01, value: st.x, 'aria-label': 'Prediction input x', oninput: (e) => { st.x = +e.target.value; draw(); }, onchange: announce })), probe),
    h('details', { class: 'weights3d-explainer' }, h('summary', null, 'How to read this model'),
      h('p', null, 'The two horizontal coordinates are weights w₁ and w₂, not predictions. Changing them changes the orange prediction curve. Height is mean squared error (MSE) across 19 fixed, synthetic training examples. The known fit generated those examples, so its error is zero.'),
      h('p', null, 'Loss view: lower is better. Fitness view: height = −MSE, so higher is better; the weights and predictions stay identical. Colors always encode error, and the vertical scale is fixed within each model. Switching model recomputes the scale.'),
      h('p', null, 'The orange trail is drawn above the surface for readability, including through hills. Nonlinear training may find a local minimum. A flat-looking region does not prove good performance on unseen data.'),
      h('p', null, 'This is a complete two-weight teaching model. A real language model has many more weights; a 3D picture of one would show only a two-dimensional slice through its parameter space.'),
      h('a', { href: 'https://arxiv.org/abs/1712.09913', target: '_blank', rel: 'noopener noreferrer' }, 'Research background: Visualizing the Loss Landscape of Neural Nets (Li et al., 2018)')), live);
  makeMesh(); reset();
  return dispose;
}
