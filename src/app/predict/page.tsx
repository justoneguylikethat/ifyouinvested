import { Metadata } from "next";
import { PredictionEngine } from "@/components/predictions/prediction-engine";
import { ArrowLeft, Bot, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Future Price Predictions | IfYouInvested.online",
  description: "Use our Monte Carlo simulation engine to project potential future prices for stocks, crypto, and ETFs based on historical volatility and drift.",
};

export default function PredictPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI & Math Modeling</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Predictions</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Select an asset to project its potential future price. We use a mathematical <strong className="text-slate-200">Monte Carlo Simulation</strong> that runs 100 randomized paths based on the asset's historical volatility and average daily returns.
          </p>
        </div>
      </div>

      {/* Main Engine */}
      <PredictionEngine />
      
      {/* Educational Explanation */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">How does this work?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-bold text-white text-lg">1. Historical Drift</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              We look back at the historical data to calculate the asset's "Drift"—the average daily percentage return over time. This acts as the baseline trajectory.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-lg">2. Daily Volatility</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              We calculate the Standard Deviation of daily returns. Highly volatile assets like Crypto will have a much wider "cone of uncertainty" than stable ETFs.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-lg">3. Random Walk</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Using Geometric Brownian Motion, we simulate 100 random paths into the future, combining the historical drift with random daily volatility shocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
