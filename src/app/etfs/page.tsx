import { constructMetadata } from "@/lib/seo";
import { POPULAR_ASSETS } from "@/lib/assets";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "ETF & Index Fund Returns Calculator | IfYouInvested",
  description: "Simulate historical returns for popular ETFs and index funds like SPY, QQQ, VOO, and more. See how passive investing compounds over time.",
});

const etfAssets = POPULAR_ASSETS.filter((a) => a.type === "etf");

export default function ETFsPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">ETFs &amp; Index Funds</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Explore historical returns for popular ETFs and index funds. See the power of passive, long-term investing with real historical data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {etfAssets.map((asset) => (
            <Link
              key={asset.symbol}
              href={`/invest/${asset.symbol}`}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500/40 to-blue-500/40 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-xs font-bold text-white">{asset.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">{asset.name}</p>
                  <p className="text-xs text-slate-500">{asset.symbol}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Click to simulate returns →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
