import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TARGET_WEIGHTS, loss, gradient, predict, samples, trainStep, fitness } from '../src/widgets/weight-model.js';

for (const model of ['linear', 'nonlinear']) {
  test(`${model}: known generating weights fit every target`, () => {
    assert.equal(loss(TARGET_WEIGHTS[model], model), 0);
    assert.equal(samples(model).length, 19);
    for (const p of samples(model)) assert.equal(predict(p.x, TARGET_WEIGHTS[model], model), p.y);
  });
  test(`${model}: analytic gradient agrees with independent finite differences`, () => {
    for (const w of [[.15, 1.9], [-2.2, -1.6], [2.7, -.5]]) {
      const g = gradient(w, model), epsilon = 1e-5;
      for (let i = 0; i < 2; i++) {
        const plus = [...w], minus = [...w]; plus[i] += epsilon; minus[i] -= epsilon;
        assert.ok(Math.abs(g[i] - (loss(plus, model) - loss(minus, model)) / (2 * epsilon)) < 1e-7);
      }
    }
  });
  test(`${model}: default training decreases actual prediction error`, () => {
    let w = [.15, 1.9]; const before = loss(w, model);
    for (let i = 0; i < 60; i++) w = trainStep(w, .12, model);
    assert.ok(loss(w, model) < before * .2);
    assert.equal(fitness(w, model), -loss(w, model));
  });
  test(`${model}: training stays in the displayed weight domain`, () => {
    for (const w of [[-3, -3], [3, 3]]) for (const value of trainStep(w, .5, model)) assert.ok(Number.isFinite(value) && value >= -3 && value <= 3);
  });
}
