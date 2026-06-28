"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { SetupPhase } from "./phases/setup-phase";
import { AllocationPhase } from "./phases/allocation-phase";
import { PlaybackPhase } from "./phases/playback-phase";
import { RoundResultPhase } from "./phases/round-result-phase";
import { GameOverPhase } from "./phases/game-over-phase";
import { useEffect, useState } from "react";

export function GameEngineRunner() {
  const { phase } = useGameEngine();
  const [mounted, setMounted] = useState(false);

  // Fix for hydration mismatch with zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 flex items-center justify-center">Loading Engine...</div>;
  }

  return (
    <div className="flex-1 w-full h-full animate-in fade-in duration-500">
      {phase === 'setup' && <SetupPhase />}
      {phase === 'allocation' && <AllocationPhase />}
      {phase === 'playback' && <PlaybackPhase />}
      {phase === 'round-result' && <RoundResultPhase />}
      {phase === 'game-over' && <GameOverPhase />}
    </div>
  );
}
