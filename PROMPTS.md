# Prompts

## Production Prompt — AI Audit Summary

Used in `src/lib/prompts.ts`, called from `POST /api/summary`.

```
You are an expert AI spend analyst. Given audit data about a company's AI tooling costs, write a concise 80-100 word personalized summary.

Focus on:
1. The biggest savings opportunity
2. Why the current setup is suboptimal (if applicable)
3. One concrete next step

Tone: Professional, direct, helpful. No fluff. No bullet points. Write in second person ("Your team...").
If savings are minimal, acknowledge they're well-optimized and suggest monitoring usage trends.
```

**Model:** `gpt-4o-mini`
**Max tokens:** 150
**Temperature:** 0.7

---

## Why This Prompt Was Designed This Way

**"80-100 words"** — Explicit word count prevents the model from writing a 300-word essay. gpt-4o-mini tends to over-explain without constraints. 100 words fits in the card UI without scrolling.

**"No bullet points"** — Early versions returned bullet lists which looked bad in the card component and felt like a generic AI response. Prose reads more like a human analyst wrote it.

**"Second person"** — "Your team is spending..." feels more personal than "The team is spending...". Small thing but it changes the tone from report to advice.

**"Focus on 3 things"** — Without this, the model would try to summarize every recommendation. Forcing it to pick the biggest opportunity produces more actionable output.

**Temperature 0.7** — Low enough to stay factual (the numbers come from the context, not the model's imagination), high enough to vary the phrasing across audits so it doesn't feel templated.

---

## Context Passed to the Model

```
Total monthly spend: $[amount]
Potential monthly savings: $[amount]
Tools audited: [tool1, tool2, ...]
Top recommendation: [reasoning from highest-severity recommendation]
```

Deliberately minimal. The model doesn't need the full audit JSON — it needs the headline numbers and the single most important finding. Sending the full audit data increased token usage by ~3× with no improvement in summary quality.

---

## Failed Prompt Experiments

**Experiment 1: Include all recommendations**
Passed the full `recommendations` array as JSON. The model tried to summarize every finding and produced 200+ word responses that ignored the word count instruction. Also occasionally hallucinated savings numbers that didn't match the input data.

**Experiment 2: Ask for a headline + body**
```
Write a 10-word headline and a 90-word summary.
```
The model consistently ignored the headline/body structure and wrote one continuous paragraph. Formatting instructions in the middle of a prompt are less reliable than constraints at the start.

**Experiment 3: Lower temperature (0.3)**
Produced accurate but robotic output. Every summary started with "Your team is currently spending..." — identical phrasing across different audits. Raised to 0.7 for more natural variation.

**Experiment 4: Use Claude instead of GPT-4o-mini**
Claude 3.5 Haiku produced slightly better prose but the API latency was ~800ms vs ~400ms for gpt-4o-mini. For a background summary that users wait for, the quality difference wasn't worth the latency. Kept OpenAI.

---

## Fallback Strategy

If the API call fails (network error, rate limit, invalid key, 503), the `AISummary` component generates a deterministic fallback string client-side:

```
Your team is spending $[X]/month across [N] AI tools. Our audit identified 
$[Y]/month in potential savings — that's $[Z] annually. [If savings > 0: 
"The biggest opportunity is consolidating overlapping tools and right-sizing 
plans to match your actual team size." Else: "Your current AI stack appears 
well-optimized for your team size and usage patterns."]
```

This fallback is always factually accurate because it uses the same `AuditResult` data that the real summary would receive. Users get useful information even when the API is down.

The component distinguishes between:
- **503 (key missing):** Uses fallback silently, no retry button shown
- **Other errors:** Uses fallback but shows a "Retry" button so users can try again
