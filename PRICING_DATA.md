# Pricing Data

All pricing data is stored in `src/lib/pricing-data.ts`. Prices are in USD/month.

> **Last updated:** July 2025. Verify with vendor websites before making decisions.

## Cursor (Anysphere)

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Free | $0 | 1 |
| Pro | $20 | 1 |
| Business | $40 | 1 |

## GitHub Copilot

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Individual | $10 | 1 |
| Business | $19 | 1 |
| Enterprise | $39 | 1 |

## Claude (Anthropic)

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Free | $0 | 1 |
| Pro | $20 | 1 |
| Team | $30 | 5 |

## ChatGPT (OpenAI)

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Free | $0 | 1 |
| Plus | $20 | 1 |
| Team | $30 | 2 |
| Enterprise | $60 | 150 |

## Anthropic API

| Plan | Notes |
|------|-------|
| Pay-as-you-go | Claude 3.5 Sonnet: $3/MTok in, $15/MTok out |
| Committed Usage | Up to 25% discount with annual commitment |

## OpenAI API

| Plan | Notes |
|------|-------|
| Pay-as-you-go | GPT-4o: $2.50/MTok in, $10/MTok out |
| Cached Prompts | 50% discount on cached input tokens |

## Gemini (Google)

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Free | $0 | 1 |
| Google One AI Premium | $20 | 1 |
| Workspace Business | $30 | 1 |

## Windsurf (Codeium)

| Plan | Price/Seat/Month | Min Seats |
|------|-----------------|-----------|
| Free | $0 | 1 |
| Pro | $15 | 1 |
| Teams | $35 | 1 |

## Updating Prices

Edit `src/lib/pricing-data.ts`. The audit engine reads from this file directly, so all rules automatically use updated prices.

```typescript
cursor: {
  plans: {
    pro: { name: "Pro", pricePerSeat: 20, ... },
  }
}
```
