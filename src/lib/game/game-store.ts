import { useState, useEffect } from 'react';

// Game Types
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'start' | 'investing' | 'fast-forward' | 'results' | 'game-over';

export interface GameAsset {
  symbol: string;
  name: string;
  weight: number; // 0 to 100
}

export interface GameState {
  status: GameStatus;
  difficulty: GameDifficulty;
  currentYear: number;
  endYear: number;
  cash: number;
  portfolioValue: number;
  targetValue: number;
  holdings: GameAsset[];
  // Stats
  gamesPlayed: number;
  gamesWon: number;
  highestPortfolioValue: number;
  fastestMillionaireYears: number | null;
  achievements: string[];
}

const DEFAULT_STATE: GameState = {
  status: 'start',
  difficulty: 'medium',
  currentYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  cash: 10000,
  portfolioValue: 10000,
  targetValue: 1000000,
  holdings: [],
  gamesPlayed: 0,
  gamesWon: 0,
  highestPortfolioValue: 10000,
  fastestMillionaireYears: null,
  achievements: [],
};

const STORAGE_KEY = 'invested_millionaire_challenge_state';

export function useGameState() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...DEFAULT_STATE, ...parsed });
      } catch (e) {
        console.error("Failed to parse game state");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = (keepStats = true) => {
    setState(prev => ({
      ...DEFAULT_STATE,
      ...(keepStats ? {
        gamesPlayed: prev.gamesPlayed,
        gamesWon: prev.gamesWon,
        highestPortfolioValue: prev.highestPortfolioValue,
        fastestMillionaireYears: prev.fastestMillionaireYears,
        achievements: prev.achievements,
      } : {})
    }));
  };

  const unlockAchievement = (id: string) => {
    if (!state.achievements.includes(id)) {
      updateState({ achievements: [...state.achievements, id] });
      return true; // Newly unlocked
    }
    return false;
  };

  return {
    state,
    isLoaded,
    updateState,
    resetGame,
    unlockAchievement
  };
}
