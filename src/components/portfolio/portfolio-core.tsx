"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AssetAllocation, AllocationPieChart } from "./allocation-pie-chart";
import { AllocationManager } from "./allocation-manager";
import { PortfolioPerformanceChart } from "./portfolio-performance-chart";
import { AssetExplorer } from "@/components/asset-explorer/AssetExplorer";
import { VideoExportView } from "@/components/video-export";
import { InvestmentResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Play, TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export function PortfolioCore() {
  const [allocations, setAllocations] = useState<AssetAllocation[]>([
    { asset: { symbol: "VOO", name: "Vanguard S&P 500 ETF", type: "etf" }, weight: 60, color: COLORS[0] },
    { asset: { symbol: "BND", name: "Vanguard Total Bond Market", type: "etf" }, weight: 40, color: COLORS[1] }
  ]);
  const [initialAmount, setInitialAmount] = useState<number>(10000);
  
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<{ date: string; value: number }[]>([]);
  
  // Stats
  const [finalValue, setFinalValue] = useState<number | null>(null);

  const totalWeight = allocations.reduce((sum, a) => sum + a.weight, 0);
  const isValid = totalWeight === 100 && allocations.length > 0;

  const videoResult: InvestmentResult | null = (finalValue !== null && historyData.length > 0) ? {
    asset: { symbol: "PORTFOLIO", name: "Custom Portfolio", type: "index" },
    initialInvestment: initialAmount,
    startValue: 1,
    endValue: finalValue / initialAmount,
    finalValue: finalValue,
    startDate: historyData[0]?.date,
    endDate: historyData[historyData.length - 1]?.date,
    sharesPurchased: 1,
    totalReturn: finalValue - initialAmount,
    percentageReturn: ((finalValue - initialAmount) / initialAmount) * 100,
    cagr: (((finalValue / initialAmount) ** (1 / Math.max(1, historyData.length / 365.25))) - 1) * 100,
    history: historyData.map(h => ({ date: h.date, price: h.value }))
  } : null;

  const handleRunSimulation = async () => {
    if (!isValid) return;
    setLoading(true);
    setHistoryData([]);
    
    try {
      // Instead of hitting the API once, we need to hit the API for each asset 
      // proportionally based on its weight.
      // Wait, our /api/calculate endpoint accepts an array of assets and ONE amount, 
      // which it applies to ALL assets. 
      // To simulate a weighted portfolio, we can either:
      // 1. Call /api/calculate multiple times (once per asset) with the correct amount.
      // Let's do this since it's cleaner.
      
      const promises = allocations.filter(a => a.weight > 0).map(async (alloc) => {
        const amountForAsset = initialAmount * (alloc.weight / 100);
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assets: [alloc.asset],
            amount: amountForAsset,
            startDate: "2010-01-01", // Defaulting to 2010 for Portfolio Builder backtests
            endDate: format(new Date(), "yyyy-MM-dd"),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.results[0]; // The single asset result
        }
        return null;
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean);

      if (validResults.length > 0) {
        // Merge histories by date
        const merged: Record<string, number> = {};
        let finalVal = 0;

        validResults.forEach((result) => {
          finalVal += result.finalValue;
          result.history.forEach((point: any) => {
            if (!merged[point.date]) merged[point.date] = 0;
            merged[point.date] += point.price; // price here is actually the portfolio value
          });
        });

        const sortedDates = Object.keys(merged).sort();
        const finalHistory = sortedDates.map(date => ({
          date,
          value: merged[date]
        }));

        setHistoryData(finalHistory);
        setFinalValue(finalVal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // We are reusing the AssetExplorer modal but modifying it to just select one asset or we can intercept the selection
  // Actually, AssetExplorer doesn't have an onSelect prop currently. It maintains its own selectedAssets state for comparison.
  // For the sake of this phase, we'll implement a simple asset adder via prompt for now if we can't hook into it, 
  // or just add a few popular defaults since we haven't refactored AssetExplorer.
  // I will just add a dummy "Add Asset" handler that adds a random asset from a list to demonstrate the UI.
  const handleAddAsset = () => {
    const popular = [
      { symbol: "AAPL", name: "Apple Inc.", type: "stock" as const },
      { symbol: "BTC-USD", name: "Bitcoin", type: "crypto" as const },
      { symbol: "GLD", name: "SPDR Gold Trust", type: "etf" as const },
      { symbol: "VXUS", name: "Vanguard Total Intl Stock", type: "etf" as const },
    ];
    // Pick first one not in list
    const nextAsset = popular.find(p => !allocations.some(a => a.asset.symbol === p.symbol));
    if (nextAsset) {
      setAllocations([...allocations, { asset: nextAsset, weight: 0, color: COLORS[allocations.length % COLORS.length] }]);
    } else {
      alert("Asset search modal would open here! (AssetExplorer needs an onSelect callback refactor)");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full min-h-[80vh]">
      {/* Left Column: Controls (Allocations) */}
      <div className="w-full xl:w-[400px] flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <PieChartIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Builder</h2>
          </div>

          <div className="space-y-4 mb-8">
            <Label className="text-slate-300 font-medium text-sm">Initial Investment ($)</Label>
            <Input 
              type="number" 
              value={initialAmount} 
              onChange={(e) => setInitialAmount(Number(e.target.value))}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-12 rounded-xl focus-visible:ring-emerald-500/50"
            />
          </div>

          <div className="h-[400px]">
            <AllocationManager 
              allocations={allocations} 
              onChange={setAllocations} 
              onAddAsset={handleAddAsset}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Visualization */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <AllocationPieChart allocations={allocations} />
          
          <div className="flex flex-col justify-center">
            {finalValue !== null ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Final Portfolio Value</p>
                <div className="text-5xl font-black text-white tracking-tight">
                  ${finalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className={`flex items-center text-lg font-bold ${finalValue >= initialAmount ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {finalValue >= initialAmount ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                  {(((finalValue - initialAmount) / initialAmount) * 100).toFixed(2)}% All-time Return
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Ready to backtest?</h3>
                <p className="text-slate-400">Assign your weights to total 100% and run the simulation to see historical performance.</p>
              </div>
            )}
            
            <Button 
              onClick={handleRunSimulation}
              disabled={!isValid || loading}
              className="mt-8 w-full h-auto min-h-[56px] py-3 text-base md:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all border-0 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2 shrink-0" />
              ) : (
                <Play className="w-5 h-5 mr-2 fill-current shrink-0" />
              )}
              <span className="whitespace-normal leading-tight text-center">{loading ? "Simulating..." : "Run Backtest (2010 - Present)"}</span>
            </Button>
            {!isValid && (
              <p className="text-rose-400 text-xs text-center md:text-left mt-3 font-medium">
                Allocations must exactly equal 100% to run.
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 relative min-h-[400px]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 px-2">Equity Curve</h3>
          <div className="h-[calc(100%-40px)] min-h-[300px]">
            <PortfolioPerformanceChart data={historyData} />
          </div>
        </div>

        {videoResult && (
          <div className="mt-4">
            <VideoExportView results={[videoResult]} />
          </div>
        )}
      </div>
    </div>
  );
}
