"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Asset } from "@/lib/types";
import { POPULAR_ASSETS } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coffee, Flame, Utensils, Car, Tv, HeartPulse, RefreshCw } from "lucide-react";
import { InvestmentResult } from "@/lib/types";
import { VideoExportView } from "../video-export";
import { AssetSelect } from "@/components/asset-select";

interface Habit {
  id: string;
  name: string;
  icon: any;
  defaultAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  color: string;
}

const HABITS: Habit[] = [
  { id: "coffee", name: "Daily Coffee", icon: Coffee, defaultAmount: 5, frequency: "daily", color: "bg-amber-900/50 text-amber-500 border-amber-500/50" },
  { id: "smoke", name: "Smoking", icon: Flame, defaultAmount: 10, frequency: "daily", color: "bg-slate-800 text-slate-400 border-slate-500/50" },
  { id: "dining", name: "Dining Out", icon: Utensils, defaultAmount: 150, frequency: "weekly", color: "bg-rose-900/50 text-rose-500 border-rose-500/50" },
  { id: "car", name: "Car Payment", icon: Car, defaultAmount: 600, frequency: "monthly", color: "bg-blue-900/50 text-blue-400 border-blue-500/50" },
  { id: "streaming", name: "Streaming Subs", icon: Tv, defaultAmount: 40, frequency: "monthly", color: "bg-purple-900/50 text-purple-400 border-purple-500/50" },
  { id: "gym", name: "Unused Gym", icon: HeartPulse, defaultAmount: 60, frequency: "monthly", color: "bg-emerald-900/50 text-emerald-400 border-emerald-500/50" },
];

export function LifestyleCore() {
  const [selectedHabit, setSelectedHabit] = useState<Habit>(HABITS[0]);
  const [customAmount, setCustomAmount] = useState<number>(HABITS[0].defaultAmount);
  const [asset, setAsset] = useState<Asset>(POPULAR_ASSETS.find(a => a.symbol === "AAPL") || POPULAR_ASSETS[0]);
  const [years, setYears] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    totalSpent: number;
    portfolioValue: number;
    difference: number;
    videoData: InvestmentResult[];
  } | null>(null);

  const handleHabitSelect = (habit: Habit) => {
    setSelectedHabit(habit);
    setCustomAmount(habit.defaultAmount);
  };

  const handleCalculate = async () => {
    setLoading(true);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - years);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets: [asset],
          amount: 1, 
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const historyData = data.results[0]?.history;
        if (historyData && historyData.length > 0) {
          
          let totalSpent = 0;
          let totalShares = 0;
          const portfolioHistory: { date: string; price: number }[] = [];
          
          const intervalDays = selectedHabit.frequency === "daily" ? 1 : selectedHabit.frequency === "weekly" ? 7 : 30;
          let daysSinceLastInvestment = intervalDays;
          let lastDate = new Date(historyData[0].date);

          for (let i = 0; i < historyData.length; i++) {
            const point = historyData[i];
            const currentDate = new Date(point.date);
            const daysPassed = Math.abs(differenceInDays(currentDate, lastDate));
            daysSinceLastInvestment += daysPassed;
            
            if (daysSinceLastInvestment >= intervalDays) {
              totalSpent += customAmount;
              totalShares += customAmount / point.price;
              daysSinceLastInvestment = 0;
            }
            lastDate = currentDate;

            portfolioHistory.push({
               date: point.date,
               price: totalShares > 0 ? (totalShares * point.price) : 0
            });
          }

          const finalValue = totalShares * historyData[historyData.length - 1].price;
          const cagr = ((finalValue / Math.max(1, totalSpent)) ** (1 / years) - 1) * 100;
          
          const videoData: InvestmentResult[] = [{
             asset: { ...asset, name: `${selectedHabit.name} in ${asset.symbol}` },
             initialInvestment: totalSpent,
             startValue: historyData[0].price,
             finalValue: finalValue,
             sharesPurchased: totalShares,
             totalReturn: finalValue - totalSpent,
             percentageReturn: totalSpent > 0 ? ((finalValue - totalSpent) / totalSpent) * 100 : 0,
             cagr: isNaN(cagr) ? 0 : cagr,
             history: portfolioHistory
          }];
          
          setResults({
            totalSpent,
            portfolioValue: finalValue,
            difference: finalValue - totalSpent,
            videoData
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
    <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">The Opportunity Cost</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Everyday habits add up. See what you could have built if you invested that money instead.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {HABITS.map(habit => (
          <button
            key={habit.id}
            onClick={() => handleHabitSelect(habit)}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
              selectedHabit.id === habit.id 
                ? `${habit.color} scale-105 shadow-xl` 
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
            }`}
          >
            <habit.icon className="w-8 h-8 mb-3" />
            <span className="font-bold">{habit.name}</span>
            <span className="text-sm opacity-80 mt-1">${habit.defaultAmount} / {habit.frequency}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md mt-4 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Amount Spent</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={customAmount} 
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Alternative Asset</Label>
            <AssetSelect 
              value={asset.symbol}
              onValueChange={(symbol) => {
                const found = POPULAR_ASSETS.find(a => a.symbol === symbol);
                if (found) setAsset(found);
              }}
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Time Period</Label>
            <select 
              className="w-full bg-[#0B1220] border border-white/10 text-white font-bold text-lg h-14 rounded-xl px-4 focus:outline-none"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            >
              <option value={1}>Last 1 Year</option>
              <option value={3}>Last 3 Years</option>
              <option value={5}>Last 5 Years</option>
              <option value={10}>Last 10 Years</option>
            </select>
          </div>
        </div>

        <Button 
          onClick={handleCalculate}
          disabled={loading}
          className="w-full h-14 md:h-16 flex items-center justify-center gap-2 text-base md:text-xl font-bold text-white rounded-2xl shadow-lg transition-all border-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 px-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
          )}
          <span className="whitespace-nowrap">{loading ? "Calculating..." : "Reveal Opportunity Cost"}</span>
        </Button>

        {results && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <selectedHabit.icon className="w-64 h-64" />
              </div>
              
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-2 relative z-10">
                If you had invested your <span className="text-white font-bold">{selectedHabit.name.toLowerCase()}</span> money into <span className="text-white font-bold">{asset.symbol}</span> for {years} years...
              </p>
              
              <h3 className="text-4xl md:text-6xl font-black text-emerald-400 my-6 relative z-10 tracking-tighter">
                You'd have ${results.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              
              <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-medium relative z-10 mt-8">
                <div className="bg-white/5 px-6 py-4 rounded-xl border border-white/10">
                  <span className="text-slate-500 block mb-1">Total Spent on Habit</span>
                  <span className="text-white text-2xl font-bold">${results.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="bg-white/5 px-6 py-4 rounded-xl border border-white/10">
                  <span className="text-slate-500 block mb-1">Missed Profit</span>
                  <span className="text-emerald-400 text-2xl font-bold">+${results.difference.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <VideoExportView results={results.videoData} mode="lifestyle" />
          </div>
        )}
      </div>
    </div>
  );
}
