import { constructMetadata } from "@/lib/seo";
import { POPULAR_ASSETS } from "@/lib/assets";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = constructMetadata({
  title: "Compare Investment Assets | IfYouInvested",
  description: "Compare historical returns across stocks, crypto, and ETFs. Find out which assets would have made you the most money.",
});

const featuredPairs = [
  { a: "AAPL", b: "MSFT", label: "Apple vs Microsoft" },
  { a: "BTC", b: "ETH", label: "Bitcoin vs Ethereum" },
  { a: "SPY", b: "QQQ", label: "S&P 500 vs Nasdaq 100" },
  { a: "TSLA", b: "NVDA", label: "Tesla vs NVIDIA" },
  { a: "GOOGL", b: "META", label: "Google vs Meta" },
  { a: "BTC", b: "SPY", label: "Bitcoin vs S&P 500" },
];

const allAssets = POPULAR_ASSETS.slice(0, 30);

export default function ComparePage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Compare Assets</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Compare historical returns between any two investments. Use our simulator to find which asset would have grown your money more.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Popular Comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPairs.map((pair) => (
              <Link
                key={`${pair.a}-${pair.b}`}
                href={`/invest/${pair.a}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-200 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">{pair.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{pair.a} vs {pair.b}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">All Assets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {allAssets.map((asset) => (
              <Link
                key={asset.symbol}
                href={`/invest/${asset.symbol}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3 transition-all duration-200 text-center"
              >
                <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{asset.symbol}</p>
                <p className="text-xs text-slate-500 truncate">{asset.name.split(" ")[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
