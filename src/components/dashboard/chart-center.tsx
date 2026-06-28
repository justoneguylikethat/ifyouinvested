"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Maximize2, Download, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockData = Array.from({ length: 30 }).map((_, i) => ({
  date: `2024-05-${i + 1}`,
  portfolio: Math.floor(100000 + Math.random() * 50000 + i * 2000),
  benchmark: Math.floor(100000 + Math.random() * 20000 + i * 1500),
}));

export function ChartCenter() {
  const [timeframe, setTimeframe] = useState("1Y");
  const [showForecast, setShowForecast] = useState(false);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 md:p-6 mb-6">
      <div className="flex flex-col justify-between items-start mb-6 gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
          <p className="text-sm text-slate-400">Compared to S&P 500 Benchmark</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
          <button 
            onClick={() => setShowForecast(!showForecast)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showForecast 
                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {showForecast && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${showForecast ? 'bg-indigo-500' : 'bg-slate-500'}`}></span>
            </span>
            AI Forecast
          </button>
          
          <div className="flex bg-[#0F172A] rounded-lg p-1 border border-white/10 w-full overflow-x-auto no-scrollbar sm:w-auto shadow-inner">
            {["1M", "3M", "6M", "1Y", "5Y", "MAX"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                  timeframe === t 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-white shrink-0">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="benchmark" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBenchmark)" 
            />
            <Area 
              type="monotone" 
              dataKey="portfolio" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPortfolio)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
