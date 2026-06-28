"use client";

import { useGameEngine } from "@/lib/game/useGameEngine";
import { useEffect, useState } from "react";
import { LivePortfolioChart } from "../playback/live-portfolio-chart";
import { EventToast } from "../playback/event-toast";
import { getEventsForPeriod } from "@/lib/game/historical-events";
import { HistoricalEvent } from "@/lib/game/game-types";

export function PlaybackPhase() {
  const { currentYear, targetYear, startingCapital, processRoundResult } = useGameEngine();
  const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);
  
  // Calculate mock result and mock end capital immediately for the animation
  // In a real app we'd fetch actual historical data
  const [endCapital] = useState(() => startingCapital * (1 + (Math.random() * 1.5 - 0.2))); // -20% to +130%
  const [displayYear, setDisplayYear] = useState(currentYear);

  useEffect(() => {
    const yearsToSimulate = targetYear - currentYear;
    const events = getEventsForPeriod(currentYear, targetYear);
    
    // Simulate year progression
    let year = currentYear;
    const yearInterval = setInterval(() => {
      year++;
      if (year <= targetYear) {
        setDisplayYear(year);
        // Check for events in this year
        const yearEvents = events.filter(e => e.date.startsWith(year.toString()));
        if (yearEvents.length > 0) {
          setCurrentEvent(yearEvents[0]);
          setTimeout(() => setCurrentEvent(null), 2500); // hide event after 2.5s
        }
      }
    }, 3000 / yearsToSimulate); // Spread over 3 seconds

    // Finish playback after 3 seconds
    const timer = setTimeout(() => {
      clearInterval(yearInterval);
      const mockAssetPerformances = {
        'AAPL': 0.25,
        'BTC-USD': 0.50,
      };
      processRoundResult(endCapital, mockAssetPerformances);
    }, 3200);
    
    return () => {
      clearTimeout(timer);
      clearInterval(yearInterval);
    };
  }, [currentYear, targetYear, startingCapital, endCapital, processRoundResult]);

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-8 items-center justify-center relative">
      <div className="text-center mb-8 animate-pulse">
        <h2 className="text-4xl font-bold text-white mb-2">Fast Forwarding...</h2>
        <p className="text-2xl font-mono text-indigo-400">{displayYear}</p>
      </div>

      <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
        <LivePortfolioChart 
          startYear={currentYear} 
          endYear={targetYear} 
          startCapital={startingCapital} 
          endCapital={endCapital} 
        />
      </div>

      <EventToast event={currentEvent} onDismiss={() => setCurrentEvent(null)} />
    </div>
  );
}
