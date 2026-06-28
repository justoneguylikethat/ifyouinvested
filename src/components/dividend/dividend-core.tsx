"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, Snowflake, Search } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function DividendCore() {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [dividendYield, setDividendYield] = useState<number>(4.5);
  const [annualContribution, setAnnualContribution] = useState<number>(1200);
  const [simulated, setSimulated] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [finalAnnualDividend, setFinalAnnualDividend] = useState<number>(0);

  const calculateSnowball = () => {
    let balance = initialInvestment;
    const data = [];
    const yieldRate = dividendYield / 100;

    for (let year = 1; year <= 20; year++) {
      const annualDividend = balance * yieldRate;
      
      data.push({
        year: `Year ${year}`,
        dividend: Math.round(annualDividend),
        balance: Math.round(balance)
      });
      
      // DRIP: reinvest dividends, add new contributions
      balance += annualDividend + annualContribution;
      // Assume a conservative 3% stock price appreciation
      balance *= 1.03; 
    }

    setChartData(data);
    setFinalAnnualDividend(data[data.length - 1].dividend);
    setSimulated(true);
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl mb-4">
          <Percent className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Dividend Snowball</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Visualize the power of DRIP (Dividend Reinvestment Plan). See how passive income grows exponentially over time.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Initial Investment</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={initialInvestment} 
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Dividend Yield (%)</Label>
            <Input 
              type="number" 
              value={dividendYield} 
              step="0.1"
              onChange={(e) => setDividendYield(Number(e.target.value))}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Annual Addition</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={annualContribution} 
                onChange={(e) => setAnnualContribution(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={calculateSnowball}
          className="w-full h-16 text-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-emerald-950 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all border-0"
        >
          <Snowflake className="w-6 h-6 mr-2" />
          Roll the Snowball
        </Button>
      </div>

      {simulated && (
        <div className="max-w-5xl mx-auto w-full mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-3xl p-8 mb-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-2">Annual Passive Income in 20 Years</p>
            <h3 className="text-5xl md:text-7xl font-black text-white">${finalAnnualDividend.toLocaleString()} <span className="text-3xl text-emerald-500/50">/ yr</span></h3>
            <p className="text-slate-400 mt-4 text-lg">
              That's <span className="text-white font-bold">${Math.round(finalAnnualDividend / 12).toLocaleString()}</span> every single month, purely from dividends!
            </p>
          </div>

          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8 h-[400px]">
            <h4 className="text-white font-bold text-lg mb-4 text-center">Annual Dividend Income Growth</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="year" 
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  cursor={{ fill: '#ffffff05' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Dividends Paid"]}
                />
                <Bar 
                  dataKey="dividend" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
