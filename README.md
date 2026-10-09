# Learn AI: an ecologist's path

A self-paced course on AI, agents, harnesses, RAG and evals, taught through evolutionary biology and ecology. It is built as a Vite + vanilla JS PWA, a sibling of `robotics-learning`.

- `course/outline.json` / `course/OUTLINE.md`: the 32-module outline. Its source of truth is `course/tools/outline_src.py`.
- `course/modules/mNN.md`: module text. `course/narration/mNN.md`: narration scripts.
- `scripts/prepare-data.mjs`: builds `src/generated/` and `public/data/` from `course/` and the RAG pack (`learn-ai-rag/`, which is not committed).
- `public/audio/`: narration generated with edge-tts. Each file is cached by the service worker the first time it is played.

```sh
npm install
npm run narrate     # needs .venv with edge-tts; incremental
npm run build       # prepare-data + vite build -> dist/
npm run validate    # citation guardrail on course/ and public/data/
npm run preview
```

Deploy (only when approved): push to a GitHub repo, then set Settings → Pages → Source: GitHub Actions. `.github/workflows/deploy.yml` builds from the committed data.
