"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Target, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function RetirementCore() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [expectedReturn, setExpectedReturn] = useState<number>(8); // 8% default
  const [simulated, setSimulated] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [finalValue, setFinalValue] = useState<number>(0);

  const calculateRetirement = () => {
    const yearsToRetire = retirementAge - currentAge;
    let balance = currentSavings;
    const data = [];
    const monthlyRate = (expectedReturn / 100) / 12;

    for (let i = 0; i <= yearsToRetire; i++) {
      data.push({
        age: currentAge + i,
        balance: Math.round(balance)
      });
      // Add 1 year of compound interest and contributions
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
    }

    setChartData(data);
    setFinalValue(data[data.length - 1].balance);
    setSimulated(true);
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4">
          <PiggyBank className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Retirement Planner</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Map out your path to financial independence. See how compounding interest and consistent contributions can build your nest egg over time.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Current Age</Label>
            <Input 
              type="number" 
              value={currentAge} 
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Retirement Age</Label>
            <Input 
              type="number" 
              value={retirementAge} 
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Expected Return (%)</Label>
            <Input 
              type="number" 
              value={expectedReturn} 
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Current Savings</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={currentSavings} 
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label className="text-slate-300 font-medium text-sm mb-2 block">Monthly Contribution</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input 
                type="number" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="pl-8 bg-[#0B1220] border-white/10 text-white font-bold text-lg h-14 rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={calculateRetirement}
          className="w-full h-16 text-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all border-0"
        >
          <Target className="w-6 h-6 mr-2" />
          Calculate Projection
        </Button>
      </div>

      {simulated && (
        <div className="max-w-5xl mx-auto w-full mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 rounded-3xl p-8 mb-8 text-center shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <p className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-2">Projected Nest Egg</p>
            <h3 className="text-5xl md:text-7xl font-black text-white">${finalValue.toLocaleString()}</h3>
            <p className="text-slate-400 mt-4 text-lg">
              By age <span className="text-white font-bold">{retirementAge}</span>, investing <span className="text-white font-bold">${monthlyContribution.toLocaleString()}/mo</span> at a <span className="text-white font-bold">{expectedReturn}%</span> return.
            </p>
          </div>

          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="age" 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                  tickFormatter={(value) => `Age ${value}`}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
