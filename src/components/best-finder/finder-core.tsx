"use client";

import { useState } from "react";
import { format } from "date-fns";
import { POPULAR_ASSETS } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Trophy, Medal, Crown } from "lucide-react";
import { AssetType } from "@/lib/types";

export function FinderCore() {
  const [amount, setAmount] = useState<number>(1000);
  const [startDate, setStartDate] = useState<string>("2015-01-01");
  const [assetType, setAssetType] = useState<"ALL" | AssetType>("ALL");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    asset: any;
    roi: number;
    finalValue: number;
    startPrice: number;
    endPrice: number;
  }[] | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setResults(null);
    
    // Filter assets if user selected a specific type
    let assetsToSearch = assetType === "ALL" 
      ? POPULAR_ASSETS 
      : POPULAR_ASSETS.filter(a => a.type === assetType);

    // Randomly select 15 assets to prevent API timeout and Yahoo Finance rate limiting
    assetsToSearch = [...assetsToSearch].sort(() => 0.5 - Math.random()).slice(0, 15);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: assetsToSearch,
          amount,
          startDate,
          endDate: format(new Date(), "yyyy-MM-dd"), // Today
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        const rankings = data.results.map((result: any) => {
          if (!result.history || result.history.length === 0) return null;
          
          const startPrice = result.history[0].price;
          const endPrice = result.history[result.history.length - 1].price;
          const roi = ((endPrice - startPrice) / startPrice) * 100;
          const finalValue = amount * (1 + (roi / 100));

          return {
            asset: result.asset,
            roi,
            finalValue,
            startPrice,
            endPrice
          };
        }).filter(Boolean); // Remove nulls (assets that failed or didn't exist then)

        // Sort descending by ROI
        rankings.sort((a: any, b: any) => b.roi - a.roi);
        
        setResults(rankings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Hindsight 20/20</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Input an amount and a date in the past. We'll simulate the market and tell you exactly what you <em>should</em> have bought.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">If I had...</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">On this Date...</Label>
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">In this Market...</Label>
            <select 
              className="w-full bg-[#0B1220] border border-white/10 text-white font-bold text-lg h-14 rounded-xl px-4 focus:outline-none"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
            >
              <option value="ALL">Everything</option>
              <option value="STOCK">Stocks</option>
              <option value="CRYPTO">Crypto</option>
              <option value="ETF">ETFs</option>
            </select>
          </div>
        </div>

        <Button 
          onClick={handleSearch}
          disabled={loading}
          className="w-full h-16 text-xl font-bold flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all border-0"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin shrink-0" />
          ) : (
            <Search className="w-6 h-6 shrink-0" />
          )}
          <span className="truncate">{loading ? "Searching History..." : "Find the Best Investment"}</span>
        </Button>
      </div>

      {results && results.length > 0 && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h3 className="text-center text-2xl font-bold text-white mb-10">The Ultimate Leaderboard</h3>
          
          {/* Top 3 Podium */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 mb-16 max-w-4xl mx-auto px-4">
            {/* Rank 2 */}
            {results[1] && (
              <div className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-t-3xl rounded-b-xl p-6 text-center order-2 md:order-1 relative pb-10">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center shadow-lg shadow-slate-300/20">
                  <Medal className="w-6 h-6 text-slate-600" />
                </div>
                <h4 className="text-2xl font-black text-white mt-4">{results[1].asset.symbol}</h4>
                <p className="text-slate-400 text-sm mb-4">{results[1].asset.name}</p>
                <div className="bg-[#0B1220] p-4 rounded-xl border border-white/5">
                  <p className="text-xl font-bold text-emerald-400">${results[1].finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">+{results[1].roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</p>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {results[0] && (
              <div className="w-full md:w-1/3 bg-gradient-to-b from-amber-500/20 to-white/5 border border-amber-500/30 rounded-t-3xl rounded-b-xl p-8 text-center order-1 md:order-2 relative md:-translate-y-8 shadow-[0_-10px_40px_rgba(245,158,11,0.1)]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/40">
                  <Crown className="w-8 h-8 text-amber-900" />
                </div>
                <div className="text-amber-400 font-black tracking-widest text-xs uppercase mb-2 mt-4">The Absolute Best</div>
                <h4 className="text-4xl font-black text-white">{results[0].asset.symbol}</h4>
                <p className="text-slate-300 text-sm mb-6">{results[0].asset.name}</p>
                <div className="bg-[#0B1220]/80 p-5 rounded-2xl border border-amber-500/20">
                  <p className="text-3xl font-black text-amber-400">${results[0].finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-sm font-bold text-emerald-400 mt-2">+{results[0].roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}% ROI</p>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {results[2] && (
              <div className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-t-3xl rounded-b-xl p-6 text-center order-3 md:order-3 relative pb-6">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center shadow-lg shadow-orange-700/20">
                  <Medal className="w-6 h-6 text-orange-200" />
                </div>
                <h4 className="text-2xl font-black text-white mt-4">{results[2].asset.symbol}</h4>
                <p className="text-slate-400 text-sm mb-4">{results[2].asset.name}</p>
                <div className="bg-[#0B1220] p-4 rounded-xl border border-white/5">
                  <p className="text-xl font-bold text-emerald-400">${results[2].finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">+{results[2].roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the list */}
          <div className="max-w-3xl mx-auto space-y-3 px-4">
            {results.slice(3, 10).map((res, i) => (
              <div key={res.asset.symbol} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                    {i + 4}
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{res.asset.symbol}</h5>
                    <p className="text-xs text-slate-400">{res.asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${res.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs font-medium text-emerald-400">+{res.roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
