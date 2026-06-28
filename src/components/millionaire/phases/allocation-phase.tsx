"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { Button } from "@/components/ui/button";
import { AllocationBuilder } from "../allocation/allocation-builder";
import { useState } from "react";
import { Allocation } from "@/lib/game/game-types";

export function AllocationPhase() {
  const { currentYear, targetYear, startingCapital, setPhase, setAllocations } = useGameEngine();
  const [isValid, setIsValid] = useState(false);
  const [currentAllocs, setCurrentAllocs] = useState<Allocation[]>([]);

  const handleReady = (allocs: Allocation[]) => {
    setCurrentAllocs(allocs);
    setIsValid(allocs.reduce((sum, a) => sum + a.percentage, 0) === 100);
  };

  const handleStartPlayback = () => {
    setAllocations(currentAllocs);
    setPhase('playback');
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Year {currentYear}</h2>
        <p className="text-slate-400">
          You have <strong className="text-white">${startingCapital.toLocaleString()}</strong> to invest for the next {targetYear - currentYear} years.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex-1 flex flex-col">
        <AllocationBuilder onReady={handleReady} />
        
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={handleStartPlayback} 
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 h-14 text-lg font-bold w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fast Forward to {targetYear}
          </Button>
        </div>
      </div>
    </div>
  );
}
