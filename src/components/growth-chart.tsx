"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, subMonths, subYears, isAfter } from "date-fns";
import { InvestmentResult } from "@/lib/types";

const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];

interface GrowthChartProps {
  results: InvestmentResult[];
}

type TimeRange = '1M' | '6M' | '1Y' | '5Y' | 'MAX';

export function GrowthChart({ results }: GrowthChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('MAX');

  const chartData = useMemo(() => {
    if (!results || results.length === 0) return [];

    const dataMap = new Map<string, any>();
    
    // Find the latest date across all results to calculate the cutoff
    let latestDate = new Date(0);

    results.forEach((result) => {
      result.history.forEach((point) => {
        const pointDate = new Date(point.date);
        if (pointDate > latestDate) {
          latestDate = pointDate;
        }
        
        if (!dataMap.has(point.date)) {
          dataMap.set(point.date, { 
            date: point.date, 
            displayDate: format(pointDate, 'yyyy'),
            timestamp: pointDate.getTime()
          });
        }
        const dataObj = dataMap.get(point.date);
        dataObj[result.asset.symbol] = point.price;
      });
    });

    let cutoffDate = new Date(0);
    switch (timeRange) {
      case '1M':
        cutoffDate = subMonths(latestDate, 1);
        break;
      case '6M':
        cutoffDate = subMonths(latestDate, 6);
        break;
      case '1Y':
        cutoffDate = subYears(latestDate, 1);
        break;
      case '5Y':
        cutoffDate = subYears(latestDate, 5);
        break;
      case 'MAX':
      default:
        cutoffDate = new Date(0);
        break;
    }

    return Array.from(dataMap.values())
      .filter(item => item.timestamp >= cutoffDate.getTime())
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [results, timeRange]);

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative overflow-hidden pt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2">
        <div className="flex items-center p-1 bg-[#0F172A] border border-white/5 rounded-lg ml-auto">
          {(['1M', '6M', '1Y', '5Y', 'MAX'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] md:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              {results.map((result, index) => (
                <linearGradient key={`color-${result.asset.symbol}`} id={`color-${result.asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 11, fill: '#64748B' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              minTickGap={20} 
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value >= 1000 ? value / 1000 + 'K' : value)}`} 
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              width={60}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
            />
            {results.map((result, index) => (
              <Area
                key={result.asset.symbol}
                type="monotone"
                dataKey={result.asset.symbol}
                name={result.asset.symbol}
                stroke={COLORS[index % COLORS.length]}
                fillOpacity={1}
                fill={`url(#color-${result.asset.symbol})`}
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
