"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Asset } from "@/lib/types";

export interface AssetAllocation {
  asset: Asset;
  weight: number;
  color: string;
}

interface AllocationPieChartProps {
  allocations: AssetAllocation[];
}

export function AllocationPieChart({ allocations }: AllocationPieChartProps) {
  // Only render segments that have a weight > 0
  const data = allocations.filter(a => a.weight > 0);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 border border-white/10 border-dashed rounded-full p-8 aspect-square max-h-[300px] max-w-[300px] mx-auto">
        No Allocation
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="weight"
            nameKey="asset.symbol"
            stroke="none"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as AssetAllocation;
                return (
                  <div className="bg-[#0B1220]/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-white font-bold text-sm">{data.asset.symbol}</p>
                    <p className="text-slate-400 text-xs mb-1">{data.asset.name}</p>
                    <p className="text-lg font-black" style={{ color: data.color }}>
                      {data.weight}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
