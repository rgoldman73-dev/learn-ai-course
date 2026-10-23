# Frontier track: MIT "How to AI an AI for (Almost) Anything", Self-Evolving AI

**What it is.** MIT MAS.S62 (Fall 2026), taught by Paul Liang with TA Ao Qu at the MIT Media Lab. It is a research-seminar course on *self-evolving AI*: systems that improve themselves through experience, feedback, memory and exploration instead of staying frozen after training. The course has four parts: **context evolution** (prompt optimization, memory), **harness evolution** (tools, skills, multi-agent systems), **model evolution** (RL, self-play, distillation, test-time training) and **task and environment evolution** (synthetic tasks, simulations, evaluations). It meets weekly for 14 weeks, with weekly arXiv readings, four homeworks and a research project. [S:9000000000000000620]
[Course site](https://mit-mi.github.io/how2ai-course/fall2026/) · [Schedule and slides](https://mit-mi.github.io/how2ai-course/fall2026/schedule/) · [Syllabus](https://docs.google.com/document/d/1H1vs32fhWaxEuP6-nA2GP-a1aFuEmjOXNMcer2UyKpM/edit?usp=sharing) · [GitHub (MIT licence)](https://github.com/MIT-MI/how2ai-course)

This is the track that goes *past* Learn AI. Learn AI teaches you to build a harness by hand, and this course asks how a harness, a prompt or a model can improve **itself**, which is the "organism" metaphor taken literally. It is also the closest match in the library to Learn AI's own hill-climbing, skill-library and memory modules.

> Honest limits: the lectures are **not recorded**, so you get slide decks, not videos. Weeks 1–7 slides are posted; weeks 9–14 (self-play, environment generation, world models, AI for science, embodied harnesses, safe evolution) were not up yet when this was added, and the schedule says topics may change. The slides are dense and assume machine-learning background (a first ML course, probability, linear algebra, PyTorch). Some slides quote lab announcements without a source (for example an unattributed quote on Lecture 1, slide 2), so treat those as motivation, not evidence. The homeworks (TextGrad or OpenEvolve, SkillOpt/DGM/Meta-Harness, test-time training, PostTrainBench) are described in the syllabus only as tentative, and so far the only public hands-on items are the week 2 Colab tutorial and a Colab preview of the OpenEvolve homework (Lecture 3, slide 38). [S:9000000000000000620]

## Week map

| Week | Topic and slides | Learn AI module |
|---|---|---|
| 1 | [Intro](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec1%20-%20intro.pdf): six years from in-context learning to long-horizon agents, a history of self-improvement (Good, Gödel machines, AlphaGo Zero, FunSearch, Darwin Gödel Machine), and a "what is being evolved" framework (programs, harnesses, weights, tasks) | [m07](#/module/m07), [m29](#/module/m29), [m30](#/module/m30) |
| 2 | Context evolution 1: [lecture](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec2%20-%20context.pdf) (what context is, in-context learning, chain of thought, TextGrad, DSPy, long context) and [guest slides](https://mit-mi.github.io/how2ai-course/fall2026/schedule/context_guest.pdf); a [Colab tutorial](https://colab.research.google.com/drive/1rL24Ydm9yQKRUPoGXHr2-zJumFbBRfvJ) | [m04](#/module/m04), [m06](#/module/m06) |
| 3 | [LLMs as optimizers](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec3%20-%20llm%20optimizers.pdf): self-refine, FunSearch islands, AlphaEvolve, "autoresearch", OpenEvolve, AI Scientist, why verification matters | [m11](#/module/m11), [m23](#/module/m23), [m30](#/module/m30) |
| 5 | Harness evolution 1: [lecture](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec4%20-%20harness.pdf) (memory systems, MEM1, Reflexion, tools as code, skills as text vs code, workflow memory) and [guest slides](https://mit-mi.github.io/how2ai-course/fall2026/schedule/harness_guest.pdf) | [m18](#/module/m18), [m22](#/module/m22) |
| 6 | Harness engineering [tutorial](https://mit-mi.github.io/how2ai-course/fall2026/schedule/harness%20engineering%20tutorial.pdf): a 100-line agent loop, tool descriptions as prompts, skills, MCP, hooks, prompt caching, plan mode, memory files, "the lethal trifecta" | [m08](#/module/m08), [m13](#/module/m13), [m16](#/module/m16), [m17](#/module/m17), [m19](#/module/m19) |
| 6 | [Multi-agent evolution](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec5%20-%20multi%20agent.pdf): planning, decentralized vs centralized teams, when multi-agent helps, CORAL | [m09](#/module/m09), [m14](#/module/m14), [m15](#/module/m15) |
| 7 | Model evolution 1: [training lecture](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec6%20-%20training.pdf) (policy gradients, RLHF, PPO, GRPO, reward hacking, test-time RL, distillation, self-distillation), [RL in practice](https://mit-mi.github.io/how2ai-course/fall2026/schedule/lec6%20-%20rl%20in%20practice.pdf) and [guest slides](https://mit-mi.github.io/how2ai-course/fall2026/schedule/model_guest.pdf) | [m27](#/module/m27), [m28](#/module/m28) |
| 4, 8, 13 | Project proposal, midterm and final presentations | n/a |
| 9–12, 14 | Self-play, synthetic tasks and environments, world models, evolving rewards, AI for science, embodied harnesses, safe evolution (slides not posted yet) | [m29](#/module/m29), [m30](#/module/m30), [m25](#/module/m25) |

## The reading list, grouped

- **Prompts and context (wk 2):** [Human-level prompt engineers (APE)](https://arxiv.org/abs/2211.01910) · [TextGrad](https://arxiv.org/abs/2406.07496) · [DSPy](https://arxiv.org/abs/2310.03714) · [Reflexion](https://arxiv.org/abs/2303.11366) · [Evolving Prompts In-Context](https://arxiv.org/abs/2506.17930) · [GEPA](https://arxiv.org/abs/2507.19457) · [ReasoningBank](https://arxiv.org/abs/2509.25140)
- **Optimization and discovery (wk 3):** [FunSearch (Nature)](https://www.nature.com/articles/s41586-023-06924-6) · [LLMs as Optimizers](https://arxiv.org/abs/2309.03409) · [AlphaEvolve](https://arxiv.org/abs/2506.13131) · [The AI Scientist](https://arxiv.org/abs/2408.06292) · [Can LLMs generate novel research ideas?](https://arxiv.org/abs/2409.04109) · [Towards End-to-End Automation of AI Research](https://arxiv.org/abs/2606.15497)
- **Harness, memory and skills (wk 5–6):** [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) · [Recursive Language Models](https://arxiv.org/abs/2512.24601) · [Context Language Models](https://arxiv.org/abs/2609.37725) · [MEM1](https://arxiv.org/abs/2506.15841) · [Meta-Harness](https://arxiv.org/abs/2603.28052) · [Continual Harness](https://arxiv.org/abs/2605.09998) · [HarnessTax (Arena blog)](https://arena.ai/blog/coding-agents-harness-tax) · [Harness Updating Is Not Harness Benefit](https://arxiv.org/abs/2605.30621) · [Toolformer](https://arxiv.org/abs/2302.04761) · [ToolLLM](https://arxiv.org/abs/2307.16789) · [SkillsBench](https://arxiv.org/abs/2602.12670) · [Voyager](https://arxiv.org/abs/2305.16291)
- **Multi-agent (wk 6):** [CORAL](https://arxiv.org/abs/2604.01658) · [Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296) · [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)
- **Code from the course:** [MEM1](https://github.com/MIT-MI/MEM1) · [CORAL](https://github.com/Human-Agent-Society/CORAL) · Ao Qu's blog post [Self-evolving agents](https://quao627.github.io/blog/self-evolving-agents/), which the first slides link as the course's framing.

## Where it overlaps what you already have, and what's new

- **Already covered at an introductory level:** agent loops and harness anatomy (m07, m08), skills and `SKILL.md` (m18), memory and second brains (m22), hill-climbing evals (m23), multi-agent topologies (m14–m16), RL basics (m28). The week 6 harness tutorial is a good second look at m08, m13, m17 and m19, and its [mini-swe-agent](https://mit-mi.github.io/how2ai-course/fall2026/schedule/harness%20engineering%20tutorial.pdf) walkthrough fits the m08 100-line loop.
- **New to the library:** *automated* improvement (TextGrad, DSPy, GEPA, FunSearch, AlphaEvolve, Darwin Gödel Machine, Meta-Harness), memory that is *trained* (MEM1, Context Language Models), self-distillation and test-time training, and multi-agent *evolution* (CORAL). Nothing else in the library covers these.
- **Pairs with:** the [Build track (CS336)](#/track/cs336) for the maths and systems under weeks 7 and later, and the [Production and safety track](#/track/production-safety) for the "safe evolution" topic that the course ends on.

## A pace that fits

Six sittings of about 90 minutes, one per posted week, while you work through Units 2–6 of Learn AI. Read the slides first, then the two or three papers marked as your interest, and try the week 2 Colab. When weeks 9–14 go up, run the ingest again and add a sitting.

## Ask the course library

Slides for weeks 1–7 and the syllabus are indexed under `how2ai`, and the abstracts of the 26 arXiv readings under `how2ai-readings`. Hits cite the deck and slide range and link to that page of the PDF:

```sh
/workspace/course-rag/search.py "TextGrad textual gradient prompt optimization" -s how2ai
/workspace/course-rag/search.py "island population program database evolutionary search" -s how2ai,how2ai-readings
/workspace/course-rag/search.py "self-distillation continual learning" -s how2ai
```
