import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditRecommendation } from "@/types/audit";
import { TOOL_DISPLAY_NAMES } from "@/lib/pricing-data";
import { TrendingDown, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface Props {
  recommendation: AuditRecommendation;
}

const SEVERITY_CONFIG = {
  high: { label: "High Savings", color: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: AlertCircle, border: "border-violet-500/30" },
  medium: { label: "Medium Savings", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", icon: AlertTriangle, border: "border-indigo-500/30" },
  low: { label: "Low Savings", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: TrendingDown, border: "border-blue-500/30" },
  optimal: { label: "Optimized", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: CheckCircle, border: "border-zinc-800" },
};

export function RecommendationCard({ recommendation: r }: Props) {
  const config = SEVERITY_CONFIG[r.severity];
  const Icon = config.icon;

  return (
    <Card className={`bg-zinc-900/60 border ${config.border} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500 mb-1">{TOOL_DISPLAY_NAMES[r.tool]}</p>
            <h3 className="font-semibold text-white text-sm">
              {r.severity === "optimal" ? "Already Optimized" : `Switch to ${r.recommendedPlan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`}
            </h3>
          </div>
          <Badge className={`${config.color} border text-xs shrink-0`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-zinc-400">{r.reasoning}</p>
        {r.monthlySavings > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500">Monthly Savings</p>
              <p className="text-lg font-bold text-violet-400">${r.monthlySavings.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Annual Savings</p>
              <p className="text-lg font-bold text-violet-300">${r.annualSavings.toFixed(0)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="line-through">{r.currentPlan}</span>
          <span>→</span>
          <span className="text-zinc-300">{r.recommendedPlan}</span>
          <span className="ml-auto">${r.currentSpend}/mo → ${r.recommendedSpend.toFixed(0)}/mo</span>
        </div>
      </CardContent>
    </Card>
  );
}
