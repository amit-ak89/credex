import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";
import type { AuditResult } from "@/types/audit";
import { AUDIT_SUMMARY_PROMPT } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`summary:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body: { audit: AuditResult } = await req.json().catch(() => ({ audit: null }));
  if (!body.audit) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { audit } = body;
  const context = `
Total monthly spend: $${audit.totalMonthlySpend}
Potential monthly savings: $${audit.totalMonthlySavings.toFixed(0)}
Tools audited: ${audit.toolEntries.map((t) => t.tool).join(", ")}
Top recommendation: ${audit.recommendations.find((r) => r.severity === "high")?.reasoning ?? "No high-priority issues found"}
  `.trim();

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: AUDIT_SUMMARY_PROMPT },
        { role: "user", content: context },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ summary });
  } catch (e) {
    console.error("OpenAI error:", e);
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }
}
