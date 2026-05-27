"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { spendFormSchema, type SpendFormInput } from "@/lib/schemas";
import { PRICING_DATA } from "@/lib/pricing-data";
import type { AITool } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Zap, ChevronRight } from "lucide-react";
import { runAudit } from "@/lib/audit-engine";

const TOOLS = Object.entries(PRICING_DATA).map(([id, data]) => ({ id: id as AITool, ...data }));

const USE_CASES = [
  { value: "code-completion", label: "Code Completion" },
  { value: "code-review", label: "Code Review" },
  { value: "chat-assistant", label: "Chat Assistant" },
  { value: "api-integration", label: "API Integration" },
  { value: "documentation", label: "Documentation" },
  { value: "testing", label: "Testing" },
  { value: "other", label: "Other" },
];

const STORAGE_KEY = "credex-spend-form";

type ToolEntry = SpendFormInput["tools"][0];

const defaultTool = (): ToolEntry => ({
  tool: "chatgpt",
  plan: "plus",
  monthlySpend: 20,
  seats: 1,
  useCase: "chat-assistant",
  teamSize: 1,
});

export function SpendForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SpendFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(spendFormSchema) as any,
    defaultValues: { tools: [defaultTool()] },
  });

  const { register, control, handleSubmit, watch, setValue: setValueRaw, formState: { errors } } = form;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValue = setValueRaw as any;
  const { fields, append, remove } = useFieldArray({ control, name: "tools" });
  const watchedTools = watch("tools");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SpendFormInput;
        if (parsed.tools?.length) {
          form.reset({ tools: parsed.tools });
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = watch((value) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<SpendFormInput> = (data) => {
    setIsSubmitting(true);
    const result = runAudit(data.tools);
    localStorage.setItem(`credex-audit-${result.id}`, JSON.stringify(result));
    router.push(`/audit/results?id=${result.id}`);
  };

  const totalSpend = watchedTools.reduce((sum, t) => sum + (Number(t.monthlySpend) || 0), 0);

  return (
    <form onSubmit={handleSubmit(onSubmit as SubmitHandler<SpendFormInput>)} className="space-y-6">
      {fields.map((field, index) => {
        const selectedTool = watchedTools[index]?.tool as AITool;
        const toolData = PRICING_DATA[selectedTool];
        const plans = toolData ? Object.entries(toolData.plans) : [];

        return (
          <Card key={field.id} className="bg-zinc-900/60 border-zinc-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  AI Tool #{index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-zinc-500 hover:text-red-400 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Tool</Label>
                <Select
                  value={watchedTools[index]?.tool}
                  onValueChange={(v) => {
                    setValue(`tools.${index}.tool`, v as AITool);
                    const firstPlan = Object.keys(PRICING_DATA[v as AITool]?.plans ?? {})[0] ?? "";
                    if (firstPlan) setValue(`tools.${index}.plan`, firstPlan);
                  }}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {TOOLS.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-white hover:bg-zinc-700">
                        {t.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Plan</Label>
                <Select
                  value={watchedTools[index]?.plan}
                  onValueChange={(v) => setValue(`tools.${index}.plan`, v)}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {plans.map(([planId, planData]) => (
                      <SelectItem key={planId} value={planId} className="text-white hover:bg-zinc-700">
                        {planData.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Monthly Spend ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`tools.${index}.monthlySpend`)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="0.00"
                />
                {errors.tools?.[index]?.monthlySpend && (
                  <p className="text-red-400 text-xs">{errors.tools[index]?.monthlySpend?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Number of Seats</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`tools.${index}.seats`)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="1"
                />
                {errors.tools?.[index]?.seats && (
                  <p className="text-red-400 text-xs">{errors.tools[index]?.seats?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Primary Use Case</Label>
                <Select
                  value={watchedTools[index]?.useCase}
                  onValueChange={(v) => setValue(`tools.${index}.useCase`, v as ToolEntry["useCase"])}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {USE_CASES.map((uc) => (
                      <SelectItem key={uc.value} value={uc.value} className="text-white hover:bg-zinc-700">
                        {uc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-sm">Team Size</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`tools.${index}.teamSize`)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="1"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => append(defaultTool())}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Add Another Tool
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-zinc-500">Total monthly spend</p>
            <p className="text-lg font-bold text-white">${totalSpend.toLocaleString()}</p>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-500 text-white gap-2 px-6"
          >
            {isSubmitting ? (
              <><span className="animate-spin inline-block">&#8635;</span> Analyzing...</>
            ) : (
              <><Zap className="w-4 h-4" /> Run Audit <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
