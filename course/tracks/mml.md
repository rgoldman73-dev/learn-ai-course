---
title: Math track: Mathematics for Machine Learning
---
# Math track: Mathematics for Machine Learning

**What it is.** *Mathematics for Machine Learning* (MML) by Marc Peter Deisenroth, A. Aldo Faisal and Cheng Soon Ong (Cambridge University Press, 2020) is a free, 417-page textbook. Part I covers the maths (chapters 2–7). Part II applies it to four classic models: linear regression, PCA, Gaussian mixtures and support vector machines (chapters 8–12). The PDF and the exercises are free: [book site](https://mml-book.github.io/) · [PDF](https://mml-book.github.io/book/mml-book.pdf) · [GitHub](https://github.com/mml-book/mml-book.github.io). [S:2112909734936199213]

@mentalium_ summed up the order: "linear algebra => analytic geometry => matrix decompositions => vector calculus => probability => optimization => the system you ship." The post also claims Anthropic interviews ask "exactly about this". That's one person's claim, so treat it as motivation rather than a fact. [S:2112909734936199213]

This is an optional companion track. Learn AI teaches the *intuition* with ecology analogies, and MML is the *proof-and-exercise* version of the same ideas. You don't need it to finish the course. It's for when an analogy stops being enough.

> Honest limits: MML is a maths textbook, not a deep-learning book. It has no transformers, attention or LLM chapters, and it is not about agents. It assumes high-school algebra and some calculus. Its PDF is "free to view and download for personal use only", so nothing from it is copied into this app; the search below runs on your own computer.

## Ask the book (local RAG)

The full book is indexed in the course library on the Grok Bot box, `/workspace/course-rag` (source id `mml`, 1,039 passages, keyword plus embedding search). Each hit cites chapter, section and page, with a link straight to that PDF page:

```sh
/workspace/course-rag/search.py "Gaussian conditioning" -s mml      # top 5 passages from the book
/workspace/course-rag/search.py "SVD low-rank" -s mml -k 8 --json   # more, as JSON
```

Or just ask Grok Bot: "search MML for …".

## Chapter map: which maths powers which module

| MML chapter | Pages | What you get | Learn AI module |
|---|---|---|---|
| 2 Linear Algebra | 17–69 | vectors, matrices, rank, linear maps | [m07](#/module/m07) (weights are matrices), [m21](#/module/m21) |
| 3 Analytic Geometry | 70–97 | norms, inner products, angles, projections | [m21](#/module/m21) (cosine similarity of embeddings), [m20](#/module/m20) |
| 4 Matrix Decompositions | 98–138 | eigenvalues, Cholesky, **SVD**, low-rank approximation | [m27](#/module/m27) (LoRA is a low-rank update), [m21](#/module/m21) |
| 5 Vector Calculus | 139–171 | gradients, Jacobians, **backpropagation** (§5.6) | [m01](#/module/m01) (gradient descent), [m08](#/module/m08) |
| 6 Probability and Distributions | 172–224 | Bayes, Gaussians, conditioning, exponential family | [m02](#/module/m02) (next-token distributions), [m03](#/module/m03) (calibration) |
| 7 Continuous Optimization | 225–250 | gradient descent, momentum, constraints, convexity | [m01](#/module/m01), [m27](#/module/m27), [m28](#/module/m28) |
| 8 When Models Meet Data | 251–288 | empirical risk, MLE/MAP, cross-validation, graphical models | [m23](#/module/m23) (evals, overfitting), [m27](#/module/m27) |
| 9 Linear Regression | 289–316 | least squares, Bayesian regression | [m01](#/module/m01) (the 3D weights lab is exactly this) |
| 10 PCA | 317–347 | dimensionality reduction | [m21](#/module/m21) (visualising embeddings) |
| 11 Gaussian Mixture Models | 348–369 | EM algorithm, latent variables | [m22](#/module/m22) (clustering memories) |
| 12 Support Vector Machines | 370–394 | margins, duality, kernels | background only (the classic pre-deep-learning classifier) |

## Study plan: 12 sessions of about 30 minutes, alongside Units 1–4

Read the chapter intro and the boxed definitions, do 2–3 end-of-chapter exercises, and skip proofs on a first pass. The book's own advice is that you can read it bottom-up (maths first) or top-down (start from a Part II model and look back). Top-down suits this course.

1. **Ch 1 + Ch 9.1–9.2 least squares.** Pair with [m01](#/module/m01). Reproduce the 3D weights lab's loss by hand.
2. **Ch 5.1–5.3 gradients.** Derive the gradient used in m01's lab.
3. **Ch 5.6 backpropagation and autodiff.** Draw the computation graph for a two-layer net.
4. **Ch 7.1 gradient descent, step size, momentum.**
5. **Ch 6.1–6.3 probability, sum and product rules, Bayes.** Pair with [m02](#/module/m02).
6. **Ch 6.5 Gaussians, marginals, conditioning.** Pair with [m03](#/module/m03).
7. **Ch 2.1–2.7 linear algebra (skim).** Matrices as functions.
8. **Ch 3.1–3.4 and 3.8 inner products, angles, projections.** Pair with [m21](#/module/m21) and compute a cosine similarity by hand.
9. **Ch 4.2 and 4.4 eigenvalues and eigendecomposition.**
10. **Ch 4.5–4.6 SVD and low-rank approximation.** Pair with [m27](#/module/m27): why does a rank-8 LoRA update work?
11. **Ch 8.1–8.3 empirical risk, MLE vs MAP, overfitting.** Pair with [m23](#/module/m23).
12. **Ch 10 PCA.** Project a set of embeddings to 2D.

Chapters 11–12 are optional extras. The AI course doesn't need them, but they're a good interview warm-up.

**Interview checklist** (from the post's framing): explain eigendecomposition vs SVD; derive backprop with the chain rule; condition a joint Gaussian; state MLE vs MAP; and explain why gradient descent needs a step size.
