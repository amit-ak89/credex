import type { AITool } from "@/types/audit";

export interface PlanData {
  name: string;
  pricePerSeat: number;
  minSeats: number;
  maxSeats?: number;
  features: string[];
}

export interface ToolPricing {
  displayName: string;
  vendor: string;
  plans: Record<string, PlanData>;
}

export const PRICING_DATA: Record<AITool, ToolPricing> = {
  cursor: {
    displayName: "Cursor",
    vendor: "Anysphere",
    plans: {
      free: { name: "Free", pricePerSeat: 0, minSeats: 1, features: ["2000 completions/month", "50 slow requests"] },
      pro: { name: "Pro", pricePerSeat: 20, minSeats: 1, features: ["Unlimited completions", "500 fast requests", "GPT-4 access"] },
      business: { name: "Business", pricePerSeat: 40, minSeats: 1, features: ["All Pro features", "SSO", "Admin dashboard", "Privacy mode"] },
    },
  },
  "github-copilot": {
    displayName: "GitHub Copilot",
    vendor: "GitHub",
    plans: {
      individual: { name: "Individual", pricePerSeat: 10, minSeats: 1, maxSeats: 1, features: ["Code completion", "Chat", "CLI"] },
      business: { name: "Business", pricePerSeat: 19, minSeats: 1, features: ["All Individual", "Policy management", "Audit logs"] },
      enterprise: { name: "Enterprise", pricePerSeat: 39, minSeats: 1, features: ["All Business", "Fine-tuned models", "Knowledge bases"] },
    },
  },
  claude: {
    displayName: "Claude (Anthropic)",
    vendor: "Anthropic",
    plans: {
      free: { name: "Free", pricePerSeat: 0, minSeats: 1, features: ["Claude 3.5 Haiku", "Limited messages"] },
      pro: { name: "Pro", pricePerSeat: 20, minSeats: 1, maxSeats: 1, features: ["Claude 3.5 Sonnet", "5x more usage", "Priority access"] },
      team: { name: "Team", pricePerSeat: 30, minSeats: 5, features: ["All Pro", "Central billing", "Admin console"] },
    },
  },
  chatgpt: {
    displayName: "ChatGPT (OpenAI)",
    vendor: "OpenAI",
    plans: {
      free: { name: "Free", pricePerSeat: 0, minSeats: 1, features: ["GPT-4o mini", "Limited GPT-4o"] },
      plus: { name: "Plus", pricePerSeat: 20, minSeats: 1, maxSeats: 1, features: ["GPT-4o", "DALL-E 3", "Advanced data analysis"] },
      team: { name: "Team", pricePerSeat: 30, minSeats: 2, features: ["All Plus", "Shared workspace", "Admin console"] },
      enterprise: { name: "Enterprise", pricePerSeat: 60, minSeats: 150, features: ["Unlimited GPT-4o", "SSO", "Custom data retention"] },
    },
  },
  "anthropic-api": {
    displayName: "Anthropic API",
    vendor: "Anthropic",
    plans: {
      "pay-as-you-go": { name: "Pay-as-you-go", pricePerSeat: 0, minSeats: 1, features: ["Claude 3.5 Sonnet: $3/MTok in, $15/MTok out", "Claude 3 Haiku: $0.25/MTok in, $1.25/MTok out"] },
      "committed-usage": { name: "Committed Usage", pricePerSeat: 0, minSeats: 1, features: ["Up to 25% discount", "Annual commitment"] },
    },
  },
  "openai-api": {
    displayName: "OpenAI API",
    vendor: "OpenAI",
    plans: {
      "pay-as-you-go": { name: "Pay-as-you-go", pricePerSeat: 0, minSeats: 1, features: ["GPT-4o: $2.50/MTok in, $10/MTok out", "GPT-4o mini: $0.15/MTok in, $0.60/MTok out"] },
      "cached-prompts": { name: "Cached Prompts", pricePerSeat: 0, minSeats: 1, features: ["50% discount on cached input tokens"] },
    },
  },
  gemini: {
    displayName: "Gemini (Google)",
    vendor: "Google",
    plans: {
      free: { name: "Free", pricePerSeat: 0, minSeats: 1, features: ["Gemini 1.5 Flash", "Limited Gemini 1.5 Pro"] },
      "google-one-ai-premium": { name: "Google One AI Premium", pricePerSeat: 20, minSeats: 1, maxSeats: 1, features: ["Gemini Advanced", "2TB storage", "Gemini in Workspace"] },
      "workspace-business": { name: "Workspace Business", pricePerSeat: 30, minSeats: 1, features: ["Gemini for Workspace", "Admin controls", "Enterprise security"] },
    },
  },
  windsurf: {
    displayName: "Windsurf (Codeium)",
    vendor: "Codeium",
    plans: {
      free: { name: "Free", pricePerSeat: 0, minSeats: 1, features: ["Basic completions", "Limited AI flows"] },
      pro: { name: "Pro", pricePerSeat: 15, minSeats: 1, features: ["Unlimited completions", "Advanced models", "Priority support"] },
      teams: { name: "Teams", pricePerSeat: 35, minSeats: 1, features: ["All Pro", "Team management", "SSO", "Analytics"] },
    },
  },
};

export const TOOL_DISPLAY_NAMES: Record<AITool, string> = Object.fromEntries(
  Object.entries(PRICING_DATA).map(([k, v]) => [k, v.displayName])
) as Record<AITool, string>;
