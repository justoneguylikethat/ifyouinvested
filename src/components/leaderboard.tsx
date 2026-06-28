"use client";

import { InvestmentResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface LeaderboardProps {
  results: InvestmentResult[];
}

export function Leaderboard({ results }: LeaderboardProps) {
  if (!results || results.length === 0) return null;

  const sorted = [...results].sort((a, b) => b.finalValue - a.finalValue);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
              <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Final Value</th>
              <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Return</th>
              <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">CAGR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((result, index) => {
              const isPositive = result.totalReturn >= 0;
              
              const getAssetColor = (symbol: string) => {
                if (symbol === 'BTC') return 'bg-[#F59E0B]';
                if (symbol === 'AAPL') return 'bg-[#64748B]';
                if (symbol === 'SPY') return 'bg-[#3B82F6]';
                if (symbol === 'MSFT') return 'bg-[#10B981]';
                if (symbol === 'NVDA') return 'bg-[#84CC16]';
                if (symbol === 'TSLA') return 'bg-[#EF4444]';
                if (symbol === 'AMZN') return 'bg-[#F97316]';
                if (symbol === 'GOOGL') return 'bg-[#3B82F6]';
                if (symbol === 'META') return 'bg-[#0EA5E9]';
                const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500'];
                return colors[symbol.length % colors.length];
              };

              return (
                <tr key={result.asset.symbol} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4 text-sm text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white ${getAssetColor(result.asset.symbol)}`}>
                        {result.asset.symbol.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {result.asset.name}
                          {index === 0 && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{result.asset.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-white">
                    {formatCurrency(result.finalValue)}
                  </td>
                  <td className={`py-4 px-4 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{result.percentageReturn.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-blue-400">
                    {result.cagr.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
