"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AuditRecommendation } from "@/types/audit";
import { TOOL_DISPLAY_NAMES } from "@/lib/pricing-data";

interface Props {
  recommendations: AuditRecommendation[];
}

const SEVERITY_COLORS: Record<string, string> = {
  high: "#8b5cf6",
  medium: "#6366f1",
  low: "#a78bfa",
  optimal: "#3f3f46",
};

export function SavingsChart({ recommendations }: Props) {
  const data = recommendations
    .filter((r) => r.monthlySavings > 0)
    .map((r) => ({
      name: TOOL_DISPLAY_NAMES[r.tool]?.split(" ")[0] ?? r.tool,
      savings: r.monthlySavings,
      severity: r.severity,
    }))
    .sort((a, b) => b.savings - a.savings);

  if (data.length === 0) return null;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff" }}
            formatter={(value) => [`$${Number(value ?? 0).toFixed(0)}/mo`, "Savings"]}
          />
          <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={SEVERITY_COLORS[entry.severity] ?? "#8b5cf6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
