"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, X, Building2, Bitcoin, Activity, Loader2, Check } from "lucide-react";

interface AssetDetails {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  sector: string;
  type?: string;
  sparkline: number[];
}

export function AssetExplorer({ open, onOpenChange, onSelect }: { open: boolean, onOpenChange: (o: boolean) => void, onSelect?: (assets: AssetDetails[]) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [assets, setAssets] = useState<AssetDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<AssetDetails[]>([]);
  const router = useRouter();

  const handleAnalyze = () => {
    if (selectedAssets.length === 0) return;
    
    if (onSelect) {
      onSelect(selectedAssets);
      onOpenChange(false);
      return;
    }

    if (selectedAssets.length === 1) {
      router.push(`/invest/${selectedAssets[0].symbol.toLowerCase()}`);
    } else if (selectedAssets.length === 2) {
      const slug = `${selectedAssets[0].symbol.toLowerCase()}-vs-${selectedAssets[1].symbol.toLowerCase()}`;
      router.push(`/compare/${slug}`);
    } else {
      const symbols = selectedAssets.map(a => a.symbol).join(',');
      router.push(`/race?assets=${symbols}`);
    }
    
    onOpenChange(false);
  };

  // Default symbols to load
  const defaultSymbols = [
    // Tech & Growth
    "AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "META", "NFLX", "AMD",
    // Crypto
    "BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD", "ADA-USD", "XRP-USD", "LINK-USD",
    // ETFs
    "SPY", "QQQ", "VOO", "DIA"
  ];

  useEffect(() => {
    if (open && assets.length === 0) {
      fetchAssets(defaultSymbols.join(","));
    }
  }, [open]);

  const fetchAssets = async (symbols: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets/details?symbols=${symbols}`);
      if (res.ok) {
        const data = await res.json();
        setAssets(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setLoading(true);
      try {
        const searchRes = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (searchRes.ok) {
          const data = await searchRes.json();
          const symbols = data.results.map((r: any) => r.symbol).join(",");
          if (symbols) {
            await fetchAssets(symbols);
          } else {
            setAssets([]);
            setLoading(false);
          }
        } else {
            setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const toggleAsset = (asset: AssetDetails) => {
    if (selectedAssets.find(a => a.symbol === asset.symbol)) {
      setSelectedAssets(selectedAssets.filter(a => a.symbol !== asset.symbol));
    } else if (selectedAssets.length < 5) {
      setSelectedAssets([...selectedAssets, asset]);
    }
  };

  const categories = [
    { name: "All", icon: Activity },
    { name: "Stocks", icon: Building2 },
    { name: "Crypto", icon: Bitcoin },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[1200px] max-w-[1200px] w-[95vw] md:w-full h-[90vh] md:h-[85vh] p-0 bg-[#0B1220]/95 backdrop-blur-3xl border-white/10 overflow-hidden flex flex-col rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">Asset Explorer</DialogTitle>
        
        {/* Top Search Bar */}
        <div className="flex items-center gap-3 p-3 md:p-4 border-b border-white/10 bg-white/5 shrink-0">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search Apple, Bitcoin..."
            className="flex-1 bg-transparent border-none text-base md:text-lg text-white focus-visible:ring-0 placeholder:text-slate-500 px-0"
          />
          <button onClick={() => onOpenChange(false)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Horizontal Categories */}
        <div className="flex md:hidden overflow-x-auto hide-scrollbar gap-2 p-3 border-b border-white/5 shrink-0 bg-black/20">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                category === c.name ? "bg-blue-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <c.icon className="w-4 h-4" />
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Desktop Left Sidebar */}
          <div className="w-56 shrink-0 hidden md:flex flex-col border-r border-white/10 bg-black/20 p-4 gap-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categories</h3>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                  category === c.name ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <c.icon className="w-5 h-5" />
                {c.name}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-blue-900/5 to-emerald-900/5 relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 hide-scrollbar relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24 md:pb-0">
                  {assets.filter(asset => {
                    if (category === "All") return true;
                    if (category === "Crypto") return asset.type === "CRYPTOCURRENCY" || asset.symbol.includes("-USD");
                    if (category === "Stocks") return asset.type === "EQUITY" || asset.type === "ETF" || (!asset.symbol.includes("-USD") && asset.type !== "CRYPTOCURRENCY");
                    return true;
                  }).map((asset) => {
                    const isSelected = selectedAssets.some(a => a.symbol === asset.symbol);
                    return (
                      <motion.div
                        key={asset.symbol}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleAsset(asset)}
                        className={`relative overflow-hidden cursor-pointer rounded-2xl border p-5 transition-all ${
                          isSelected ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-20">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <svg className="w-full h-full" preserveAspectRatio="none">
                            <polyline 
                              points={asset.sparkline?.map((val, i, arr) => `${(i / (arr.length - 1)) * 100},${100 - ((val - Math.min(...arr)) / (Math.max(...arr) - Math.min(...arr))) * 100}`).join(" ")}
                              fill="none" 
                              stroke={asset.change >= 0 ? "#10b981" : "#ef4444"} 
                              strokeWidth="3" 
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="pr-8">
                            <h4 className="font-black text-white text-xl tracking-tight">{asset.symbol}</h4>
                            <p className="text-sm text-slate-400 truncate max-w-[140px]">{asset.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-end relative z-10">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-white/10 text-slate-300 px-2 py-1 rounded w-fit">
                              {asset.sector}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-white text-lg">${asset.price?.toFixed(2)}</p>
                            <p className={`text-sm font-bold flex items-center justify-end gap-1 ${asset.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {asset.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {Math.abs(asset.change || 0).toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Mobile Compare Sticky Bottom Bar */}
            <AnimatePresence>
              {selectedAssets.length > 0 && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="xl:hidden absolute bottom-0 left-0 right-0 p-4 bg-[#0f172a] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-white">Comparing {selectedAssets.length}/5</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedAssets.map(a => (
                        <span key={a.symbol} className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-slate-300">
                          {a.symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors"
                  >
                    Analyze
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Compare Panel */}
          <div className="w-72 shrink-0 hidden xl:flex flex-col border-l border-white/10 bg-black/20 p-5 relative">
            <h3 className="text-base font-bold text-white mb-6">Compare List ({selectedAssets.length}/5)</h3>
            <div className="flex-1 space-y-3 overflow-y-auto hide-scrollbar">
              <AnimatePresence>
                {selectedAssets.map((asset) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{asset.symbol}</p>
                      <p className="text-xs font-medium text-slate-400">${asset.price?.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleAsset(asset); }}
                      className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedAssets.length === 0 && (
                <div className="text-center mt-10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Select assets to compare their historical performance.</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={selectedAssets.length === 0}
              className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {onSelect ? "Select Assets" : "Analyze Assets"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
