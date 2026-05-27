export type AITool =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCaseType =
  | "code-completion"
  | "code-review"
  | "chat-assistant"
  | "api-integration"
  | "documentation"
  | "testing"
  | "other";

export interface ToolEntry {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: UseCaseType;
  teamSize: number;
}

export interface AuditRecommendation {
  tool: AITool;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  alternativeTool?: string;
  alternativeSpend?: number;
  severity: "high" | "medium" | "low" | "optimal";
}

export interface AuditResult {
  id: string;
  createdAt: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
  summary?: string;
  toolEntries: ToolEntry[];
}

export interface LeadCapture {
  email: string;
  companyName: string;
  role: string;
  teamSize: number;
  auditId: string;
}
