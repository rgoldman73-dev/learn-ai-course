---
title: Library: every companion course and how to search it
---
# Library: every companion course and how to search it

Learn AI is the spine: 32 modules with ecology analogies. Every outside course or book you add becomes a **companion track** with a map to the modules, a pace, and honest limits. Its free text goes into one local search library, the **course RAG**. New sources keep landing here.

| Track | Level | What it adds | Search with |
|---|---|---|---|
| [Primer: Harvard generative AI](#/track/harvard-genai) | beginner | non-technical GenAI, prompting, RAG, society | `-s hks,cs50` |
| [Hands-on: UMich AASE](#/track/aase) | intermediate | build and evaluate your own coding agent | (course site) |
| [Math: Mathematics for Machine Learning](#/track/mml) | foundations | linear algebra, calculus, probability, optimization | `-s mml` |
| [Build: Stanford CS336](#/track/cs336) | advanced | build an LLM from scratch, GPUs, scaling, post-training | `-s cs336` |
| [Production and safety (AI Engineering from Scratch)](#/track/production-safety) | intermediate | serving, cost, observability, release; red-teaming, alignment failures, governance. Its "Build it" lessons are also linked from m08, m10, m11, m13–m16, m18, m19 and m22–m26 | `-s aiefs` |

**Suggested order:** Primer, then Learn AI Units 1–3 with the Math track alongside, then AASE alongside Units 3–5, then CS336 alongside Units 6–7. Dip into Production and safety whenever you ship something.

## The course RAG

It lives on the Grok Bot box at `/workspace/course-rag`. It uses keyword plus embedding search, and every hit cites a page, section or video timestamp with a deep link.

```sh
/workspace/course-rag/search.py "how does attention scale with context length"   # everything
/workspace/course-rag/search.py "Kalman filter Gaussian" -s mml                   # one source
/workspace/course-rag/search.py --list                                            # sources and licences
```

Or ask Grok Bot "search the course library for …". The library stays on that computer, because some sources are licensed for personal use only.
