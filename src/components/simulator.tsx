"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorForm } from "@/components/calculator-form";
import { GrowthChart } from "@/components/growth-chart";
import { ResultsDisplay } from "@/components/results-display";
import { ResultsHero } from "@/components/results-hero";
import { Leaderboard } from "@/components/leaderboard";
import { VideoExportView } from "@/components/video-export";
import { AssetType, InvestmentResult } from "@/lib/types";
import { BrainCircuit, AlertCircle, TrendingUp } from "lucide-react";

export interface SimulatorProps {
  title: ReactNode;
  subtitle: ReactNode;
  assetFilter?: AssetType | AssetType[];
  initialResults?: InvestmentResult[];
  defaultDaysAgo?: number;
  mode?: 'standard' | 'memecoin';
}

export function Simulator({ title, subtitle, assetFilter, initialResults, defaultDaysAgo, mode }: SimulatorProps) {
  const [results, setResults] = useState<InvestmentResult[]>(initialResults || []);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.error || 'Something went wrong');
      }

      setResults(json.results);
      setAiInsights(json.aiInsights);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Calculator */}
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
            <div className="sticky top-8">
              <CalculatorForm 
                onCalculate={handleCalculate} 
                isLoading={isLoading} 
                assetFilter={assetFilter} 
                defaultDaysAgo={defaultDaysAgo}
                mode={mode}
              />
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right Column: Results Area */}
          <div className="flex-1 min-w-0 min-h-[600px]">
            {results.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* 1. The Big Reveal */}
                <ResultsHero results={results} />
                
                {/* 2. The Chart */}
                <GrowthChart results={results} />
                  
                {/* 3. The Leaderboard */}
                <Leaderboard results={results} />

                {/* 4. Individual Asset Breakdowns */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Asset Breakdown</h3>
                  <ResultsDisplay results={results} />
                </div>

                {/* AI Insights */}
                {aiInsights && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0B1220] border border-white/5 rounded-2xl p-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <BrainCircuit className="w-32 h-32 text-indigo-400" />
                    </div>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-indigo-400 mb-4 relative z-10">
                      <BrainCircuit className="w-6 h-6" /> AI Analysis
                    </h3>
                    <div className="prose prose-invert prose-lg max-w-none relative z-10 text-slate-300">
                      {aiInsights}
                    </div>
                  </motion.div>
                )}

                {/* 5. Share/Export */}
                <div className="pt-8 border-t border-white/5">
                  <VideoExportView results={results} />
                </div>

              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 py-24 border-2 border-dashed border-white/5 rounded-3xl bg-[#0B1220]">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-2">Ready to run the numbers?</h3>
                <p className="text-slate-500 max-w-sm">
                  Configure your hypothetical investment on the left and hit calculate to see how it would have performed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
