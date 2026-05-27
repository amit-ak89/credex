import type { ToolEntry, AuditRecommendation, AuditResult } from "@/types/audit";
import { PRICING_DATA } from "./pricing-data";

function auditTool(entry: ToolEntry): AuditRecommendation {
  const { tool, plan, monthlySpend, seats, teamSize } = entry;
  const pricing = PRICING_DATA[tool];

  const base: Omit<AuditRecommendation, "monthlySavings" | "annualSavings"> = {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    recommendedPlan: plan,
    recommendedSpend: monthlySpend,
    reasoning: "Your current plan appears well-suited for your usage.",
    severity: "optimal",
  };

  // ChatGPT rules
  if (tool === "chatgpt") {
    if (plan === "team" && seats <= 2) {
      const savings = monthlySpend - seats * 20;
      return { ...base, recommendedPlan: "plus", recommendedSpend: seats * 20, monthlySavings: savings, annualSavings: savings * 12, reasoning: "ChatGPT Team requires minimum 2 seats but offers no advantage over Plus for ≤2 users. Switch to Plus and save.", severity: savings > 20 ? "high" : "medium" };
    }
    if (plan === "enterprise" && seats < 150) {
      const savings = monthlySpend - seats * 30;
      return { ...base, recommendedPlan: "team", recommendedSpend: seats * 30, monthlySavings: savings, annualSavings: savings * 12, reasoning: "ChatGPT Enterprise is designed for 150+ seats. Team plan covers your needs at a fraction of the cost.", severity: "high" };
    }
    if (plan === "plus" && seats > 10) {
      const savings = 0;
      return { ...base, recommendedPlan: "team", recommendedSpend: seats * 30, monthlySavings: savings, annualSavings: 0, reasoning: "With 10+ users, ChatGPT Team provides shared workspace and admin controls worth the slight premium.", severity: "low" };
    }
  }

  // Cursor rules
  if (tool === "cursor") {
    if (plan === "business" && seats === 1) {
      const savings = monthlySpend - 20;
      return { ...base, recommendedPlan: "pro", recommendedSpend: 20, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Cursor Business SSO and admin features are unnecessary for a single user. Pro plan is identical in AI capability.", severity: "high" };
    }
    if (plan === "business" && seats <= 3 && teamSize <= 3) {
      const savings = monthlySpend - seats * 20;
      return { ...base, recommendedPlan: "pro", recommendedSpend: seats * 20, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Small teams under 4 people rarely need Business-tier admin controls. Pro saves $20/seat/month.", severity: "medium" };
    }
  }

  // GitHub Copilot rules
  if (tool === "github-copilot") {
    if (plan === "enterprise" && seats < 20) {
      const savings = monthlySpend - seats * 19;
      return { ...base, recommendedPlan: "business", recommendedSpend: seats * 19, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Copilot Enterprise fine-tuning requires large codebases to be effective. Business plan covers all core features for small teams.", severity: "high" };
    }
    if (plan === "business" && seats === 1) {
      const savings = monthlySpend - 10;
      return { ...base, recommendedPlan: "individual", recommendedSpend: 10, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Single developers don't need Business policy management. Individual plan provides the same AI completions.", severity: "medium" };
    }
  }

  // Claude rules
  if (tool === "claude") {
    if (plan === "team" && seats < 5) {
      const savings = monthlySpend - seats * 20;
      return { ...base, recommendedPlan: "pro", recommendedSpend: seats * 20, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Claude Team has a 5-seat minimum but charges per seat. Under 5 users, individual Pro subscriptions are cheaper.", severity: "high" };
    }
  }

  // Windsurf rules
  if (tool === "windsurf") {
    if (plan === "teams" && seats <= 2) {
      const savings = monthlySpend - seats * 15;
      return { ...base, recommendedPlan: "pro", recommendedSpend: seats * 15, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Windsurf Teams management features are overkill for ≤2 developers. Pro plan has identical AI capabilities.", severity: "medium" };
    }
  }

  // Gemini rules
  if (tool === "gemini") {
    if (plan === "workspace-business" && seats === 1) {
      const savings = monthlySpend - 20;
      return { ...base, recommendedPlan: "google-one-ai-premium", recommendedSpend: 20, monthlySavings: savings, annualSavings: savings * 12, reasoning: "Google Workspace Business admin features are unnecessary for solo users. Google One AI Premium gives the same Gemini Advanced access.", severity: "medium" };
    }
  }

  // API overspend detection (generic)
  if (tool === "anthropic-api" || tool === "openai-api") {
    const planData = pricing.plans[plan];
    if (planData && monthlySpend > 500 && plan === "pay-as-you-go") {
      return { ...base, recommendedPlan: "committed-usage", recommendedSpend: monthlySpend * 0.75, monthlySavings: monthlySpend * 0.25, annualSavings: monthlySpend * 0.25 * 12, reasoning: "At $500+/month API spend, a committed usage agreement typically yields 25% savings. Contact your vendor for volume pricing.", severity: "high" };
    }
    if (tool === "openai-api" && monthlySpend > 100) {
      return { ...base, recommendedPlan: "cached-prompts", recommendedSpend: monthlySpend * 0.85, monthlySavings: monthlySpend * 0.15, annualSavings: monthlySpend * 0.15 * 12, reasoning: "Enable prompt caching for repeated system prompts. Cached tokens cost 50% less, typically saving 15%+ on total API spend.", severity: "medium" };
    }
  }

  return { ...base, monthlySavings: 0, annualSavings: 0 };
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 12);
}

export function runAudit(entries: ToolEntry[]): AuditResult {
  const recommendations = entries.map(auditTool);
  const totalMonthlySpend = entries.reduce((sum, e) => sum + e.monthlySpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    recommendations,
    toolEntries: entries,
  };
}
