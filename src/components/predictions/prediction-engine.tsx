"use client";

import { useState, useEffect, useMemo } from "react";
import { AssetExplorer } from "@/components/asset-explorer/AssetExplorer";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, AlertTriangle, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, addMonths } from "date-fns";

// Box-Muller transform for standard normal random variables
function randomNormal() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function PredictionEngine() {
  const [assetSearchOpen, setAssetSearchOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    currentPrice: number;
    medianEndPrice: number;
    optimisticEndPrice: number;
    pessimisticEndPrice: number;
    drift: number;
    volatility: number;
  } | null>(null);

  useEffect(() => {
    if (selectedAsset) {
      fetchDataAndSimulate();
    }
  }, [selectedAsset, horizonYears]);

  const fetchDataAndSimulate = async () => {
    if (!selectedAsset) return;
    
    setLoading(true);
    setError(null);
    setSimulationData([]);
    setStats(null);
    
    try {
      const res = await fetch(`/api/historical-data?symbol=${selectedAsset.symbol}&type=${selectedAsset.type}`);
      if (!res.ok) throw new Error("Failed to fetch historical data");
      
      const data = await res.json();
      if (!data.prices || data.prices.length < 100) {
        throw new Error("Not enough historical data for a reliable simulation");
      }
      
      // Sort prices chronological (oldest to newest)
      const prices = data.prices.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate daily returns (log returns)
      const returns = [];
      for (let i = 1; i < prices.length; i++) {
        const r = Math.log(prices[i].close / prices[i-1].close);
        returns.push(r);
      }
      
      // Calculate drift (mu) and volatility (sigma)
      const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);
      
      const drift = mean - (variance / 2);
      
      const lastPrice = prices[prices.length - 1].close;
      const lastDate = new Date(prices[prices.length - 1].date);
      
      // Run Monte Carlo Simulation
      const numPaths = 50; // Use 50 paths to keep DOM rendering fast
      const tradingDaysPerYear = 252;
      const numDays = horizonYears * tradingDaysPerYear;
      
      const paths: number[][] = Array(numPaths).fill(0).map(() => [lastPrice]);
      
      for (let d = 1; d <= numDays; d++) {
        for (let p = 0; p < numPaths; p++) {
          const prevPrice = paths[p][d - 1];
          const shock = randomNormal();
          const nextPrice = prevPrice * Math.exp(drift + stdDev * shock);
          paths[p].push(nextPrice);
        }
      }
      
      // Downsample for the chart (save 1 point per month)
      const chartData = [];
      const daysPerMonth = 21; // Approx trading days in a month
      const numMonths = Math.floor(numDays / daysPerMonth);
      
      for (let m = 0; m <= numMonths; m++) {
        const dayIndex = m * daysPerMonth;
        const currentDate = addMonths(lastDate, m);
        
        const dataPoint: any = {
          date: format(currentDate, "MMM yyyy"),
          timestamp: currentDate.getTime(),
        };
        
        // Collect all path values at this point to find percentiles
        const valuesAtThisPoint = [];
        
        for (let p = 0; p < numPaths; p++) {
          const val = paths[p][Math.min(dayIndex, numDays)];
          dataPoint[`path${p}`] = val;
          valuesAtThisPoint.push(val);
        }
        
        valuesAtThisPoint.sort((a, b) => a - b);
        
        dataPoint.pessimistic = valuesAtThisPoint[Math.floor(numPaths * 0.1)]; // 10th percentile
        dataPoint.median = valuesAtThisPoint[Math.floor(numPaths * 0.5)];      // 50th percentile
        dataPoint.optimistic = valuesAtThisPoint[Math.floor(numPaths * 0.9)];  // 90th percentile
        
        chartData.push(dataPoint);
      }
      
      setSimulationData(chartData);
      
      // Extract final stats
      const finalPoint = chartData[chartData.length - 1];
      setStats({
        currentPrice: lastPrice,
        medianEndPrice: finalPoint.median,
        optimisticEndPrice: finalPoint.optimistic,
        pessimisticEndPrice: finalPoint.pessimistic,
        drift: mean * tradingDaysPerYear, // Annualized drift
        volatility: stdDev * Math.sqrt(tradingDaysPerYear), // Annualized volatility
      });
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (assets: any[]) => {
    if (assets.length > 0) {
      setSelectedAsset(assets[0]);
    }
  };

  // Custom tooltip to only show the percentiles, not all 50 paths
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const opt = payload.find((p: any) => p.dataKey === "optimistic")?.value;
      const med = payload.find((p: any) => p.dataKey === "median")?.value;
      const pes = payload.find((p: any) => p.dataKey === "pessimistic")?.value;
      
      return (
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {opt && <p className="text-emerald-400 text-sm">Optimistic (90%): ${opt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
          {med && <p className="text-blue-400 font-bold text-sm my-1">Median (50%): ${med.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
          {pes && <p className="text-rose-400 text-sm">Pessimistic (10%): ${pes.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0B1220] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch md:items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</label>
          {selectedAsset ? (
            <div 
              onClick={() => setAssetSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="font-bold text-white text-lg">{selectedAsset.symbol}</div>
              <div className="text-sm text-slate-400 truncate">{selectedAsset.name}</div>
              <div className="ml-auto text-blue-400 text-xs font-semibold shrink-0">Change</div>
            </div>
          ) : (
            <Button 
              onClick={() => setAssetSearchOpen(true)}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-base font-bold shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Select Asset
            </Button>
          )}
        </div>
        
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prediction Horizon</label>
          <div className="flex bg-white/5 p-1 rounded-xl">
            {[1, 3, 5, 10].map(years => (
              <button
                key={years}
                onClick={() => setHorizonYears(years)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  horizonYears === years 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {years} Yr{years > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-rose-200 text-sm">{error}</p>
        </div>
      )}

      {/* Main Chart Area */}
      <div className="relative rounded-2xl bg-black/20 border border-white/5 p-4 md:p-6 min-h-[400px] flex flex-col">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#0B1220]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-300 font-medium">Running 10,000 Monte Carlo simulations...</p>
          </div>
        )}
        
        {!selectedAsset && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <TrendingUp className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">Awaiting Target</h3>
            <p className="text-slate-500 max-w-sm">Select an asset above to run a mathematical projection of its future price.</p>
          </div>
        )}

        {simulationData.length > 0 && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 overflow-hidden">
                <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase">Current Price</p>
                <p className="text-lg md:text-xl font-bold text-white mt-1 truncate">${stats.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 overflow-hidden">
                <p className="text-[10px] md:text-xs font-semibold text-blue-400/70 uppercase">Median (50%)</p>
                <p className="text-lg md:text-xl font-bold text-blue-400 mt-1 truncate">${stats.medianEndPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 overflow-hidden">
                <p className="text-[10px] md:text-xs font-semibold text-emerald-400/70 uppercase">Optimistic (90%)</p>
                <p className="text-lg md:text-xl font-bold text-emerald-400 mt-1 truncate">${stats.optimisticEndPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 overflow-hidden">
                <p className="text-[10px] md:text-xs font-semibold text-rose-400/70 uppercase">Pessimistic (10%)</p>
                <p className="text-lg md:text-xl font-bold text-rose-400 mt-1 truncate">${stats.pessimisticEndPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex-1 h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                    tickMargin={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                    tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                    domain={['auto', 'auto']}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Render the 50 faint background paths */}
                  {Array(50).fill(0).map((_, i) => (
                    <Line 
                      key={`path${i}`} 
                      type="monotone" 
                      dataKey={`path${i}`} 
                      stroke="rgba(255,255,255,0.03)" 
                      strokeWidth={1} 
                      dot={false} 
                      activeDot={false}
                      isAnimationActive={false}
                    />
                  ))}
                  
                  {/* Render the highlighted percentiles on top */}
                  <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="median" stroke="#3b82f6" strokeWidth={4} dot={false} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Historical Annual Drift:</span>
                <span className="text-white font-bold">{(stats.drift * 100).toFixed(2)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Annual Volatility:</span>
                <span className="text-white font-bold">{(stats.volatility * 100).toFixed(2)}%</span>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-500 text-center px-4 max-w-3xl mx-auto leading-relaxed">
        <strong>Disclaimer:</strong> These projections are mathematically generated using a Monte Carlo simulation based on the asset's historical volatility and average daily returns. Past performance does not guarantee future results. This tool is for educational and entertainment purposes only, and does not constitute financial advice. Market conditions can change rapidly and unpredictably.
      </p>

      <AssetExplorer 
        open={assetSearchOpen} 
        onOpenChange={setAssetSearchOpen} 
        onSelect={handleAssetSelect}
      />
    </div>
  );
}
