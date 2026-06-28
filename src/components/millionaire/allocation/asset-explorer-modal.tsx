"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { POPULAR_ASSETS } from "@/lib/assets";

export function AssetExplorerModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (assetId: string) => void }) {
  const [search, setSearch] = useState("");

  const filteredAssets = POPULAR_ASSETS.filter(a => 
    a.symbol.toLowerCase().includes(search.toLowerCase()) || 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-white/10 text-white p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-indigo-400" />
            Asset Explorer
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search by ticker, company, or crypto..." 
              className="pl-10 h-12 bg-white/5 border-white/10 text-lg placeholder:text-slate-500 focus-visible:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar flex flex-col gap-2">
            {filteredAssets.map(asset => (
              <div 
                key={asset.symbol} 
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                onClick={() => onSelect(asset.symbol)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {asset.symbol.substring(0,3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{asset.symbol}</h4>
                    <p className="text-sm text-slate-400">{asset.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-slate-300 uppercase tracking-wider mb-1">
                    {asset.type}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No assets found matching "{search}"
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
