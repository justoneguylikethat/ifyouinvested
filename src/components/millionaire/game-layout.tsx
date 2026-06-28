"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { useGameEngine } from "@/lib/game/useGameEngine";
import { PlayerStatsModal } from "./metagame/player-stats-modal";

export function GameLayout({ children }: { children: ReactNode }) {
  const { currentCapital, stats } = useGameEngine();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Game Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Game</span>
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-lg hidden sm:block tracking-tight">Millionaire Challenge</h1>
          </div>
        </div>

        {/* Live Game Stats in Header */}
        <div className="flex items-center gap-4 md:gap-8">
          <PlayerStatsModal />
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Portfolio</span>
            <span className={`text-lg md:text-xl font-bold tracking-tight ${currentCapital >= 1000000 ? 'text-emerald-400' : 'text-white'}`}>
              ${currentCapital.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] pointer-events-none" />
        
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative z-10 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
