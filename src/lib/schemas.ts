import { z } from "zod";

export const toolEntrySchema = z.object({
  tool: z.enum(["cursor", "github-copilot", "claude", "chatgpt", "anthropic-api", "openai-api", "gemini", "windsurf"]),
  plan: z.string().min(1, "Plan is required"),
  monthlySpend: z.number().min(0, "Must be >= 0").max(100000),
  seats: z.number().int().min(1, "At least 1 seat").max(10000),
  useCase: z.enum(["code-completion", "code-review", "chat-assistant", "api-integration", "documentation", "testing", "other"]),
  teamSize: z.number().int().min(1).max(100000),
});

export const spendFormSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
});

export const leadSchema = z.object({
  email: z.string().email("Valid email required"),
  companyName: z.string().min(1, "Company name required").max(100),
  role: z.string().min(1, "Role required").max(100),
  teamSize: z.number().int().min(1).max(100000),
  auditId: z.string(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type ToolEntryInput = z.infer<typeof toolEntrySchema>;
export type SpendFormInput = z.infer<typeof spendFormSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
