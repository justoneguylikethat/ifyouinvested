"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export function HeroStats() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "$142,305.21",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Total ROI",
      value: "145.2%",
      change: "+2.4%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "CAGR",
      value: "15.4%",
      change: "-0.2%",
      isPositive: false,
      icon: Activity,
    },
    {
      title: "Total Gain",
      value: "$84,200.00",
      change: "+$2,400",
      isPositive: true,
      icon: TrendingUp,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-slate-300" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white tracking-tight">
              {stat.value}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm font-medium">
            {stat.isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
            <span className={stat.isPositive ? "text-emerald-400" : "text-rose-400"}>
              {stat.change}
            </span>
            <span className="text-slate-500 ml-1">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
