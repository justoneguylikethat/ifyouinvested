"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { GameState } from "@/lib/game/game-store";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

interface FastForwardScreenProps {
  state: GameState;
  updateState: (s: Partial<GameState>) => void;
  unlockAchievement: (id: string) => boolean;
}

export function FastForwardScreen({ state, updateState, unlockAchievement }: FastForwardScreenProps) {
  const [timeline, setTimeline] = useState<{date: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayValue, setDisplayValue] = useState(state.portfolioValue);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch simulation data
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/game/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startYear: state.currentYear,
            endYear: state.endYear,
            initialCash: state.cash,
            holdings: state.holdings
          })
        });
        
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTimeline(data.timeline);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  useEffect(() => {
    if (!loading && !error && timeline.length > 0) {
      // Start animation loop
      const intervalTime = 100; // ms per frame (month)
      
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= timeline.length - 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // End of simulation for this round
            setTimeout(() => {
              const finalValue = timeline[timeline.length - 1].value;
              updateState({
                portfolioValue: finalValue,
                cash: finalValue, // They liquidate at the end of the round
                status: finalValue >= 1000000 || finalValue <= 0 ? "game-over" : "results",
                currentYear: state.endYear // update current year to end year for next round
              });
            }, 1000);
            return prev;
          }
          const nextIndex = prev + 1;
          setDisplayValue(timeline[nextIndex].value);
          return nextIndex;
        });
      }, intervalTime);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, error, timeline]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl text-slate-400">Time traveling from {state.currentYear} to {state.endYear}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl text-slate-400 mb-6">A time paradox occurred while simulating.</p>
        <button onClick={() => updateState({ status: "investing" })} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 text-white font-bold">Try Again</button>
      </div>
    );
  }

  const currentData = timeline[currentIndex] || timeline[0];
  const chartData = timeline.slice(0, currentIndex + 1);
  const currentYearDisplay = currentData.date.substring(0, 4);
  const isProfitable = displayValue >= state.cash;

  return (
    <div className="flex-1 flex flex-col p-6 w-full h-full relative z-10 overflow-hidden">
      
      {/* HUD */}
      <div className="flex justify-between items-center mb-8 relative z-20">
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
          <p className="text-sm text-slate-300 font-bold uppercase tracking-widest mb-1">Current Year</p>
          <p className="text-3xl font-black text-white">{currentYearDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Portfolio Value</p>
          <motion.p 
            key={displayValue}
            initial={{ scale: 1.1, color: isProfitable ? "#34d399" : "#f87171" }}
            animate={{ scale: 1, color: isProfitable ? "#10b981" : "#ef4444" }}
            className="text-5xl md:text-6xl font-black tabular-nums tracking-tighter"
          >
            ${displayValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </motion.p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isProfitable ? "#3b82f6" : "#ef4444"} 
              strokeWidth={4} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 z-20">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (timeline.length - 1)) * 100}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

    </div>
  );
}
