"use client";

import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { format, parseISO } from "date-fns";

interface DcaChartProps {
  data: {
    date: string;
    invested: number;
    value: number;
  }[];
}

export function DcaChart({ data }: DcaChartProps) {
  const formattedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      formattedDate: d.date.includes('T') ? format(parseISO(d.date), "MMM yyyy") : format(new Date(d.date), "MMM yyyy")
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold mb-2">{payload[0]?.payload?.formattedDate}</p>
          <div className="space-y-1">
            <p className="text-blue-400 font-medium">
              Total Invested: ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-emerald-400 font-medium">
              Portfolio Value: ${payload[1].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) return <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">Run a simulation to see the chart.</div>;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          
          <Area 
            type="monotone" 
            dataKey="invested" 
            name="Total Cash Invested"
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorInvested)" 
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            name="Portfolio Value"
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
