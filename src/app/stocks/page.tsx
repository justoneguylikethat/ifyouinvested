import { constructMetadata } from "@/lib/seo";
import { POPULAR_ASSETS } from "@/lib/assets";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Stock Returns Calculator | IfYouInvested",
  description: "Simulate historical returns for top stocks. See what AAPL, TSLA, NVDA, MSFT and more would be worth if you invested in them earlier.",
});

const stockAssets = POPULAR_ASSETS.filter((a) => a.type === "stock");

export default function StocksPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Stocks &amp; Equities</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Explore historical returns for top stocks and equities. Select an asset to see what your investment would be worth today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockAssets.map((asset) => (
            <Link
              key={asset.symbol}
              href={`/invest/${asset.symbol}`}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                {asset.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.logoUrl} alt={asset.name} className="w-9 h-9 rounded-full object-contain bg-white/10 p-1" />
                )}
                <div>
                  <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{asset.name}</p>
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
