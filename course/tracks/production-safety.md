---
title: Production and safety track (AI Engineering from Scratch, Phases 17–18)
---
# Production and safety track

**What it is.** Two phases of *AI Engineering from Scratch* by Rohit Ghumare and contributors (MIT licence, free, [site](https://aiengineeringfromscratch.com/) · [GitHub](https://github.com/rohitg00/ai-engineering-from-scratch)). Phase 17 covers running LLM systems in production (29 lessons) and Phase 18 covers ethics, safety and alignment (30 lessons). Each lesson has a text of about 1,000–3,000 words, runnable code and a quiz. [S:9000000000000000542]

These are the two areas Learn AI covers least. m10, m25, m26 and m32 touch them; this page goes further.

> Honest limits: this is a secondary source. The repo has 542 lessons written in about seven months and is probably heavily AI-written. The lessons are well structured, but check any number or claim against the paper or docs a lesson cites before you rely on it. The code uses toy, standard-library examples, not production configurations.

## Phase 17 · Infrastructure and production (pick by need)

| Lessons | Theme | Learn AI module |
|---|---|---|
| 01 Managed LLM platforms · 02 Inference economics · 27 FinOps | what it costs | [m10](#/module/m10), [m32](#/module/m32) |
| 04 vLLM serving internals · 06 SGLang RadixAttention · 05 EAGLE-3 speculative decoding · 09 Production quantization · 17 Disaggregated prefill/decode · 28 Self-hosted serving selection | serving models fast | [m26](#/module/m26) |
| 08 Inference metrics and goodput · 13 LLM observability · 22 Load testing | measuring a live system | [m24](#/module/m24) |
| 14 Prompt/semantic caching · 15 Batch APIs · 16 Model routing · 19 AI gateways | cheaper and more reliable calls | [m04](#/module/m04), [m10](#/module/m10) |
| 20 Shadow/canary/progressive release · 21 A/B testing LLM features · 23 SRE for AI · 24 Chaos engineering | releasing safely | [m32](#/module/m32) |
| 25 Security, secrets, audit · 26 Compliance frameworks | governance | [m13](#/module/m13) |

Start with [16 Model routing](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/17-infrastructure-and-production/16-model-routing), [04 Serving internals](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/17-infrastructure-and-production/04-vllm-serving-internals) and the [Inside an LLM Serving GPU](https://aiengineeringfromscratch.com/inside-an-llm-serving-gpu) simulation.

## Phase 18 · Ethics, safety and alignment

| Lessons | Theme | Learn AI module |
|---|---|---|
| 01 Instruction following · 03 DPO family · 04 Sycophancy · 05 Constitutional AI | how alignment training works | [m27](#/module/m27), [m28](#/module/m28) |
| 02 Reward hacking and Goodhart · 06 Mesa-optimization · 07 Sleeper agents · 08 In-context scheming · 09 Alignment faking · 10 AI control · 11 Scalable oversight | when models game the objective | [m25](#/module/m25), [m28](#/module/m28) |
| 12 Automated red-teaming · 13 Many-shot jailbreaking · 15 Indirect prompt injection · 16 Red-team tooling (garak, Llama Guard, PyRIT) · 25 CVEs for AI | attacking your own system | [m16](#/module/m16), [m25](#/module/m25) |
| 17 Dual-use evaluation · 18 Frontier safety frameworks · 30 Dual-use risk | lab safety policies | [m30](#/module/m30) |
| 20 Bias · 21 Fairness criteria · 22 Differential privacy · 23 Watermarking · 24 Regulation · 26 Model cards · 27 Data provenance | society and governance | pairs with Harvard Classes 8–11 in the [Primer track](#/track/harvard-genai) |

Start with [02 Reward hacking](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/18-ethics-safety-alignment/02-reward-hacking-goodhart) and [15 Indirect prompt injection](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/18-ethics-safety-alignment/15-indirect-prompt-injection).

## Ask the course library

All 542 lessons are indexed locally under source id `aiefs`. Pair a hit with a primary source when you can:

```sh
/workspace/course-rag/search.py "canary release LLM feature" -s aiefs
/workspace/course-rag/search.py "reward hacking" -s aiefs,cs336
```
