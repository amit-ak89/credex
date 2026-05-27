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

describe("ChatGPT audit rules", () => {
  it("recommends Plus over Team for 2 seats", () => {
    const result = runAudit([makeEntry({ tool: "chatgpt", plan: "team", monthlySpend: 60, seats: 2 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("plus");
    expect(rec.monthlySavings).toBe(20);
    expect(rec.severity).toBe("medium");
  });

  it("recommends Team over Enterprise for under 150 seats", () => {
    const result = runAudit([makeEntry({ tool: "chatgpt", plan: "enterprise", monthlySpend: 600, seats: 10 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("team");
    expect(rec.monthlySavings).toBe(300);
    expect(rec.severity).toBe("high");
  });

  it("marks ChatGPT Plus with 1 seat as optimal", () => {
    const result = runAudit([makeEntry({ tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 })]);
    expect(result.recommendations[0].severity).toBe("optimal");
    expect(result.recommendations[0].monthlySavings).toBe(0);
  });
});

describe("Cursor audit rules", () => {
  it("recommends Pro over Business for 1 seat", () => {
    const result = runAudit([makeEntry({ tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(20);
    expect(rec.severity).toBe("high");
  });

  it("recommends Pro over Business for small team of 3", () => {
    const result = runAudit([makeEntry({ tool: "cursor", plan: "business", monthlySpend: 120, seats: 3, teamSize: 3 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(60);
  });
});

describe("GitHub Copilot audit rules", () => {
  it("recommends Business over Enterprise for under 20 seats", () => {
    const result = runAudit([makeEntry({ tool: "github-copilot", plan: "enterprise", monthlySpend: 390, seats: 10 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("business");
    expect(rec.monthlySavings).toBe(200);
    expect(rec.severity).toBe("high");
  });

  it("recommends Individual over Business for 1 seat", () => {
    const result = runAudit([makeEntry({ tool: "github-copilot", plan: "business", monthlySpend: 19, seats: 1 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("individual");
    expect(rec.monthlySavings).toBe(9);
  });
});

describe("Claude audit rules", () => {
  it("recommends Pro over Team for under 5 seats", () => {
    const result = runAudit([makeEntry({ tool: "claude", plan: "team", monthlySpend: 90, seats: 3 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(30);
    expect(rec.severity).toBe("high");
  });
});

describe("Windsurf audit rules", () => {
  it("recommends Pro over Teams for 2 seats", () => {
    const result = runAudit([makeEntry({ tool: "windsurf", plan: "teams", monthlySpend: 70, seats: 2 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBe(40);
  });
});

describe("Audit totals", () => {
  it("correctly sums savings across multiple tools", () => {
    const result = runAudit([
      makeEntry({ tool: "chatgpt", plan: "team", monthlySpend: 60, seats: 2 }),
      makeEntry({ tool: "cursor", plan: "business", monthlySpend: 40, seats: 1 }),
    ]);
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.totalAnnualSavings).toBe(480);
  });

  it("generates a unique audit ID each time", () => {
    const r1 = runAudit([makeEntry({})]);
    const r2 = runAudit([makeEntry({})]);
    expect(r1.id).not.toBe(r2.id);
  });

  it("returns zero savings for a fully optimized stack", () => {
    const result = runAudit([makeEntry({ tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 })]);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
  });
});

describe("OpenAI API audit rules", () => {
  it("recommends cached prompts for over 100 dollars API spend", () => {
    const result = runAudit([makeEntry({ tool: "openai-api", plan: "pay-as-you-go", monthlySpend: 200, seats: 1 })]);
    const rec = result.recommendations[0];
    expect(rec.recommendedPlan).toBe("cached-prompts");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });
});
