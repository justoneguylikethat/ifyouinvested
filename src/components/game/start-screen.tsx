"use client";

import { motion } from "framer-motion";
import { GameState } from "@/lib/game/game-store";
import { Play, Trophy, TrendingUp, Target, RefreshCw } from "lucide-react";

interface StartScreenProps {
  state: GameState;
  updateState: (s: Partial<GameState>) => void;
  resetGame: (keepStats?: boolean) => void;
}

const STARTING_YEARS = [1985, 1992, 1999, 2008, 2012, 2018, 2020];

export function StartScreen({ state, updateState, resetGame }: StartScreenProps) {
  const handleStart = () => {
    // Generate random scenario
    const startYear = STARTING_YEARS[Math.floor(Math.random() * STARTING_YEARS.length)];
    // End year is between 3 to 10 years later, but capped at 2024
    let endYear = startYear + Math.floor(Math.random() * 7) + 3;
    if (endYear > 2024) endYear = 2024;

    resetGame(true); // reset current run but keep stats
    
    updateState({
      status: "investing",
      currentYear: startYear,
      endYear: endYear,
      cash: 10000,
      portfolioValue: 10000,
      holdings: [],
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <Target className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          The Millionaire Challenge
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          Can you turn <strong className="text-emerald-400">$10,000</strong> into <strong className="text-emerald-400">$1,000,000</strong> using real historical market data?
        </p>

        <button 
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-xl rounded-2xl overflow-hidden transition-transform hover:scale-105 active:scale-95 mb-16"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Play className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
          <span className="relative z-10 group-hover:text-white transition-colors">Start the Challenge</span>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 text-slate-500 mb-2" />
            <p className="text-sm text-slate-400 font-bold mb-1">Games Played</p>
            <p className="text-2xl font-black text-white">{state.gamesPlayed}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-sm text-slate-400 font-bold mb-1">Games Won</p>
            <p className="text-2xl font-black text-white">{state.gamesWon}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
            <p className="text-sm text-slate-400 font-bold mb-1">High Score</p>
            <p className="text-xl font-black text-white">
              ${state.highestPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <Target className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-sm text-slate-400 font-bold mb-1">Badges</p>
            <p className="text-2xl font-black text-white">{state.achievements.length}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
