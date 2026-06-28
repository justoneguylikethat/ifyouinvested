"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { Button } from "@/components/ui/button";
import { Trophy, Skull, RotateCcw } from "lucide-react";

export function GameOverPhase() {
  const { currentCapital, resetGame, stats } = useGameEngine();
  const won = currentCapital >= 1000000;

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-12 text-center">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto ${won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
        {won ? <Trophy className="w-12 h-12" /> : <Skull className="w-12 h-12" />}
      </div>
      
      <h1 className="text-5xl font-black text-white mb-4">
        {won ? 'You are a Millionaire!' : 'Bankrupt!'}
      </h1>
      
      <p className="text-xl text-slate-400 mb-12">
        {won 
          ? `You successfully navigated the historical markets and reached $${currentCapital.toLocaleString(undefined, { maximumFractionDigits: 0 })}.` 
          : `The markets were unforgiving. Your portfolio dropped to $${currentCapital.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full mb-12">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Highest Portfolio</p>
          <p className="text-2xl font-bold text-white">${stats.highestPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total Games Played</p>
          <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
        </div>
      </div>

      <Button onClick={resetGame} className="bg-white text-black hover:bg-slate-200 px-8 h-14 text-lg font-bold rounded-xl">
        <RotateCcw className="w-5 h-5 ml-2 mr-2" />
        Play Again
      </Button>
    </div>
  );
}
