#!/usr/bin/env python3
"""Source of truth for course/outline.json and course/OUTLINE.md. Edit here, then: python3 course/tools/outline_src.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); COURSE = os.path.dirname(HERE)
CMU = '2104635196910030894'
U = []
def unit(id, title, theme, build): U.append(dict(id=id, title=title, theme=theme, build=build, modules=[]))
def mod(id, title, objectives, analogy, fails, lab, source_ids, optional=False):
    U[-1]['modules'].append(dict(id=id, unit=U[-1]['id'], title=title, objectives=objectives, analogy=analogy,
        metaphor_fails=fails, lab=lab, source_ids=source_ids, optional=optional))

unit(1, 'The fitness landscape: how models learn', 'foundations', 'A notebook of landscape and sampling experiments you can reuse as intuition pumps.')
mod('m01', 'Loss is a fitness function: gradient descent vs evolution',
    ['Explain training as minimising a loss over billions of weights, in plain words',
     'Compare gradient descent (follow the local slope) with an evolutionary strategy (mutate, select, repeat)',
     'Predict how step size / mutation size and landscape ruggedness change the outcome'],
    'Fitness landscape, hill-climbing populations, local optima, Wright’s shifting balance',
    'A loss surface is defined over weights the model itself does not “experience”; there is no population of competing models, gradients give an exact local direction that mutation never has, and the surface has millions of dimensions where saddle points, not isolated peaks, dominate.',
    'In-browser fitness-landscape widget (GD vs ES), then ask Claude Code/Codex to write and run a short Python script that repeats the comparison across 50 random starts and reports success rates.',
    ['2106716291708911844', '2106489085829488811', CMU])
mod('m02', 'Mutation rate: tokens, next-token distributions and temperature',
    ['Describe generation as repeated sampling from a next-token probability distribution',
     'Explain what temperature (and top-p) do to that distribution and why outputs vary between runs',
     'Choose temperature settings for creative vs extraction/classification work'],
    'Mutation rate and drift: low rates conserve, high rates explore and accumulate noise',
    'Temperature reshapes one distribution at one step; it is not heritable and there is no selection between samples unless you add it (best-of-n, verifiers). Low temperature also does not make a model correct, only consistent.',
    'Temperature-sampler widget, then a Claude Code/Codex lab: run the same prompt 10 times at two settings via a local script or the CLI, and measure answer diversity.',
    [CMU, '2106489085829488811', '2106761689123139973', '2101715352258232539', '2105819303471976479'])
mod('m03', 'Reading the organism: confidence, calibration and controlled language',
    ['Distinguish a model’s stated confidence from calibrated probability',
     'Use output formats that make errors easier to spot (controlled language, diagrams, HTML explainers)',
     'Run a small calibration check on a yes/no task'],
    'Phenotype vs genotype: you only observe behaviour, so you design assays that reveal the underlying state',
    'An organism’s phenotype is shaped by selection for survival; a model’s fluent explanation is shaped by training to sound helpful, so fluency is not evidence of correctness.',
    'Ask your coding agent to build a 40-item yes/no question set from your field, collect answers with stated confidence, and plot a reliability diagram.',
    ['2105819303471976479', '2104923910039040173', '2101715352258232539', '2107868866361930236'])

unit(2, 'Context is habitat', 'prompting-context', 'A short CLAUDE.md/AGENTS.md “map” for your capstone repo.')
mod('m04', 'Carrying capacity: context windows, caching and compaction',
    ['Explain why every turn re-reads the whole conversation and what that costs',
     'Describe compaction and why long sessions drift',
     'Apply habits that keep context lean (one task per session, clear, plan first)'],
    'Carrying capacity K: a habitat supports only so much before crowding degrades everyone',
    'Context is not consumed like food; it is re-read in full each turn, and a crowded context fails by distraction and forgetting, not by starvation. Bigger windows do not guarantee effective use.',
    'Measure it: ask Claude Code to report token use (/usage or /context) before and after a long exploratory session versus a fresh, scoped one; write down the difference.',
    [CMU, '2107712638381941071', '2106712905001365608', '2098057823930155319'])
mod('m05', 'A map, not a manual: CLAUDE.md, AGENTS.md and progressive disclosure',
    ['Write a short instructions file that points to deeper docs instead of containing them',
     'Use nested instruction files and on-demand loading (progressive disclosure)',
     'Recognise the failure modes of one giant instructions file'],
    'A field guide’s dichotomous key: a few questions route you to the right detailed page',
    'A key is static and authored once; an agent’s map must stay in sync with a codebase that changes daily, and stale entries actively mislead.',
    'Have your coding agent interview you and draft a ≤100-line CLAUDE.md + docs/ folder for your capstone repo; then test it by asking three questions in a fresh session.',
    ['2098057823930155319', '2106712905001365608', '2104402058963026288', '2106479644354474463'])
mod('m06', 'Prompts that work: specificity, questions first, plan then build',
    ['Turn a vague request into a specific, checkable prompt',
     'Use “ask me questions first” and plan-then-execute patterns',
     'Use codebase Q&A as a safe first use of an agent'],
    'Experimental design: a well-specified protocol beats a vague hypothesis',
    'Unlike a protocol, a prompt is interpreted by a system that will confidently fill gaps; under-specification is not caught by a reviewer before the run.',
    'Rewrite three of your recent real prompts using the patterns, run old vs new in Claude Code or Codex, and score the outputs against a 3-point rubric.',
    ['2106712905001365608', '2107712638381941071', '2104402058963026288', '2105819303471976479'])

unit(3, 'Building an organism: agents and harnesses', 'agents-harnesses', 'A ~100-line Python agent harness with tools, a turn cap and a router.')
mod('m07', 'Organism = genome + body: model and harness anatomy',
    ['Name the seven harness subsystems (loop, LLM layer, tools, memory, safety, orchestration, extensions)',
     'Explain the core loop: call model, run tool or finish, check the exit condition',
     'Diagnose a failure by locating the missing layer'],
    'Genome (model weights) plus body plan (harness): appendages are tools, metabolism is the loop',
    'A body develops from the genome; a harness is engineered separately and can be swapped under the same model, which is why the same model performs very differently in different harnesses.',
    'Ask Claude Code or Codex to explain its own harness: which tools it has, how it decides to stop, where memory lives. Map its answers onto the seven-part blueprint.',
    ['2106479763636302271', '2106479644354474463', '2098057823930155319', CMU])
mod('m08', 'Build a minimal organism: a 100-line agent loop',
    ['Implement a loop with two tools, a turn cap and a state file',
     'See how tool results are fed back as tokens',
     'Understand why minimal harnesses are dangerous without guardrails'],
    'A minimal cell: the smallest set of parts that can sense, act and persist',
    'A minimal cell is self-limiting; a minimal agent with a shell tool has no innate limits on what it can delete or send, so sandboxing must be added by you.',
    'With your coding agent, build agent.py (two tools: read_file, list_dir; max 8 turns; STATE.md), run it on a small folder, then add a third tool.',
    ['2106479644354474463', '2108224785918439600', CMU, '2098057823930155319'])
mod('m09', 'Behavioural repertoires: workflows versus autonomous agents',
    ['Tell a fixed workflow from an agent that chooses its own steps',
     'Use the classic patterns: prompt chaining, routing, parallelisation, orchestrator-workers, evaluator-optimizer',
     'Pick the simplest pattern that solves a task'],
    'Fixed action patterns versus flexible foraging behaviour',
    'Animals evolved both modes over deep time; you choose per task, and the cost of flexibility (tokens, unpredictability) is paid on every run.',
    'Solve one literature-triage task twice (a prompt chain and a free agent) with your coding agent; compare cost, time and error rate on 20 abstracts.',
    ['2098057823930155319', '2106826633390772253', CMU])
mod('m10', 'Reflex and cortex: model routers and cheap decision layers',
    ['Explain why routine yes/no decisions should not go to the most expensive model',
     'Design a router with tiers, criteria and a classifier',
     'Measure a router with offline evals and an A/B comparison'],
    'Spinal reflex arcs versus cortical deliberation: fast cheap circuits handle routine stimuli',
    'Reflexes were selected for over generations; a router is only as good as the labelled data and evals behind it, and misroutes fail silently.',
    'Add a router to your agent: a cheap model (or rules) classifies each task into a tier; log choices to CSV and score 20 tasks.',
    ['2105704739585565066', '2106706177304240191', '2107578571124588977', '2101715352258232539'])

unit(4, 'Trophic flows: workflows, loops and graphs', 'workflows', 'A verified, looped workflow that only asks you to approve the last step.')
mod('m11', 'Feedback loops: loop engineering and stopping rules',
    ['Write a loop contract: job, trigger, state, verifier, stop rule, approval',
     'Loop on evidence (tests, checks), not on the model’s confidence',
     'Set budgets: attempts, time, tokens'],
    'Homeostatic feedback loops and density-dependent regulation',
    'Biological feedback is continuous and cheap; agent loops cost money per iteration and can loop forever on a broken verifier.',
    'Have your coding agent write a headless loop (claude -p or codex exec) that re-runs a failing analysis script until its tests pass, with a 3-attempt cap and STATE.md.',
    ['2098057823930155319', '2106826633390772253', '2091515787366306154', '2104402058963026288'])
mod('m12', 'Food chains to food webs: graph engineering',
    ['Break work into nodes with typed outputs and deterministic edges',
     'Use fan-out/fan-in, gates, correction edges and learning edges',
     'Keep the generator from grading its own work'],
    'Trophic levels and energy flow between compartments',
    'Energy flows one way down a food chain; in agent graphs information flows back (correction edges), and a graph can freeze assumptions too early.',
    'Build a small graph in plain Python (or LangGraph): split 30 records, annotate in parallel, merge with a code node, gate with an independent check.',
    ['2091515787366306154', '2104873702198538738', '2098057823930155319', '2106826633390772253'])
mod('m13', 'Approve only the last step: hooks, headless runs and permissions',
    ['Use CLAUDE.md, permissions and plan mode to bound an agent',
     'Add a hook that runs checks automatically after edits',
     'Run agents headlessly for scheduled jobs'],
    'Field-station protocols: routine sampling runs unattended, the PI signs off the final dataset',
    'Field assistants understand intent; an agent follows literal permissions, so gaps in the rules are exploited by accident, not judgement.',
    'Set up a repo with a test hook and permissions, then run one task headlessly and review only the final diff.',
    ['2104402058963026288', '2105764769479455043', '2091515787366306154', '2106712905001365608'])

unit(5, 'Food webs: multi-agent coordination', 'multi-agent', 'An orchestrator with specialist subagents and an independent reviewer.')
mod('m14', 'Orchestration topologies: manager versus decentralised handoffs',
    ['Contrast the manager pattern (agents as tools) with decentralised handoffs',
     'Use task decomposition and replanning',
     'Decide when not to go multi-agent'],
    'Eusocial colonies with a queen vs decentralised swarms (stigmergy)',
    'A colony’s coordination evolved and is robust; agent topologies are designed and each extra agent multiplies token cost and failure points.',
    'Have your coding agent build an orchestrator that fans out three summariser subagents over papers, then synthesises; compare with a single agent.',
    ['2098057823930155319', CMU, '2106410521079538108', '2106826633390772253'])
mod('m15', 'Division of labour: subagents, teams and the adversary',
    ['Give subagents isolated context and restricted tools',
     'Use an advisor or adversarial reviewer before “done”',
     'Weigh team benefits against token cost and echo-chamber risk'],
    'Castes and division of labour; predators that keep prey populations honest',
    'Workers sharing one context converge on one opinion; unlike real castes, cloned agents have no genuine diversity unless you design it in.',
    'Create a read-only reviewer subagent in Claude Code and run it on a data-cleaning change; log what it catches.',
    ['2105764769479455043', '2105040007127761242', '2098057823930155319', '2091515787366306154'])
mod('m16', 'A guild at work: role-based teams and prompt injection',
    ['Assign roles (planner, navigator, checker, guard, logger) for a real task',
     'Defend against prompt injection from web content',
     'Make multi-agent runs repeatable and logged'],
    'Foraging guilds and mixed-species flocks with sentinels',
    'Sentinel birds are not tricked by text; agents read attacker-controlled content as instructions unless separated by design.',
    'Run a role-based browser or lookup team over a CSV of taxon names (e.g. checking a public database), with a guard role and a log.csv.',
    ['2108160445764833696', '2098057823930155319', '2106489085829488811'])

unit(6, 'Niches: skills, tools, plugins and MCP', 'skills-tools-mcp', 'A domain skill and an MCP connection your capstone agents use.')
mod('m17', 'Appendages: tool definitions, schemas and constrained decoding',
    ['Write a JSON-schema tool definition',
     'Explain how constrained decoding guarantees well-formed calls',
     'Design tools that are hard to misuse'],
    'Appendage morphology fits function: beak shape predicts diet',
    'Morphology is fixed for a lifetime; tools can be added or removed per task, and too many tools crowd the context.',
    'Define three tools (taxonomy lookup, file read, unit converter) for your agent and watch how the model chooses between them.',
    [CMU, '2098057823930155319', '2106479644354474463'])
mod('m18', 'Learned behaviour: skills, SKILL.md and self-rewriting skill libraries',
    ['Write a SKILL.md with a name, description and on-demand body',
     'Explain progressive disclosure for skills',
     'Describe agents that induce or rewrite their own skills'],
    'Learned behaviours and cultural transmission (song learning)',
    'Culture is transmitted with variation and selection across individuals; an agent rewriting its own skills can drift without any selection unless you add evals.',
    'Write a “field-data-qc” skill and have Claude Code invoke it on a messy CSV; then ask it to improve the skill and compare versions.',
    [CMU, '2106479763636302271', '2098057823930155319', '2104402058963026288', '2107871108338982988'])
mod('m19', 'Shared interfaces: MCP servers, gateways and mods',
    ['Explain MCP as a shared interface standard between agents and tools',
     'Describe the gateway/registry pattern at company scale',
     'Customise an agent with plugins, hooks or mods'],
    'Mutualism via a shared signal: pollinators and flowers converge on standard cues',
    'Mutualisms co-evolve slowly; MCP servers can be added in seconds, including untrusted ones, so trust has to be managed explicitly.',
    'Add one public MCP server to Claude Code, use it in a task, and write a small hook that blocks a dangerous command.',
    ['2106483024129147108', '2106118519368888562', '2104992334438154414', '2106479763636302271'])

unit(7, 'The field notebook: RAG and memory', 'rag-memory', 'A searchable knowledge base (this very pack, then your own notes).')
mod('m20', 'Foraging for facts: BM25 keyword search and chunking',
    ['Explain BM25 scoring (term frequency, rarity, length normalisation)',
     'Compare chunking strategies',
     'Judge a ranked hit list for relevance (precision@5)'],
    'Optimal foraging and the marginal value theorem: when to leave a patch',
    'Foragers learn patch quality from experience; BM25 has no learning at all, it matches words, so synonyms and paraphrases are invisible to it.',
    'Use this pack’s corpus/query.py as your first RAG system: write 10 questions, label top-5 hits, then have your coding agent tune k1/b and compare.',
    ['2105259648001376474', '2033587293064204349', '2106489085829488811'])
mod('m21', 'Smelling the patch: embeddings and hybrid search',
    ['Explain embeddings and similarity search',
     'Fuse keyword and vector rankings (reciprocal rank fusion)',
     'A/B test retrieval changes on your own question set'],
    'Olfactory search: following a gradient of similarity rather than an exact match',
    'Smell is grounded in chemistry; embedding similarity is learned from text statistics and can rank fluent but irrelevant passages highly.',
    'With your coding agent, add a small free embedding model to the pack search, fuse with BM25, and compare precision@5 with the m20 baseline.',
    ['2105259648001376474', '2106462125874987099', '2107516198959386895', '2105607355262009622'])
mod('m22', 'The field notebook: agent memory and second brains',
    ['Distinguish working context, compaction and external memory',
     'Organise a markdown knowledge base with an index file',
     'Test recall with questions you already know the answers to'],
    'Field notebooks and herbaria: external memory that outlives the expedition',
    'A herbarium specimen is fixed; agent memory is rewritten by the agent, so errors can be stored and reinforced.',
    'Build a markdown field notebook of your paper notes with a CLAUDE.md index and /process, /ask commands; test recall on 10 known answers.',
    [CMU, '2078784709253841039', '2106195341485703442', '2029222820257935369'])

unit(8, 'Fitness assays: evals and verification', 'evals', 'An eval suite with a held-out split and an adversarial checker.')
mod('m23', 'Designing a fitness assay: evals and hill-climbing',
    ['Design tasks that mirror real use with headroom',
     'Keep a held-out split and check grader agreement',
     'Hill-climb a prompt or config against the eval without overfitting'],
    'Common-garden experiments: measure fitness under controlled conditions',
    'A common garden measures organisms that cannot game the assay; models and agents can overfit to an eval, so assays need rotation and held-out data.',
    'Write a 30-item eval for a small task in your field with a code grader; hill-climb a prompt with your coding agent and report train vs held-out scores.',
    ['2104676099083190435', '2105008692655743208', '2033587293064204349'])
mod('m24', 'Judges, RAG metrics and tracing',
    ['Choose between code graders and LLM-as-judge',
     'Use faithfulness and context precision/recall for RAG',
     'Debug with traces instead of guesses'],
    'Inter-observer reliability when scoring behaviour',
    'Human observers can be trained and calibrated against each other; LLM judges share biases with the systems they grade.',
    'Score your m21 retrieval pipeline with an open-source eval library using a free or local judge, and inspect five traces.',
    ['2105607355262009622', '2106462125874987099', '2105008692655743208'])
mod('m25', 'The Red Queen: independent verification and adversarial testing',
    ['Never let the generator grade its own homework',
     'Add verifier and adversary agents',
     'Report results with confidence intervals'],
    'Coevolutionary arms races (Red Queen): predators and prey keep each other honest',
    'Natural arms races have no referee; in evals you control both sides, so a weak adversary gives false comfort.',
    'Add an independent verifier that checks claims against citations; measure how many planted errors it catches versus self-checking.',
    ['2104873702198538738', '2106462125874987099', '2104832660791308542', '2105764769479455043'])

unit(9, 'Artificial selection: fine-tuning, RL and local models', 'finetuning-training', 'A small local decision model that your capstone router can call.')
mod('m26', 'Domestication at home: running models locally',
    ['Explain quantisation and memory needs (weights + context cache)',
     'Run a small open model locally and measure tokens per second',
     'Know when local models are good enough'],
    'Domestic strains: smaller, hardier, adapted to your environment',
    'Quantisation is lossy compression, not adaptation; a smaller model is not tuned to your habitat until you fine-tune it.',
    'With your coding agent, install a local runtime, run a 1-4B model, change one setting at a time and log speed and memory.',
    ['2104017679908540472', '2106761689123139973', '2106704758048485654'])
mod('m27', 'Selective breeding: supervised fine-tuning and LoRA',
    ['Explain SFT as imitation of demonstrations',
     'Explain LoRA as cheap, small adaptations on a frozen base',
     'Fine-tune a small classifier and compare it with the base model'],
    'Artificial selection from a breeding stock; cultural transmission by imitation',
    'Breeding selects among heritable variation; SFT copies demonstrations directly, including their mistakes.',
    'Run a free notebook to fine-tune a small model as a classifier for your field (e.g. study type from abstract), and compare base vs tuned accuracy on held-out data.',
    ['2107868866361930236', '2107873310327648461', '2101715352258232539', '2102881280115249597', CMU])
mod('m28', 'Selection on behaviour: reinforcement learning basics',
    ['Explain rollouts, rewards and policy updates',
     'Connect evals to rewards (and reward hacking to Goodhart’s law)',
     'Understand why RL for agents is hard'],
    'Natural selection acting on behaviour; Goodhart’s law as selection on a proxy trait',
    'Selection acts on whole lifetimes over generations; RL credit assignment acts token by token, and a mis-specified reward is optimised ruthlessly.',
    'Run a tiny RL demo (a free notebook or a toy script your coding agent writes) with a verifiable reward; plot reward over time and look for hacking.',
    [CMU, '2102497917185802737', '2107868866361930236', '2105008692655743208'])

unit(10, 'Embodiment: a bridge to robotics (optional)', 'robotics-ai', 'A simulated controller your coding agent writes, tests and scores.')
mod('m29', 'Agents with bodies: simulation, self-practice and robot data',
    ['Describe agents writing and testing robot code with simulation in the loop',
     'Explain the robot data pyramid (simulation, teleoperation, video)',
     'Report robot success rates with confidence intervals'],
    'Reciprocal transplant experiments: does performance transfer to a new environment?',
    'Transplanted organisms adapt over generations; sim-trained policies face a fixed reality gap that only better simulation or real data closes.',
    'Ask your coding agent to write a small MuJoCo reach or gait task on CPU, tune it, and report success rate with a confidence interval. Link to your robotics course for depth.',
    ['2107485908673106241', '2108128859006570832', '2107871108338982988', '2090126022465495083', '2104832660791308542'], optional=True)

unit(11, 'Capstone: build an ecosystem', 'ai-for-science', 'A small multi-agent literature-triage and field-data-QA system with memory, evals and a budget.')
mod('m30', 'Choosing your niche: AI for science and the impedance mismatch',
    ['Identify problems where AI output can be verified',
     'Audit a real workflow before automating it',
     'Scope a capstone that reuses each unit’s build'],
    'Niche construction: organisms that reshape their environment to fit',
    'Niche construction is slow and mutual; automating a broken process just makes the broken process faster.',
    'Audit one of your lab workflows step by step (delete / rule / agent / human) with your coding agent and write the capstone spec.',
    ['2105733864152858919', '2107228565519708665', '2105793758616866834'])
mod('m31', 'Assembling the ecosystem: harness, specialists and memory',
    ['Assemble harness, router, specialist agents and RAG memory into one system',
     'Wire components through clear interfaces',
     'Keep a map (CLAUDE.md) of the whole system'],
    'Community assembly: species arrive, interact and form a stable community',
    'Communities assemble themselves; your system only has the interactions you build and test.',
    'With your coding agent, combine your unit builds into a literature-triage and field-data-QA team for one real dataset.',
    ['2105008692655743208', '2105607355262009622', '2106479644354474463', '2091515787366306154'])
mod('m32', 'Stress-testing the ecosystem: evals, adversaries and budgets',
    ['Run the eval suite and adversarial agent against the full system',
     'Set and monitor a cost and latency budget',
     'Decide what to ship and what to cut'],
    'Disturbance experiments: perturb the community and measure resilience',
    'Ecosystems recover on their own; an agent system degrades silently unless monitoring and evals run continuously.',
    'Run the full eval + adversary suite, compute cost per task, write a one-page report, and plan the next iteration.',
    ['2104676099083190435', '2105704739585565066', '2104873702198538738', '2033587293064204349'])

outline = dict(
    title='Learn AI: an ecologist’s path',
    subtitle='Accelerated, self-paced. 32 daily ~30-minute modules (m29 optional) from loss landscapes to multi-agent ecosystems, grounded in the learn-ai-rag pack.',
    version='2026-10-09',
    units=U)
json.dump(outline, open(os.path.join(COURSE, 'outline.json'), 'w'), indent=1, ensure_ascii=False)

idx = {m['id']: m for m in json.load(open(os.path.join(COURSE, '..', 'learn-ai-rag', 'sources', 'index.json')))}
L = [f"# {outline['title']}\n", outline['subtitle'] + '\n',
     'Each module: narrated intro (3-4 min) · concept reading with a widget or diagram (8-12 min) · hands-on lab (12-15 min) · self-check · “what you built today”. Each unit ends with a build the capstone reuses.\n']
for u in U:
    L.append(f"\n## Unit {u['id']}: {u['title']}\n\n*Unit build:* {u['build']}\n")
    for m in u['modules']:
        L.append(f"\n### {m['id']}: {m['title']}{' (optional)' if m['optional'] else ''}\n")
        L.append('- **Objectives:** ' + '; '.join(m['objectives']))
        L.append(f"- **Ecology analogy:** {m['analogy']}")
        L.append(f"- **Where the metaphor fails:** {m['metaphor_fails']}")
        L.append(f"- **Lab:** {m['lab']}")
        L.append('- **Sources:** ' + '; '.join(f"[S:{s}] {idx[s]['title'][:70]} (@{idx[s]['handle']})" for s in m['source_ids']))
open(os.path.join(COURSE, 'OUTLINE.md'), 'w').write('\n'.join(L) + '\n')
print('modules:', sum(len(u['modules']) for u in U))
