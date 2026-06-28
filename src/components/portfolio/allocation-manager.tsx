"use client";

import { useState } from "react";
import { AssetAllocation } from "./allocation-pie-chart";
import { Trash2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AllocationManagerProps {
  allocations: AssetAllocation[];
  onChange: (allocations: AssetAllocation[]) => void;
  onAddAsset: () => void;
}

export function AllocationManager({ allocations, onChange, onAddAsset }: AllocationManagerProps) {
  const totalWeight = allocations.reduce((sum, a) => sum + a.weight, 0);

  const handleWeightChange = (index: number, newWeight: number) => {
    const clamped = Math.max(0, Math.min(100, newWeight));
    const newAllocations = [...allocations];
    newAllocations[index].weight = clamped;
    onChange(newAllocations);
  };

  const handleRemove = (index: number) => {
    const newAllocations = allocations.filter((_, i) => i !== index);
    onChange(newAllocations);
  };

  const rebalanceEvenly = () => {
    if (allocations.length === 0) return;
    const evenWeight = Math.floor(100 / allocations.length);
    let remainder = 100 - (evenWeight * allocations.length);
    
    const newAllocations = allocations.map((a, i) => ({
      ...a,
      weight: evenWeight + (i < remainder ? 1 : 0) // Distribute remainder
    }));
    onChange(newAllocations);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Asset Weights</h3>
          <p className={`text-sm font-medium ${totalWeight === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Total: {totalWeight}% {totalWeight !== 100 && "(Must equal 100%)"}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={rebalanceEvenly}
          className="bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Rebalance Evenly
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar pr-2">
        {allocations.map((alloc, idx) => (
          <div key={alloc.asset.symbol} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: alloc.color }} />
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="font-bold text-white leading-none mb-1">{alloc.asset.symbol}</h4>
                  <span className="text-xs text-slate-400 truncate w-full" title={alloc.asset.name}>{alloc.asset.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center bg-[#0B1220] border border-white/10 rounded-lg overflow-hidden">
                  <Input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={alloc.weight}
                    onChange={(e) => handleWeightChange(idx, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-right bg-transparent border-none focus-visible:ring-0 text-white font-bold p-1 pr-0"
                  />
                  <span className="text-slate-500 font-bold pr-2 pl-1">%</span>
                </div>
                <button 
                  onClick={() => handleRemove(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Range Slider for weight */}
            <input
              type="range"
              min={0}
              max={100}
              value={alloc.weight}
              onChange={(e) => handleWeightChange(idx, parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${alloc.color} ${alloc.weight}%, rgba(255,255,255,0.1) ${alloc.weight}%)`
              }}
            />
            <style dangerouslySetInnerHTML={{__html: `
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #fff;
                cursor: pointer;
                border: 2px solid ${alloc.color};
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
              }
            `}} />
          </div>
        ))}

        {allocations.length === 0 && (
          <div className="text-center py-8 text-slate-500 italic">
            Add assets to build your portfolio.
          </div>
        )}
      </div>

      <Button 
        onClick={onAddAsset}
        className="w-full py-6 border-dashed border-2 border-white/20 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white rounded-xl transition-all font-bold"
      >
        + Add Asset
      </Button>
    </div>
  );
}
