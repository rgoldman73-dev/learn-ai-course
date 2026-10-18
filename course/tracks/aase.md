---
title: Hands-on track: UMich AASE
---
# Hands-on track: UMich AASE

**What it is.** EECS 498-016 *Applied Agentic Software Engineering* (AASE, said "A two S E") is a University of Michigan course taught by Marcus Darden in Fall 2026, Aug 31 to Dec 11. It takes one object, a coding agent, three ways: **Apply** (use one), **Analyze** (take the human out of its loop and measure what broke) and **Create** (grow it into an assistant worth keeping). It has 28 lectures, 13 labs and 3 hackathons, and no exams. It runs on a small model you serve yourself, so the stated cost is $0 beyond a laptop. [S:9000000000000000498]

This is an optional companion track. Learn AI explains *why* (with ecology analogies), and AASE is the *build-it-yourself* version. Course pages: [overview](https://eecs498-aase.github.io/) · [syllabus](https://eecs498-aase.github.io/syllabus.html) · [FAQ](https://eecs498-aase.github.io/faq.html) · [podcast](https://eecs498-aase.github.io/podcast/) (a short Brief and a longer Deep Dive per lecture, as AI-generated audio with transcripts).

> Honest limits: AASE is a for-credit course. Its graded work happens in personalized GitHub repos, PrairieLearn and in-person checkoffs, and it isn't open to auditing. What you can use self-paced is the public syllabus, FAQ and podcast. The syllabus says back-half lecture titles "may shift slightly". As of Oct 18, 2026, podcast episodes exist only for L01–L05. It assumes Python, shell and git fluency (prerequisite EECS 281), so lean on Claude Code/Codex for the code and keep the AASE lectures as your checklist.

## Phase 1 · Apply: drive a coding agent (L01–L06)

| AASE | Topic | Learn AI module |
|---|---|---|
| L01 | Course Intro + the AI Coding Landscape | [m07](#/module/m07) |
| L02 | How LLMs Code (Under the Hood) | [m02](#/module/m02) |
| L03 | The Big Three: Context, Model, Prompt | [m04](#/module/m04), [m05](#/module/m05) |
| L04 | Spec-Driven Development | [m06](#/module/m06) |
| L05 | Modern Agentic CLIs | [m07](#/module/m07) |
| L06 | From Pair-Coding to Agent Orchestration | [m09](#/module/m09) |
| Lab 00 | Serve a model, connect Aider | [m26](#/module/m26) |

The AASE project for this phase is 16 guided Aider lessons followed by a spec'd "pair-programmer" with YAML config (API base, model, credential variable, budget, timeout, temperature).

## Phase 2 · Analyze: take the human out of the loop (L07–L14)

| AASE | Topic | Learn AI module |
|---|---|---|
| L07 | LLM APIs: Opening the Client You Were Handed | [m07](#/module/m07), [m08](#/module/m08) |
| L08 | Tool Use, Function Calling, and the Agent Loop | [m08](#/module/m08), [m17](#/module/m17) |
| L09 | Stop Conditions and the Approval Layer | [m11](#/module/m11), [m13](#/module/m13) |
| L10 | Serving a Local Model: an Overview | [m26](#/module/m26) |
| L11 | Edit Formats, Measured Against Your Own Parser | [m17](#/module/m17) |
| L12 | Prompting the Harness | [m05](#/module/m05), [m06](#/module/m06) |
| L13 | Evals: Task Suites, Pass Rate, Cost and Latency | [m23](#/module/m23), [m24](#/module/m24) |
| L14 | Guardrails and Failure Modes | [m25](#/module/m25) |

The AASE project here is agent v0: real function-calling tools (read, write, run), a manual approval prompt and then rule-based auto-approval with a decision log, an autonomous loop with six stop conditions, and an eval suite of at least 8 tasks run at least 3 times each, closing with a teardown report.

## Phase 3 · Create: an assistant worth keeping (L15–L28)

| AASE | Topic | Learn AI module |
|---|---|---|
| L15 | The LLM Wiki and OKF; RAG as the Alternative | [m20](#/module/m20), [m22](#/module/m22) |
| L16 | The Elephant-Goldfish Model as Skills | [m18](#/module/m18) |
| L17 | Design Is the New Code | [m18](#/module/m18), [m06](#/module/m06) |
| L18 | Permission Policy and How It Fails | [m13](#/module/m13) |
| L19 | A Repository That Tries to Prompt-Inject Your Agent | [m16](#/module/m16) |
| L20 | Context Management and Compaction | [m04](#/module/m04) |
| L21 | The Tool Interface; Why the Small Model Punishes Sloppiness | [m17](#/module/m17) |
| L22 | Sessions and Memory | [m22](#/module/m22) |
| L23 | Capturing the Build: the Graded Evidence | [m24](#/module/m24) |
| L24 | Testing Your Own Agent; Regression Gates | [m25](#/module/m25), [m32](#/module/m32) |
| L25 | Webserver and Channel | [m31](#/module/m31) |
| L26 | Wiring the Wiki (Memory) and EGM (Method) Into Your Agent | [m22](#/module/m22), [m31](#/module/m31) |
| L27 | Deploy and Demo Craft | [m31](#/module/m31) |
| L28 | Project Showcase + Course Wrap | [m32](#/module/m32) |

Learn AI has no AASE counterpart for multi-agent topologies ([m14](#/module/m14), [m15](#/module/m15)), routers ([m10](#/module/m10)), graphs ([m12](#/module/m12)), MCP ([m19](#/module/m19)) or fine-tuning and RL ([m27](#/module/m27), [m28](#/module/m28)). AASE stays with a single agent.

## Suggested self-paced order (non-CS learner)

1. **Set up the free local stack (one evening).** Install [Ollama](#/module/m26), pull a small Qwen model (AASE permits `qwen3.5:4b` or `qwen3.5:9b`, recommending the 9B), install Aider and point it at Ollama. Listen to the L01–L03 Briefs (about 1.5 minutes each) while it downloads.
2. **Apply week:** m02 → m05 → m06 → m07 → m09. After each one, give Aider a tiny task from your own work, such as a script that tidies a field-survey CSV. When it fails, diagnose the failure with AASE's Big Three: context, model or prompt?
3. **Analyze, weeks 2–3:** m08 → m17 → m11 → m13 → m23 → m25. Build your own `agent.py` as in m08, then add an approval prompt, stop conditions and an 8-task eval run 3 times each, just as AASE's agent v0 does. A small local model makes sloppy tool design fail loudly, and that's useful.
4. **Create, weeks 4–6:** m20 → m22 → m18 → m16 → m04 → m31 → m32. Your capstone becomes AASE's "assistant worth keeping": a Markdown wiki as memory, skills as method, and a regression gate.
5. Do the other Learn AI modules (multi-agent, MCP, fine-tuning) in their normal order. They extend past AASE.

## What's realistic on a Mac

AASE says any macOS, Linux or WSL laptop works with no GPU needed. Rough guidance (an estimate, not from AASE): a 4B model at 4-bit quantization takes about 3 GB and runs on an 8 GB Apple-silicon Mac, while 9B takes about 6 GB and is comfortable on 16 GB or more. A Mac Studio-class machine runs these easily and can hold much bigger models, but AASE deliberately keeps the model small so that engineering mistakes show up. Expect noticeably weaker code than Claude or Codex. Use the local stack for the *loop, approval and eval* exercises, where failures teach you something, and keep a frontier agent for real research code. Track tokens and tokens per second as AASE does (Aider's `/tokens`).
