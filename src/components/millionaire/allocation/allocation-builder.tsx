"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Allocation } from "@/lib/game/game-types";
import { AssetExplorerModal } from "./asset-explorer-modal";
import { useEffect } from "react";

export function AllocationBuilder({ onReady }: { onReady: (allocations: Allocation[]) => void }) {
  const [allocations, setAllocations] = useState<Allocation[]>([
    { assetId: 'AAPL', percentage: 50 },
    { assetId: 'BTC-USD', percentage: 50 }
  ]);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const totalAllocation = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const isReady = totalAllocation === 100 && allocations.length > 0;

  const handleUpdatePercentage = (index: number, newPercentage: number) => {
    const newAllocs = [...allocations];
    newAllocs[index].percentage = newPercentage;
    setAllocations(newAllocs);
  };

  const handleRemoveAsset = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const handleAddAsset = (assetId: string) => {
    if (!allocations.find(a => a.assetId === assetId)) {
      setAllocations([...allocations, { assetId, percentage: 0 }]);
    }
    setIsExplorerOpen(false);
  };

  useEffect(() => {
    onReady(allocations);
  }, [allocations, onReady]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-xl font-bold text-white">Your Portfolio</h3>
        <span className={`text-sm font-bold ${totalAllocation === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
          Total: {totalAllocation}%
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {allocations.map((alloc, i) => (
          <div key={alloc.assetId} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm">
                  {alloc.assetId.substring(0, 3)}
                </div>
                <span className="font-bold text-lg">{alloc.assetId}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold font-mono">{alloc.percentage}%</span>
                <button onClick={() => handleRemoveAsset(i)} className="text-slate-500 hover:text-rose-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={alloc.percentage}
              onChange={(e) => handleUpdatePercentage(i, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
            />
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full border-dashed border-white/20 text-slate-300 hover:text-white hover:border-white/40 h-14"
        onClick={() => setIsExplorerOpen(true)}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Asset
      </Button>

      {totalAllocation !== 100 && (
        <p className="text-rose-400 text-sm text-center font-medium animate-pulse">
          Total allocation must equal exactly 100%. Currently at {totalAllocation}%.
        </p>
      )}

      <AssetExplorerModal 
        isOpen={isExplorerOpen} 
        onClose={() => setIsExplorerOpen(false)} 
        onSelect={handleAddAsset} 
      />
    </div>
  );
}
