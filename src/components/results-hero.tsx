"use client";

import { InvestmentResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, DollarSign, Share2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
  const [copied, setCopied] = useState(false);

  if (!results || results.length === 0) return null;

  // Single asset mode
  if (results.length === 1) {
    const winner = results[0];
    const startYear = new Date(winner.startDate).getFullYear();
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/invest/${winner.asset.symbol.toLowerCase()}/${winner.initialInvestment}/${startYear}`
      : "";

    const handleCopy = () => {
      if (!shareUrl) return;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitter = () => {
      if (!shareUrl) return;
      const text = `An investment of $${winner.initialInvestment.toLocaleString()} in ${winner.asset.name} (${winner.asset.symbol}) in ${startYear} would be worth $${winner.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} today (${winner.percentageReturn.toFixed(0)}% return)! 🤯 Calculate yours at:`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    return (
      <div className="space-y-4">
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

        {/* Share Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Share this result</p>
              <p className="text-xs text-slate-400">Let others see how this investment performed.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#0F172A] border border-white/10 hover:border-white/20 text-white hover:bg-white/5 px-4 h-11 rounded-xl text-sm font-bold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 animate-in fade-in zoom-in-50 duration-200" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={handleTwitter}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 border border-zinc-800 text-white px-4 h-11 rounded-xl text-sm font-bold transition-all shadow-lg"
            >
              <XLogo className="w-4 h-4 text-white" />
              <span>Share on X</span>
            </button>
          </div>
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
