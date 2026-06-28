"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Skull } from "lucide-react";
import { Difficulty } from "@/lib/game/game-types";

export function SetupPhase() {
  const { startNewGame } = useGameEngine();

  const difficulties: { id: Difficulty; title: string; desc: string; icon: any; color: string }[] = [
    { id: 'easy', title: 'Easy', desc: 'Large-cap companies & safe ETFs only.', icon: Target, color: 'text-emerald-400' },
    { id: 'medium', title: 'Medium', desc: 'Stocks, ETFs, and major Crypto.', icon: TrendingUp, color: 'text-blue-400' },
    { id: 'hard', title: 'Hard', desc: 'Every available asset including volatile ones.', icon: Skull, color: 'text-rose-400' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
          The Millionaire Challenge
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Start with <strong className="text-white">$10,000</strong>. Navigate historical markets. Grow your portfolio to <strong className="text-emerald-400">$1,000,000</strong>.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {difficulties.map((d) => (
          <div 
            key={d.id} 
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            onClick={() => startNewGame(d.id)}
          >
            <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${d.color}`}>
              <d.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{d.title}</h3>
            <p className="text-sm text-slate-400">{d.desc}</p>
            <Button 
              className="mt-6 w-full bg-white/5 hover:bg-white/20 text-white border border-white/10"
              variant="outline"
            >
              Select {d.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
