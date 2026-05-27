"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { AuditResult } from "@/types/audit";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecommendationCard } from "@/components/audit/RecommendationCard";
import { SavingsChart } from "@/components/audit/SavingsChart";
import { AISummary } from "@/components/audit/AISummary";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowLeft, TrendingDown, CheckCircle, Zap } from "lucide-react";

export default function ResultsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) { router.push("/audit"); return; }
    const load = async () => {
      try {
        const stored = localStorage.getItem(`credex-audit-${id}`);
        if (!stored) { router.push("/audit"); return; }
        setAudit(JSON.parse(stored) as AuditResult);
      } catch {
        router.push("/audit");
      }
    };
    void load();
  }, [id, router]);

  const handleShare = async () => {
    const url = `${window.location.origin}/share/${id ?? ""}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!audit) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOptimized = audit.totalMonthlySavings < 100;
  const isHighSavings = audit.totalMonthlySavings > 500;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/audit" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Audit
          </Link>

          {/* Hero savings */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-950/60 to-indigo-950/60 border border-violet-500/20 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">Audit Complete</Badge>
                  {isOptimized ? (
                    <>
                      <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                        Already Optimized!
                      </h1>
                      <p className="text-zinc-400">Your AI stack is well-configured. Minor tweaks could save a little more.</p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl md:text-4xl font-bold">
                        You could save{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                          ${audit.totalMonthlySavings.toFixed(0)}/mo
                        </span>
                      </h1>
                      <p className="text-zinc-400">
                        That&apos;s <strong className="text-white">${audit.totalAnnualSavings.toFixed(0)}</strong> per year in AI tooling costs.
                      </p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-zinc-500 mb-1">Current Spend</p>
                    <p className="text-2xl font-bold text-white">${audit.totalMonthlySpend.toLocaleString()}</p>
                    <p className="text-xs text-zinc-600">/month</p>
                  </div>
                  <div className="bg-violet-600/20 rounded-xl p-4 text-center border border-violet-500/20">
                    <p className="text-xs text-violet-400 mb-1">Potential Savings</p>
                    <p className="text-2xl font-bold text-violet-300">${audit.totalMonthlySavings.toFixed(0)}</p>
                    <p className="text-xs text-violet-500">/month</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleShare} variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2">
                  <Share2 className="w-4 h-4" />
                  {copied ? "Copied!" : "Share Audit"}
                </Button>
              </div>
            </div>
          </div>

          {/* High savings CTA */}
          {isHighSavings && (
            <div className="rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  Significant savings detected!
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Credex can help you implement these changes and track ongoing AI spend automatically.
                </p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-500 text-white shrink-0 gap-2">
                <Zap className="w-4 h-4" /> Get Credex Pro
              </Button>
            </div>
          )}

          <AISummary audit={audit} />

          {audit.recommendations.some((r) => r.monthlySavings > 0) && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-violet-400" />
                Savings by Tool
              </h2>
              <SavingsChart recommendations={audit.recommendations} />
            </div>
          )}

          <div>
            <h2 className="font-semibold text-white mb-4">
              Recommendations ({audit.recommendations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audit.recommendations.map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} />
              ))}
            </div>
          </div>

          <LeadCaptureForm auditId={audit.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
