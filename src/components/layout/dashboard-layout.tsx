"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./topnav";
import { X } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss the banner after 12 seconds
    const timer = setTimeout(() => {
      setBannerVisible(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B1220]">
      {/* Top Banner for Memecoins */}
      {bannerVisible && (
        <div className="w-full bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-purple-600/15 border-b border-white/5 py-2.5 px-10 text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-2 select-none relative shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Check out the latest hot memecoins like <span className="text-amber-400 font-extrabold">PEPE</span>, <span className="text-orange-400 font-extrabold">DOGE</span>, <span className="text-purple-400 font-extrabold">SHIB</span>, <span className="text-sky-400 font-extrabold">WIF</span>, and <span className="text-yellow-400 font-extrabold">BONK</span> in the asset picker!</span>
          <button 
            onClick={() => setBannerVisible(false)} 
            className="absolute right-4 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div 
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
            collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
          }`}
        >
          <TopNav setMobileOpen={setMobileOpen} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-[#0B1220] to-emerald-900/10 -z-10 pointer-events-none" />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
