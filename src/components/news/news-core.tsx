"use client";

import { Newspaper, TrendingUp, TrendingDown, Clock, Globe } from "lucide-react";
import Link from "next/link";

const NEWS_DATA = [
  {
    id: 1,
    headline: "Federal Reserve Signals Potential Rate Cuts Before Year End",
    source: "Financial Times",
    time: "2 hours ago",
    sentiment: "Bullish",
    summary: "In a surprising pivot, the central bank indicated that inflation targets are closer than previously projected, sending equities higher across the board.",
    tags: ["Macro", "Rates"]
  },
  {
    id: 2,
    headline: "NVIDIA Unveils Next-Gen AI Architecture, Shattering Performance Records",
    source: "TechCrunch",
    time: "4 hours ago",
    sentiment: "Bullish",
    summary: "The semiconductor giant announced its highly anticipated 'Blackwell' architecture, promising 30x the performance of its predecessor for large language models.",
    tags: ["Tech", "AI", "NVDA"]
  },
  {
    id: 3,
    headline: "Oil Prices Slide as Global Demand Forecasts Are Revised Downward",
    source: "Bloomberg",
    time: "5 hours ago",
    sentiment: "Bearish",
    summary: "Weakening manufacturing data from major industrial hubs has led analysts to lower crude demand projections for Q3 and Q4.",
    tags: ["Energy", "Commodities"]
  },
  {
    id: 4,
    headline: "Bitcoin ETFs See Record Inflows Following Institutional Approvals",
    source: "CoinDesk",
    time: "7 hours ago",
    sentiment: "Bullish",
    summary: "Major asset managers reported unprecedented volume in their spot Bitcoin products, signaling a shift in traditional finance adoption.",
    tags: ["Crypto", "BTC"]
  },
  {
    id: 5,
    headline: "Consumer Spending Contracts for Second Straight Month",
    source: "Reuters",
    time: "10 hours ago",
    sentiment: "Bearish",
    summary: "Retail sales figures disappointed expectations, raising concerns about the health of the consumer in the face of prolonged high borrowing costs.",
    tags: ["Economy", "Retail"]
  },
  {
    id: 6,
    headline: "Apple's New Product Lineup Fails to Excite Wall Street",
    source: "Wall Street Journal",
    time: "12 hours ago",
    sentiment: "Bearish",
    summary: "Despite iterative improvements to its flagship devices, investors were left wanting more revolutionary AI integrations, causing a slight dip in share price.",
    tags: ["Tech", "AAPL"]
  }
];

export function NewsCore() {
  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh] max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4">
          <Newspaper className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Market News</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Curated financial headlines and AI-driven sentiment analysis. Stay ahead of the market moving events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NEWS_DATA.map((news) => {
          const isBullish = news.sentiment === "Bullish";
          return (
            <div 
              key={news.id} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Globe className="w-3.5 h-3.5" /> {news.source}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" /> {news.time}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">{news.headline}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{news.summary}</p>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="flex gap-2">
                  {news.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isBullish ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {isBullish ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {news.sentiment}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
