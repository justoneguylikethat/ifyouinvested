"use client";

import { motion } from "framer-motion";
import { GameState } from "@/lib/game/game-store";
import { ArrowRight, Trophy, Skull, RefreshCw, LogOut } from "lucide-react";

interface ResultsScreenProps {
  state: GameState;
  updateState: (s: Partial<GameState>) => void;
  resetGame: (keepStats?: boolean) => void;
}

export function ResultsScreen({ state, updateState, resetGame }: ResultsScreenProps) {
  const isGameOver = state.status === "game-over";
  const isMillionaire = state.portfolioValue >= 1000000;
  const isBankrupt = state.portfolioValue <= 0;

  const handleContinue = () => {
    // Generate next end year (3 to 7 years later, max 2024)
    let nextEndYear = state.currentYear + Math.floor(Math.random() * 5) + 3;
    if (nextEndYear > 2024) nextEndYear = 2024;
    
    // If we are already at 2024, game is over, force cash out
    if (state.currentYear >= 2024) {
      handleCashOut();
      return;
    }

    updateState({
      status: "investing",
      endYear: nextEndYear,
      holdings: [], // reset holdings for next period
    });
  };

  const handleCashOut = () => {
    // End the game manually
    // Update stats
    updateState({
      status: "game-over",
      gamesPlayed: state.gamesPlayed + 1,
      highestPortfolioValue: Math.max(state.highestPortfolioValue, state.portfolioValue),
      gamesWon: isMillionaire ? state.gamesWon + 1 : state.gamesWon
    });
  };

  const handlePlayAgain = () => {
    resetGame(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        {isMillionaire ? (
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
        ) : isBankrupt ? (
          <div className="w-24 h-24 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
            <Skull className="w-12 h-12 text-red-500" />
          </div>
        ) : (
          <div className="w-24 h-24 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
            <ArrowRight className="w-12 h-12 text-blue-500" />
          </div>
        )}

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          {isMillionaire ? "YOU DID IT!" : isBankrupt ? "BANKRUPT" : `Surviving ${state.currentYear}`}
        </h2>
        <p className="text-xl text-slate-400 mb-8">
          Your portfolio is currently worth:
        </p>
        
        <p className={`text-6xl md:text-8xl font-black tracking-tighter mb-12 ${isBankrupt ? "text-red-500" : "text-emerald-400"}`}>
          ${state.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>

        {isGameOver ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                const text = isMillionaire 
                  ? `I just turned $10,000 into $${state.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} playing the Millionaire Challenge on IfYouInvested! Can you beat my score?`
                  : `I just went bankrupt playing the Millionaire Challenge on IfYouInvested 😭 Can you do better?`;
                const url = `https://ifyouinvested.online/challenge`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-black border border-white/20 text-white font-bold text-xl rounded-xl hover:bg-white/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              Share on X
            </button>
            <button 
              onClick={handlePlayAgain}
              className="w-full py-4 bg-white text-black font-black text-xl rounded-xl hover:bg-slate-200 transition-colors mt-2"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-slate-300 font-bold">Do you want to continue investing?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" /> Keep Playing
              </button>
              <button 
                onClick={handleCashOut}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" /> Cash Out
              </button>
            </div>
            {state.currentYear >= 2024 && (
              <p className="text-sm text-red-400 mt-2">You have reached the present day. You must cash out.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
