"use client";

import { useState, useEffect } from "react";
import { Bot, Cpu, Gauge, LineChart, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiInsightsCore() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setProgress(0);
    
    // Simulate complex analysis
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalyzed(true);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] max-w-6xl mx-auto">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 text-blue-400 rounded-2xl mb-4">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">AI Market Analyst</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Our deep learning models synthesize millions of data points to generate actionable insights for your portfolio.
        </p>
      </div>

      {!analyzed && (
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl max-w-2xl mx-auto w-full text-center">
          <Cpu className={`w-16 h-16 text-blue-400 mx-auto mb-6 ${analyzing ? 'animate-pulse' : ''}`} />
          <h3 className="text-2xl font-bold text-white mb-2">
            {analyzing ? "Synthesizing Market Data..." : "Ready for Analysis"}
          </h3>
          <p className="text-slate-400 mb-8">
            {analyzing 
              ? "Scanning news feeds, earnings transcripts, and price action." 
              : "Click below to generate a real-time AI report on current market conditions."}
          </p>
          
          {analyzing ? (
            <div className="w-full bg-[#0B1220] rounded-full h-4 mb-4 overflow-hidden border border-white/10">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          ) : (
            <Button 
              onClick={runAnalysis}
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all border-0"
            >
              Run AI Analysis
            </Button>
          )}
        </div>
      )}

      {analyzed && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Insight */}
          <div className="md:col-span-8 bg-gradient-to-br from-blue-900/40 to-[#0B1220] border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
            </div>
            
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed relative z-10">
              <p>
                The market is currently exhibiting a <span className="text-emerald-400 font-bold">bullish divergence</span>, with tech sectors showing unusual resilience despite macroeconomic headwinds.
              </p>
              <p>
                Our models detect a 78% probability of a near-term rotation out of cyclical stocks and into defensive mega-cap technology over the next 14 trading days. Retail sentiment remains cautiously optimistic.
              </p>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-6 flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-emerald-400 font-bold mb-1">AI Recommendation</h4>
                  <p className="text-sm">Consider increasing exposure to semiconductor and cloud infrastructure assets while hedging with short-duration treasuries.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fear & Greed */}
          <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-slate-300 mb-6 w-full text-left">Market Sentiment</h3>
            <div className="relative w-40 h-40 mb-6">
              <svg viewBox="0 0 100 50" className="overflow-visible">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 75 25" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 flex flex-col items-center">
                <span className="text-4xl font-black text-white">72</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mt-1">Greed</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Momentum indicators are accelerating, pushing sentiment firmly into the Greed zone.
            </p>
          </div>

          {/* Sector Analysis */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Technology</h4>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">Strong Buy</span>
              </div>
              <p className="text-sm text-slate-400">AI-driven productivity gains are expanding margins across the software sub-sector faster than consensus estimates.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Energy</h4>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">Sell</span>
              </div>
              <p className="text-sm text-slate-400">Supply gluts and slowing global manufacturing demand indicate continued downward pressure on crude prices.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Healthcare</h4>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">Hold</span>
              </div>
              <p className="text-sm text-slate-400">Regulatory uncertainty is balancing out strong pipelines in biotech. Awaiting clarity on Q3 policy changes.</p>
            </div>
          </div>
          
          <div className="md:col-span-12 text-center mt-4">
            <Button variant="outline" onClick={() => setAnalyzed(false)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Run New Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
