# Learn AI: an ecologist’s path

Accelerated, self-paced. 32 daily ~30-minute modules (m29 optional) from loss landscapes to multi-agent ecosystems, grounded in the learn-ai-rag pack.

Each module: narrated intro (3-4 min) · concept reading with a widget or diagram (8-12 min) · hands-on lab (12-15 min) · self-check · “what you built today”. Each unit ends with a build the capstone reuses.


## Unit 1: The fitness landscape: how models learn

*Unit build:* A notebook of landscape and sampling experiments you can reuse as intuition pumps.


### m01: Loss is a fitness function: gradient descent vs evolution

- **Objectives:** Explain training as minimising a loss over billions of weights, in plain words; Compare gradient descent (follow the local slope) with an evolutionary strategy (mutate, select, repeat); Predict how step size / mutation size and landscape ruggedness change the outcome
- **Ecology analogy:** Fitness landscape, hill-climbing populations, local optima, Wright’s shifting balance
- **Where the metaphor fails:** A loss surface is defined over weights the model itself does not “experience”; there is no population of competing models, gradients give an exact local direction that mutation never has, and the surface has millions of dimensions where saddle points, not isolated peaks, dominate.
- **Lab:** In-browser fitness-landscape widget (GD vs ES), then ask Claude Code/Codex to write and run a short Python script that repeats the comparison across 50 random starts and reports success rates.
- **Sources:** [S:2106716291708911844] Article: "LLMs do not guess, they optimize": the math of loss landscap (@0xDeliriumm); [S:2106489085829488811] 75-min native video lecture (Jeff Dean) on AI engineering from LLM bas (@res1dualedge); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak)

### m02: Mutation rate: tokens, next-token distributions and temperature

- **Objectives:** Describe generation as repeated sampling from a next-token probability distribution; Explain what temperature (and top-p) do to that distribution and why outputs vary between runs; Choose temperature settings for creative vs extraction/classification work
- **Ecology analogy:** Mutation rate and drift: low rates conserve, high rates explore and accumulate noise
- **Where the metaphor fails:** Temperature reshapes one distribution at one step; it is not heritable and there is no selection between samples unless you add it (best-of-n, verifiers). Low temperature also does not make a model correct, only consistent.
- **Lab:** Temperature-sampler widget, then a Claude Code/Codex lab: run the same prompt 10 times at two settings via a local script or the CLI, and measure answer diversity.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2106489085829488811] 75-min native video lecture (Jeff Dean) on AI engineering from LLM bas (@res1dualedge); [S:2106761689123139973] How to set up your first Local LLM in 10 Steps ( Full-course ) (@0xMovez); [S:2101715352258232539] Kev: small open-source decision models (Qwen3 + LoRA + pointer head) y (@jaredpalmer); [S:2105819303471976479] Karpathy: tips for reading/understanding LLM outputs (e.g. ask for con (@karpathy)

### m03: Reading the organism: confidence, calibration and controlled language

- **Objectives:** Distinguish a model’s stated confidence from calibrated probability; Use output formats that make errors easier to spot (controlled language, diagrams, HTML explainers); Run a small calibration check on a yes/no task
- **Ecology analogy:** Phenotype vs genotype: you only observe behaviour, so you design assays that reveal the underlying state
- **Where the metaphor fails:** An organism’s phenotype is shaped by selection for survival; a model’s fluent explanation is shaped by training to sound helpful, so fluency is not evidence of correctness.
- **Lab:** Ask your coding agent to build a 40-item yes/no question set from your field, collect answers with stated confidence, and plot a reliability diagram.
- **Sources:** [S:2105819303471976479] Karpathy: tips for reading/understanding LLM outputs (e.g. ask for con (@karpathy); [S:2104923910039040173] Sebastian Raschka's visual mega write-up on LMs for text classificatio (@rasbt); [S:2101715352258232539] Kev: small open-source decision models (Qwen3 + LoRA + pointer head) y (@jaredpalmer); [S:2107868866361930236] Unsloth: train your own decision model locally on 4GB VRAM (20.7% to 7 (@UnslothAI)

## Unit 2: Context is habitat

*Unit build:* A short CLAUDE.md/AGENTS.md “map” for your capstone repo.


### m04: Carrying capacity: context windows, caching and compaction

- **Objectives:** Explain why every turn re-reads the whole conversation and what that costs; Describe compaction and why long sessions drift; Apply habits that keep context lean (one task per session, clear, plan first)
- **Ecology analogy:** Carrying capacity K: a habitat supports only so much before crowding degrades everyone
- **Where the metaphor fails:** Context is not consumed like food; it is re-read in full each turn, and a crowded context fails by distraction and forgetting, not by starvation. Bigger windows do not guarantee effective use.
- **Lab:** Measure it: ask Claude Code to report token use (/usage or /context) before and after a long exploratory session versus a fresh, scoped one; write down the difference.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2107712638381941071] How to make Claude limitless (22 rules): (@rubenhassid); [S:2106712905001365608] 28-min video by Claude Code's creator on writing prompts that work (CL (@txbrraa); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_)

### m05: A map, not a manual: CLAUDE.md, AGENTS.md and progressive disclosure

- **Objectives:** Write a short instructions file that points to deeper docs instead of containing them; Use nested instruction files and on-demand loading (progressive disclosure); Recognise the failure modes of one giant instructions file
- **Ecology analogy:** A field guide’s dichotomous key: a few questions route you to the right detailed page
- **Where the metaphor fails:** A key is static and authored once; an agent’s map must stay in sync with a codebase that changes daily, and stale entries actively mislead.
- **Lab:** Have your coding agent interview you and draft a ≤100-line CLAUDE.md + docs/ folder for your capstone repo; then test it by asking three questions in a fresh session.
- **Sources:** [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106712905001365608] 28-min video by Claude Code's creator on writing prompts that work (CL (@txbrraa); [S:2104402058963026288] THE COMPLETE CLAUDE CODE GUIDE: EVERYTHING YOU NEED TO START TODAY (@dravenip); [S:2106479644354474463] Summary of the Wavestone paper: 7-part blueprint every good agent harn (@undefinedKi)

### m06: Prompts that work: specificity, questions first, plan then build

- **Objectives:** Turn a vague request into a specific, checkable prompt; Use “ask me questions first” and plan-then-execute patterns; Use codebase Q&A as a safe first use of an agent
- **Ecology analogy:** Experimental design: a well-specified protocol beats a vague hypothesis
- **Where the metaphor fails:** Unlike a protocol, a prompt is interpreted by a system that will confidently fill gaps; under-specification is not caught by a reviewer before the run.
- **Lab:** Rewrite three of your recent real prompts using the patterns, run old vs new in Claude Code or Codex, and score the outputs against a 3-point rubric.
- **Sources:** [S:2106712905001365608] 28-min video by Claude Code's creator on writing prompts that work (CL (@txbrraa); [S:2107712638381941071] How to make Claude limitless (22 rules): (@rubenhassid); [S:2104402058963026288] THE COMPLETE CLAUDE CODE GUIDE: EVERYTHING YOU NEED TO START TODAY (@dravenip); [S:2105819303471976479] Karpathy: tips for reading/understanding LLM outputs (e.g. ask for con (@karpathy)

## Unit 3: Building an organism: agents and harnesses

*Unit build:* A ~100-line Python agent harness with tools, a turn cap and a router.


### m07: Organism = genome + body: model and harness anatomy

- **Objectives:** Name the seven harness subsystems (loop, LLM layer, tools, memory, safety, orchestration, extensions); Explain the core loop: call model, run tool or finish, check the exit condition; Diagnose a failure by locating the missing layer
- **Ecology analogy:** Genome (model weights) plus body plan (harness): appendages are tools, metabolism is the loop
- **Where the metaphor fails:** A body develops from the genome; a harness is engineered separately and can be swapped under the same model, which is why the same model performs very differently in different harnesses.
- **Lab:** Ask Claude Code or Codex to explain its own harness: which tools it has, how it decides to stop, where memory lives. Map its answers onto the seven-part blueprint.
- **Sources:** [S:2106479763636302271] Paper (arXiv 2609.00006) "Harness Engineering: Anatomy, Architecture,  (@undefinedKi); [S:2106479644354474463] Summary of the Wavestone paper: 7-part blueprint every good agent harn (@undefinedKi); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak)

### m08: Build a minimal organism: a 100-line agent loop

- **Objectives:** Implement a loop with two tools, a turn cap and a state file; See how tool results are fed back as tokens; Understand why minimal harnesses are dangerous without guardrails
- **Ecology analogy:** A minimal cell: the smallest set of parts that can sense, act and persist
- **Where the metaphor fails:** A minimal cell is self-limiting; a minimal agent with a shell tool has no innate limits on what it can delete or send, so sandboxing must be added by you.
- **Lab:** With your coding agent, build agent.py (two tools: read_file, list_dir; max 8 turns; STATE.md), run it on a small folder, then add a third tool.
- **Sources:** [S:2106479644354474463] Summary of the Wavestone paper: 7-part blueprint every good agent harn (@undefinedKi); [S:2108224785918439600] Ouro. The Last Harness (@DominikTornow); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_)

### m09: Behavioural repertoires: workflows versus autonomous agents

- **Objectives:** Tell a fixed workflow from an agent that chooses its own steps; Use the classic patterns: prompt chaining, routing, parallelisation, orchestrator-workers, evaluator-optimizer; Pick the simplest pattern that solves a task
- **Ecology analogy:** Fixed action patterns versus flexible foraging behaviour
- **Where the metaphor fails:** Animals evolved both modes over deep time; you choose per task, and the cost of flexibility (tokens, unpredictability) is paid on every run.
- **Lab:** Solve one literature-triage task twice (a prompt chain and a free agent) with your coding agent; compare cost, time and error rate on 20 abstracts.
- **Sources:** [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106826633390772253] 78-min podcast with Claude Code's creator on agent graphs that self-im (@hayatomaruu); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak)

### m10: Reflex and cortex: model routers and cheap decision layers

- **Objectives:** Explain why routine yes/no decisions should not go to the most expensive model; Design a router with tiers, criteria and a classifier; Measure a router with offline evals and an A/B comparison
- **Ecology analogy:** Spinal reflex arcs versus cortical deliberation: fast cheap circuits handle routine stimuli
- **Where the metaphor fails:** Reflexes were selected for over generations; a router is only as good as the labelled data and evals behind it, and misroutes fail silently.
- **Lab:** Add a router to your agent: a cheap model (or rules) classifies each task into a tier; log choices to CSV and score 20 tasks.
- **Sources:** [S:2105704739585565066] How to Build a Model Router in the Harness (@sydneyrunkle); [S:2106706177304240191] Jev/decision-layer gate for Claude Code: route routine decisions to a  (@SolSt1ne); [S:2107578571124588977] Checklist of 10 open-source decision-layer repos (jev-opus, routers, p (@ch3nweiii); [S:2101715352258232539] Kev: small open-source decision models (Qwen3 + LoRA + pointer head) y (@jaredpalmer)

## Unit 4: Trophic flows: workflows, loops and graphs

*Unit build:* A verified, looped workflow that only asks you to approve the last step.


### m11: Feedback loops: loop engineering and stopping rules

- **Objectives:** Write a loop contract: job, trigger, state, verifier, stop rule, approval; Loop on evidence (tests, checks), not on the model’s confidence; Set budgets: attempts, time, tokens
- **Ecology analogy:** Homeostatic feedback loops and density-dependent regulation
- **Where the metaphor fails:** Biological feedback is continuous and cheap; agent loops cost money per iteration and can loop forever on a broken verifier.
- **Lab:** Have your coding agent write a headless loop (claude -p or codex exec) that re-runs a failing analysis script until its tests pass, with a 3-attempt cap and STATE.md.
- **Sources:** [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106826633390772253] 78-min podcast with Claude Code's creator on agent graphs that self-im (@hayatomaruu); [S:2091515787366306154] Loops and Graphs: how to stop babysitting agents and only approve the  (@hanakoxbt); [S:2104402058963026288] THE COMPLETE CLAUDE CODE GUIDE: EVERYTHING YOU NEED TO START TODAY (@dravenip)

### m12: Food chains to food webs: graph engineering

- **Objectives:** Break work into nodes with typed outputs and deterministic edges; Use fan-out/fan-in, gates, correction edges and learning edges; Keep the generator from grading its own work
- **Ecology analogy:** Trophic levels and energy flow between compartments
- **Where the metaphor fails:** Energy flows one way down a food chain; in agent graphs information flows back (correction edges), and a graph can freeze assumptions too early.
- **Lab:** Build a small graph in plain Python (or LangGraph): split 30 records, annotate in parallel, merge with a code node, gate with an independent check.
- **Sources:** [S:2091515787366306154] Loops and Graphs: how to stop babysitting agents and only approve the  (@hanakoxbt); [S:2104873702198538738] Graph Engineering prompt + article: stop agents grading their own home (@imryven); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106826633390772253] 78-min podcast with Claude Code's creator on agent graphs that self-im (@hayatomaruu)

### m13: Approve only the last step: hooks, headless runs and permissions

- **Objectives:** Use CLAUDE.md, permissions and plan mode to bound an agent; Add a hook that runs checks automatically after edits; Run agents headlessly for scheduled jobs
- **Ecology analogy:** Field-station protocols: routine sampling runs unattended, the PI signs off the final dataset
- **Where the metaphor fails:** Field assistants understand intent; an agent follows literal permissions, so gaps in the rules are exploited by accident, not judgement.
- **Lab:** Set up a repo with a test hook and permissions, then run one task headlessly and review only the final diff.
- **Sources:** [S:2104402058963026288] THE COMPLETE CLAUDE CODE GUIDE: EVERYTHING YOU NEED TO START TODAY (@dravenip); [S:2105764769479455043] Claude Code agent-teams tip (lead + specialist teammates incl. an adve (@mirku21); [S:2091515787366306154] Loops and Graphs: how to stop babysitting agents and only approve the  (@hanakoxbt); [S:2106712905001365608] 28-min video by Claude Code's creator on writing prompts that work (CL (@txbrraa)

## Unit 5: Food webs: multi-agent coordination

*Unit build:* An orchestrator with specialist subagents and an independent reviewer.


### m14: Orchestration topologies: manager versus decentralised handoffs

- **Objectives:** Contrast the manager pattern (agents as tools) with decentralised handoffs; Use task decomposition and replanning; Decide when not to go multi-agent
- **Ecology analogy:** Eusocial colonies with a queen vs decentralised swarms (stigmergy)
- **Where the metaphor fails:** A colony’s coordination evolved and is robust; agent topologies are designed and each extra agent multiplies token cost and failure points.
- **Lab:** Have your coding agent build an orchestrator that fans out three summariser subagents over papers, then synthesises; compare with a single agent.
- **Sources:** [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2106410521079538108] 2-hour native video guide (Annie Wang): AI employee from one prompt to (@0xMortyx); [S:2106826633390772253] 78-min podcast with Claude Code's creator on agent graphs that self-im (@hayatomaruu)

### m15: Division of labour: subagents, teams and the adversary

- **Objectives:** Give subagents isolated context and restricted tools; Use an advisor or adversarial reviewer before “done”; Weigh team benefits against token cost and echo-chamber risk
- **Ecology analogy:** Castes and division of labour; predators that keep prey populations honest
- **Where the metaphor fails:** Workers sharing one context converge on one opinion; unlike real castes, cloned agents have no genuine diversity unless you design it in.
- **Lab:** Create a read-only reviewer subagent in Claude Code and run it on a data-cleaning change; log what it catches.
- **Sources:** [S:2105764769479455043] Claude Code agent-teams tip (lead + specialist teammates incl. an adve (@mirku21); [S:2105040007127761242] Claude Code /advisor pattern: big model plans, cheaper models swarm ro (@mirku21); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2091515787366306154] Loops and Graphs: how to stop babysitting agents and only approve the  (@hanakoxbt)

### m16: A guild at work: role-based teams and prompt injection

- **Objectives:** Assign roles (planner, navigator, checker, guard, logger) for a real task; Defend against prompt injection from web content; Make multi-agent runs repeatable and logged
- **Ecology analogy:** Foraging guilds and mixed-species flocks with sentinels
- **Where the metaphor fails:** Sentinel birds are not tricked by text; agents read attacker-controlled content as instructions unless separated by design.
- **Lab:** Run a role-based browser or lookup team over a CSV of taxon names (e.g. checking a public database), with a guard role and a log.csv.
- **Sources:** [S:2108160445764833696] Prompt that turns one Claude Code session into a 6-role browser-agent  (@hexobuilds); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106489085829488811] 75-min native video lecture (Jeff Dean) on AI engineering from LLM bas (@res1dualedge)

## Unit 6: Niches: skills, tools, plugins and MCP

*Unit build:* A domain skill and an MCP connection your capstone agents use.


### m17: Appendages: tool definitions, schemas and constrained decoding

- **Objectives:** Write a JSON-schema tool definition; Explain how constrained decoding guarantees well-formed calls; Design tools that are hard to misuse
- **Ecology analogy:** Appendage morphology fits function: beak shape predicts diet
- **Where the metaphor fails:** Morphology is fixed for a lifetime; tools can be added or removed per task, and too many tools crowd the context.
- **Lab:** Define three tools (taxonomy lookup, file read, unit converter) for your agent and watch how the model chooses between them.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2106479644354474463] Summary of the Wavestone paper: 7-part blueprint every good agent harn (@undefinedKi)

### m18: Learned behaviour: skills, SKILL.md and self-rewriting skill libraries

- **Objectives:** Write a SKILL.md with a name, description and on-demand body; Explain progressive disclosure for skills; Describe agents that induce or rewrite their own skills
- **Ecology analogy:** Learned behaviours and cultural transmission (song learning)
- **Where the metaphor fails:** Culture is transmitted with variation and selection across individuals; an agent rewriting its own skills can drift without any selection unless you add evals.
- **Lab:** Write a “field-data-qc” skill and have Claude Code invoke it on a messy CSV; then ask it to improve the skill and compare versions.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2106479763636302271] Paper (arXiv 2609.00006) "Harness Engineering: Anatomy, Architecture,  (@undefinedKi); [S:2098057823930155319] How to design AI agent systems in 12 steps: The full agent architectur (@Gyome1_); [S:2104402058963026288] THE COMPLETE CLAUDE CODE GUIDE: EVERYTHING YOU NEED TO START TODAY (@dravenip); [S:2107871108338982988] RPG (Berkeley/Amazon): robot practices in sim, diagnoses failures, rew (@wangyenjen)

### m19: Shared interfaces: MCP servers, gateways and mods

- **Objectives:** Explain MCP as a shared interface standard between agents and tools; Describe the gateway/registry pattern at company scale; Customise an agent with plugins, hooks or mods
- **Ecology analogy:** Mutualism via a shared signal: pollinators and flowers converge on standard cues
- **Where the metaphor fails:** Mutualisms co-evolve slowly; MCP servers can be added in seconds, including untrusted ones, so trust has to be managed explicitly.
- **Lab:** Add one public MCP server to Claude Code, use it in a task, and write a small hook that blocks a dangerous command.
- **Sources:** [S:2106483024129147108] Uber's MCP Gateway: managing MCP servers at company scale (quoted engi (@santtiagom_); [S:2106118519368888562] Claude Code mods blog post; example mod that spins off a side-agent to (@ClaudeDevs); [S:2104992334438154414] OpenAI MCP extensions / MCP Apps: build ChatGPT plugin features on MCP (@mxstbr); [S:2106479763636302271] Paper (arXiv 2609.00006) "Harness Engineering: Anatomy, Architecture,  (@undefinedKi)

## Unit 7: The field notebook: RAG and memory

*Unit build:* A searchable knowledge base (this very pack, then your own notes).


### m20: Foraging for facts: BM25 keyword search and chunking

- **Objectives:** Explain BM25 scoring (term frequency, rarity, length normalisation); Compare chunking strategies; Judge a ranked hit list for relevance (precision@5)
- **Ecology analogy:** Optimal foraging and the marginal value theorem: when to leave a patch
- **Where the metaphor fails:** Foragers learn patch quality from experience; BM25 has no learning at all, it matches words, so synonyms and paraphrases are invisible to it.
- **Lab:** Use this pack’s corpus/query.py as your first RAG system: write 10 questions, label top-5 hits, then have your coding agent tune k1/b and compare.
- **Sources:** [S:2105259648001376474] Free "AI university" GitHub course: week-by-week production agentic RA (@mdancho84); [S:2033587293064204349] How to become an AI Engineer in 6 months (RESOURCES) (@DeRonin_); [S:2106489085829488811] 75-min native video lecture (Jeff Dean) on AI engineering from LLM bas (@res1dualedge)

### m21: Smelling the patch: embeddings and hybrid search

- **Objectives:** Explain embeddings and similarity search; Fuse keyword and vector rankings (reciprocal rank fusion); A/B test retrieval changes on your own question set
- **Ecology analogy:** Olfactory search: following a gradient of similarity rather than an exact match
- **Where the metaphor fails:** Smell is grounded in chemistry; embedding similarity is learned from text statistics and can rank fluent but irrelevant passages highly.
- **Lab:** With your coding agent, add a small free embedding model to the pack search, fuse with BM25, and compare precision@5 with the m20 baseline.
- **Sources:** [S:2105259648001376474] Free "AI university" GitHub course: week-by-week production agentic RA (@mdancho84); [S:2106462125874987099] 10 open-source fact-checking/verification agent projects (OpenScholar  (@Promixyz); [S:2107516198959386895] EmbeddingGemma 2: small open embedding model for local RAG (0.5GB RAM) (@HuggingModels); [S:2105607355262009622] 10 open-source agent repos (LangGraph, PydanticAI, Mastra, Agno, Cogne (@Lummox_eth)

### m22: The field notebook: agent memory and second brains

- **Objectives:** Distinguish working context, compaction and external memory; Organise a markdown knowledge base with an index file; Test recall with questions you already know the answers to
- **Ecology analogy:** Field notebooks and herbaria: external memory that outlives the expedition
- **Where the metaphor fails:** A herbarium specimen is fixed; agent memory is rewritten by the agent, so errors can be stored and reinforced.
- **Lab:** Build a markdown field notebook of your paper notes with a CLAUDE.md index and /process, /ask commands; test recall on 10 known answers.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2078784709253841039] Claude Second Brain & Folder Workflow: The Complete Guide (@Bober_smart); [S:2106195341485703442] How to build a second brain with Opus 5.5 ( Full Course) (@cyrilXBT); [S:2029222820257935369] Steal My AI Second Brain Setup With Obsidian + Claude Code (For Free) (@noahvnct)

## Unit 8: Fitness assays: evals and verification

*Unit build:* An eval suite with a held-out split and an adversarial checker.


### m23: Designing a fitness assay: evals and hill-climbing

- **Objectives:** Design tasks that mirror real use with headroom; Keep a held-out split and check grader agreement; Hill-climb a prompt or config against the eval without overfitting
- **Ecology analogy:** Common-garden experiments: measure fitness under controlled conditions
- **Where the metaphor fails:** A common garden measures organisms that cannot game the assay; models and agents can overfit to an eval, so assays need rotation and held-out data.
- **Lab:** Write a 30-item eval for a small task in your field with a code grader; hill-climb a prompt with your coding agent and report train vs held-out scores.
- **Sources:** [S:2104676099083190435] Anthropic/Claude guide to eval design and "hill-climbing" with Claude  (@ClaudeDevs); [S:2105008692655743208] 10 GitHub repos to learn agentic AI: awesome-harness-engineering, loop (@AvinashSingh_20); [S:2033587293064204349] How to become an AI Engineer in 6 months (RESOURCES) (@DeRonin_)

### m24: Judges, RAG metrics and tracing

- **Objectives:** Choose between code graders and LLM-as-judge; Use faithfulness and context precision/recall for RAG; Debug with traces instead of guesses
- **Ecology analogy:** Inter-observer reliability when scoring behaviour
- **Where the metaphor fails:** Human observers can be trained and calibrated against each other; LLM judges share biases with the systems they grade.
- **Lab:** Score your m21 retrieval pipeline with an open-source eval library using a free or local judge, and inspect five traces.
- **Sources:** [S:2105607355262009622] 10 open-source agent repos (LangGraph, PydanticAI, Mastra, Agno, Cogne (@Lummox_eth); [S:2106462125874987099] 10 open-source fact-checking/verification agent projects (OpenScholar  (@Promixyz); [S:2105008692655743208] 10 GitHub repos to learn agentic AI: awesome-harness-engineering, loop (@AvinashSingh_20)

### m25: The Red Queen: independent verification and adversarial testing

- **Objectives:** Never let the generator grade its own homework; Add verifier and adversary agents; Report results with confidence intervals
- **Ecology analogy:** Coevolutionary arms races (Red Queen): predators and prey keep each other honest
- **Where the metaphor fails:** Natural arms races have no referee; in evals you control both sides, so a weak adversary gives false comfort.
- **Lab:** Add an independent verifier that checks claims against citations; measure how many planted errors it catches versus self-checking.
- **Sources:** [S:2104873702198538738] Graph Engineering prompt + article: stop agents grading their own home (@imryven); [S:2106462125874987099] 10 open-source fact-checking/verification agent projects (OpenScholar  (@Promixyz); [S:2104832660791308542] Reality Check: public real-world robot manipulation benchmark (14,400  (@Nicolas_Keller); [S:2105764769479455043] Claude Code agent-teams tip (lead + specialist teammates incl. an adve (@mirku21)

## Unit 9: Artificial selection: fine-tuning, RL and local models

*Unit build:* A small local decision model that your capstone router can call.


### m26: Domestication at home: running models locally

- **Objectives:** Explain quantisation and memory needs (weights + context cache); Run a small open model locally and measure tokens per second; Know when local models are good enough
- **Ecology analogy:** Domestic strains: smaller, hardier, adapted to your environment
- **Where the metaphor fails:** Quantisation is lossy compression, not adaptation; a smaller model is not tuned to your habitat until you fine-tune it.
- **Lab:** With your coding agent, install a local runtime, run a 1-4B model, change one setting at a time and log speed and memory.
- **Sources:** [S:2104017679908540472] Local AI learning advice: learn llama.cpp internals instead of hiding  (@sudoingX); [S:2106761689123139973] How to set up your first Local LLM in 10 Steps ( Full-course ) (@0xMovez); [S:2106704758048485654] Yes! your gaming gpu runs an autonomous local ai agent, here is what t (@sudoingX)

### m27: Selective breeding: supervised fine-tuning and LoRA

- **Objectives:** Explain SFT as imitation of demonstrations; Explain LoRA as cheap, small adaptations on a frozen base; Fine-tune a small classifier and compare it with the base model
- **Ecology analogy:** Artificial selection from a breeding stock; cultural transmission by imitation
- **Where the metaphor fails:** Breeding selects among heritable variation; SFT copies demonstrations directly, including their mistakes.
- **Lab:** Run a free notebook to fine-tune a small model as a classifier for your field (e.g. study type from abstract), and compare base vs tuned accuracy on held-out data.
- **Sources:** [S:2107868866361930236] Unsloth: train your own decision model locally on 4GB VRAM (20.7% to 7 (@UnslothAI); [S:2107873310327648461] Daniel Han: convert Qwen/Gemma/Llama into decision models with a class (@danielhanchen); [S:2101715352258232539] Kev: small open-source decision models (Qwen3 + LoRA + pointer head) y (@jaredpalmer); [S:2102881280115249597] How to train your own Jev for $17 (@nutlope); [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak)

### m28: Selection on behaviour: reinforcement learning basics

- **Objectives:** Explain rollouts, rewards and policy updates; Connect evals to rewards (and reward hacking to Goodhart’s law); Understand why RL for agents is hard
- **Ecology analogy:** Natural selection acting on behaviour; Goodhart’s law as selection on a proxy trait
- **Where the metaphor fails:** Selection acts on whole lifetimes over generations; RL credit assignment acts token by token, and a mis-specified reward is optimised ruthlessly.
- **Lab:** Run a tiny RL demo (a free notebook or a toy script your coding agent writes) with a verifiable reward; plot reward over time and look for hacking.
- **Sources:** [S:2104635196910030894] CMU 11-768 AI Agents (Neubig & Fried, Fall 2026) free on YouTube: from (@techNmak); [S:2102497917185802737] Perplexity research: post-training a computer-use agent from real user (@AravSrinivas); [S:2107868866361930236] Unsloth: train your own decision model locally on 4GB VRAM (20.7% to 7 (@UnslothAI); [S:2105008692655743208] 10 GitHub repos to learn agentic AI: awesome-harness-engineering, loop (@AvinashSingh_20)

## Unit 10: Embodiment: a bridge to robotics (optional)

*Unit build:* A simulated controller your coding agent writes, tests and scores.


### m29: Agents with bodies: simulation, self-practice and robot data (optional)

- **Objectives:** Describe agents writing and testing robot code with simulation in the loop; Explain the robot data pyramid (simulation, teleoperation, video); Report robot success rates with confidence intervals
- **Ecology analogy:** Reciprocal transplant experiments: does performance transfer to a new environment?
- **Where the metaphor fails:** Transplanted organisms adapt over generations; sim-trained policies face a fixed reality gap that only better simulation or real data closes.
- **Lab:** Ask your coding agent to write a small MuJoCo reach or gait task on CPU, tune it, and report success rate with a confidence interval. Link to your robotics course for depth.
- **Sources:** [S:2107485908673106241] SimEX (arXiv 2609.38982, "Simulation-Integrated Robotics AutoResearch" (@JiahengHu1); [S:2108128859006570832] One sentence in Claude Code trains, evaluates and packages a MuJoCo ga (@0x_meden); [S:2107871108338982988] RPG (Berkeley/Amazon): robot practices in sim, diagnoses failures, rew (@wangyenjen); [S:2090126022465495083] The Robotics Data Map (@_varunnair); [S:2104832660791308542] Reality Check: public real-world robot manipulation benchmark (14,400  (@Nicolas_Keller)

## Unit 11: Capstone: build an ecosystem

*Unit build:* A small multi-agent literature-triage and field-data-QA system with memory, evals and a budget.


### m30: Choosing your niche: AI for science and the impedance mismatch

- **Objectives:** Identify problems where AI output can be verified; Audit a real workflow before automating it; Scope a capstone that reuses each unit’s build
- **Ecology analogy:** Niche construction: organisms that reshape their environment to fit
- **Where the metaphor fails:** Niche construction is slow and mutual; automating a broken process just makes the broken process faster.
- **Lab:** Audit one of your lab workflows step by step (delete / rule / agent / human) with your coding agent and write the capstone spec.
- **Sources:** [S:2105733864152858919] Anthropic Science Blog guest post (Schwartz): the "impedance mismatch" (@AnthropicAI); [S:2107228565519708665] FDE full course clip: audit a client's process before automating (17 s (@startupideaspod); [S:2105793758616866834] 54-min native video masterclass on how forward deployed engineers scop (@gregisenberg)

### m31: Assembling the ecosystem: harness, specialists and memory

- **Objectives:** Assemble harness, router, specialist agents and RAG memory into one system; Wire components through clear interfaces; Keep a map (CLAUDE.md) of the whole system
- **Ecology analogy:** Community assembly: species arrive, interact and form a stable community
- **Where the metaphor fails:** Communities assemble themselves; your system only has the interactions you build and test.
- **Lab:** With your coding agent, combine your unit builds into a literature-triage and field-data-QA team for one real dataset.
- **Sources:** [S:2105008692655743208] 10 GitHub repos to learn agentic AI: awesome-harness-engineering, loop (@AvinashSingh_20); [S:2105607355262009622] 10 open-source agent repos (LangGraph, PydanticAI, Mastra, Agno, Cogne (@Lummox_eth); [S:2106479644354474463] Summary of the Wavestone paper: 7-part blueprint every good agent harn (@undefinedKi); [S:2091515787366306154] Loops and Graphs: how to stop babysitting agents and only approve the  (@hanakoxbt)

### m32: Stress-testing the ecosystem: evals, adversaries and budgets

- **Objectives:** Run the eval suite and adversarial agent against the full system; Set and monitor a cost and latency budget; Decide what to ship and what to cut
- **Ecology analogy:** Disturbance experiments: perturb the community and measure resilience
- **Where the metaphor fails:** Ecosystems recover on their own; an agent system degrades silently unless monitoring and evals run continuously.
- **Lab:** Run the full eval + adversary suite, compute cost per task, write a one-page report, and plan the next iteration.
- **Sources:** [S:2104676099083190435] Anthropic/Claude guide to eval design and "hill-climbing" with Claude  (@ClaudeDevs); [S:2105704739585565066] How to Build a Model Router in the Harness (@sydneyrunkle); [S:2104873702198538738] Graph Engineering prompt + article: stop agents grading their own home (@imryven); [S:2033587293064204349] How to become an AI Engineer in 6 months (RESOURCES) (@DeRonin_)
