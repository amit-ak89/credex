import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { runAudit } from "@/lib/audit-engine";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { toolEntrySchema } from "@/lib/schemas";

const bodySchema = z.object({ tools: z.array(toolEntrySchema).min(1) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`audit:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const result = runAudit(parsed.data.tools);

  try {
    await getSupabaseAdmin().from("audits").insert({
      id: result.id,
      audit_data: result,
      created_at: result.createdAt,
    });
  } catch {
    // Non-fatal — audit still works without persistence
  }

  return NextResponse.json(result);
}
