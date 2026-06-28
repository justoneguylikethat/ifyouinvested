export type Difficulty = 'easy' | 'medium' | 'hard';

export type GamePhase = 
  | 'setup' 
  | 'allocation' 
  | 'playback' 
  | 'round-result' 
  | 'game-over';

export interface Allocation {
  assetId: string; // e.g., 'AAPL', 'BTC-USD'
  percentage: number; // 0 to 100
}

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  impact?: 'positive' | 'negative' | 'neutral';
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number; // Reached $1M
  gamesLost: number; // Went bankrupt
  highestPortfolioValue: number;
  fastestMillionaireYears: number | null;
  averageROI: number;
  bestInvestment: { asset: string; roi: number } | null;
  worstInvestment: { asset: string; roi: number } | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null; // ISO string if unlocked
}

export interface GameState {
  // Current Game State
  phase: GamePhase;
  difficulty: Difficulty;
  startingCapital: number;
  currentCapital: number;
  currentYear: number;
  targetYear: number; // The end of the current round
  startYear: number; // For the current round
  allocations: Allocation[];
  
  // Historical Game Run State
  runStartYear: number;
  runTotalYears: number;
  
  // Persistent Metagame State
  stats: PlayerStats;
  achievements: Achievement[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (diff: Difficulty) => void;
  startNewGame: (difficulty: Difficulty) => void;
  generateNextRound: () => void;
  setAllocations: (allocs: Allocation[]) => void;
  processRoundResult: (finalCapital: number, assetPerformances: Record<string, number>) => void;
  unlockAchievement: (id: string) => void;
  resetGame: () => void;
}
