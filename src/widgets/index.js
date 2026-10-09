import { landscape } from './landscape.js';
import { temperature } from './temperature.js';
import { bm25 } from './bm25.js';

export const WIDGETS = {
  landscape: { mount: landscape, title: 'Fitness-landscape optimizer', module: 'm01' },
  temperature: { mount: temperature, title: 'Temperature sampler', module: 'm02' },
  bm25: { mount: bm25, title: 'BM25 playground', module: 'm20' },
};
// Markdown embeds a widget with: <div class="widget" data-widget="landscape"></div>
export function mountWidgets(root) {
  root.querySelectorAll('[data-widget]').forEach((el) => {
    const w = WIDGETS[el.dataset.widget];
    if (w && !el.dataset.mounted) { el.dataset.mounted = '1'; el.classList.add('card', 'widget'); w.mount(el); }
  });
}
