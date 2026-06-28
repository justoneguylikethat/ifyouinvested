"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Calculator, DollarSign, Coffee, TrendingUp, Gamepad2, Bot } from "lucide-react";
import { getHistory, HistoryItem } from "@/lib/history";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const iconMap = {
  Calculator,
  DollarSign,
  Coffee,
  TrendingUp,
  Gamepad2,
  Bot,
  History
};

export function QuickActions() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  const playgrounds = [
    { title: "Investment Calculator", subtitle: "Compare returns", href: "/calculator", icon: Calculator, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Dollar Cost Averaging", subtitle: "Consistent investing", href: "/dca", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Lifestyle Calculator", subtitle: "Coffee vs Stocks", href: "/lifestyle", icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "Future Predictions", subtitle: "Monte Carlo engine", href: "/predict", icon: Bot, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
    { title: "Millionaire Challenge", subtitle: "Can you reach $1M?", href: "/challenge", icon: Gamepad2, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  if (!isLoaded) return null; // Prevent hydration mismatch

  const displayItems = history.length > 0 ? history : playgrounds;
  const isHistory = history.length > 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isHistory ? (
            <History className="w-5 h-5 text-indigo-400" />
          ) : (
            <Gamepad2 className="w-5 h-5 text-blue-400" />
          )}
          <h2 className="text-lg font-semibold text-white">
            {isHistory ? "Recent Activity" : "Explore Our Playgrounds"}
          </h2>
        </div>
        {isHistory && (
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Your History</span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayItems.map((item, i) => {
          const Icon = isHistory ? (iconMap[item.icon as keyof typeof iconMap] || History) : (item as any).icon;
          const timeAgo = isHistory ? formatDistanceToNow((item as HistoryItem).timestamp, { addSuffix: true }) : null;
          
          return (
            <Link href={item.href} key={isHistory ? (item as HistoryItem).id : item.title}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group h-full cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-sm font-bold text-slate-200 leading-tight line-clamp-1">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider line-clamp-1">
                    {isHistory ? timeAgo : (item as any).subtitle}
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
