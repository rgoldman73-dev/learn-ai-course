# Library: every companion course and how to search it

Learn AI is the spine: 32 modules with ecology analogies. Every outside course or book you add becomes a **companion track** with a map to the modules, a pace, and honest limits. Its free text goes into one local search library, the **course RAG**. New sources keep landing here.

| Track | Level | What it adds | Search with |
|---|---|---|---|
| [Primer: Harvard generative AI](#/track/harvard-genai) | beginner | non-technical GenAI, prompting, RAG, society | `-s hks,cs50` |
| [Hands-on: UMich AASE](#/track/aase) | intermediate | build and evaluate your own coding agent | (course site) |
| [Math: Mathematics for Machine Learning](#/track/mml) | foundations | linear algebra, calculus, probability, optimization | `-s mml` |
| [Build: Stanford CS336](#/track/cs336) | advanced | build an LLM from scratch, GPUs, scaling, post-training | `-s cs336` |
| [Production and safety (AI Engineering from Scratch)](#/track/production-safety) | intermediate | serving, cost, observability, release; red-teaming, alignment failures, governance. Its "Build it" lessons are also linked from m08, m10, m11, m13–m16, m18, m19 and m22–m26 | `-s aiefs` |
| [Robotics: Principles of Robot Autonomy (Stanford)](https://porabook.com/) | intermediate | open robotics textbook: dynamics, control, planning, perception, filtering/SLAM, RL. Its AA174A lectures and 40 Colab labs are wired into the [robotics course](https://rgoldman73-dev.github.io/robotics-learning/) | `-s pora` |
| [Robotics: ETH Zurich Robot Learning, fundamentals to foundation models (Mees, Spring 2026)](https://cvg.ethz.ch/lectures/Robot-Learning/) | advanced | 11 lectures (imitation learning, RL, generative models, transformers, world models, VLAs, embodied reasoning) + 10 guest talks (Physical Intelligence, NVIDIA, Google DeepMind, Meta) + 4 coding assignments. Taught as Month 9 of the [robotics course](https://rgoldman73-dev.github.io/robotics-learning/) and linked from its earlier RL/imitation modules. The Aviral Kumar (LLM recipe in robotics) and Archit Sharma (test-time compute) talks pair well with Units 6–9 | `-s eth-robotlearning` |
| [Frontier: MIT How2AI, Self-Evolving AI (Fall 2026)](#/track/how2ai) | advanced | AI that improves itself: prompt/context optimization, memory and skills, multi-agent evolution, RL and self-distillation, LLM-driven discovery. Its slides and readings are linked from m04, m06, m08, m11, m14–m16, m18, m22, m23 and m28–m30 | `-s how2ai` |

**Suggested order:** Primer, then Learn AI Units 1–3 with the Math track alongside, then AASE alongside Units 3–5, then CS336 alongside Units 6–7. Take the Frontier track (How2AI) last, once Units 3–9 feel familiar. Dip into Production and safety whenever you ship something.

## The course RAG

It lives on the Grok Bot box at `/workspace/course-rag`. It uses keyword plus embedding search, and every hit cites a page, section or video timestamp with a deep link.

```sh
/workspace/course-rag/search.py "how does attention scale with context length"   # everything
/workspace/course-rag/search.py "Kalman filter Gaussian" -s mml                   # one source
/workspace/course-rag/search.py --list                                            # sources and licences
```

Or ask Grok Bot "search the course library for …". The library stays on that computer, because some sources are licensed for personal use only.
