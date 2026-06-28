"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";

interface PortfolioPerformanceChartProps {
  data: { date: string; value: number }[];
}

export function PortfolioPerformanceChart({ data }: PortfolioPerformanceChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      formattedDate: format(parseISO(d.date), "MMM yyyy"),
    }));
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-black/20 rounded-2xl border border-white/5">
        Run simulation to see performance
      </div>
    );
  }

  const minVal = Math.min(...chartData.map((d) => d.value));
  const maxVal = Math.max(...chartData.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
        <XAxis 
          dataKey="date" 
          tickFormatter={(tick) => format(parseISO(tick), "yyyy")}
          stroke="#334155" 
          tick={{ fill: "#64748b", fontSize: 12 }}
          minTickGap={50}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          hide 
          domain={[minVal * 0.9, maxVal * 1.1]} 
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[#0B1220]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                  <p className="text-slate-400 text-xs mb-2 font-semibold uppercase tracking-wider">{payload[0].payload.formattedDate}</p>
                  <p className="text-white font-black text-2xl tracking-tight">
                    ${payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorPortfolio)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
