"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function LivePortfolioChart({ 
  startYear, 
  endYear, 
  startCapital, 
  endCapital 
}: { 
  startYear: number, 
  endYear: number, 
  startCapital: number, 
  endCapital: number 
}) {
  const [data, setData] = useState<{ year: number; value: number }[]>([]);

  useEffect(() => {
    // Generate the full data path
    const years = endYear - startYear;
    const path: { year: number; value: number }[] = [];
    
    for (let i = 0; i <= years; i++) {
      const progress = i / years;
      // Add a little random noise to make it look like a real chart
      const noise = (Math.random() - 0.5) * (startCapital * 0.05); 
      const interpolatedValue = i === 0 
        ? startCapital 
        : i === years 
          ? endCapital 
          : startCapital + (endCapital - startCapital) * progress + noise;
          
      path.push({
        year: startYear + i,
        value: interpolatedValue
      });
    }

    // Animate points appearing
    let currentPoint = 0;
    const interval = setInterval(() => {
      if (currentPoint <= years) {
        setData(path.slice(0, currentPoint + 1));
        currentPoint++;
      } else {
        clearInterval(interval);
      }
    }, 3000 / (years + 1)); // Distribute over 3 seconds

    return () => clearInterval(interval);
  }, [startYear, endYear, startCapital, endCapital]);

  const isProfitable = endCapital >= startCapital;

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isProfitable ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isProfitable ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={isProfitable ? "#10b981" : "#f43f5e"} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={false} // Disable recharts animation since we animate by streaming data
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
