# Tests

## Running Tests

```bash
npm run test          # single run, exits after completion
npm run test:watch    # watch mode, re-runs on file changes
```

Output on passing run:
```
✓ src/__tests__/audit-engine.test.ts (13 tests) 25ms
Test Files  1 passed (1)
Tests       13 passed (13)
```

---

## Test Files

### `src/__tests__/audit-engine.test.ts`

All 13 tests cover the core audit engine in `src/lib/audit-engine.ts`. No mocks — pure unit tests against the deterministic rule logic.

---

## Test Coverage by Suite

### ChatGPT Rules (3 tests)

| Test | Input | Expected output |
|------|-------|----------------|
| Team → Plus for ≤2 seats | `plan: "team"`, 2 seats, $60/mo | `recommendedPlan: "plus"`, saves $20/mo, severity `"medium"` |
| Enterprise → Team for <150 seats | `plan: "enterprise"`, 10 seats, $600/mo | `recommendedPlan: "team"`, saves $300/mo, severity `"high"` |
| Plus with 1 seat is optimal | `plan: "plus"`, 1 seat, $20/mo | severity `"optimal"`, $0 savings |

**Why these cases:** ChatGPT Team has a 2-seat minimum but no real advantage over Plus for small teams. Enterprise is priced for 150+ seats — recommending it for 10 users is a common mistake.

---

### Cursor Rules (2 tests)

| Test | Input | Expected output |
|------|-------|----------------|
| Business → Pro for 1 seat | `plan: "business"`, 1 seat, $40/mo | `recommendedPlan: "pro"`, saves $20/mo, severity `"high"` |
| Business → Pro for small team | `plan: "business"`, 3 seats, $120/mo, teamSize 3 | `recommendedPlan: "pro"`, saves $60/mo |

**Why these cases:** Cursor Business adds SSO and admin controls that are useless for solo devs or teams under 4. Pro has identical AI capabilities at half the price.

---

### GitHub Copilot Rules (2 tests)

| Test | Input | Expected output |
|------|-------|----------------|
| Enterprise → Business for <20 seats | `plan: "enterprise"`, 10 seats, $390/mo | `recommendedPlan: "business"`, saves $200/mo, severity `"high"` |
| Business → Individual for 1 seat | `plan: "business"`, 1 seat, $19/mo | `recommendedPlan: "individual"`, saves $9/mo |

**Why these cases:** Copilot Enterprise's fine-tuned models require large codebases to be effective. Under 20 seats, Business covers all practical needs.

---

### Claude Rules (1 test)

| Test | Input | Expected output |
|------|-------|----------------|
| Team → Pro for <5 seats | `plan: "team"`, 3 seats, $90/mo | `recommendedPlan: "pro"`, saves $30/mo, severity `"high"` |

**Why this case:** Claude Team has a 5-seat minimum but charges per seat from seat 1. Under 5 users, individual Pro subscriptions are cheaper than the Team plan.

---

### Windsurf Rules (1 test)

| Test | Input | Expected output |
|------|-------|----------------|
| Teams → Pro for ≤2 seats | `plan: "teams"`, 2 seats, $70/mo | `recommendedPlan: "pro"`, saves $40/mo |

---

### Aggregate / Integration Tests (3 tests)

| Test | Description |
|------|-------------|
| Multi-tool savings sum | Two tools with savings → `totalMonthlySavings` correctly summed, `totalAnnualSavings = monthly × 12` |
| Unique audit IDs | Two separate `runAudit()` calls produce different `id` values |
| Zero savings for optimized stack | ChatGPT Plus 1 seat → `totalMonthlySavings: 0`, `totalAnnualSavings: 0` |

---

### OpenAI API Rules (1 test)

| Test | Input | Expected output |
|------|-------|----------------|
| Cached prompts for >$100 spend | `plan: "pay-as-you-go"`, $200/mo | `recommendedPlan: "cached-prompts"`, savings > 0 |

---

## What's Not Tested

- API routes (`/api/audit`, `/api/leads`, `/api/summary`) — would require mocking Supabase and OpenAI. Not worth the complexity for an MVP; covered by manual testing.
- React components — no component tests. The audit engine is the only logic worth unit testing; UI is verified visually.
- Rate limiter — simple enough to verify by inspection.

---

## Adding New Tests

```typescript
import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit-engine";
import type { ToolEntry } from "@/types/audit";

const makeEntry = (overrides: Partial<ToolEntry>): ToolEntry => ({
  tool: "chatgpt",
  plan: "plus",
  monthlySpend: 20,
  seats: 1,
  useCase: "chat-assistant",
  teamSize: 1,
  ...overrides,
});

it("your new rule", () => {
  const result = runAudit([makeEntry({ tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 })]);
  expect(result.recommendations[0].recommendedPlan).toBe("pro");
  expect(result.recommendations[0].monthlySavings).toBe(20);
});
```
