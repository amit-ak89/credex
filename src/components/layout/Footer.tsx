import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white">Credex AI</span>
        </Link>
        <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Credex AI. Audit your AI spend. Ship smarter.</p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="/audit" className="hover:text-white transition-colors">Start Audit</Link>
        </div>
      </div>
    </footer>
  );
}
