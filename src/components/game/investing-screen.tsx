"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GameState } from "@/lib/game/game-store";
import { AssetExplorer } from "@/components/asset-explorer/AssetExplorer";
import { Slider } from "@/components/ui/slider";
import { Plus, FastForward, Wallet, Briefcase } from "lucide-react";

interface InvestingScreenProps {
  state: GameState;
  updateState: (s: Partial<GameState>) => void;
}

export function InvestingScreen({ state, updateState }: InvestingScreenProps) {
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<{symbol: string, name: string, weight: number}[]>([]);

  const handleAssetsSelected = (assets: any[]) => {
    // Distribute weights evenly by default
    const weightPerAsset = Math.floor(100 / assets.length);
    const newAssets = assets.map(a => ({
      symbol: a.symbol,
      name: a.name,
      weight: weightPerAsset
    }));
    setSelectedAssets(newAssets);
  };

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...selectedAssets];
    updated[index].weight = newWeight;
    setSelectedAssets(updated);
  };

  const totalAllocated = selectedAssets.reduce((sum, a) => sum + a.weight, 0);
  const cashRemaining = Math.max(0, 100 - totalAllocated);

  const handleFastForward = () => {
    // Normalize weights if they exceed 100
    let finalAssets = [...selectedAssets];
    if (totalAllocated > 100) {
      finalAssets = finalAssets.map(a => ({
        ...a,
        weight: (a.weight / totalAllocated) * 100
      }));
    }

    updateState({
      holdings: finalAssets,
      status: "fast-forward"
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-4xl w-full mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Investment Selection</h2>
          <p className="text-slate-400 font-medium">It is <strong className="text-white">January 1, {state.currentYear}</strong>. Where will you put your money?</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase">Current Cash</span>
            <span className="text-2xl font-black text-emerald-400">${state.cash.toLocaleString()}</span>
          </div>
          <Wallet className="w-8 h-8 text-slate-600" />
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Your Portfolio
          </h3>
          <button 
            onClick={() => setExplorerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Assets
          </button>
        </div>

        {selectedAssets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400 mb-4 max-w-sm">You haven't selected any assets to invest in. Your money is currently sitting in cash.</p>
            <button 
              onClick={() => setExplorerOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              Browse Markets
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {selectedAssets.map((asset, i) => (
              <motion.div 
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-lg">{asset.symbol}</h4>
                    <p className="text-xs text-slate-400">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-400">{asset.weight.toFixed(0)}%</span>
                  </div>
                </div>
                <Slider
                  defaultValue={[asset.weight]}
                  max={100}
                  step={1}
                  onValueChange={(val) => handleWeightChange(i, val[0])}
                  className="w-full"
                />
              </motion.div>
            ))}
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <span className="font-bold text-slate-300">Cash (Uninvested)</span>
              <span className={`text-xl font-black ${totalAllocated > 100 ? "text-red-400" : "text-emerald-400"}`}>
                {totalAllocated > 100 ? "Over-allocated!" : `${cashRemaining.toFixed(0)}%`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <p className="text-slate-400 text-sm font-medium">Goal: Reaching <strong className="text-white">${(1000000).toLocaleString()}</strong> by {state.endYear}</p>
        </div>
        <button 
          onClick={handleFastForward}
          disabled={selectedAssets.length === 0}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          Fast Forward <FastForward className="w-5 h-5" />
        </button>
      </div>

      <AssetExplorer 
        open={explorerOpen} 
        onOpenChange={setExplorerOpen}
        onSelect={handleAssetsSelected}
      />
    </div>
  );
}
