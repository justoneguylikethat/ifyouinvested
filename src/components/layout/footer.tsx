import Link from "next/link";
import { PLAYGROUND_TOOLS } from "@/components/playground-grid";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1220] py-12 px-4 md:px-6 mt-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Invested
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Premium investment intelligence. Simulate historical returns, backtest strategies, and visualize what you missed out on.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4">Our Tools</h3>
            <nav>
              <ul className="space-y-3">
                {PLAYGROUND_TOOLS.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4">Assets</h3>
            <nav>
              <ul className="space-y-3">
                <li><Link href="/crypto" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Cryptocurrency</Link></li>
                <li><Link href="/stocks" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Stocks & Equities</Link></li>
                <li><Link href="/etfs" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">ETFs & Index Funds</Link></li>
                <li><Link href="/compare" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Compare Assets</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <nav>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><span className="text-sm text-slate-500">Not financial advice.</span></li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col items-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Invested-Now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
