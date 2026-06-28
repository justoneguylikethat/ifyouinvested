import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, GamePhase, Difficulty, Allocation, PlayerStats, Achievement } from './game-types';

const INITIAL_CAPITAL = 10000;
const TARGET_CAPITAL = 1000000;

// The available years we can start a game from. We'll pick randomly.
const STARTING_YEARS = [1995, 1999, 2005, 2008, 2012, 2015, 2018, 2020];

const INITIAL_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  highestPortfolioValue: INITIAL_CAPITAL,
  fastestMillionaireYears: null,
  averageROI: 0,
  bestInvestment: null,
  worstInvestment: null,
};

export const useGameEngine = create<GameState>()(
  persist(
    (set, get) => ({
      // Current Game State
      phase: 'setup',
      difficulty: 'medium',
      startingCapital: INITIAL_CAPITAL,
      currentCapital: INITIAL_CAPITAL,
      currentYear: 2015,
      targetYear: 2016,
      startYear: 2015,
      allocations: [],
      
      runStartYear: 2015,
      runTotalYears: 0,
      
      // Metagame State
      stats: INITIAL_STATS,
      achievements: [],
      
      // Actions
      setPhase: (phase: GamePhase) => set({ phase }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      
      startNewGame: (difficulty: Difficulty) => {
        const randomStartYear = STARTING_YEARS[Math.floor(Math.random() * STARTING_YEARS.length)];
        // First round is usually 1-3 years
        const roundDuration = Math.floor(Math.random() * 3) + 1;
        
        set((state) => ({
          phase: 'allocation',
          difficulty,
          startingCapital: INITIAL_CAPITAL,
          currentCapital: INITIAL_CAPITAL,
          startYear: randomStartYear,
          currentYear: randomStartYear,
          targetYear: randomStartYear + roundDuration,
          runStartYear: randomStartYear,
          runTotalYears: 0,
          allocations: [],
          stats: {
            ...state.stats,
            gamesPlayed: state.stats.gamesPlayed + 1,
          }
        }));
      },
      
      generateNextRound: () => {
        const { targetYear, currentCapital } = get();
        // Next round duration: 1-4 years
        const roundDuration = Math.floor(Math.random() * 4) + 1;
        
        set({
          phase: 'allocation',
          startYear: targetYear,
          currentYear: targetYear,
          targetYear: targetYear + roundDuration,
          startingCapital: currentCapital,
          allocations: [],
        });
      },
      
      setAllocations: (allocs: Allocation[]) => set({ allocations: allocs }),
      
      processRoundResult: (finalCapital: number, assetPerformances: Record<string, number>) => {
        const { currentCapital, startYear, targetYear, runTotalYears, stats } = get();
        
        // Update stats
        let newHighest = Math.max(stats.highestPortfolioValue, finalCapital);
        let newBest = stats.bestInvestment;
        let newWorst = stats.worstInvestment;
        
        for (const [asset, roi] of Object.entries(assetPerformances)) {
          if (!newBest || roi > newBest.roi) {
            newBest = { asset, roi };
          }
          if (!newWorst || roi < newWorst.roi) {
            newWorst = { asset, roi };
          }
        }
        
        const yearsPassed = targetYear - startYear;
        const newTotalYears = runTotalYears + yearsPassed;
        
        // Check win/loss
        let phase: GamePhase = 'round-result';
        let won = false;
        let lost = false;
        
        if (finalCapital >= TARGET_CAPITAL) {
          phase = 'game-over';
          won = true;
        } else if (finalCapital <= 0 || finalCapital < 100) { // Bankrupt threshold
          phase = 'game-over';
          lost = true;
        }
        
        set((state) => ({
          phase,
          currentCapital: finalCapital,
          currentYear: targetYear,
          runTotalYears: newTotalYears,
          stats: {
            ...state.stats,
            highestPortfolioValue: newHighest,
            bestInvestment: newBest,
            worstInvestment: newWorst,
            gamesWon: state.stats.gamesWon + (won ? 1 : 0),
            gamesLost: state.stats.gamesLost + (lost ? 1 : 0),
            fastestMillionaireYears: won ? Math.min(state.stats.fastestMillionaireYears || 999, newTotalYears) : state.stats.fastestMillionaireYears,
          }
        }));
      },
      
      unlockAchievement: (id: string) => {
        set((state) => {
          if (state.achievements.find(a => a.id === id)) return state; // Already unlocked
          
          return {
            achievements: [
              ...state.achievements,
              {
                id,
                title: id.replace(/-/g, ' '),
                description: "Unlocked!", // We can embellish this later
                icon: "🏆",
                unlockedAt: new Date().toISOString()
              }
            ]
          };
        });
      },
      
      resetGame: () => {
        set({
          phase: 'setup',
          currentCapital: INITIAL_CAPITAL,
          allocations: []
        });
      }
    }),
    {
      name: 'millionaire-challenge-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ stats: state.stats, achievements: state.achievements }), // Only persist stats and achievements
    }
  )
);
