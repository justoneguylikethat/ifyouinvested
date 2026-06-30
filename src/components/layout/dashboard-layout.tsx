"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./topnav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B1220]">
      {/* Top Banner for Memecoins */}
      <div className="w-full bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-purple-600/15 border-b border-white/5 py-2.5 px-4 text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-2 select-none relative shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span>Check out the latest hot memecoins like <span className="text-amber-400 font-extrabold">PEPE</span>, <span className="text-orange-400 font-extrabold">DOGE</span>, <span className="text-purple-400 font-extrabold">SHIB</span>, <span className="text-sky-400 font-extrabold">WIF</span>, and <span className="text-yellow-400 font-extrabold">BONK</span> in the asset picker!</span>
      </div>
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
