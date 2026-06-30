"use client";

import { TrendingUp, Flame, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const TRENDING_DATA = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 135.58, change: 4.5, volume: "High", sector: "Technology" },
  { symbol: "BTC", name: "Bitcoin", price: 67240.00, change: 2.1, volume: "Very High", sector: "Crypto" },
  { symbol: "SOL", name: "Solana", price: 145.20, change: 8.4, volume: "Extreme", sector: "Crypto" },
  { symbol: "AAPL", name: "Apple Inc.", price: 214.32, change: -1.2, volume: "High", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 184.50, change: 3.2, volume: "High", sector: "Automotive" },
  { symbol: "PLTR", name: "Palantir", price: 28.40, change: 12.5, volume: "Extreme", sector: "Technology" },
  { symbol: "COIN", name: "Coinbase", price: 220.10, change: -4.5, volume: "Medium", sector: "Finance" },
  { symbol: "META", name: "Meta Platforms", price: 504.20, change: 1.8, volume: "Medium", sector: "Technology" },
];

export function TrendingCore() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 text-orange-400 rounded-2xl mb-4">
          <Flame className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Trending Now</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          See what would have happened if you invested in these high-momentum assets 24 hours ago.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRENDING_DATA.map((asset) => {
          const isPositive = asset.change > 0;
          const principal = 1000;
          const finalValue = principal * (1 + asset.change / 100);
          const profit = finalValue - principal;

          return (
            <Link 
              key={asset.symbol} 
              href={`/calculator?amount=1000&start=${yesterdayStr}&end=${todayStr}&assets=${asset.symbol}`}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{asset.symbol}</h3>
                  <p className="text-xs text-slate-400">{asset.name}</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                  {asset.sector}
                </span>
              </div>
              
              <div className="my-5 p-3.5 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center gap-1 shadow-inner">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  If you invested $1,000 24h ago:
                </span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className={`text-xl font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'} whitespace-nowrap`}>
                    {isPositive ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{asset.change}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium border-t border-white/5 pt-4">
                <span className="text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {asset.volume} Vol
                </span>
                <span className="text-blue-400 flex items-center gap-0.5 hover:underline font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  Backtest 24h <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
