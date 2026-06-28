"use client";

import { InvestmentResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react";

export function ResultsDisplay({ results }: { results: InvestmentResult[] }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, i) => {
        const isPositive = result.totalReturn >= 0;

        return (
          <motion.div 
            key={result.asset.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors relative overflow-hidden group"
          >
            {/* Soft glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B1220] border border-white/10 flex items-center justify-center shadow-inner">
                    <span className="font-bold text-lg text-white">{result.asset.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">{result.asset.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400 font-semibold">{result.asset.symbol}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                        {result.asset.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Final Value</p>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(result.finalValue)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-white/5">
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">Profit</p>
                    <p className={`font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-destructive'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {isPositive ? "+" : "-"}{formatCurrency(Math.abs(Number(result.totalReturn)))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">ROI</p>
                    <p className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-destructive'}`}>
                      {isPositive ? '+' : '-'}{Math.abs(Number(result.percentageReturn)).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">CAGR</p>
                    <p className={`font-semibold ${Number(result.cagr) >= 0 ? 'text-blue-400' : 'text-destructive'}`}>
                      {Number(result.cagr) >= 0 ? '+' : '-'}{Math.abs(Number(result.cagr)).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CircleDollarSign className="w-4 h-4 opacity-50" />
                  <span>Bought {result.sharesPurchased.toFixed(4)} shares at {formatCurrency(result.startValue)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
