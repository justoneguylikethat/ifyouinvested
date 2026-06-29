"use client";

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { POPULAR_ASSETS } from "@/lib/assets"

const TOP_SYMBOLS = ['AAPL', 'MSFT', 'BTC', 'ETH', 'DOGE', 'SHIB', 'SPY', 'QQQ'];
const MIXED_ASSETS = [
  ...POPULAR_ASSETS.filter(a => TOP_SYMBOLS.includes(a.symbol)),
  ...POPULAR_ASSETS.filter(a => !TOP_SYMBOLS.includes(a.symbol))
];

interface AssetSelectProps {
  value: string;
  onValueChange: (symbol: string) => void;
  className?: string;
}

export function AssetSelect({ value, onValueChange, className }: AssetSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedAsset = POPULAR_ASSETS.find((asset) => asset.symbol === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center justify-between bg-[#0B1220] border border-white/10 text-white font-bold h-12 md:h-14 rounded-xl px-4 hover:bg-[#1a2333] hover:text-white transition-colors",
          className
        )}
      >
        <span className="truncate">
          {selectedAsset ? `${selectedAsset.symbol} - ${selectedAsset.name}` : "Select asset..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 border-white/10 bg-[#0B1220] text-white" 
        align="start"
        side="bottom"
        avoidCollisions={false}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command className="bg-transparent border-none">
          <CommandInput placeholder="Search symbol or name..." className="text-white border-b border-white/10 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none" />
          <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <CommandEmpty className="py-6 text-center text-sm text-slate-400">No asset found.</CommandEmpty>
            <CommandGroup>
              {MIXED_ASSETS.map((asset) => (
                <CommandItem
                  key={asset.symbol}
                  value={`${asset.symbol} ${asset.name}`}
                  onSelect={() => {
                    onValueChange(asset.symbol)
                    setOpen(false)
                  }}
                  className="text-white aria-selected:bg-white/10 aria-selected:text-white cursor-pointer py-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0 text-emerald-400",
                      value === asset.symbol ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold">{asset.symbol}</span>
                    <span className="text-xs text-slate-400 truncate">{asset.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
