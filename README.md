# Learn AI: an ecologist's path

A self-paced course on AI, agents, harnesses, RAG and evals, taught through evolutionary biology and ecology. It is built as a Vite + vanilla JS PWA, a sibling of `robotics-learning`.

- `course/outline.json` / `course/OUTLINE.md`: the 32-module outline. Its source of truth is `course/tools/outline_src.py`.
- `course/modules/mNN.md`: module text. `course/narration/mNN.md`: narration scripts.
- `scripts/prepare-data.mjs`: builds `src/generated/` and `public/data/` from `course/` and the RAG pack (`learn-ai-rag/`, which is not committed).
- `public/audio/`: narration generated with edge-tts. First playback starts a full-file download for offline use; wait for the player to confirm it is available. A failed save can be retried by pausing and playing again. Unplayed narration is not guaranteed offline.

```sh
npm install
npm run narrate     # needs .venv with edge-tts; incremental
npm run build       # prepare-data + vite build -> dist/
npm run validate    # validate committed lessons, citations, audio and captions
npm test            # player/cache, progress and citation regression tests
npm run preview
```

## 3D weights and predictions lab

Module 1 and **More → Field kit** include a rotatable 3D loss/fitness surface.
Two weights control a small linear or nonlinear prediction model. The surface
shows its mean squared error on 19 fixed synthetic examples; the linked plot
shows the predictions and residuals. Drag or use arrow keys to orbit, adjust the
weight sliders, and train one step or 60 steps. Fitness is defined as negative
MSE. This is a complete two-weight teaching model, not a real LLM landscape.

The renderer uses Canvas 2D projection with no extra runtime dependencies.
Run `node --test scripts/weight-model.test.mjs` to verify the analytic gradients,
known fit, error reduction, and displayed weight bounds.

Deploy (only when approved): push to a GitHub repo, then set Settings → Pages → Source: GitHub Actions. `.github/workflows/deploy.yml` builds from the committed data.
