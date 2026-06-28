"use client";

import { useState } from "react";
import { Menu, Search, Bell, Sun, Moon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetExplorer } from "@/components/asset-explorer/AssetExplorer";

import { toast } from "sonner";

export function TopNav({ setMobileOpen }: { setMobileOpen: (open: boolean) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title || "IfYouInvested.online | Time Travel With Your Money";
    const text = `Time travel with your money using IfYouInvested.online! Check out this historical return simulation: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this historical return simulation on IfYouInvested.online!`,
          url,
        });
      } catch (err) {
        // user canceled or error, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(text);
          toast.success("Link copied to clipboard!");
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-md h-16 flex items-center justify-between px-3 md:px-6 gap-2 sm:gap-4">
        {/* Left: Menu */}
        <div className="flex items-center shrink-0 lg:w-0 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-full max-w-lg flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-slate-400 transition-all group"
          >
            <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="hidden sm:block flex-1 text-left truncate">Search Apple, Bitcoin, NVIDIA...</span>
            <span className="sm:hidden flex-1 text-left truncate">Search...</span>
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <kbd className="inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          {/* Ticker Tape (hidden on mobile) */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-medium mr-4 border-r border-white/10 pr-6">
            <div className="flex items-center gap-1 text-emerald-400">
              <span>AAPL</span>
              <span>+1.2%</span>
            </div>
            <div className="flex items-center gap-1 text-rose-400">
              <span>BTC</span>
              <span>-0.8%</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span>NVDA</span>
              <span>+2.4%</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="inline-flex text-slate-400 hover:text-white hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
            onClick={handleShare}
            title="Share this page"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          {/* Simplified theme toggle for now */}
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-white">
            <Sun className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <AssetExplorer open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
