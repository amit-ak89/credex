import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { AuditResult } from "@/types/audit";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecommendationCard } from "@/components/audit/RecommendationCard";
import { SavingsChart } from "@/components/audit/SavingsChart";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Zap } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string): Promise<AuditResult | null> {
  try {
    const { data } = await supabaseAdmin
      .from("audits")
      .select("audit_data")
      .eq("id", id)
      .single();
    return (data as { audit_data: AuditResult } | null)?.audit_data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return { title: "Audit Not Found — Credex" };

  const savings = audit.totalMonthlySavings;
  const title = savings > 0
    ? `AI Spend Audit: $${savings.toFixed(0)}/mo savings found — Credex`
    : "AI Spend Audit: Already Optimized — Credex";

  return {
    title,
    description: `This team audited ${audit.toolEntries.length} AI tools and found $${savings.toFixed(0)}/month in potential savings.`,
    openGraph: {
      title,
      description: `AI spend audit results. $${audit.totalMonthlySpend}/mo current spend. $${savings.toFixed(0)}/mo potential savings.`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  const publicAudit: AuditResult = {
    ...audit,
    toolEntries: audit.toolEntries.map((t) => ({ ...t, monthlySpend: 0 })),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">Shared Audit Report</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">
              {audit.totalMonthlySavings > 0
                ? <>Potential savings: <span className="text-violet-400">${audit.totalMonthlySavings.toFixed(0)}/mo</span></>
                : "AI Stack Already Optimized"}
            </h1>
            <p className="text-zinc-400">
              Audited {audit.toolEntries.length} AI tool{audit.toolEntries.length > 1 ? "s" : ""} &middot;{" "}
              ${audit.totalAnnualSavings.toFixed(0)}/year potential savings
            </p>
          </div>

          {audit.recommendations.some((r) => r.monthlySavings > 0) && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <SavingsChart recommendations={audit.recommendations} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicAudit.recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          <div className="text-center space-y-4 py-8 border-t border-zinc-800">
            <p className="text-zinc-400">Want to audit your own AI spend?</p>
            <LinkButton href="/audit" className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
              <Zap className="w-4 h-4" /> Start Free Audit
            </LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
