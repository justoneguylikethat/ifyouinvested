"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Activity, Target, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useGameEngine } from "@/lib/game/useGameEngine";

export function PlayerStatsModal() {
  const { stats, achievements } = useGameEngine();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 gap-2 h-10 px-4 rounded-xl">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline font-bold">My Stats</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] bg-[#0F172A] border-white/10 text-white p-0 gap-0 overflow-hidden max-h-[80vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-white/10 shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Player Career Stats
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto no-scrollbar flex-1 flex flex-col gap-8">
          
          {/* Top Line Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Games Played</p>
              <p className="text-2xl font-bold">{stats.gamesPlayed}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-xs text-emerald-400/80 mb-1 font-bold uppercase tracking-wider">Millionaire Wins</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.gamesWon}</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
              <p className="text-xs text-rose-400/80 mb-1 font-bold uppercase tracking-wider">Bankruptcies</p>
              <p className="text-2xl font-bold text-rose-400">{stats.gamesLost}</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <p className="text-xs text-indigo-400/80 mb-1 font-bold uppercase tracking-wider">Fastest Win</p>
              <p className="text-2xl font-bold text-indigo-400">{stats.fastestMillionaireYears ? `${stats.fastestMillionaireYears} yrs` : '-'}</p>
            </div>
          </div>

          {/* Records */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              All-Time Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-sm text-slate-400">Highest Portfolio Value</span>
                <span className="text-xl font-bold text-white">${stats.highestPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="w-16 h-16" />
                </div>
                <span className="text-sm text-slate-400">Best Investment</span>
                {stats.bestInvestment ? (
                  <div>
                    <span className="font-bold text-lg mr-2">{stats.bestInvestment.asset}</span>
                    <span className="text-emerald-400 font-bold">{(stats.bestInvestment.roi * 100).toFixed(0)}%</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">None yet</span>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingDown className="w-16 h-16" />
                </div>
                <span className="text-sm text-slate-400">Worst Investment</span>
                {stats.worstInvestment ? (
                  <div>
                    <span className="font-bold text-lg mr-2">{stats.worstInvestment.asset}</span>
                    <span className="text-rose-400 font-bold">{(stats.worstInvestment.roi * 100).toFixed(0)}%</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">None yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Achievements ({achievements.length})
            </h3>
            
            {achievements.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-slate-500">
                Play the game to unlock achievements!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map(a => (
                  <div key={a.id} className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">{a.icon}</span>
                    <span className="font-bold text-sm text-indigo-300">{a.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
