"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export function RoundResultPhase() {
  const { currentYear, currentCapital, startingCapital, generateNextRound } = useGameEngine();
  
  const profit = currentCapital - startingCapital;
  const roi = (profit / startingCapital) * 100;
  const isPositive = profit >= 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-12">
      <h2 className="text-3xl font-bold text-white mb-8">Year {currentYear} Results</h2>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full flex flex-col items-center mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-full ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
          </div>
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Portfolio Value</p>
            <p className="text-4xl font-bold text-white">${currentCapital.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
        
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/10 w-full justify-center">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Profit/Loss</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">ROI</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{roi.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 mb-8 text-indigo-200">
        <h4 className="font-bold text-indigo-400 mb-2">Historical Insight</h4>
        <p className="text-sm leading-relaxed">
          [Educational insight about why the market moved this way during this period will go here.]
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={generateNextRound} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg">
          Continue to Next Round
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
