"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";

interface Props {
  auditId: string;
}

export function LeadCaptureForm({ auditId }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any,
    defaultValues: { auditId, honeypot: "" },
  });

  const onSubmit: SubmitHandler<LeadInput> = async (data) => {
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to submit");
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <Card className="bg-zinc-900/60 border-emerald-500/30">
        <CardContent className="pt-6 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="font-semibold text-white">Check your inbox!</p>
          <p className="text-sm text-zinc-400">We sent your full audit report to your email.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2 text-white">
          <Mail className="w-4 h-4 text-violet-400" />
          Get Your Full Report
        </CardTitle>
        <p className="text-sm text-zinc-400">Receive a detailed PDF audit + optimization roadmap.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />
          <input {...register("auditId")} type="hidden" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-sm">Work Email *</Label>
              <Input {...register("email")} type="email" placeholder="you@company.com" className="bg-zinc-800 border-zinc-700 text-white" />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-sm">Company Name *</Label>
              <Input {...register("companyName")} placeholder="Acme Corp" className="bg-zinc-800 border-zinc-700 text-white" />
              {errors.companyName && <p className="text-red-400 text-xs">{errors.companyName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-sm">Your Role *</Label>
              <Input {...register("role")} placeholder="CTO, Engineering Manager..." className="bg-zinc-800 border-zinc-700 text-white" />
              {errors.role && <p className="text-red-400 text-xs">{errors.role.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-sm">Team Size *</Label>
              <Input {...register("teamSize")} type="number" min="1" placeholder="10" className="bg-zinc-800 border-zinc-700 text-white" />
              {errors.teamSize && <p className="text-red-400 text-xs">{errors.teamSize.message}</p>}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
            {isSubmitting ? "Sending..." : "Send My Report"}
          </Button>
          <p className="text-xs text-zinc-500 text-center">No spam. Unsubscribe anytime.</p>
        </form>
      </CardContent>
    </Card>
  );
}
