"use client";

import { useGameState } from "@/lib/game/game-store";
import { StartScreen } from "./start-screen";
import { InvestingScreen } from "./investing-screen";
import { FastForwardScreen } from "./fast-forward-screen";
import { ResultsScreen } from "./results-screen";
import { Loader2 } from "lucide-react";

export function GameBoard() {
  const { state, isLoaded, updateState, resetGame, unlockAchievement } = useGameState();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative w-full h-full min-h-[600px]">
      {state.status === "start" && (
        <StartScreen state={state} updateState={updateState} resetGame={resetGame} />
      )}
      
      {state.status === "investing" && (
        <InvestingScreen state={state} updateState={updateState} />
      )}
      
      {state.status === "fast-forward" && (
        <FastForwardScreen state={state} updateState={updateState} unlockAchievement={unlockAchievement} />
      )}
      
      {(state.status === "results" || state.status === "game-over") && (
        <ResultsScreen state={state} updateState={updateState} resetGame={resetGame} />
      )}
    </div>
  );
}
