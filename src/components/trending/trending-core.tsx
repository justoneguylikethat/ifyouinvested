"use client";

import { TrendingUp, Flame, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

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
  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 text-orange-400 rounded-2xl mb-4">
          <Flame className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Trending Now</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          See where the money is moving. Real-time momentum and volume tracking across global markets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRENDING_DATA.map((asset) => {
          const isPositive = asset.change > 0;
          return (
            <Link 
              key={asset.symbol} 
              href={`/invest/${asset.symbol.toLowerCase()}`}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{asset.symbol}</h3>
                  <p className="text-sm text-slate-400">{asset.name}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(asset.change)}%
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-black text-white">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-medium border-t border-white/5 pt-4">
                <span className="text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {asset.volume} Vol
                </span>
                <span className="text-slate-400 px-2 py-1 bg-white/5 rounded-md">
                  {asset.sector}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
