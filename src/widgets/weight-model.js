// A complete two-parameter model, rather than a decorative terrain or an LLM slice.
export const LIMIT = 3;
export const INPUTS = Array.from({ length: 19 }, (_, i) => -2.4 + i * 4.8 / 18);
export const TARGET_WEIGHTS = { nonlinear: [1.15, 0.85], linear: [0.7, -0.3] };
export const bound = (v) => Math.max(-LIMIT, Math.min(LIMIT, v));
export function predict(x, weights, model = 'nonlinear') {
  const [a, b] = weights;
  return model === 'linear' ? a * x + b : Math.sin(a * x) + 0.5 * Math.sin(1.4 * b * x + 0.3);
}
export function samples(model = 'nonlinear') {
  return INPUTS.map((x) => ({ x, y: predict(x, TARGET_WEIGHTS[model], model) }));
}
export function loss(weights, model = 'nonlinear') {
  return samples(model).reduce((s, p) => s + (predict(p.x, weights, model) - p.y) ** 2, 0) / INPUTS.length;
}
export function gradient(weights, model = 'nonlinear') {
  const [a, b] = weights;
  return samples(model).reduce((g, p) => {
    const error = predict(p.x, weights, model) - p.y;
    const da = model === 'linear' ? p.x : p.x * Math.cos(a * p.x);
    const db = model === 'linear' ? 1 : 0.7 * p.x * Math.cos(1.4 * b * p.x + 0.3);
    return [g[0] + 2 * error * da / INPUTS.length, g[1] + 2 * error * db / INPUTS.length];
  }, [0, 0]);
}
export function trainStep(weights, rate, model = 'nonlinear') {
  const g = gradient(weights, model);
  return weights.map((w, i) => bound(w - rate * g[i]));
}
// Fitness is a teaching convention here, exactly negative MSE. Maximizing it
// leaves the best weights unchanged; it does not claim biological fitness units.
export const fitness = (weights, model = 'nonlinear') => -loss(weights, model);
