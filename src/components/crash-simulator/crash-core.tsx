"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { VideoExportView } from "@/components/video-export";
import { InvestmentResult } from "@/lib/types";

const CRASHES = [
  {
    id: "2008",
    name: "2008 Financial Crisis",
    description: "The Global Financial Crisis triggered by the subprime mortgage meltdown.",
    peak: "Oct 2007",
    trough: "Mar 2009",
    recovery: "Mar 2013",
    dropPct: -56.8,
    data: [
      { date: "Oct 07", value: 10000 },
      { date: "Jan 08", value: 8500 },
      { date: "Jul 08", value: 7200 },
      { date: "Oct 08", value: 5500 },
      { date: "Mar 09", value: 4320 },
      { date: "Dec 09", value: 5400 },
      { date: "Dec 10", value: 6500 },
      { date: "Dec 11", value: 6600 },
      { date: "Dec 12", value: 7800 },
      { date: "Mar 13", value: 10100 },
    ]
  },
  {
    id: "2020",
    name: "2020 COVID-19 Crash",
    description: "The sudden, severe global stock market crash during the onset of the pandemic.",
    peak: "Feb 2020",
    trough: "Mar 2020",
    recovery: "Aug 2020",
    dropPct: -34.0,
    data: [
      { date: "Feb 19", value: 10000 },
      { date: "Feb 26", value: 8800 },
      { date: "Mar 05", value: 8200 },
      { date: "Mar 12", value: 7400 },
      { date: "Mar 23", value: 6600 },
      { date: "Apr 15", value: 7500 },
      { date: "May 15", value: 8400 },
      { date: "Jun 15", value: 9200 },
      { date: "Jul 15", value: 9600 },
      { date: "Aug 18", value: 10100 },
    ]
  },
  {
    id: "2000",
    name: "Dot Com Bubble",
    description: "The crash of technology stocks in the early 2000s.",
    peak: "Mar 2000",
    trough: "Oct 2002",
    recovery: "May 2007",
    dropPct: -49.1,
    data: [
      { date: "Mar 00", value: 10000 },
      { date: "Sep 00", value: 9000 },
      { date: "Mar 01", value: 7800 },
      { date: "Sep 01", value: 6500 },
      { date: "Mar 02", value: 5800 },
      { date: "Oct 02", value: 5090 },
      { date: "Oct 03", value: 6200 },
      { date: "Oct 04", value: 7100 },
      { date: "Oct 05", value: 8200 },
      { date: "May 07", value: 10200 },
    ]
  }
];

export function CrashCore() {
  const [amount, setAmount] = useState<number>(10000);
  const [selectedCrash, setSelectedCrash] = useState(CRASHES[0]);
  const [simulated, setSimulated] = useState(false);

  // Scale the mock data by the initial amount
  const chartData = selectedCrash.data.map(d => ({
    ...d,
    value: (d.value / 10000) * amount
  }));

  const lowestValue = (amount * (100 + selectedCrash.dropPct)) / 100;
  const totalLost = amount - lowestValue;

  const videoResult: InvestmentResult | null = simulated ? {
    asset: { symbol: "PORTFOLIO", name: "Crash Portfolio", type: "index" },
    initialInvestment: amount,
    startValue: 1, 
    endValue: 1, 
    finalValue: chartData[chartData.length - 1]?.value,
    startDate: chartData[0]?.date,
    endDate: chartData[chartData.length - 1]?.date,
    sharesPurchased: 1,
    totalReturn: chartData[chartData.length - 1]?.value - amount,
    percentageReturn: ((chartData[chartData.length - 1]?.value - amount) / amount) * 100,
    cagr: selectedCrash.dropPct,
    history: chartData.map((h: any) => ({ date: h.date, price: h.value }))
  } : null;

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 text-red-400 rounded-2xl mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Crash Simulator</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Stress test your portfolio. See exactly how much you would have lost during history's worst market crashes, and how long it would take to recover.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">If I invested...</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Right before the...</Label>
            <select 
              className="w-full bg-[#0B1220] border border-white/10 text-white font-bold text-lg h-14 rounded-xl px-4 focus:outline-none"
              value={selectedCrash.id}
              onChange={(e) => {
                const crash = CRASHES.find(c => c.id === e.target.value);
                if (crash) setSelectedCrash(crash);
              }}
            >
              {CRASHES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={() => setSimulated(true)}
          className="w-full h-16 text-xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all border-0"
        >
          <ShieldAlert className="w-6 h-6 mr-2" />
          Simulate Crash
        </Button>
      </div>

      {simulated && (
        <div className="max-w-5xl mx-auto w-full mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
              <TrendingDown className="w-6 h-6 text-red-400 mb-2" />
              <p className="text-slate-400 text-sm font-medium mb-1">Max Drawdown</p>
              <p className="text-3xl font-black text-red-400">{selectedCrash.dropPct}%</p>
              <p className="text-sm font-bold text-red-400/60 mt-1">-${totalLost.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Clock className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-slate-400 text-sm font-medium mb-1">Time to Bottom</p>
              <p className="text-xl font-bold text-white">{selectedCrash.peak} to {selectedCrash.trough}</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
              <Clock className="w-6 h-6 text-emerald-400 mb-2" />
              <p className="text-slate-400 text-sm font-medium mb-1">Time to Recover</p>
              <p className="text-xl font-bold text-white">{selectedCrash.trough} to {selectedCrash.recovery}</p>
            </div>
          </div>

          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {videoResult && (
            <div className="mt-8">
              <VideoExportView results={[videoResult]} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
