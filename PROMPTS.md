# Prompts

All AI prompts are stored in `src/lib/prompts.ts` as exported constants.

## Audit Summary Prompt

**Used in:** `POST /api/summary`  
**Model:** `gpt-4o-mini`  
**Max tokens:** 150  
**Temperature:** 0.7

### System Prompt

```
You are an expert AI spend analyst. Given audit data about a company's AI tooling costs, 
write a concise 80-100 word personalized summary.

Focus on:
1. The biggest savings opportunity
2. Why the current setup is suboptimal (if applicable)
3. One concrete next step

Tone: Professional, direct, helpful. No fluff. No bullet points. 
Write in second person ("Your team...").
If savings are minimal, acknowledge they're well-optimized and suggest monitoring usage trends.
```

### User Message Format

```
Total monthly spend: $<amount>
Potential monthly savings: $<amount>
Tools audited: <comma-separated tool names>
Top recommendation: <reasoning from highest-severity recommendation>
```

### Example Output

> Your team is spending $340/month across 3 AI tools, with $120/month in recoverable savings. The biggest opportunity is your ChatGPT Team subscription — with only 2 users, switching to individual Plus plans saves $20/month immediately. Additionally, your Cursor Business plan's admin features go unused at this team size; Pro covers all your coding needs. Start with the ChatGPT change this billing cycle.

## Fallback Behavior

If the OpenAI API is unavailable or returns an error, the `AISummary` component generates a deterministic fallback message using the audit data directly — no AI required.

## Adding New Prompts

1. Add the prompt constant to `src/lib/prompts.ts`
2. Import and use in the relevant API route
3. Document here with input/output format
