"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import type { AuditResult } from "@/types/audit";

interface Props {
  audit: AuditResult;
}

function getFallback(audit: AuditResult): string {
  return `Your team is spending $${audit.totalMonthlySpend.toLocaleString()}/month across ${audit.toolEntries.length} AI tool${audit.toolEntries.length > 1 ? "s" : ""}. Our audit identified $${audit.totalMonthlySavings.toFixed(0)}/month in potential savings — that's $${audit.totalAnnualSavings.toFixed(0)} annually. ${audit.totalMonthlySavings > 0 ? "The biggest opportunity is consolidating overlapping tools and right-sizing plans to match your actual team size." : "Your current AI stack appears well-optimized for your team size and usage patterns."}`;
}

export function AISummary({ audit }: Props) {
  const [summary, setSummary] = useState<string | null>(audit.summary ?? null);
  const [loading, setLoading] = useState(!audit.summary);
  const [canRetry, setCanRetry] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setCanRetry(false);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audit }),
      });
      const data = await res.json();
      if (!res.ok || !data.summary) {
        // 503 = key missing, use fallback silently. Other errors = show retry.
        setSummary(getFallback(audit));
        if (res.status !== 503) setCanRetry(true);
      } else {
        setSummary(data.summary);
      }
    } catch {
      setSummary(getFallback(audit));
      setCanRetry(true);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { if (!audit.summary) void fetchSummary(); }, []);

  return (
    <Card className="bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border-violet-500/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-300">AI Audit Summary</span>
          {canRetry && (
            <Button variant="ghost" size="sm" onClick={fetchSummary} className="ml-auto h-7 text-xs text-zinc-400 hover:text-white gap-1">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          )}
        </div>
        {loading ? (
          <div className="space-y-2">
            {[100, 90, 75].map((w, i) => (
              <div key={i} className="h-3 bg-zinc-800 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-300 text-sm leading-relaxed">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
