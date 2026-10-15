import { landscape } from './landscape.js';
import { temperature } from './temperature.js';
import { bm25 } from './bm25.js';
import { weights3d } from './weights3d.js';

export const WIDGETS = {
  weights3d: { mount: weights3d, title: '3D weights and predictions', module: 'm01' },
  landscape: { mount: landscape, title: 'Fitness-landscape optimizer', module: 'm01' },
  temperature: { mount: temperature, title: 'Temperature sampler', module: 'm02' },
  bm25: { mount: bm25, title: 'BM25 playground', module: 'm20' },
};
const disposers = new Set();
export function disposeWidgets() {
  disposers.forEach((dispose) => dispose());
  disposers.clear();
}
// Markdown embeds a widget with: <div class="widget" data-widget="landscape"></div>
export function mountWidgets(root) {
  root.querySelectorAll('[data-widget]').forEach((el) => {
    const w = WIDGETS[el.dataset.widget];
    if (w && !el.dataset.mounted) {
      el.dataset.mounted = '1'; el.classList.add('card', 'widget');
      const dispose = w.mount(el);
      if (typeof dispose === 'function') disposers.add(dispose);
    }
  });
}
