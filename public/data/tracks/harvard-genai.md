# Primer track: Harvard's free generative AI lectures

**What it is.** @hey_davidmax shared a bundle of free Harvard material. The core is the Harvard Kennedy School course *The Science and Implications of Generative AI* (DPI-681, Spring 2024; Sharad Goel, Dan Levy, Teddy Svoronos): 11 classes of short videos with exercises, and its site content is CC BY 4.0. The bonus items are the CS50x AI lecture, the CS50 Extension week on AI and prompt engineering, and two CS50 tech talks. [S:2112886735189553437]

This is the *gentlest* track, aimed at non-programmers, so it's a good on-ramp before Unit 1 or something to share with colleagues. The post's "Harvard just made its AI course free" framing is overstated: the HKS course is the free archived version of a 2024 class, and the paid offerings are separate. Two of the six items are for teachers (an educator playlist and an HBS Publishing teaching-with-AI page) and are skipped here.

## Class map

| HKS class | Topic | Learn AI module |
|---|---|---|
| [1](https://generative-ai-course.hks.harvard.edu/1-how-genai-works/class-1) | Intro to generative AI; intro to LLMs; admissions case study | [m02](#/module/m02) |
| [2](https://generative-ai-course.hks.harvard.edu/1-how-genai-works/class-2) | Neural networks, contextual word embeddings, small LMs | [m01](#/module/m01), [m21](#/module/m21) |
| [3](https://generative-ai-course.hks.harvard.edu/1-how-genai-works/class-3) | Alignment: learning from comparisons, eliciting preferences | [m28](#/module/m28) |
| [4](https://generative-ai-course.hks.harvard.edu/2-using-genai/class-4) | Prompt engineering, personas | [m06](#/module/m06) |
| [5](https://generative-ai-course.hks.harvard.edu/2-using-genai/class-5) | Beyond chatbots: system prompts, custom GPTs, RAG and fine-tuning | [m05](#/module/m05), [m20](#/module/m20), [m27](#/module/m27) |
| [6](https://generative-ai-course.hks.harvard.edu/2-using-genai/class-6) | Practical considerations, which tasks suit GenAI | [m09](#/module/m09) |
| [7](https://generative-ai-course.hks.harvard.edu/2-using-genai/class-7) | Uses, good and questionable | background |
| [8](https://generative-ai-course.hks.harvard.edu/society/class-8)–[11](https://generative-ai-course.hks.harvard.edu/society/class-11) | Risks (a healthcare case), IP and copyright, jobs and the economy, misinformation | [m25](#/module/m25), [m30](#/module/m30) |

## Bonus lectures

- [CS50x: Artificial Intelligence](https://cs50.harvard.edu/x/weeks/ai/) ([notes](https://cs50.harvard.edu/x/notes/ai/)): prompt engineering, neural nets and LLMs from the CS50 angle (CC BY-NC-SA 4.0).
- [CS50 Extension week 10: AI](https://cs50.harvard.edu/extension/2025/spring/weeks/10/) ([notes](https://cs50.harvard.edu/extension/2025/spring/notes/ai/)).
- [Large Language Models and the End of Programming](https://www.youtube.com/watch?v=JhCl-GeT4jw) (Matt Welsh, CS50 tech talk): pair it with [m07](#/module/m07).
- [GPT-4: how it works and how to build with it](https://www.youtube.com/watch?v=vw-KWfKwvTQ) (CS50 tech talk). This one has no captions, so it isn't searchable.

## Ask the course library

`/workspace/course-rag` indexes the captions and notes (source ids `hks-genai`, `cs50-ai`, `cs50-ai-notes`, `harvard-talks`). Hits link to the right second of the video:

```sh
/workspace/course-rag/search.py "system prompt vs RAG vs fine-tuning" -s hks,cs50
```
