import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Zap, TrendingDown, Shield, BarChart3, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Credex AI Spend Auditor — Stop Overpaying for AI Tools",
  description: "Audit your company's AI tooling spend in 2 minutes. Get personalized recommendations to cut costs without cutting productivity.",
  keywords: ["AI spend", "AI cost optimization", "Cursor", "GitHub Copilot", "ChatGPT", "Claude", "SaaS audit"],
  openGraph: {
    title: "Credex AI Spend Auditor",
    description: "Stop overpaying for AI tools. Get a free audit in 2 minutes.",
    type: "website",
    url: "https://credex.ai",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Credex AI Spend Auditor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credex AI Spend Auditor",
    description: "Stop overpaying for AI tools. Free audit in 2 minutes.",
    images: ["/og-image.png"],
  },
};

const FEATURES = [
  { icon: TrendingDown, title: "Detect Overkill Plans", desc: "Find where you're paying for enterprise features your team doesn't use." },
  { icon: BarChart3, title: "Savings Breakdown", desc: "See exactly how much you can save per tool, per month, per year." },
  { icon: Shield, title: "Vendor-Neutral Advice", desc: "We recommend the best plan for your needs — not the most expensive one." },
  { icon: Clock, title: "2-Minute Audit", desc: "Enter your tools and spend. Get actionable results instantly." },
  { icon: Zap, title: "AI-Powered Summary", desc: "Get a personalized 100-word summary of your optimization opportunities." },
  { icon: CheckCircle, title: "Shareable Reports", desc: "Share your audit with your team or CFO via a unique URL." },
];

const TOOLS = ["Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API", "OpenAI API", "Gemini", "Windsurf"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-black to-black pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-1.5 text-sm">
            Free AI Spend Audit
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Stop Overpaying for{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              AI Tools
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Most engineering teams waste 30-40% of their AI budget on wrong plans and overlapping tools.
            Audit yours in 2 minutes and get a personalized savings roadmap.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/audit" size="lg" className="bg-violet-600 hover:bg-violet-500 text-white text-base px-8 h-12 gap-2">
              <Zap className="w-5 h-5" /> Start Free Audit
            </LinkButton>
            <LinkButton href="#how-it-works" variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white text-base px-8 h-12">
              See How It Works
            </LinkButton>
          </div>

          <p className="text-sm text-zinc-600">No account required · Takes 2 minutes · 100% free</p>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-zinc-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-zinc-600 mb-4 uppercase tracking-widest">Audits tools including</p>
          <div className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((t) => (
              <span key={t} className="text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to optimize AI spend</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Built for CTOs, engineering managers, and finance teams who want data-driven AI budget decisions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors group">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-zinc-950/50">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter Your Tools", desc: "Add each AI tool your team uses with plan, spend, and seat count." },
              { step: "02", title: "Get Instant Analysis", desc: "Our audit engine checks 20+ rules to find savings opportunities." },
              { step: "03", title: "Implement & Save", desc: "Follow the recommendations and start saving from next billing cycle." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="space-y-3">
                <div className="text-4xl font-bold text-violet-600/40">{step}</div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to cut your AI bill?</h2>
          <p className="text-zinc-400">Teams typically find $200-$800/month in savings. Takes 2 minutes.</p>
          <LinkButton href="/audit" size="lg" className="bg-violet-600 hover:bg-violet-500 text-white text-base px-10 h-12 gap-2">
            <Zap className="w-5 h-5" /> Start Free Audit Now
          </LinkButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
