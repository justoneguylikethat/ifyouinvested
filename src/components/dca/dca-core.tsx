"use client";

import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Asset, InvestmentResult } from "@/lib/types";
import { DcaChart } from "./dca-chart";
import { VideoExportView } from "@/components/video-export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, PiggyBank, RefreshCw, Calendar as CalendarIcon, Coins } from "lucide-react";
import { POPULAR_ASSETS } from "@/lib/assets";
import { AssetSelect } from "@/components/asset-select";

export function DcaCore() {
  const [asset, setAsset] = useState<Asset>(POPULAR_ASSETS[0]);
  const [amount, setAmount] = useState<number>(100);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    history: any[];
    totalInvested: number;
    finalValue: number;
    totalShares: number;
    roi: number;
  } | null>(null);

  const videoResult: InvestmentResult | null = results ? {
    asset: { symbol: asset.symbol, name: asset.name, type: asset.type },
    initialInvestment: results.totalInvested,
    startValue: 1, 
    endValue: 1, 
    finalValue: results.finalValue,
    startDate: results.history[0]?.date,
    endDate: results.history[results.history.length - 1]?.date,
    sharesPurchased: results.totalShares,
    totalReturn: results.finalValue - results.totalInvested,
    percentageReturn: results.roi,
    cagr: (((results.finalValue / results.totalInvested) ** (1 / Math.max(1, results.history.length / 365.25))) - 1) * 100,
    history: results.history.map((h: any) => ({ date: h.date, price: h.value }))
  } : null;

  const handleCalculate = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      // Fetch daily history from standard calculate endpoint (hack: sending 1$ lump sum just to get the price curve)
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: [asset],
          amount: 1, // Doesn't matter, we just need the history prices
          startDate,
          endDate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const historyData = data.results[0]?.history;
        if (historyData && historyData.length > 0) {
          // Perform DCA Simulation Client-Side
          let totalInvested = 0;
          let totalShares = 0;
          const dcaHistory: any[] = [];
          
          // Determine interval in days
          const intervalDays = frequency === "daily" ? 1 : frequency === "weekly" ? 7 : 30;
          let daysSinceLastInvestment = intervalDays; // Trigger immediate investment on day 1
          
          let lastDate = new Date(historyData[0].date);

          for (let i = 0; i < historyData.length; i++) {
            const point = historyData[i];
            const currentDate = new Date(point.date);
            const daysPassed = differenceInDays(currentDate, lastDate);
            
            daysSinceLastInvestment += daysPassed;
            
            // Check if it's time to invest
            if (daysSinceLastInvestment >= intervalDays) {
              totalInvested += amount;
              const sharesBought = amount / point.price;
              totalShares += sharesBought;
              daysSinceLastInvestment = 0; // reset
            }

            dcaHistory.push({
              date: point.date,
              invested: totalInvested,
              value: totalShares * point.price
            });
            
            lastDate = currentDate;
          }

          const finalValue = dcaHistory[dcaHistory.length - 1].value;
          const roi = ((finalValue - totalInvested) / totalInvested) * 100;

          setResults({
            history: dcaHistory,
            totalInvested,
            finalValue,
            totalShares,
            roi
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Dollar Cost Averaging</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Discover the compounding power of consistent, periodic investments over time.
          </p>
        </div>

        {results && (
          <div className="bg-[#0B1220] px-6 py-4 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex items-center gap-4">
            <TrendingUp className={`w-10 h-10 ${results.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Total ROI
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black tracking-tight ${results.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Controls */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            
            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-slate-300 font-medium text-sm mb-2 block">Select Asset</Label>
                <AssetSelect 
                  value={asset.symbol}
                  onValueChange={(symbol) => {
                    const found = POPULAR_ASSETS.find(a => a.symbol === symbol);
                    if (found) setAsset(found);
                  }}
                />
              </div>

              <div>
                <Label className="text-slate-300 font-medium text-sm mb-2 block">Contribution ($)</Label>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-12 rounded-xl focus-visible:ring-blue-500/50"
                />
              </div>

              <div>
                <Label className="text-slate-300 font-medium text-sm mb-2 block">Frequency</Label>
                <div className="flex gap-2 bg-[#0B1220] p-1 rounded-xl border border-white/10">
                  {(["daily", "weekly", "monthly"] as const).map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                        frequency === freq ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-300 font-medium text-sm mb-2 block">Start Date</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#0B1220] border-white/10 text-white text-sm h-10 rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 font-medium text-sm mb-2 block">End Date</Label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#0B1220] border-white/10 text-white text-sm h-10 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all border-0"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <PiggyBank className="w-5 h-5 mr-2" />
              )}
              {loading ? "Simulating..." : "Calculate DCA"}
            </Button>
          </div>
        </div>

        {/* Right Content */}
        <div className="xl:col-span-3 space-y-6">
          {results ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-center">
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Cash Invested</p>
                  <p className="text-2xl font-black text-white">${results.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-center">
                  <p className="text-slate-400 text-sm font-medium mb-1">Portfolio Value</p>
                  <p className="text-2xl font-black text-emerald-400">${results.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-center">
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Shares Accumulated</p>
                  <p className="text-2xl font-black text-blue-400">{results.totalShares.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative">
                <h3 className="text-lg font-bold text-white mb-6">Wealth Accumulation</h3>
                <DcaChart data={results.history} />
              </div>

              {videoResult && (
                <div className="mt-6">
                  <VideoExportView results={[videoResult]} />
                </div>
              )}
            </>
          ) : (
             <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Coins className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">Simulate Consistent Investing</h3>
                <p className="text-slate-500 max-w-md">
                  Configure your recurring investment on the left and see how dollar-cost averaging performs through market volatility.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
