'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, TrendingUp, Sparkles, Clock, Coffee, AlertTriangle, Trophy, Zap } from 'lucide-react';

const PROMOS = [
  {
    title: "Time Travel With Your Money",
    desc: "Compare stocks, crypto, and ETFs to see what you missed out on.",
    href: "/calculator",
    icon: <Clock className="w-5 h-5 text-blue-400" />
  },
  {
    title: "Crypto vs Stocks",
    desc: "Did Bitcoin really beat the S&P 500? Run a simulation to find out.",
    href: "/calculator?assets=BTC-USD,SPY",
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "What if you invested $100?",
    desc: "See the power of compound growth with historical data.",
    href: "/calculator?amount=100",
    icon: <Sparkles className="w-5 h-5 text-purple-400" />
  },
  {
    title: "The Coffee Effect ☕",
    desc: "Instead of a $5 coffee daily, see what investing it does.",
    href: "/lifestyle/coffee",
    icon: <Coffee className="w-5 h-5 text-amber-500" />
  },
  {
    title: "Survive a Market Crash 📉",
    desc: "What if you invested right before the 2008 financial crisis?",
    href: "/crash-simulator",
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />
  },
  {
    title: "Millionaire Challenge 🎯",
    desc: "How long would it take you to reach $1,000,000?",
    href: "/millionaire-challenge",
    icon: <Trophy className="w-5 h-5 text-yellow-400" />
  },
  {
    title: "NVIDIA vs Intel 💻",
    desc: "See how the AI boom changed the semiconductor race.",
    href: "/calculator?assets=NVDA,INTC",
    icon: <Zap className="w-5 h-5 text-cyan-400" />
  }
];

export function SeoPromoBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [promo, setPromo] = useState(PROMOS[0]);

  useEffect(() => {
    // Don't show on the homepage
    if (pathname === '/') {
      setIsVisible(false);
      return;
    }

    const lastClosed = localStorage.getItem('promo_closed_at');
    // If closed within the last 24 hours, don't show
    if (lastClosed && Date.now() - parseInt(lastClosed) < 24 * 60 * 60 * 1000) {
      return;
    }

    // Only 30% chance to show up, to avoid annoying the user
    if (Math.random() > 0.3) {
      return;
    }

    // Pick a random promo
    setPromo(PROMOS[Math.floor(Math.random() * PROMOS.length)]);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promo_closed_at', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500 max-w-[320px]">
      <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/30 shadow-2xl shadow-blue-900/20 rounded-2xl p-4 flex flex-col relative group">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <Link href={promo.href} className="flex items-start gap-3 mt-1 cursor-pointer group-hover:opacity-90 transition-opacity">
          <div className="flex-shrink-0 bg-slate-800 p-2 rounded-xl border border-slate-700">
            {promo.icon}
          </div>
          <div className="pr-4">
            <h3 className="text-white font-bold text-sm mb-1 leading-tight">{promo.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {promo.desc}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
