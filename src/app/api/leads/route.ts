import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`leads:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues;
    return NextResponse.json({ error: issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { honeypot: _honeypot, ...lead } = parsed.data;

  const { error: dbError } = await getSupabaseAdmin().from("leads").insert({
    email: lead.email,
    company_name: lead.companyName,
    role: lead.role,
    team_size: lead.teamSize,
    audit_id: lead.auditId,
    created_at: new Date().toISOString(),
  });

  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Credex AI <hello@credex.ai>",
      to: lead.email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#09090b;color:#fff;">
          <h1 style="color:#a78bfa;font-size:24px;margin-bottom:8px;">Your Audit is Ready</h1>
          <p style="color:#a1a1aa;">Hi ${lead.role} at ${lead.companyName},</p>
          <p style="color:#a1a1aa;">Thanks for using Credex AI Spend Auditor. Your personalized audit report is ready.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/share/${lead.auditId}"
             style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
            View Your Audit
          </a>
          <p style="color:#52525b;font-size:12px;margin-top:32px;">Credex AI &middot; Unsubscribe anytime</p>
        </div>
      `,
    }).catch((e: unknown) => console.error("Email error:", e));
  }

  return NextResponse.json({ success: true });
}
