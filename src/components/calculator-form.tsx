"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POPULAR_ASSETS } from "@/lib/assets";
import { Asset, AssetType } from "@/lib/types";

const SUGGESTED_SYMBOLS = ['BTC', 'ETH', 'SOL', 'DOGE', 'SHIB', 'PEPE', 'WIF', 'BONK', 'FLOKI', 'POPCAT', 'AAPL', 'NVDA', 'TSLA', 'MSFT', 'PLTR', 'SPY', 'QQQ'];
const MIXED_ASSETS = [
  ...POPULAR_ASSETS.filter(a => SUGGESTED_SYMBOLS.includes(a.symbol)),
  ...POPULAR_ASSETS.filter(a => !SUGGESTED_SYMBOLS.includes(a.symbol))
];

const PRESET_AMOUNTS = [100, 1000, 10000];

const getAssetColor = (symbol: string) => {
  if (symbol === 'BTC') return 'bg-[#F59E0B]';
  if (symbol === 'AAPL') return 'bg-[#64748B]';
  if (symbol === 'SPY') return 'bg-[#3B82F6]';
  if (symbol === 'MSFT') return 'bg-[#10B981]';
  if (symbol === 'NVDA') return 'bg-[#84CC16]';
  if (symbol === 'TSLA') return 'bg-[#EF4444]';
  if (symbol === 'AMZN') return 'bg-[#F97316]';
  if (symbol === 'GOOGL') return 'bg-[#3B82F6]';
  if (symbol === 'META') return 'bg-[#0EA5E9]';
  const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500'];
  return colors[symbol.length % colors.length];
};

interface CalculatorFormProps {
  onCalculate: (data: { amount: number; startDate: string; endDate: string; assets: Asset[] }) => void;
  isLoading: boolean;
  assetFilter?: AssetType | AssetType[];
}

export function CalculatorForm({ onCalculate, isLoading, assetFilter }: CalculatorFormProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [startDate, setStartDate] = useState<Date>(new Date("2020-01-01"));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>(() => {
    let defaults = MIXED_ASSETS;
    if (assetFilter) {
      const filters = Array.isArray(assetFilter) ? assetFilter : [assetFilter];
      defaults = defaults.filter(a => filters.includes(a.type));
    }
    return defaults.length > 0 ? [defaults[0]] : [];
  });
  const [assetSearchOpen, setAssetSearchOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Asset[]>(() => {
    let defaults = MIXED_ASSETS;
    if (assetFilter) {
      const filters = Array.isArray(assetFilter) ? assetFilter : [assetFilter];
      defaults = defaults.filter(a => filters.includes(a.type));
    }
    return defaults;
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get('amount');
    const startParam = params.get('start');
    const endParam = params.get('end');
    const assetsParam = params.get('assets');

    let loadedAmount = amount;
    let loadedStart = startDate;
    let loadedEnd = endDate;

    if (amountParam) {
      const val = Number(amountParam);
      if (!isNaN(val) && val > 0) {
        setAmount(val);
        loadedAmount = val;
      }
    }
    if (startParam) {
      const d = new Date(startParam);
      if (!isNaN(d.getTime())) {
        setStartDate(d);
        loadedStart = d;
      }
    }
    if (endParam) {
      const d = new Date(endParam);
      if (!isNaN(d.getTime())) {
        setEndDate(d);
        loadedEnd = d;
      }
    }

    if (assetsParam) {
      fetch(`/api/assets/details?symbols=${encodeURIComponent(assetsParam)}`)
        .then(res => res.ok ? res.json() : { results: [] })
        .then(data => {
          if (data.results && data.results.length > 0) {
            const normalized = data.results.map((a: any) => ({
              symbol: a.symbol,
              name: a.name,
              type: a.type === 'CRYPTOCURRENCY' ? 'crypto' : (a.type === 'ETF' ? 'etf' : 'stock')
            }));
            setSelectedAssets(normalized);
            onCalculate({
              amount: loadedAmount,
              startDate: format(loadedStart, "yyyy-MM-dd"),
              endDate: format(loadedEnd, "yyyy-MM-dd"),
              assets: normalized,
            });
          }
        })
        .catch(err => console.error("Failed to load search parameters on-load", err));
    }
  }, []);
 
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery) {
        let defaults = MIXED_ASSETS;
        if (assetFilter) {
          const filters = Array.isArray(assetFilter) ? assetFilter : [assetFilter];
          defaults = defaults.filter(a => filters.includes(a.type));
        }
        setSearchResults(defaults);
        return;
      }
      setIsSearching(true);
      try {
        let url = `/api/search?q=${encodeURIComponent(searchQuery)}`;
        if (assetFilter) {
          if (Array.isArray(assetFilter)) {
            url += `&type=${assetFilter.join(',')}`;
          } else {
            url += `&type=${assetFilter}`;
          }
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, assetFilter]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssets.length === 0) return;
    
    // Add to history
    import('@/lib/history').then(({ addHistory }) => {
      addHistory({
        title: selectedAssets.length > 1 
          ? `Compare ${selectedAssets.map(a => a.symbol).join(', ')}`
          : `Calculate ${selectedAssets[0].symbol}`,
        subtitle: `Invested $${amount.toLocaleString()}`,
        icon: 'Calculator',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        href: `/calculator?amount=${amount}&start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}&assets=${selectedAssets.map(a => a.symbol).join(',')}`
      });
    });

    onCalculate({
      amount,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      assets: selectedAssets,
    });
  };

  const toggleAsset = (asset: Asset) => {
    setSelectedAssets((current) => {
      const isSelected = current.some((a) => a.symbol === asset.symbol && a.type === asset.type);
      if (isSelected) {
        return current.filter((a) => !(a.symbol === asset.symbol && a.type === asset.type));
      }
      if (current.length >= 5) {
        // Limit to 5
        return current;
      }
      return [...current, asset];
    });
  };

  return (
    <div className="bg-[#0B1220] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl space-y-8 text-white h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold mb-1 tracking-tight">Run the numbers</h2>
        <p className="text-sm text-slate-400">If I had invested...</p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="amount" className="text-xs font-bold text-slate-500 tracking-wider uppercase">Amount</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
          <Input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="pl-8 h-12 text-sm font-bold bg-[#0F172A] border-white/5 focus-visible:ring-blue-500/50 rounded-xl placeholder:text-slate-500 transition-all"
            required
          />
        </div>
        <div className="flex gap-2 pt-2">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                amount === amt
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                  : "bg-transparent text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label className="text-xs font-bold text-slate-500 tracking-wider uppercase">Start</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-12 justify-start text-left font-medium bg-[#0F172A] border-white/5 hover:bg-white/5 hover:text-white rounded-xl transition-all text-sm px-4",
                !startDate && "text-slate-400"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span>{startDate ? format(startDate, "MM/dd/yyyy") : "Pick a date"}</span>
                <CalendarIcon className="h-4 w-4 text-slate-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0F172A] border-white/10 rounded-xl shadow-xl">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
                captionLayout="dropdown"
                fromYear={1970}
                toYear={new Date().getFullYear()}
                className="bg-[#0F172A] text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-3">
          <Label className="text-xs font-bold text-slate-500 tracking-wider uppercase">End</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-12 justify-start text-left font-medium bg-[#0F172A] border-white/5 hover:bg-white/5 hover:text-white rounded-xl transition-all text-sm px-4",
                !endDate && "text-slate-400"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span>{endDate ? format(endDate, "MM/dd/yyyy") : "Pick a date"}</span>
                <CalendarIcon className="h-4 w-4 text-slate-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0F172A] border-white/10 rounded-xl shadow-xl">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
                captionLayout="dropdown"
                fromYear={1970}
                toYear={new Date().getFullYear()}
                className="bg-[#0F172A] text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <Label className="text-xs font-bold text-slate-500 tracking-wider uppercase">Assets ({selectedAssets.length}/5)</Label>
        <Popover open={assetSearchOpen} onOpenChange={setAssetSearchOpen}>
          <div className="flex flex-wrap gap-2 items-center">
            {selectedAssets.map(a => (
              <div key={`${a.symbol}-${a.type}`} className="flex items-center gap-2 bg-transparent border border-white/10 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${getAssetColor(a.symbol)}`}>
                  {a.symbol.substring(0, 2).toUpperCase()}
                </div>
                <span>{a.name.split(' ')[0]}</span>
                <div 
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAsset(a);
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
            
            {selectedAssets.length < 5 && (
              <PopoverTrigger className="flex items-center gap-1.5 text-sm font-bold text-white px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-dashed border-white/10">
                <span className="text-lg leading-none">+</span> Add asset
              </PopoverTrigger>
            )}
          </div>
          <PopoverContent 
            align="start" 
            sideOffset={8}
            className="w-[calc(100vw-3rem)] md:w-[350px] p-0 bg-[#12121D] border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <Command shouldFilter={false} className="bg-transparent">
              <div className="border-b border-white/5 bg-transparent px-3 py-2">
                <CommandInput 
                  placeholder="Search Apple, BTC, S&P 500..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-10 text-white placeholder:text-slate-500 bg-transparent border-none focus:ring-0"
                />
              </div>
              <CommandEmpty className="p-4 text-center text-sm text-slate-400">{isSearching ? "Searching..." : "No asset found."}</CommandEmpty>
              <CommandGroup className="p-2">
                <CommandList className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {searchResults.map((asset) => {
                    const isSelected = selectedAssets.some((a) => a.symbol === asset.symbol && a.type === asset.type);
                    return (
                      <CommandItem
                        key={`${asset.symbol}-${asset.type}`}
                        value={`${asset.symbol}-${asset.type}`}
                        onSelect={() => {
                          toggleAsset(asset);
                        }}
                        className={`flex items-center px-4 py-3 cursor-pointer rounded-xl mx-2 my-1 transition-colors ${isSelected ? 'bg-[#1E1B4B] opacity-50' : 'hover:bg-[#1E1B4B] aria-selected:bg-[#1E1B4B]'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white mr-4 shrink-0 shadow-sm ${getAssetColor(asset.symbol)}`}>
                          {asset.symbol.substring(0,3).toUpperCase()}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-white text-base leading-tight truncate">{asset.name}</span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{asset.type}</span>
                        </div>
                        {isSelected && (
                          <div className="ml-2">
                            <Check className="h-5 w-5 text-indigo-400" />
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="pt-6">
        <Button 
          type="button"
          onClick={handleCalculate}
          className="w-full h-14 text-base font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all border-0" 
          disabled={isLoading || selectedAssets.length === 0}
        >
          {isLoading ? (
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          ) : null}
          {isLoading ? "Running..." : "Calculate"}
        </Button>
      </div>
    </div>
  );
}
