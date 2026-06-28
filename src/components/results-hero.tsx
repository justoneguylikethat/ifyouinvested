"use client";

import { InvestmentResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

// Helper component for counting animation
function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 1500; // 1.5s

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(value * easeProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <span>
      {prefix}
      {value >= 1000 ? count.toLocaleString(undefined, { maximumFractionDigits: 0 }) : count.toFixed(2)}
      {suffix}
    </span>
  );
}

interface ResultsHeroProps {
  results: InvestmentResult[];
}

export function ResultsHero({ results }: ResultsHeroProps) {
  if (!results || results.length === 0) return null;

  // Single asset mode
  if (results.length === 1) {
    const winner = results[0];
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* INVESTED */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-transparent border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
        >
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Invested</p>
          <div className="text-3xl md:text-4xl font-bold text-white">
            <Counter value={winner.initialInvestment} prefix="$" />
          </div>
        </motion.div>

        {/* WORTH TODAY */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-transparent border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
        >
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Worth Today</p>
          <div className="text-3xl md:text-4xl font-bold text-[#10B981]">
            <Counter value={winner.finalValue} prefix="$" />
          </div>
          <p className="text-sm font-medium text-slate-400 mt-2">{winner.asset.name}</p>
        </motion.div>

        {/* TOTAL RETURN */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-transparent border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
        >
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Total Return</p>
          <div className="text-3xl md:text-4xl font-bold text-[#10B981]">
            <Counter value={winner.percentageReturn} suffix="%" />
          </div>
          <p className="text-sm font-medium text-slate-400 mt-2">CAGR {winner.cagr.toFixed(2)}%</p>
        </motion.div>
      </div>
    );
  }

  // Multiple assets mode (Comparison)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result, index) => (
        <motion.div 
          key={result.asset.symbol}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="bg-transparent border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">{result.asset.symbol}</p>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">WORTH TODAY</p>
          </div>
          <div className={`text-3xl md:text-4xl font-bold mb-2 ${result.totalReturn >= 0 ? 'text-[#10B981]' : 'text-rose-500'}`}>
            <Counter value={result.finalValue} prefix="$" />
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-slate-400">Total Return:</span>
            <span className={result.totalReturn >= 0 ? 'text-[#10B981]' : 'text-rose-500'}>
              {result.totalReturn >= 0 ? "+" : "-"}<Counter value={Math.abs(result.percentageReturn)} suffix="%" />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
