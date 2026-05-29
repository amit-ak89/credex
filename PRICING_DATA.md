# Pricing Data

All prices are in USD per seat per month unless noted. Verified against official pricing pages.

Last full verification: **2025-01-19**

---

## Cursor

- **Free** — $0 — 2,000 completions/month, 50 slow premium requests
  https://cursor.com/pricing — verified 2025-01-19
- **Pro** — $20/seat/month — unlimited completions, 500 fast premium requests, GPT-4o access
  https://cursor.com/pricing — verified 2025-01-19
- **Business** — $40/seat/month — all Pro features + SSO, admin dashboard, enforced privacy mode
  https://cursor.com/pricing — verified 2025-01-19

**Notes:** Business plan requires no minimum seats. SSO is the primary differentiator — not worth it for teams under ~10 unless your company mandates SSO for compliance.

---

## ChatGPT (OpenAI)

- **Free** — $0 — GPT-4o mini, limited GPT-4o access
  https://openai.com/chatgpt/pricing — verified 2025-01-19
- **Plus** — $20/seat/month — GPT-4o, DALL-E 3, Advanced Data Analysis, 1 seat only
  https://openai.com/chatgpt/pricing — verified 2025-01-19
- **Team** — $30/seat/month (billed monthly), min 2 seats — shared workspace, admin console, higher rate limits
  https://openai.com/chatgpt/pricing — verified 2025-01-19
- **Enterprise** — ~$60/seat/month (negotiated), min 150 seats — unlimited GPT-4o, SSO, custom data retention, dedicated support
  https://openai.com/chatgpt/enterprise — verified 2025-01-19

**Notes:** Enterprise pricing is not publicly listed — $60/seat is an estimate based on reported deals. Team plan billed annually is $25/seat/month.

---

## Claude (Anthropic)

- **Free** — $0 — Claude 3.5 Haiku, limited messages per day
  https://claude.ai/upgrade — verified 2025-01-19
- **Pro** — $20/seat/month — Claude 3.5 Sonnet, 5× more usage than free, priority access, 1 seat only
  https://claude.ai/upgrade — verified 2025-01-19
- **Team** — $30/seat/month, min 5 seats — all Pro features, central billing, admin console, higher usage limits
  https://claude.ai/upgrade — verified 2025-01-19

**Notes:** The 5-seat minimum on Team is a real gotcha. A 3-person team on Team plan pays $90/month when 3× Pro at $60/month is cheaper and functionally identical.

---

## GitHub Copilot

- **Individual** — $10/seat/month (or $100/year) — code completion, chat, CLI, 1 seat
  https://github.com/features/copilot#pricing — verified 2025-01-19
- **Business** — $19/seat/month — all Individual features + policy management, audit logs, IP indemnity
  https://github.com/features/copilot#pricing — verified 2025-01-19
- **Enterprise** — $39/seat/month — all Business features + fine-tuned models on your codebase, knowledge bases, Copilot in GitHub.com
  https://github.com/features/copilot#pricing — verified 2025-01-19

**Notes:** Enterprise fine-tuning requires a substantial codebase to show meaningful improvement. Most teams under 50 engineers won't see ROI on the $20/seat premium over Business.

---

## Gemini (Google)

- **Free** — $0 — Gemini 1.5 Flash, limited Gemini 1.5 Pro access
  https://gemini.google.com — verified 2025-01-19
- **Google One AI Premium** — $20/month flat (not per seat) — Gemini Advanced (1.5 Pro), 2TB storage, Gemini in Gmail/Docs/Sheets
  https://one.google.com/about/ai-premium — verified 2025-01-19
- **Google Workspace Business Starter with Gemini** — $30/seat/month — Gemini for Workspace, admin controls, enterprise security
  https://workspace.google.com/pricing — verified 2025-01-19

**Notes:** Google One AI Premium is a personal plan — not suitable for team billing. Workspace Business is the correct choice for teams but is significantly more expensive per seat.

---

## OpenAI API

Pay-as-you-go token pricing (as of 2025-01-19):

- **GPT-4o** — $2.50/million input tokens, $10.00/million output tokens
  https://openai.com/api/pricing — verified 2025-01-19
- **GPT-4o mini** — $0.15/million input tokens, $0.60/million output tokens
  https://openai.com/api/pricing — verified 2025-01-19
- **GPT-4o (cached input)** — $1.25/million tokens — 50% discount on repeated prompt prefixes
  https://openai.com/api/pricing — verified 2025-01-19
- **Committed usage** — up to 25% discount — requires annual spend commitment, contact sales
  https://openai.com/enterprise — verified 2025-01-19

**Notes:** Prompt caching is automatic for prompts over 1,024 tokens with a repeated prefix. If your system prompt is static and long, you're leaving money on the table by not structuring requests to maximize cache hits.

---

## Anthropic API

Pay-as-you-go token pricing (as of 2025-01-19):

- **Claude 3.5 Sonnet** — $3.00/million input tokens, $15.00/million output tokens
  https://anthropic.com/pricing — verified 2025-01-19
- **Claude 3.5 Haiku** — $0.80/million input tokens, $4.00/million output tokens
  https://anthropic.com/pricing — verified 2025-01-19
- **Claude 3 Haiku** — $0.25/million input tokens, $1.25/million output tokens
  https://anthropic.com/pricing — verified 2025-01-19
- **Prompt caching** — $3.75/million tokens to write cache, $0.30/million to read — ~90% savings on cached reads
  https://anthropic.com/pricing — verified 2025-01-19
- **Committed usage** — up to 25% discount — annual commitment, contact sales
  https://anthropic.com/enterprise — verified 2025-01-19

**Notes:** Anthropic's prompt caching is more aggressive than OpenAI's — cache writes are more expensive but reads are dramatically cheaper. Worth it for any app with a long, static system prompt.

---

## Windsurf (Codeium)

- **Free** — $0 — basic completions, limited AI flows (Cascade)
  https://windsurf.com/pricing — verified 2025-01-19
- **Pro** — $15/seat/month — unlimited completions, advanced models (GPT-4o, Claude), priority support
  https://windsurf.com/pricing — verified 2025-01-19
- **Teams** — $35/seat/month — all Pro features + team management, SSO, usage analytics, admin controls
  https://windsurf.com/pricing — verified 2025-01-19

**Notes:** Windsurf is the most price-competitive coding assistant at the Pro tier. At $15/seat vs Cursor's $20/seat, it's worth evaluating for cost-sensitive teams. The Teams plan at $35/seat is harder to justify — most of the admin features are only useful at 20+ seats.

---

## Pricing Update Policy

Prices change frequently. Before making recommendations based on this data:

1. Check the official pricing page linked above
2. Update the `PRICING_DATA` constant in `src/lib/pricing-data.ts`
3. Update the verification date in this file
4. Re-run tests to confirm audit rules still produce correct savings calculations
