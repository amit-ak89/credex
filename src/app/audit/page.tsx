import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpendForm } from "@/components/forms/SpendForm";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Start Your AI Spend Audit — Credex",
  description: "Enter your AI tools and spend to get instant optimization recommendations.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300">
              <Zap className="w-3.5 h-3.5" /> Free Audit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Audit Your AI Spend</h1>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Add each AI tool your team pays for. We&apos;ll analyze your spend and find savings opportunities instantly.
            </p>
          </div>
          <SpendForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
