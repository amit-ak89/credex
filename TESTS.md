# Tests

## Running Tests

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
```

## Test Coverage

All tests are in `src/__tests__/audit-engine.test.ts` using Vitest.

### ChatGPT Rules (3 tests)
| Test | Input | Expected |
|------|-------|----------|
| Team → Plus for ≤2 seats | Team plan, 2 seats, $60/mo | Recommend Plus, save $20/mo |
| Enterprise → Team for <150 seats | Enterprise, 10 seats, $600/mo | Recommend Team, save $300/mo |
| Plus with 1 seat is optimal | Plus, 1 seat, $20/mo | severity: optimal, $0 savings |

### Cursor Rules (2 tests)
| Test | Input | Expected |
|------|-------|----------|
| Business → Pro for 1 seat | Business, 1 seat, $40/mo | Recommend Pro, save $20/mo |
| Business → Pro for small team | Business, 3 seats, $120/mo | Recommend Pro, save $60/mo |

### GitHub Copilot Rules (2 tests)
| Test | Input | Expected |
|------|-------|----------|
| Enterprise → Business for <20 seats | Enterprise, 10 seats, $390/mo | Recommend Business, save $200/mo |
| Business → Individual for 1 seat | Business, 1 seat, $19/mo | Recommend Individual, save $9/mo |

### Claude Rules (1 test)
| Test | Input | Expected |
|------|-------|----------|
| Team → Pro for <5 seats | Team, 3 seats, $90/mo | Recommend Pro, save $30/mo |

### Windsurf Rules (1 test)
| Test | Input | Expected |
|------|-------|----------|
| Teams → Pro for ≤2 seats | Teams, 2 seats, $70/mo | Recommend Pro, save $40/mo |

### Aggregate Tests (3 tests)
| Test | Description |
|------|-------------|
| Multi-tool savings | Correctly sums savings across 2 tools |
| Unique IDs | Each audit generates a different ID |
| Zero savings | Optimized stack returns $0 savings |

### OpenAI API Tests (1 test)
| Test | Input | Expected |
|------|-------|----------|
| Cached prompts recommendation | Pay-as-you-go, $200/mo | Recommend cached-prompts |

## Adding New Tests

```typescript
import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit-engine";

it("your test description", () => {
  const result = runAudit([{
    tool: "cursor",
    plan: "business",
    monthlySpend: 40,
    seats: 1,
    useCase: "code-completion",
    teamSize: 1,
  }]);
  expect(result.recommendations[0].recommendedPlan).toBe("pro");
});
```
