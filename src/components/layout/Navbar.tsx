"use client";

import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white">Credex</span>
          <span className="text-violet-400">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/audit" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Start Audit
          </Link>
          <LinkButton href="/audit" size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">
            Free Audit
          </LinkButton>
        </div>
      </div>
    </nav>
  );
}
